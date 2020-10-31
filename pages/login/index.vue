<template>
  <v-row no-gutters align="stretch" style="height: 100%">
    <v-col cols="5">
      <v-img
        src="https://i.picsum.photos/id/1/5616/3744.jpg?hmac=kKHwwU8s46oNettHKwJ24qOlIAsWN9d2TtsXDoCWWsQ"
        min-height="100%"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"></v-img>
    </v-col>

    <v-col cols="7" class="d-flex align-center">

      <v-card tile flat class="auth-box">
        <v-card-title>
          <h1>Авторизация</h1>
        </v-card-title>
        <v-card-text>
          <v-alert dense text :type="message.type" :value="message.view">{{ message.text }}</v-alert>

          <p>
            Добро пожаловать, <br>
            Пожалуйста войдите в аккаунт.
          </p>

          <p>
            Не зарегистированы? <nuxt-link to="/registration">Зарегистрироваться</nuxt-link>
          </p>

          <v-divider></v-divider>

          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="controls.email" :rules="[rules.required, rules.email]" label="Введите e-mail" name="EMAIL" required></v-text-field>

            <v-text-field
              v-model="controls.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              name="PASSWORD"
              label="Введите пароль"
              hint="Не меньше 8 символов"
              counter
              @click:append="showPassword = !showPassword"
              required
            ></v-text-field>

            <v-btn :disabled="!valid" color="primary" @click="onSubmit">
              Войти
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'empty',
  data: () => ({
    loading: false,
    showPassword: false,
    valid: true,
    controls: {
      email: '',
      password: '',
    },
    message: {
      view: false,
      type: 'info',
      text: null
    },
    rules: {
      required: value => !!value || 'Заполните поле.',
      min: v => v.length >= 8 || 'Минимум 8 символов',
      email: v => /.+@.+/.test(v) || 'Введите e-mail'
    },
  }),
  mounted() {
    const { message } = this.$route.query;

    switch (message) {
      case 'auth':
        this.message = {
          view: true,
          type: 'warning',
          text: 'Чтобы продолжить работу авторизуйтесь'
        }
        break
      case 'reg':
        this.message = {
          view: true,
          type: 'success',
          text: 'Вы успешно зарегистрировались, авторизуйтесь'
        }
        break
      case 'session':
        this.message = {
          view: true,
          type: 'warning',
          text: 'Время сессии истекло, авторизуйтесь'
        }
        break
    }
  },
  methods: {
    async onSubmit() {
      const valid = this.$refs.form.validate();

      if (valid) {
        this.loading = true;

        try {
          const data = {
            email: this.controls.email,
            password: this.controls.password
          }

          await this.$store.dispatch('auth/login', data);
          this.$router.push('/');
        } catch (e) {
          this.loading = false
        }
      }
    }
  }
}
</script>

