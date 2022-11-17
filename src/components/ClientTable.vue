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
    this.setListeners()
    this.showSnackbar('Clientes carregados com sucesso!')
  },
  computed: {
    filteredClients() {
      return this.search ? this.items.filter((i) => this.search === i.id) : this.items
    },
  },
  methods: {
    addItem(item) {
      this.$db.push(item, (err) => {
        if (err) {
          this.$refs.snackbar.show('Erro ao adicionar cliente', true)
        }
      })
    },
    deleteItem() {
      this.$db.child(this.selectedItem.id).remove((err) => {
        if (err) {
          this.$refs.snackbar.show('Erro ao remover cliente', true)
        }
      })

    },
    editItem(item) {
      this.$db.child(this.selectedItem.id).update(item, (err) => {
        if (err) {
          this.showSnackbar(`Erro ao editar cliente: ${err}`, true)
        }
      })
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
    setListeners() {
      this.$db.on('child_added', (snapshot) => {
        let client = snapshot.val()

        this.items.push({
          id: snapshot.key,
          name: client.name,
          email: client.email
        })
        this.showSnackbar(`Cliente ${client.name} cadastrado!`)
      })

      this.$db.on('child_changed', (snapshot) => {
        let client = snapshot.val()
        let index = this.items.findIndex(item => item.id === snapshot.key)
        this.items[index].name = client.name;
        this.items[index].email = client.email;

        this.showSnackbar(`Cliente ${client.name} alterado!`)
      })

      this.$db.on('child_removed', (snapshot) => {
        let index = this.items.findIndex(item => item.id === snapshot.key)
        this.showSnackbar(`Cliente ${this.items[index].name} deletado!`)
        this.items.splice(index, 1)
      })
    }
  },
}
</script>