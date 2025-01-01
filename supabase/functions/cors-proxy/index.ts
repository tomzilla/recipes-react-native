// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (request) => {
  const reqUrl = request.url.split("cors-proxy/")[1];

  const res = await fetch(reqUrl, {
    headers: request.headers,
    method: request.method,
    body: request.body,
  });

  const allowedHeaders = request.headers.get("Access-Control-Request-Headers"); // .headers wasn't specified, so reflect the request headers

  const response = await res.arrayBuffer();
  return new Response(response, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      Vary: "Origin",
      "Access-Control-Allow-Headers":
        allowedHeaders || "Authorization, Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
});
