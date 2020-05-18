export default class Resource {
  constructor(instance) {
    this.instance = instance
  }

  setHeader(key, value) {
    this.instance.headers.common[key] = value
  }

  removeHeader(key) {
    delete this.instance.headers.common[key]
  }

  install(auth) {
    this.instance.interceptors.push(function(request) {
      return function(response) {
        const { status } = response

        if (status === 401 && process.env.CLIENT) {
          auth.localLogout()
        }
      }
    })
  }
}
