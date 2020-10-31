export default ({ $axios, error, redirect, store }) => {
  $axios.onError(({ response }) => {
    const statusCode = response.status
    const message = response.data.message

    switch (statusCode) {
      case 401:
        redirect('/login?message=session')
        store.dispatch('auth/logout')
        break

      case 422:
        break

      case 500:
        break

      default:
        error({
          statusCode,
          message
        })
    }
  })
}
