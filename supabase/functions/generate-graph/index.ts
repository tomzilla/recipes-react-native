import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from 'npm:@supabase/supabase-js@2'
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { UrlRecipeHandler } from "../../../services/UrlRecipeHandler.ts";
import { UrlRecipeFetcher } from "../../../services/UrlRecipeFetcher.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { url, cached } = await req.json()

  const isLocal = Deno.env.get('IS_LOCAL');
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? '',
    { global: { headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` } } }
  )

  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  const { data: authData } = await supabase.auth.getUser(token)
  const user = authData.user

  console.log(user, token);

  if (user == null && !isLocal) {
    return new Response(
      'Unauthorized',
      { status: 401 }
    )
  }
  const handler = new UrlRecipeHandler<UrlRecipeFetcher>(UrlRecipeFetcher, {url});

  const cacheResponse = await supabase.from('recipes').select('*').eq("url", url);


  if (cacheResponse.error) {
    throw cacheResponse.error
  }

  if (cached && !cacheResponse.data) {
    return new Response(
      'Not Found',
      { status: 404 },
    )
  }

  const content = await handler.fetchRecipe();

  if (content?.length < 1000) {
    return new Response(
      'Not enough content',
      { status: 400 },
    )
  }

  const title = content.match(/<title>(.*?)<\/title>/)?.[1] ?? 'Untitled'

  let recipe;
  if (cacheResponse.data.length > 0) {
    console.log('found cached: ', cacheResponse.data);
    recipe = cacheResponse.data[0];
  } else {
    const anthropic = new Anthropic({
      apiKey: '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', // defaults to process.env["ANTHROPIC_API_KEY"]
    });
    console.log('calling anthropic');
    // const msg = await anthropic.messages.create({
    //   model: "claude-3-5-sonnet-20241022",
    //   max_tokens: 1024,
    //   messages: [{ role: "user", content: `From this content ${content}, extract the recipe. Create a graph from the instructions. Each vertex is an ingredient or an intermediate state and each edge is an action. For example, Ingredients A and B are mixed and cooked. This should create 4 vertices, 2 for the ingredients, one for them mixed together and the last one for the cooked. Ingredients should include the quantity and the action should include qualifiers such as temperature and time. Additionally, create the json representation of this graph. E.g. you can represent each node as an object with the keys "type" for ingredient or state, "name", "quantity" if it's an ingredient. Give each vertex an unique identifier. Then create another object as the adjacency list where the key is the unique identifier, and an array of downstream neighbors as the value. Be sure to label the edges with actions including qualifiers such as duration and temperature. If possible, include key description of the intermediate state in order to indicate that the step was successful. Only return the json.` }, ],
    // });
    // console.log(msg);
    const json = {
      "name": "Simple Sourdough Bread",
      "steps": [
        {
          "id": "prepare_starter",
          "inputs": [
            {
              "type": "Ingredient",
              "name": "dormant_starter",
              "description": "Refrigerated sourdough starter",
              "quantity": "Any amount"
            },
            {
              "type": "Ingredient",
              "name": "flour",
              "description": "Bread flour for feeding",
              "quantity": "Equal to starter weight"
            },
            {
              "type": "Ingredient",
              "name": "water",
              "description": "Room temperature water for feeding",
              "quantity": "Equal to starter weight"
            }
          ],
          "action": {
            "type": "Feed",
            "duration": "8-12 hours",
            "temperature": "70°F/21°C",
            "description": "Discard most of starter, feed with equal parts flour and water"
          },
          "output": {
            "type": "IntermediateState",
            "name": "active_starter",
            "description": "Doubled in size, bubbly, passing float test",
            "successIndicators": [
              "Doubled in volume",
              "Bubbles throughout",
              "Small piece floats in water"
            ]
          }
        },
        {
          "id": "mix_dough",
          "inputs": [
            {
              "type": "Ingredient",
              "name": "active_starter",
              "description": "Bubbly, active starter",
              "quantity": "50-100g"
            },
            {
              "type": "Ingredient",
              "name": "water",
              "description": "Warm water",
              "quantity": "375g"
            },
            {
              "type": "Ingredient",
              "name": "bread_flour",
              "description": "Bread flour",
              "quantity": "500g"
            },
            {
              "type": "Ingredient",
              "name": "salt",
              "description": "Fine sea salt",
              "quantity": "9-12g"
            }
          ],
          "action": {
            "type": "Mix",
            "duration": "5 minutes",
            "temperature": "Room temperature",
            "description": "Combine starter and water, then add flour and salt, mix until no dry flour remains"
          },
          "output": {
            "type": "IntermediateState",
            "name": "rough_dough",
            "description": "Shaggy, cohesive dough mass"
          }
        },
        {
          "id": "stretch_and_fold",
          "inputs": [
            {
              "type": "IntermediateState",
              "name": "rough_dough",
              "description": "Initial mixed dough"
            }
          ],
          "action": {
            "type": "StretchAndFold",
            "duration": "2 hours total",
            "interval": "30 minutes",
            "repetitions": 4,
            "temperature": "Room temperature",
            "description": "Perform series of stretches and folds, rest 30 minutes between sets"
          },
          "output": {
            "type": "IntermediateState",
            "name": "developed_dough",
            "description": "Smooth, elastic dough with some strength",
            "successIndicators": [
              "Dough becomes smoother",
              "Holds shape better",
              "More elastic when pulled"
            ]
          }
        },
        {
          "id": "bulk_fermentation",
          "inputs": [
            {
              "type": "IntermediateState",
              "name": "developed_dough",
              "description": "Dough after stretch and folds"
            }
          ],
          "action": {
            "type": "Ferment",
            "duration": "6-10 hours",
            "temperature": "70°F/21°C",
            "description": "Let dough rise until increased by 50% in volume"
          },
          "output": {
            "type": "IntermediateState",
            "name": "fermented_dough",
            "description": "Dough increased by 50% with some bubbles",
            "successIndicators": [
              "50% volume increase",
              "Bubbles visible on surface",
              "Jiggles when bowl is moved"
            ]
          }
        },
        {
          "id": "shape",
          "inputs": [
            {
              "type": "IntermediateState",
              "name": "fermented_dough",
              "description": "Completed bulk fermentation dough"
            }
          ],
          "action": {
            "type": "Shape",
            "duration": "30 minutes total",
            "temperature": "Room temperature",
            "description": "Shape into round, rest 30 minutes, shape again"
          },
          "output": {
            "type": "IntermediateState",
            "name": "shaped_dough",
            "description": "Taut, shaped boule",
            "successIndicators": [
              "Surface tension visible",
              "Holds shape well",
              "Seam properly closed"
            ]
          }
        },
        {
          "id": "cold_proof",
          "inputs": [
            {
              "type": "IntermediateState",
              "name": "shaped_dough",
              "description": "Final shaped dough"
            }
          ],
          "action": {
            "type": "Proof",
            "duration": "12-48 hours",
            "temperature": "38°F/3°C",
            "description": "Refrigerate in covered banneton or bowl"
          },
          "output": {
            "type": "IntermediateState",
            "name": "proofed_dough",
            "description": "Cold, proofed dough ready for baking",
            "successIndicators": [
              "Slightly increased in size",
              "Dough springs back slowly when poked",
              "Surface shows subtle bubbling"
            ]
          }
        },
        {
          "id": "bake",
          "inputs": [
            {
              "type": "IntermediateState",
              "name": "proofed_dough",
              "description": "Cold proofed dough"
            }
          ],
          "action": {
            "type": "Bake",
            "steps": [
              {
                "temperature": "450°F/230°C",
                "duration": "30 minutes",
                "description": "Bake covered in preheated Dutch oven"
              },
              {
                "temperature": "400°F/200°C",
                "duration": "10-15 minutes",
                "description": "Uncover and continue baking"
              }
            ]
          },
          "output": {
            "type": "IntermediateState",
            "name": "baked_bread",
            "description": "Fully baked loaf",
            "successIndicators": [
              "Golden brown crust",
              "Hollow sound when tapped",
              "Internal temperature 205-210°F"
            ]
          }
        }
      ]
    };
    const { data: inserted } = await supabase.from('recipes').upsert({url, json, title}).select().limit(1).single();
    console.log("Inserted new recipe: ", inserted);
    recipe = inserted;
  }
  console.log('recipe: ', recipe.id);

  const {error: saveError} = await supabase.from('saved_recipes').upsert({recipe_id: recipe.id, user_id:user?.id }).select().limit(1);
  if (saveError) {
    console.error("Failed to save recipe: ", saveError)
  }

  return new Response(
    JSON.stringify(recipe),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-graph' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
