
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname.endsWith(".workers.dev")) {
      return Response.redirect(
        "https://crochetmaker.site" + url.pathname + url.search,
        301
      );
    }

    return env.ASSETS.fetch(request);
  }
};
