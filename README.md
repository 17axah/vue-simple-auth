# vue-simple-auth

Very flexible and easily customizable authorization module using jwt token. It has SSR support.
<br>
[vue-router-auth](https://github.com/17axah/vue-router-auth) is used to configure routes.

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






