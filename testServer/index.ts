import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req: Request) => {
  const url = new URL(req.url);
  console.log(url);
  const filepath = decodeURIComponent(url.pathname);
  let file;
  try {
    file = await Deno.open('.' + filepath, { read: true });
  } catch {
    const notFoundResponse = new Response('404 Not Found', {
      status: 404,
    });
    return notFoundResponse;
  }

  const readableStream = file.readable;

  // Build and send the response
  return new Response(readableStream);
});
