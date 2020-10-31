<template>
  <v-app app light>
    <Snackbar />

    <v-main fluid style="height: 100%" :class='{ "loading-page": loading }'>
      <Nuxt />
    </v-main>

    <v-overlay :value="loading" opacity=".7">
      <v-progress-circular
        indeterminate
        size="64"
        color="purple darken-4"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>

<style>
.loading-page {
  opacity: 0
}
</style>
