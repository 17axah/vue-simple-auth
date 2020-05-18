import { middleware } from 'vue-router-auth';

export default function (context) {
  const { config, router } = context;

  const options = {
    router,
    guard: config.redirect.guard,
    routes: config.redirect.routes,
    context: {
      context,
    },
  };

  router.beforeEach(middleware(options));
}
