<template>
  <v-app app>
    <Snackbar />

    <v-app-bar app clipped-left flat color="deep-purple darken-3">
      <v-app-bar-nav-icon @click="drawer = true" color="#fff"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer app clipped v-model="drawer" mobile-breakpoint="650" dark permanent color="deep-purple accent-4">
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon x-large>mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name || '' }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email || '' }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group
          v-model="selectedItem"
          color="deep-purple lighten-5"
        >
          <v-list-item
            v-for="(item, i) in navigations"
            :key="i"
            :to="item.url" nuxt
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="addNewTable()">
            <v-list-item-icon>
              <v-icon>mdi-table-large-plus</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Создать таблицу</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn to="/logout" nuxt block>
            <v-icon left>
              mdi-exit-to-app
            </v-icon>
            Выйти
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main style="height: 100%" :class='{ "loading-page": loading }'>
      <Nuxt />
    </v-main>

    <v-overlay :value="loading" opacity=".5">
      <v-progress-circular
        indeterminate
        size="64"
        color="purple darken-4"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    drawer: true,
    selectedItem: 0,
    navigations: [
      { title: 'Таблицы', icon: 'mdi-file-table-box-multiple', 'url': '/' },
    ],
    loading: true
  }),
  computed: {
    ...mapGetters({
      user: 'auth/getUser',
    })
  },
  methods: {
    async addNewTable() {
      const data = {
        tableName: 'Новая таблица'
      }

      const response = await this.$store.dispatch('table/create', data);
      this.$router.push(`/spreadsheets/${response._id}`);
    }
  },
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
