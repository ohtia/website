// Serves public/ with security and cache headers, and sends every other ohtia.com host
// (the apex domain or any subdomain) to https://www.ohtia.com with a
// permanent redirect. The package repositories host is the exception: its
// requests go unchanged to the R2 bucket bound to it.
const CANONICAL_HOST = "www.ohtia.com";

// The *.ohtia.com/* route also matches this host, and a Worker route runs
// before the bucket's custom domain. Passing the request through sends it to
// the bucket, which answers with its own status, body and headers.
const PACKAGES_HOST = "packages.ohtia.com";

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

// How long browsers may reuse a file without asking again. Fonts never change
// under the same name; images rarely do. Pages, styles, robots.txt and the
// sitemap keep the default (revalidate on every visit), so a deploy shows up
// immediately.
const CACHE_RULES = [
  { test: (path) => path.startsWith("/assets/fonts/"), value: "public, max-age=31536000, immutable" },
  { test: (path) => path.startsWith("/assets/") || path === "/favicon.ico", value: "public, max-age=604800" },
];

function cacheControlFor(path) {
  const rule = CACHE_RULES.find((r) => r.test(path));
  return rule ? rule.value : null;
}

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
    if (url.hostname === PACKAGES_HOST) {
      // The repositories have no directory listing; their root points people to the install steps.
      if (url.pathname === "/") return withSecurityHeaders(Response.redirect(`https://${CANONICAL_HOST}/#repository`, 302));
      return fetch(request);
    }
    if (isOtherOhtiaHost(url.hostname)) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
      return withSecurityHeaders(Response.redirect(url.toString(), 301));
    }
    const response = withSecurityHeaders(await env.ASSETS.fetch(request));
    const cacheControl = response.status === 200 ? cacheControlFor(url.pathname) : null;
    if (cacheControl) response.headers.set("Cache-Control", cacheControl);
    return response;
  },
};
