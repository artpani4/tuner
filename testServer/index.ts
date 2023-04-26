// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8080 });
console.log('File server running on http://localhost:8080/');

for await (const conn of server) {
  handleHttp(conn).catch(console.error);
}

async function handleHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const url = new URL(requestEvent.request.url);
    console.log(url);
    const filepath = decodeURIComponent(url.pathname);
    let file;
    try {
      file = await Deno.open('.' + filepath, { read: true });
    } catch {
      const notFoundResponse = new Response('404 Not Found', {
        status: 404,
      });
      await requestEvent.respondWith(notFoundResponse);
      return;
    }

    const readableStream = file.readable;

    // Build and send the response
    const response = new Response(readableStream);
    await requestEvent.respondWith(response);
  }
}
