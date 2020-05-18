export default class Axios {
  constructor(instance) {
    this.instance = instance
  }

  setHeader(key, value) {
    this.instance.defaults.headers.common[key] = value
  }

  removeHeader(key) {
    delete this.instance.defaults.headers.common[key]
  }

  install(auth) {
    const onSuccess = (res) => res
    const onError = (error) => {
      const { status } = error.response

      if (status === 401 && process.env.CLIENT) {
        auth.localLogout()
      }
    }

    this.instance.interceptors.response.use(onSuccess, onError)
  }
}
