export default {
  namespaced: true,
  state() {
    return {
      user: {},
      token: null,
      loggedIn: false
    }
  },
  mutations: {
    setState(state, data) {
      state.user = data.user
      state.token = data.token
      state.loggedIn = data.loggedIn
    },
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn
    },
    setToken(state, token) {
      state.token = token
    },
    setUser(state, user) {
      state.user = user
    }
  }
}
