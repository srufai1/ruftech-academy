// The office status server. It reads server.conf and answers "ok" on /health.
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";

const here = (name) => new URL(`./${name}`, import.meta.url);
const conf = {};
for (const line of readFileSync(here("server.conf"), "utf8").split("\n")) {
  const [key, value] = line.split("=");
  if (key && value !== undefined) conf[key.trim()] = value.trim();
}
const host = conf.host ?? "127.0.0.1";
const port = Number(conf.port ?? 8080);

const server = createServer((request, response) => {
  if (request.url === "/health") return response.end("ok\n");
  response.statusCode = 404;
  response.end("not found\n");
});
server.listen(port, host, () => {
  writeFileSync(here("server.pid"), `${process.pid}\n`);
  console.log(`listening on ${host}:${port}`);
});
const stop = () => { server.closeAllConnections(); server.close(() => process.exit(0)); };
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
