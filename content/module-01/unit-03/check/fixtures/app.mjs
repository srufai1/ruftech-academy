// The app for the debugging lab. It answers "app ok" on 127.0.0.1 port 8090.
import { createServer } from "node:http";
import { writeFileSync } from "node:fs";

const server = createServer((request, response) => response.end("app ok\n"));
server.listen(8090, "127.0.0.1", () => {
  writeFileSync(new URL("./app.pid", import.meta.url), `${process.pid}\n`);
  console.log("app listening on 127.0.0.1:8090");
});
process.on("SIGTERM", () => { server.closeAllConnections(); server.close(() => process.exit(0)); });
