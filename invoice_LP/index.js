import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    return await getAssetFromKV(event, {
      mapRequestToAsset: req => {
        const url = new URL(req.url)
        if (url.pathname === '/') {
          return new Request(`${url.origin}/index.html`, req)
        }
        return req
      },
    })
  } catch (e) {
    // If an error is thrown try to serve the asset at 404.html
    let notFoundResponse = await getAssetFromKV(event, {
      mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
    })

    return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
  }
}