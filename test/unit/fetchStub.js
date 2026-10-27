// A stand-in for fetch: records each request and answers with `respond`.
const BASE = 'https://www.comet.com/api/rest/v2/';

export const makeResponse = ({ status = 200, body = {}, text } = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: async () => {
    if (text !== undefined) return JSON.parse(text);
    return body;
  },
  text: async () => (text !== undefined ? text : JSON.stringify(body)),
  arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer
});

export const stubFetch = (respond = () => makeResponse()) => {
  const calls = [];
  const original = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    const parsed = new URL(url);
    const call = {
      url,
      path: url.startsWith(BASE)
        ? parsed.pathname.replace('/api/rest/v2/', '')
        : url,
      query: parsed.searchParams,
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body ? JSON.parse(options.body) : undefined
    };
    calls.push(call);
    return respond(call);
  };

  calls.restore = () => {
    globalThis.fetch = original;
  };

  return calls;
};
