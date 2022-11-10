<template>
  <div>
    <v-snackbar
        :color="snackColor"
        v-model="snackbar"
    >
      {{ statusMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
    <v-container>
      <form class="width-md">
        <v-text-field
            v-model="client.name"
            :error-messages="nameErrors"
            :counter="10"
            label="Nome"
            required
            @input="$v.client.name.$touch()"
            @blur="$v.client.name.$touch()"
        ></v-text-field>
        <v-text-field
            v-model="client.email"
            :error-messages="emailErrors"
            label="Email"
            required
            @input="$v.client.email.$touch()"
            @blur="$v.client.email.$touch()"
        ></v-text-field>
        <div class="mt-4">
          <v-btn
              class="mr-4"
              @click="submit"
          >
            cadastrar
          </v-btn>
          <v-btn @click="clear">
            limpar
          </v-btn>
        </div>
      </form>
    </v-container>
  </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, maxLength, email} from 'vuelidate/lib/validators'


export default {
  mixins: [validationMixin],

  validations: {
    client: {
      name: {required, maxLength: maxLength(10)},
      email: {required, email},
    },

  },

  data: () => ({
    client: {
      name: '',
      email: '',
    },
    statusMessage: '',
    snackbar: false,
    snackColor: 'green'
  }),

  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.client.name.$dirty) return errors
      !this.$v.client.name.maxLength && errors.push('Nome deve conter no máximo 10 caracteres.')
      !this.$v.client.name.required && errors.push('Nome é obrigatório.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.client.email.$dirty) return errors
      !this.$v.client.email.email && errors.push('O email de ver válido.')
      !this.$v.client.email.required && errors.push('Email é obrigatório.')
      return errors
    },
  },

  methods: {
    submit() {
      this.$v.$touch()

      if (!this.$v.$error) {
        this.$http
            .post('client.json', this.client)
            .then(resp => {
              this.statusMessage = 'Cliente cadastrado com sucesso!'
              this.snackbar = true
              this.snackColor = 'green'
              setTimeout(() => {
                this.snackbar = false;
                this.statusMessage = '';
              }, 5000);
            })
            .catch(err => {
              this.statusMessage = `Erro: ${err}`
              this.snackbar = true
              this.snackColor = 'red'
              setTimeout(() => {
                this.snackbar = false;
                this.statusMessage = '';
              }, 5000);
            })
      }
    },
    clear() {
      this.$v.$reset()
      this.client.name = ''
      this.client.email = ''
    },
  },
}
</script>