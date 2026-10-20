import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const types = {
	".bin": "application/octet-stream",
	".css": "text/css; charset=utf-8",
	".glb": "model/gltf-binary",
	".gltf": "model/gltf+json",
	".html": "text/html; charset=utf-8",
	".ico": "image/x-icon",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".mp3": "audio/mpeg",
	".ogg": "audio/ogg",
	".png": "image/png",
	".svg": "image/svg+xml",
	".webmanifest": "application/manifest+json",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

http.createServer((request, response) => {
	let pathname;
	try {
		pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
	} catch {
		response.writeHead(400).end("Bad request");
		return;
	}

	if (pathname.startsWith("/api/")) {
		response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
		response.end(JSON.stringify({ offline: true, error: "This service is unavailable offline." }));
		return;
	}

	let target = path.resolve(root, `.${pathname}`);
	const decalFallback = pathname.match(/^\/content\/assets\/decals\/([^-]+)-(rally|voltage)\.png$/);
	if (decalFallback && !fs.existsSync(target)) {
		const fallback = path.resolve(root, "content/assets/decals", `${decalFallback[1]}-apex.png`);
		if (fs.existsSync(fallback) && fs.statSync(fallback).isFile()) {
			target = fallback;
		}
	}
	if (!target.startsWith(`${root}${path.sep}`) && target !== root) {
		response.writeHead(403).end("Forbidden");
		return;
	}
	if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
	if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
		response.writeHead(404).end("Not found");
		return;
	}

	if (path.extname(target).toLowerCase() === ".html") {
		const origin = `http://${request.headers.host || `${host}:${port}`}`;
		const html = fs.readFileSync(target, "utf8").replace(
			'content="/api/"',
			`content="${origin}/api/"`,
		);
		response.writeHead(200, {
			"content-type": types[".html"],
			"cache-control": "no-store",
			"x-content-type-options": "nosniff",
		});
		response.end(html);
		return;
	}

	response.writeHead(200, {
		"content-type": types[path.extname(target).toLowerCase()] || "application/octet-stream",
		"cache-control": "no-store",
		"x-content-type-options": "nosniff",
	});
	if (request.method === "HEAD") response.end();
	else fs.createReadStream(target).pipe(response);
}).listen(port, host, () => {
	console.log(`Turball offline is available at http://${host}:${port}`);
	console.log("Press Ctrl+C to stop the local server.");
});