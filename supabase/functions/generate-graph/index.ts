import OpenAI from "npm:openai";
import { zodResponseFormat } from "npm:openai/helpers/zod";
import { z } from "npm:zod";
import { createClient } from "npm:@supabase/supabase-js@2";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { UrlRecipeHandler } from "../../../services/UrlRecipeHandler.ts";
import { UrlRecipeFetcher } from "../../../services/UrlRecipeFetcher.ts";

interface Recipe {
  name: string;
  image_url?: string;
  steps: {
    id: string;
    name: string;
    inputs: {
      name: string;
      quantity?: string;
    }[];
    action: {
      name: string;
      description?: string;
      duration?: string;
      temperature?: string;
    };
    output: {
      name: string;
    };
    success_indicators?: string[];
  }[];
  source_url: string;
}

const RecipeResponseFormat = zodResponseFormat(
  z.object({
    error: z.string().optional(),
    name: z.string(),
    steps: z.array(z.object({
      id: z.string(),
      name: z.string(),
      inputs: z.array(z.object({
        name: z.string(),
        quantity: z.string().optional(),
      })),
      action: z.object({
        name: z.string(),
        description: z.string().optional(),
        duration: z.string().optional(),
        temperature: z.string().optional(),
      }),
      output: z.object({
        name: z.string(),
        success_indicators: z.array(z.string()).optional(),
      }),
      detailed: z.string(),
    })),
    source_url: z.string(),
  }),
  "recipe",
);

const system_prompt =
  `You are an expert at extracting cooking and extracting structured data from a recipe. 
You will be given some content. Extract the recipe. Make sure to use the exact numbers indicated in the recipe for quantity, temperature, and time.
Inputs must be an ingredient or an output from a previous step. The "detailed" key should include a longer detailed (max 50 words) description of the step. Don't include optional keys if there's no value. Only return the JSON representation of the recipe.
If the text does not look like a recipe, only return the error field and no values in any other fields.`;
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { url, cached, no_cache, text } = await req.json();
  console.log(text);

  const isLocal = Deno.env.get("IS_LOCAL");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      global: {
        headers: {
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
      },
    },
  );

  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");
  const { data: authData } = await supabase.auth.getUser(token);
  const user = authData.user;

  if (user == null && !isLocal) {
    return new Response(
      "Unauthorized",
      { status: 401 },
    );
  }

  const cacheResponse = url ? await supabase.from("recipes").select("*").eq(
    "url",
    url,
  ) : null;

  if (cacheResponse?.error) {
    throw cacheResponse.error;
  }

  if (cached && !cacheResponse?.data) {
    return new Response(
      "Not Found",
      { status: 404 },
    );
  }

  let recipe;
  if (cacheResponse?.data?.length) {
    console.log("found cached: ", cacheResponse.data);
    recipe = cacheResponse.data[0];
  } else {
    let content = "";
    let imageUrlParam = "";
    if (url) {
      const handler = new UrlRecipeHandler<UrlRecipeFetcher>(UrlRecipeFetcher, {
        url,
      });

      const { content: fetchedContent, image_url } = await handler
        .fetchRecipe();
      content = fetchedContent;
      imageUrlParam = image_url;
      console.log("Content length: ", content?.length);

      if (content?.length < 10000) {
        return new Response(
          "Not enough content",
          { status: 400 },
        );
      }
    } else if (text) {
      if (text?.length < 500) {
        return new Response(
          "Not enough content",
          { status: 400 },
        );
      }
      content = text;

    } else {
      console.log("no url or content");
      return new Response(
        "Bad Request",
        { status: 400 },
      );
    }

    console.log("Calling openai");
    const openai = new OpenAI(
      {
        apiKey: Deno.env.get("OPENAI_API_KEY") ??
          "sk-svcacct-Kjyp6rp59JDl89B3oWV6NcuAVh798yE_Xfj3BVcRDt7zr_zJ0i0CAdrC7OEcwxUrP3hOsO6LlT3BlbkFJWEYwCnuJ76nohwbHzL8YUlFhbUeRg3OuOrl5mLoa3qzSpOMFF9JGQaEnqV2S-bAtfF4SIZWJwA",
      },
    );

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: system_prompt,
        },
        {
          role: "user",
          content,
        },
      ],
      response_format: RecipeResponseFormat,
    });

    const json = completion.choices[0].message.parsed;

    if (!json) {
      return new Response(
        "Failed to parse recipe",
        { status: 500 },
      );
    }

    const recipeJson: Recipe = json;

    recipeJson.source_url = url;
    let imageUrl = null;
    if (imageUrlParam) {
      console.log('Generating a new image');
      const res = await fetch(imageUrlParam);
      const blob = await res.blob();

      const { data, error } = await supabase.storage.from("recipe_images")
        .upload(
          `${recipeJson.name.toLocaleLowerCase().split(" ").join("_")}-${
            new Date().getMilliseconds()
          }.png`,
          blob,
        );
      if (error) {
        console.error("Failed to upload image: ", error);
      } else {
        imageUrl = data.path;
      }
    }
    if (!imageUrl) {
      
      const {data: imageResponse} = await supabase.functions.invoke('generate-cover-image', {
        body: { recipeName: recipeJson.name }
      });

      console.log("Image generated");

      imageUrl = imageResponse.url;
    }
    const { data: inserted, error: dbError } = await supabase.from("recipes").upsert({
      url: url || "",
      json: recipeJson,
      title: recipeJson.name,
      image_url: imageUrl,
    }).select().limit(1).single();

    if (dbError) {
      throw dbError;
    }
    console.log("Inserted new recipe: ", inserted);
    recipe = inserted;
  }
  console.log("recipe: ", recipe);

  return new Response(
    JSON.stringify(recipe),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
