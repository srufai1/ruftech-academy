// Last term's copy of the app. Nobody stopped it.
import { createServer } from "node:http";

const server = createServer((request, response) => response.end("old app\n"));
server.listen(8090, "127.0.0.1");
process.on("SIGTERM", () => { server.closeAllConnections(); server.close(() => process.exit(0)); });
