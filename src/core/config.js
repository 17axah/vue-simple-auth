import strategy from './strategy'

export default {
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
