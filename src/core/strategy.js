function getProperty(data, property) {
  return property
    ? property.split('.').reduce((acc, current) => acc[current], data)
    : data
}

export default {
  async authenticate({ config }, httpClient, credentials) {
    const method = config.endpoints.authenticate.method.toLowerCase()
    const { url, property } = config.endpoints.authenticate
    const { data } = await httpClient.instance[method](url, credentials)

    return getProperty(data, property)
  },

  async getUser({ config }, httpClient) {
    const method = config.endpoints.user.method.toLowerCase()
    const { url, property } = config.endpoints.user
    const { data } = await httpClient.instance[method](url)

    return getProperty(data, property);
  },

  async logout({ config }, httpClient) {
    const method = config.endpoints.user.method.toLowerCase();

    config.endpoints.logout
      ? await httpClient.instance[method](config.endpoints.logout.url)
      : await Promise.resolve();
  },

  rememberToken({ config, cookies }, httpClient, token) {
    const { name, type } = config.token;
    const tokenString = type ? `${type} ${token}` : token;

    cookies.set(name, tokenString, config.cookies);

    httpClient.setHeader(name, tokenString);
  },

  forgetToken({ config, cookies }, httpClient) {
    const { name } = config.token;

    cookies.remove(name, config.cookies);

    httpClient.removeHeader(name);
  },
}
