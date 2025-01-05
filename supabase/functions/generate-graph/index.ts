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

const RecipeResponseFormat = zodResponseFormat(z.object({
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
  })),
  source_url: z.string(),
}), 'recipe');

const system_prompt = `You are an expert at extracting cooking and extracting structured data from a recipe. 
You will be given some content. Extract the recipe. Make sure to use the exact numbers indicated in the recipe for quantity, temperature, and time. 
Separate the recipe into individual objects. The different object types are Recipe, Ingredient, Action, and IntermediateState. 
Ingredient have properties "name", and "quantity". Action must have a name and can have properties such as temperature and duration or other descriptors of the action. 
IntermediateState must have a name and sucess_indicators. Intermediatestate can also be an ingredient on a different step. 
Combine these objects into Steps. Each step must have a human-readable id, a name, an array of inputs, which can be Ingredients or IntermediateState, 
one and only one single indivisible action, and one and only one output, which is an IntermediateState. 
Each step should start with ingredients and their quantities, followed by an action including qualifiers such as temperature and time and it 
should result in an intermediate state. If possible, include an array of success indicators on the intermediate state object in order to indicate that the step was successful. Success indicators are things the reader should look for in the output.
The Recipe object must contain a name for the recipe, the source url, and the steps. Only return the JSON representation of the recipe.`;
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { url, cached } = await req.json();

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

  console.log(user, token);

  if (user == null && !isLocal) {
    return new Response(
      "Unauthorized",
      { status: 401 },
    );
  }
  const handler = new UrlRecipeHandler<UrlRecipeFetcher>(UrlRecipeFetcher, {
    url,
  });

  const cacheResponse = await supabase.from("recipes").select("*").eq(
    "url",
    url,
  );

  if (cacheResponse.error) {
    throw cacheResponse.error;
  }

  if (cached && !cacheResponse.data) {
    return new Response(
      "Not Found",
      { status: 404 },
    );
  }

  const content = await handler.fetchRecipe();

  if (content?.length < 1000) {
    return new Response(
      "Not enough content",
      { status: 400 },
    );
  }

  let recipe;
  if (cacheResponse.data.length > 0) {
    console.log("found cached: ", cacheResponse.data);
    recipe = cacheResponse.data[0];
  } else {
    const openai = new OpenAI();

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
      }],
      response_format: RecipeResponseFormat,
    });

    console.log(completion.choices[0].message);
    const json: Recipe = {
      "name": "Homemade Sourdough Bread",
      "source_url":
        "https://alexandracooks.com/2017/10/24/artisan-sourdough-made-simple-sourdough-bread-demystified-a-beginners-guide-to-sourdough-baking/",
      "steps": [
        {
          "id": "step1",
          "name": "Mix Dough",
          "inputs": [
            {
              "name": "bread flour",
              "quantity": "500g",
            },
            {
              "name": "water",
              "quantity": "350g",
            },
            {
              "name": "sourdough starter",
              "quantity": "100g",
            },
            {
              "name": "salt",
              "quantity": "10g",
            },
          ],
          "action": {
            "name": "mix",
            "description":
              "Combine all ingredients until a shaggy dough forms.",
          },
          "output": {
            "name": "mixed dough",
          },
          "success_indicators": [
            "Dough is rough and shaggy with no dry flour remaining.",
          ],
        },
        {
          "id": "step2",
          "name": "First Rise",
          "inputs": [
            {
              "name": "mixed dough",
            },
          ],
          "action": {
            "name": "ferment",
            "duration": "8-10 hours",
            "temperature": "room temperature",
          },
          "output": {
            "name": "fermented dough",
          },
          "success_indicators": [
            "Dough has doubled in size.",
            "Surface is bubbly and domed.",
          ],
        },
        {
          "id": "step3",
          "name": "Shape Loaf",
          "inputs": [
            {
              "name": "fermented dough",
            },
          ],
          "action": {
            "name": "shape",
            "description":
              "Turn dough onto a floured surface and shape into a tight round loaf.",
          },
          "output": {
            "name": "shaped loaf",
          },
          "success_indicators": [
            "Loaf holds its shape without spreading.",
          ],
        },
        {
          "id": "step4",
          "name": "Second Rise",
          "inputs": [
            {
              "name": "shaped loaf",
            },
          ],
          "action": {
            "name": "proof",
            "duration": "30 minutes",
            "temperature": "room temperature",
          },
          "output": {
            "name": "proofed loaf",
          },
          "success_indicators": [
            "Loaf has slightly puffed up.",
            "Indentation made with a finger springs back slowly.",
          ],
        },
        {
          "id": "step5",
          "name": "Preheat Oven",
          "inputs": [],
          "action": {
            "name": "preheat",
            "temperature": "450°F",
            "duration": "30 minutes",
          },
          "output": {
            "name": "preheated oven",
          },
          "success_indicators": [
            "Oven reaches 450°F.",
          ],
        },
        {
          "id": "step6",
          "name": "Score Loaf",
          "inputs": [
            {
              "name": "proofed loaf",
            },
          ],
          "action": {
            "name": "score",
            "description":
              "Make a shallow slash on the top of the loaf with a sharp blade.",
          },
          "output": {
            "name": "scored loaf",
          },
          "success_indicators": [
            "Clean cut on the surface of the loaf.",
          ],
        },
        {
          "id": "step7",
          "name": "Bake Loaf",
          "inputs": [
            {
              "name": "scored loaf",
            },
            {
              "name": "preheated oven",
            },
          ],
          "action": {
            "name": "bake",
            "temperature": "450°F",
            "duration": "30 minutes covered, then 15-20 minutes uncovered",
          },
          "output": {
            "name": "baked loaf",
          },
          "success_indicators": [
            "Crust is deep golden brown.",
            "Loaf sounds hollow when tapped on the bottom.",
          ],
        },
        {
          "id": "step8",
          "name": "Cool Loaf",
          "inputs": [
            {
              "name": "baked loaf",
            },
          ],
          "action": {
            "name": "cool",
            "duration": "1 hour",
            "temperature": "room temperature",
          },
          "output": {
            "name": "cooled loaf",
          },
          "success_indicators": [
            "Loaf is at room temperature.",
            "Crumb is set and not gummy.",
          ],
        },
      ],
    };
    const { data: inserted } = await supabase.from("recipes").upsert({
      url,
      json,
      title: json.name,
    }).select().limit(1).single();
    console.log("Inserted new recipe: ", inserted);
    recipe = inserted;
  }
  console.log("recipe: ", recipe.id);

  const { error: saveError } = await supabase.from("saved_recipes").upsert({
    recipe_id: recipe.id,
    user_id: user?.id,
  }).select().limit(1);
  if (saveError) {
    console.error("Failed to save recipe: ", saveError);
  }

  return new Response(
    JSON.stringify(recipe),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
