"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const PORT = Number(process.env.PORT || 10000);
const HOST = "0.0.0.0";
const PUBLIC = path.resolve(__dirname, "public");
const indexFile = path.join(PUBLIC, "index.html");
const server = http.createServer((req, res) => {
  const method = req.method || "GET";
  let pathname;
  try { pathname = new URL(req.url, "http://localhost").pathname; }
  catch { res.writeHead(400); return res.end("Bad Request"); }
  if (pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    return res.end(JSON.stringify({ ok: true, application: "Sprint Analyzer V5.2", serverTime: Date.now() }));
  }
  if (method !== "GET" && method !== "HEAD") { res.writeHead(405, { Allow: "GET, HEAD" }); return res.end(); }
  if (pathname !== "/" && pathname !== "/index.html") { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("Not Found"); }
  fs.readFile(indexFile, (err, data) => {
    if (err) { res.writeHead(500); return res.end("Index not available"); }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin" });
    if (method === "HEAD") return res.end();
    res.end(data);
  });
});
server.listen(PORT, HOST, () => console.log(`Sprint Analyzer V5.2 running on port ${PORT}`));
