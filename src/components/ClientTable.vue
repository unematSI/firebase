<script src="../utils.js"></script>
<template>
  <div>
    <custom-snackbar ref="snackbar"/>
    <v-data-table
        :headers="headers"
        :items="filteredClients"
        sort-by="name"
        class="elevation-1"
        @click:row="item => openModal(item, tipoformulario.TF_VISUALIZACAO)"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Clientes</v-toolbar-title>
          <v-spacer/>
          <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="openModal(null, tipoformulario.TF_INCLUSAO)"
          >
            Novo
          </v-btn>
        </v-toolbar>
        <v-autocomplete v-model="search" :items="items" filled dense clearable label="Pesquisar"
                        no-data-text="Sem itens" prepend-inner-icon="mdi-magnify" item-value="id" item-text="name">
          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title v-text="data.item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="data.item.email"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
          </template>
        </v-autocomplete>
        <client-modal ref="clientModal" @fechar="(client, mr, tf) => onModalclose(client, mr, tf)"/>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click.stop="openModal(item, tipoformulario.TF_ALTERACAO)"
        >
          mdi-pencil
        </v-icon>
        <v-icon small @click.stop="openModal(item, tipoformulario.TF_EXCLUSAO)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ClientModal from "@/components/ClientModal";
import CustomSnackbar from "@/components/CustomSnackbar";
import {ModalResult, TipoFormulario} from "/src/utils";

export default {
  components: {CustomSnackbar, ClientModal},

  data: () => ({
    search: '',
    selectedItem: {},
    selectedIndex: -1,
    headers: [
      {text: 'Nome', align: 'start', value: 'name'},
      {text: 'Email', value: 'email'},
      {text: 'Ações', value: 'actions', sortable: false},
    ],
    tipoformulario: TipoFormulario,
    items: [],
  }),
  mounted() {
    this.getClients()
  },
  computed: {
    filteredClients() {
      return this.search ? this.items.filter((i) => this.search === i.id) : this.items
    },
  },
  methods: {
    addItem(item) {
      this.$http
          .post('client.json', item)
          .then(resp => {
            this.items.push(item)
            this.showSnackbar('Cliente cadastrado com sucesso!')
          })
          .catch(err => this.showSnackbar(`Erro ao inserir cliente: ${err}`, true))
    },
    deleteItem() {
      this.$http
          .delete('client/' + this.selectedItem.id + '.json')
          .then(resp => {
            this.items.splice(this.selectedIndex, 1)
            this.showSnackbar('Cliente deletado com sucesso!')
          })
          .catch(err => this.showSnackbar(`Erro ao deletar cliente: ${err}`, true))

    },
    editItem(item) {
      this.$http
          .patch('client/' + this.selectedItem.id + '.json', item)
          .then(resp => {
            this.showSnackbar('Cliente alterado com sucesso!')
            this.items[this.selectedIndex].name = item.name
            this.items[this.selectedIndex].email = item.email
          })
          .catch(err => this.showSnackbar(`Erro ao alterar cliente: ${err}`, true))
    },
    getClients() {
      this.items = []
      this.$http
          .get('client.json')
          .then(resp => {
            for (let key in resp.data) {
              this.items.push({
                id: key,
                name: resp.data[key].name,
                email: resp.data[key].email,
              })
            }
          })
          .catch(err => this.showSnackbar(`Erro ao carregar clientes: ${err}`, true))
    },
    openModal(item, tf) {
      this.selectedIndex = this.items.indexOf(item)
      this.selectedItem = Object.assign({}, item)

      this.$refs.clientModal.open(item, tf);
    },
    onModalclose(client = null, mr = ModalResult.MR_CANCEL, tf = TipoFormulario.TF_VISUALIZACAO) {
      if (mr === ModalResult.MR_OK) {
        if (tf === TipoFormulario.TF_INCLUSAO) {
          this.addItem(client);
        } else if (tf === TipoFormulario.TF_ALTERACAO) {
          this.editItem(client);
        } else if (tf === TipoFormulario.TF_EXCLUSAO) {
          this.deleteItem(client);
        }
      }
    },
    showSnackbar(msg, error = false) {
      this.$refs.snackbar.show(msg, error)
    },
  },
}
</script>