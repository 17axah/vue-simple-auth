import Vue from 'vue'
import { deepMerge } from './utils'
import Auth from './core/Auth'
import storeInit from './services/storeInit'
import routerInit from './services/routerInit'
import store from './core/store'
import defaultConfig from './core/config'

function getHttpClient(httpClient) {
  if (typeof httpClient === 'string') {
    const toCapitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    const moduleName = toCapitalize(httpClient === 'http' ? 'resource' : httpClient)
    const instance = Vue[httpClient] || Vue.prototype[httpClient]
    const HttpClient = require(`./httpClients/${moduleName}`).default

    return new HttpClient(instance)
  } else {
    return httpClient
  }
}

export default async function (ctx) {
  const config = deepMerge(defaultConfig, ctx.config || {})
  const context = { ...ctx, config }
  const httpClient = getHttpClient(config.httpClient)
  const strategy = config.strategy
  const auth = new Auth(context, httpClient, strategy)

  storeInit(context, store)
  routerInit(context)

  Vue.prototype.$auth = auth

  await auth.init()
}
