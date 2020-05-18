export default class Auth {
  constructor(context, httpClient, strategy) {
    this.defaultStrategy = { ...strategy }

    this.strategy = strategy
    this.context = context
    this.httpClient = httpClient
  }

  async init() {
    const token = this.getToken()

    this.httpClient.install(this)

    if (token) {
      if (!this.loggedIn) {
        await this.loginByToken(token)
      } else {
        this.rememberToken(token)
      }
    }
  }

  get user() {
    const { store, config } = this.context

    return store.state[config.vuex.namespace].user
  }

  get token() {
    const { store, config } = this.context

    return store.state[config.vuex.namespace].token
  }

  get loggedIn() {
    const { store, config } = this.context

    return store.state[config.vuex.namespace].loggedIn
  }

  setStrategy(strategy) {
    this.strategy = strategy
  }

  rememberToken(token) {
    this.strategy.rememberToken(this.context, this.httpClient, token)
  }

  forgetToken() {
    this.strategy.forgetToken(this.context, this.httpClient)
  }

  getToken() {
    const { cookies, config } = this.context
    const { name, type } = config.token
    const token = cookies.get(name)
    const re = new RegExp(`^${type} `)

    return token ? token.replace(re, '') : null
  }

  localLogout() {
    const { store, config } = this.context
    const { namespace } = config.vuex

    this.forgetToken()

    store.commit(`${namespace}/setState`, { user: {}, token: null, loggedIn: false })
  }

  async login(credentials) {
    const token = await this.strategy.authenticate(this.context, this.httpClient, credentials)

    await this.loginByToken(token)
  }

  async loginByToken(token) {
    const { store, config } = this.context
    const { namespace } = config.vuex

    const onSuccess = (user) => {
      store.commit(`${namespace}/setState`, { user, token, loggedIn: true })
    }

    const onError = () => {
      this.forgetToken()
    }

    this.rememberToken(token)

    await this.strategy.getUser(this.context, this.httpClient).then(onSuccess).catch(onError)
  }

  async fetchUser() {
    const { store, config } = this.context
    const { namespace } = config.vuex
    const user = await this.strategy.getUser(this.context, this.httpClient)

    store.commit(`${namespace}/setUser`, user)
  }

  async logout() {
    await this.strategy.logout(this.context, this.httpClient)

    this.localLogout()
  }
}
