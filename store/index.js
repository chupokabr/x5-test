export const state = () => ({
  alertUI: ''
})

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('auth/getUserServer')
  }
}

export const mutations = {
  setAlertUI(state, alert) {
    state.alertUI = alert
  },
  clearAlertUI(state) {
    state.alertUI = null
  }
}

export const getters = {
  alertUI: state => state.alertUI
}
