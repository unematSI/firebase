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
    <client-table/>
  </div>
</template>

<script>
import ClientTable from "@/components/ClientTable";
import ClientModal from "@/components/ClientModal";


export default {
  components: {ClientModal, ClientTable},

  data: () => ({
    statusMessage: '',
    snackbar: false,
    snackColor: 'green'
  }),

}
</script>