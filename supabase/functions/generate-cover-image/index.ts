import OpenAI from "npm:openai";
import { createClient } from "npm:@supabase/supabase-js@2";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { recipeName } = await req.json();

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
  if (token != Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") && !isLocal) {
    return new Response(
      "Unauthorized",
      { status: 401 },
    );
  }

  const openai = new OpenAI(
    {
      apiKey: Deno.env.get("OPENAI_API_KEY") ??
        "sk-svcacct-Kjyp6rp59JDl89B3oWV6NcuAVh798yE_Xfj3BVcRDt7zr_zJ0i0CAdrC7OEcwxUrP3hOsO6LlT3BlbkFJWEYwCnuJ76nohwbHzL8YUlFhbUeRg3OuOrl5mLoa3qzSpOMFF9JGQaEnqV2S-bAtfF4SIZWJwA",
    },
  );

  const {data: openAiData} = await openai.images.generate({
    prompt: `Generate a realistic and interesting image to use as a cover image for this recipe: ${recipeName}. Do not leave the background empty`,
    model: "dall-e-2",
    size: "512x512"
  });

  if (openAiData?.[0]?.url) {
    try {
      const url = openAiData[0].url;

      const res = await fetch(url);
      const blob = await res.blob();

      const {data, error} =
      await supabase.storage.from('recipe_images').upload(
        `${recipeName.toLocaleLowerCase().split(" ").join("_")}-${
          Date.now()
        }.png`,
        blob,
      );

      if (error) {
        console.log("Failed to upload image: ", error);
      }
        
      return new Response(
        JSON.stringify({url: data?.path}),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (e) {
      console.warn("Failed to generate image: ", e);
      return new Response(
        "Failed to generate image",
        { status: 500 },
      );
    }

  }
  return new Response(
    "Failed to generate image",
    { status: 500 },
  );
});
