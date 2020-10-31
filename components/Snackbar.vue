<template>
  <v-snackbar v-model="show" :timeout="3500" dense top :color="type">
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="show = false">
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      type: ''
    }
  },
  created: function () {
    this.$store.watch(state => state.alertUI, () => {
      const alert = this.$store.state.alertUI

      if (alert) {
        this.show = true
        this.message = this.$store.state.alertUI.message
        this.type = this.$store.state.alertUI.type

        setTimeout(() => {
          this.$store.commit('setAlertUI', '')
        }, 100)
      }
    })
  }
}
</script>
