export const state = () => ({

});

export const actions = {
  async create({ commit }, tableName) {
    try {
      const { status, message, data } = await this.$axios.$post(`${process.env.apiBaseUrl}/api/spreadsheets`, tableName);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      } else {
        return data;
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  async fetch({ commit }) {
    try {
      const { status, message, data } = await this.$axios.$get(`${process.env.apiBaseUrl}/api/spreadsheets`);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      } else {
        return data;
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  async remove({ commit }, id) {
    try {
      const { status, message, data } = await this.$axios.$delete(`${process.env.apiBaseUrl}/api/spreadsheets/${id}`);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      } else {
        return data;
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  async editName({ commit }, table) {
    try {
      const { status, message, data } = await this.$axios.$put(`${process.env.apiBaseUrl}/api/spreadsheets/name/${table.id}`, table);

      if (status !== 'ok') {
        commit('setAlertUI', {message: message, type: 'error'}, {root: true});
      } else {
        return data;
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  },
  async save({ commit }, table) {
    try {
      const res = await this.$axios.$put(`${process.env.apiBaseUrl}/api/spreadsheets/${table._id}`, table);

      if (res.status !== 'ok') {
        commit('setAlertUI', {message: result.message, type: 'error'}, {root: true});
      } else {
        return res;
      }
    } catch(e) {
      commit('setAlertUI', {message: 'Что-то пошло не так', type: 'error'}, {root: true});
    }
  }
}
