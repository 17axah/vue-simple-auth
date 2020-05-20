# vue-simple-auth

Very flexible and easily customizable authorization module using jwt token. It has SSR support.
<br>
[vue-router-auth](https://github.com/17axah/vue-router-auth) is used to configure routes.
<br>
<br>
If you find an error, incorrect behavior please open the corresponding
[issue](https://github.com/17axah/vue-simple-auth/issues). <br>
Please also rate this [repository](https://github.com/17axah/vue-simple-auth). :blush:

<hr>

## :v: Setup
```bash
$ npm i vue-simple-auth
```
```js
import initialize from 'vue-simple-auth';

initialize(options);
```
## :book: Usage
```js
import initialize from 'vue-simple-auth';
import Cookies from 'universal-cookie';

export default async function({ router, store, ssrContext }) {
  const cookies = ssrContext ? new Cookies(ssrContext.req.headers.cookie) : new Cookies();

  const config = {...};

  await initialize({ router, store, cookies, config });
};
```
### :warning: Important!
During initialization, you should already have an http client installed. That is, *Vue.prototype.$axios* or *Vue.prototype.$http* should already exist.
<br>
<br>
<br>
<br>
In the example above, there are two obscure points: **1.** cookies, **2.** Asynchronous initialization function.
<br>
**1.** Cookies are necessary for us for SSR. Therefore, we transfer a universal object of interaction with cookies to the module.
It could be another dependency, not necessarily a ***universal-cookie***.
<br>
**2.** During initialization, the module will try to authorize the user if a jwt token is present in cookies.
Therefore, the initialization function is asynchronous.
<br>
<br>
Where the project should call the initialization function depends on the project itself and this decision remains at your discretion.
The main thing is to pass the required parameters to the initialization function: **router**, **store**, **cookies**, **config**.

After initialization, we get access to ***this.$auth*** from any component.

### Login
```js
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async login() {
      this.loading = true;

      await this.$auth.login({ email: 'test@test.com', password: '123123' });

      this.loading = false;
    },
  },
}
```

The login method accepts credentials and returns a Promise. This action takes place in two stages:
* A request to receive a jwt token.
* Request for user data ***$auth.loginByToken***, saving user data in the store.

### Login by token
```js
export default {
  methods: {
    async loginByToken(token) {
      await this.$auth.loginByToken(token);
    },
  },
}
```
This method makes a request for user data. If the request is successful,
it saves the token using the ***$auth.rememberToken*** method and saves the user data to the store.

### Logout
```js
export default {
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
}
```
Sends a logout request (if specified in config), then using the ***$auth.localLogout*** method removes the user from the repository and forgets the token.

### Local logout
```js
export default {
  methods: {
    localLogout() {
      this.$auth.localLogout();
    },
  },
}
```
Deletes a token using the ***$auth.forgetToken*** method and remove user data from store.

### Remember token
```js
export default {
  methods: {
    rememberToken(token) {
      this.$auth.rememberToken(token);
    },
  },
}
```
Saves the token in cookies and adds the header in the HTTP client(axios, vue-resource).

### Forget token
```js
export default {
  methods: {
    forgetToken() {
      this.$auth.forgetToken();
    },
  },
}
```
Removes the token from cookies and the header in the http client.

### Fetch user
```js
export default {
  methods: {
    async fetchUser() {
      await this.$auth.fetchUser();
    },
  },
}
```
Updating user data from the server.

### Auth store
***$auth.user*** - Local user data storage. <br>
***$auth.token*** - Current token. <br>
***$auth.loggedIn*** - Flag indicating whether the user is authorized or not. <br>

## :gear: Customization
default config:
```js
{
  httpClient: 'axios',
  watchLoggedIn: true,
  cookies: {
    path: '/'
  },
  token: {
    name: 'Authorization',
    type: 'Bearer'
  },
  vuex: {
    namespace: '$auth'
  },
  redirect: {
    routes: {
      auth: '/profile',
      guest: '/',
    },
    queryFrom: 'from',
    guard: ({ $auth }) => $auth.loggedIn,
  },
  endpoints: {
    authenticate: {
      method: 'post',
      url: '/auth/login',
      property: 'access_token'
    },
    user: {
      method: 'get',
      url: '/auth/user'
    },
    logout: false
  },
  strategy,
}
```
When initializing the module, you can specify the following settings:

### httpClient
*Type: String|Object. Default: 'axios'.*
<br>
<br>
Сlient with the help of which HTTP requests will be sent.
<br>
May be 'axios' or 'http'. If http is specified, [vue-resource](https://www.npmjs.com/package/vue-resource) will be used.
<br>
You can also configure your own custom HTTP client and specify an object in this field. This feature may be necessary if you need a specific setting of headers and a reaction to a 401 error. See code for details.

### watchLoggedIn
*Type: Boolean. Default: true.*
<br>
<br>
If set to true, then with login and logout, a redirect to the routes specified in the settings will automatically occur.

### cookies
*Type: Object. Default: { path: '/' }.*
<br>
<br>
Cookies settings.

### token
*Type: Object. Default: { name: 'Authorization', type: 'Bearer' }.*
<br>
<br>
Token save settings.

### vuex
*Type: Object. Default: { namespace: '$auth' }.*
<br>
<br>
Using the *namespace* field, you can rename the module to vuex.

### redirect
*Type: Object.*
<br>
<br>
This option is designed to redirect the user and close routes.
To better understand it, see this plugin: [vue-router-auth](https://github.com/17axah/vue-router-auth)
***routes*** - *routes* config from vue-router-auth.
***guard*** - *guard* config from vue-router-auth.
***queryFrom*** (default: 'from') - If there is a *from* key in the *quere* parameter, then after authorization, redirection will be made to it. Only works with the **watchLoggedIn** option enabled.

### endpoints
*Type: Object.*
<br>
<br>
This option is used to indicate where to send requests and what data to expect in response.
<br>
**property** option can be specified as follows: 'data.foo.user'.

### strategy
default strategy:
```js
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
```
*Type: Object.*
<br>
<br>
You can also change or completely replace the module strategy.

### :eyes: Examples
### close route
```js
{
  path: '/account',
  component: () => import('layouts/Auth.vue'),
  meta: {
    auth: {
      access: true,
    },
  },
}
```
see more [vue-router-auth](https://github.com/17axah/vue-router-auth)

### redirect.queryFrom
```js
{
  path: '/account',
  component: () => import('layouts/Auth.vue'),
  meta: {
    auth: {
      access: true,
      redirect: ({ to }) => ({ path: '/login', query: { from: to.path } }),
    },
  },
}
```
In the example above, if the user is not authorized and tries to go to the */account* route, he will be redirected
on */login* with the *from* parameter. And when the user logs in, he redirects to the route specified in *query.from* in priority.
Only works with the **watchLoggedIn** option enabled.

### strategy
```js
import initialize from 'vue-simple-auth';
import Cookies from 'universal-cookie';

export default async function({ router, store, ssrContext }) {
  const cookies = ssrContext ? new Cookies(ssrContext.req.headers.cookie) : new Cookies();

  const config = {
    // ...
    strategy: {
      authenticate({ config }, httpClient, credentials) {
        // custom logic.
      },
    },
  };

  await initialize({ router, store, cookies, config });
};
```
