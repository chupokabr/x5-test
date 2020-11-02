<template>
  <v-row no-gutters align="stretch" style="height: 100%">
    <v-col md="5" sm="12">
      <v-img
        src="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
        min-height="100%"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"></v-img>
    </v-col>

    <v-col md="7" sm="12" class="d-flex align-center">

      <v-card tile flat class="auth-box">
        <v-card-title>
          <h1>Регистрация</h1>
        </v-card-title>
        <v-card-text>
          <p>
            Добро пожаловать, <br>
            Пожалуйста заругистрируйтесь.
          </p>

          <p>
            Уже зарегистированы? <nuxt-link to="/login">Войти</nuxt-link>
          </p>

          <v-divider></v-divider>

          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="controls.name" :rules="[rules.required]" label="Введите имя" name="USER_NAME" required></v-text-field>

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

            <v-text-field
              v-model="controls.passwordConfirm"
              :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, passwordConfirmationRule]"
              :type="showPasswordConfirm ? 'text' : 'password'"
              name="PASSWORD_CONFIRM"
              label="Повторите пароль"
              hint="Не меньше 8 символов"
              counter
              @click:append="showPasswordConfirm = !showPasswordConfirm"
              required
            ></v-text-field>

            <v-btn :disabled="!valid" color="primary" @click="onSubmit">Зарегистрироваться</v-btn>
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
    valid: true,
    showPassword: false,
    showPasswordConfirm: false,
    controls: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    rules: {
      required: value => !!value || 'Заполните поле.',
      min: v => v.length >= 8 || 'Минимум 8 символов',
      email: v => /.+@.+/.test(v) || 'Введите e-mail'
    }
  }),
  computed: {
    passwordConfirmationRule() {
      return () => (this.controls.password === this.controls.passwordConfirm) || 'Пароль не совпадает'
    }
  },
  methods: {
    async onSubmit() {
      const valid = this.$refs.form.validate();

      if (valid) {
        this.loading = true;

        try {
          const data = {
            name: this.controls.name,
            email: this.controls.email,
            password: this.controls.password
          }

          await this.$store.dispatch('auth/registration', data);
          this.$router.push('/login?message=reg');
        } catch (e) {
          this.loading = false
        }
      }
    }
  }
}
</script>
