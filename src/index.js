// Serves public/ with security headers, and sends every other ohtia.com host
// (the apex domain or any subdomain) to https://www.ohtia.com with a
// permanent redirect.
const CANONICAL_HOST = "www.ohtia.com";

const SECURITY_HEADERS = {
  // HTTPS only, for one year, on ohtia.com and every subdomain.
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  // The site loads only its own styles, fonts and images, and runs no scripts.
  "Content-Security-Policy":
    "default-src 'none'; style-src 'self'; font-src 'self'; img-src 'self'; " +
    "base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

function isOtherOhtiaHost(hostname) {
  return (
    hostname !== CANONICAL_HOST &&
    (hostname === "ohtia.com" || hostname.endsWith(".ohtia.com"))
  );
}

function withSecurityHeaders(response) {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }
  return secured;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (isOtherOhtiaHost(url.hostname)) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
      return withSecurityHeaders(Response.redirect(url.toString(), 301));
    }
    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};
