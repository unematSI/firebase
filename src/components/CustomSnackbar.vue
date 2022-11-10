<template>
  <v-snackbar
      :color="snackColor"
      v-model="visible"
      timeout="3000"
      dark
  >
    {{ statusMessage }}
    <template v-slot:action="{ attrs }">
      <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="visible = false"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    statusMessage: '',
    visible: false,
    snackColor: 'green'
  }),
  methods: {
    show(msg, error) {
      this.statusMessage = msg
      this.snackColor = error ? 'red' : 'green'
      this.visible = true
    }
  }
}
</script>