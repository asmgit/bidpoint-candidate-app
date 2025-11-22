export default defineEventHandler(async (event) => {
  const endpoint = getRouterParam(event, 'endpoint');
  const target = `https://api.bidpoint.ai/api/${endpoint}`;

  return proxyRequest(event, target);
});
