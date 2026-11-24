// Serves public/ and sends every other ohtia.com host (the apex domain or
// any subdomain) to https://www.ohtia.com with a permanent redirect.
const CANONICAL_HOST = "www.ohtia.com";

function isOtherOhtiaHost(hostname) {
  return (
    hostname !== CANONICAL_HOST &&
    (hostname === "ohtia.com" || hostname.endsWith(".ohtia.com"))
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (isOtherOhtiaHost(url.hostname)) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
