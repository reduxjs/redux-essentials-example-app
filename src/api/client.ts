// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

interface ClientResponse<T> {
  status: number
  data: T
  headers: Headers
  url: string
}

export async function client<T>(
  endpoint: string,
  { body, ...customConfig }: Partial<RequestInit> = {},
): Promise<ClientResponse<T>> {
  const headers = { 'Content-Type': 'application/json' }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data
  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      }
    }
    throw new Error(response.statusText)
  } catch (err: any) {
    return Promise.reject(err.message ? err.message : data)
  }
}

client.get = function <T>(
  endpoint: string,
  customConfig: Partial<RequestInit> = {},
) {
  return client<T>(endpoint, { ...customConfig, method: 'GET' })
}

client.post = function <T>(
  endpoint: string,
  body: any,
  customConfig: Partial<RequestInit> = {},
) {
  return client<T>(endpoint, { ...customConfig, body })
}
