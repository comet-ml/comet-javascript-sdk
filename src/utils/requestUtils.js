import { config } from '../config';

// Error responses are usually JSON ({msg: ...}), but proxies and gateways
// can return HTML or an empty body, so fall back to the HTTP status.
const handleErrors = async response => {
  if (!response.ok) {
    let message = '';

    try {
      const data = await response.json();
      message = data.msg || data.message || '';
    } catch {
      // not JSON
    }

    const error = new Error(
      message || `${response.status} ${response.statusText}`.trim()
    );
    error.status = response.status;

    throw error;
  }

  return response;
};

const parsers = {
  json: response => response.json(),
  text: response => response.text(),
  binary: response => response.arrayBuffer()
};

// Matches the query-string package this replaced: keys are sorted, arrays
// become repeated keys (tags=a&tags=b), undefined is dropped, and null is
// sent as a bare key (?key) so callers can still ask for an unset value.
const encode = value =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );

const encodePair = (key, value) => {
  if (value === undefined) return null;
  if (value === null) return encode(key);
  return `${encode(key)}=${encode(value)}`;
};

export const toQueryString = (params = {}) =>
  Object.keys(params)
    .sort()
    .flatMap(key => {
      const value = params[key];
      const values = Array.isArray(value) ? value : [value];
      return values.map(item => encodePair(key, item));
    })
    .filter(pair => pair !== null)
    .join('&');

export const getEndPoint = (endPoint, version = 'v2') =>
  `${version}/${endPoint}`;

export const generateRequestUri = ({ endPoint, version }) => {
  const endPointValue = getEndPoint(endPoint, version);

  return `${config.getUrl()}${endPointValue}`;
};

const request = (url, options, responseType) =>
  fetch(url, options).then(handleErrors).then(parsers[responseType]);

const get = ({ endPoint, params, version, apiKey }, responseType) => {
  let url = generateRequestUri({ endPoint, version });
  const urlParameters = toQueryString(params);

  if (urlParameters) {
    url += `?${urlParameters}`;
  }

  const options = { headers: { [config.header]: apiKey } };

  return request(url, options, responseType);
};

export const getRequest = args => get(args, 'json');

export const getRequestRaw = args => get(args, 'text');

export const getRequestBinary = args => get(args, 'binary');

export const postRequest = ({ endPoint, params, version, apiKey }) => {
  const url = generateRequestUri({ endPoint, version });
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { [config.header]: apiKey, 'Content-Type': 'application/json' }
  };

  return request(url, options, 'json');
};
