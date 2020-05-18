export default function ({ config, router, store }, authStore) {
  if (store.state[config.vuex.namespace]) {
    store.registerModule(config.vuex.namespace, authStore, { preserveState: true })
  } else {
    store.registerModule(config.vuex.namespace, authStore)
  }

  if (config.watchLoggedIn) {
    const redirectTo = (routeTo) => {
      const path = typeof routeTo === 'object' ? routeTo.path : routeTo
      const from = router.currentRoute.query[config.redirect.queryFrom]

      if (path !== router.currentRoute.path) {
        router.replace(from || routeTo).then(() => {}).catch(() => {})
      }
    }

    const getter = state => state[config.vuex.namespace].loggedIn
    const callback = v => redirectTo(v ? config.redirect.routes.auth : config.redirect.routes.guest)

    store.watch(getter, callback)
  }
}
