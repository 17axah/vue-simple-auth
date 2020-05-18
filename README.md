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
