export const state = () => ({
  status: false,
  user: {
    name: '',
    email: ''
  },
});

export const mutations = {
  setAuth(state, status) {
    state.status = status
  },
  setUser(state, user) {
    state.user = user
  },
  clearAuth(state) {
    state.status = false
    state.user = {
      name: '',
      email: ''
    }
  }
}

export const actions = {
  async login({ commit, dispatch }, data) {
    try {
      const { status, message, user } = await this.$axios.$post(`${
        process.env.apiBaseUrl}/api/login`, data);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      } else {
        dispatch('setAuth', status)
        dispatch('setUser', user)
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  async registration({ commit }, data) {
    try {
      const { status, message } = await this.$axios.$post(`${process.env.apiBaseUrl}/api/register`, data);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  setAuth({ commit }, status) {
    commit('setAuth', status)
  },
  async logout({ commit }) {
    try {
      const { status, message } = await this.$axios.$get(`${process.env.apiBaseUrl}/api/user/logout`);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      } else {
        commit('clearAuth')
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  async getUser({ commit, dispatch }) {
    try {
      const { status, user, message } = await this.$axios.$get(`${process.env.apiBaseUrl}/api/user/get-info`);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      } else {
        dispatch('setAuth', status)
        dispatch('setUser', user)
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  async getUserServer({ commit, dispatch }) {
    try {
      const { status, user, message } = await this.$axios.$get(`/api/user/get-info`);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      } else {
        dispatch('setAuth', status)
        dispatch('setUser', user)
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  setUser({ commit }, user) {
    commit('setUser', user)
  },
}

export const getters = {
  isAuth: state => Boolean(state.status),
  getUser: state => state.user
}
