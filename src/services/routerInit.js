export default function ({ config, router, store }, permission) {
  router.beforeEach((to, from, next) => {
    const route = to.matched.find(r => typeof r.meta.auth === 'boolean')

    function getRouteTo () {
      const meta = to.meta.authTo || route.meta.authTo

      return typeof meta === 'function'
        ? meta({ to, from, config, router, store })
        : meta
    }

    const actions = [
      {
        condition: route && route.meta.auth && !permission(),
        callback: () => router.replace(getRouteTo() || config.redirect.guest)
      },
      {
        condition: route && !route.meta.auth && permission(),
        callback: () => router.replace(getRouteTo() || config.redirect.auth)
      },
      {
        condition: true,
        callback: () => next()
      }
    ]

    actions.find(action => action.condition).callback()
  })
}
