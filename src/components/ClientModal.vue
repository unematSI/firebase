<template>
  <v-dialog max-width="500px" v-model="visible" :persistent="this.tipoFormulario!= this.tf.TF_VISUALIZACAO">
    <v-card>
      <v-card-title>
        <span class="text-h5">Cliente - {{ this.tituloFormulario }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                  :readonly="tiposVisualizacao.includes(tipoFormulario)"
                  v-model="client.name"
                  :error-messages="nameErrors"
                  :counter="10"
                  label="Nome"
                  required
                  @input="$v.client.name.$touch()"
                  @blur="$v.client.name.$touch()"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                  :readonly="tiposVisualizacao.includes(tipoFormulario)"
                  v-model="client.email"
                  :error-messages="emailErrors"
                  label="Email"
                  required
                  @input="$v.client.email.$touch()"
                  @blur="$v.client.email.$touch()"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mr-4" @click="submit(mrOK)" color="green">
          {{ tituloBtnOk }}
        </v-btn>
        <v-btn v-if="tipoFormulario !== tf.TF_VISUALIZACAO" @click="submit(mrCancel)" color="red">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {email, maxLength, required} from "vuelidate/lib/validators";
import {validationMixin} from "vuelidate";
import {ModalResult, TipoFormulario} from "/src/utils";

export default {
  mixins: [validationMixin],

  validations: {
    client: {
      name: {required, maxLength: maxLength(10)},
      email: {required, email},
    },

  },
  data: () => ({
    visible: false,
    tiposVisualizacao: [TipoFormulario.TF_VISUALIZACAO, TipoFormulario.TF_EXCLUSAO],
    tipoFormulario: TipoFormulario.TF_VISUALIZACAO,
    tf: TipoFormulario,
    mrCancel: ModalResult.MR_CANCEL,
    mrOK: ModalResult.MR_OK,
    client: {
      name: '',
      email: '',
    },
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
    tituloFormulario() {
      if (this.tipoFormulario === TipoFormulario.TF_INCLUSAO) {
        return 'inclusão'
      } else if (this.tipoFormulario === TipoFormulario.TF_ALTERACAO) {
        return 'alteração'
      } else if (this.tipoFormulario === TipoFormulario.TF_EXCLUSAO) {
        return 'exclusão'
      } else if (this.tipoFormulario === TipoFormulario.TF_VISUALIZACAO) {
        return 'visualização'
      }
      return ''
    },
    tituloBtnOk(){
      if (this.tipoFormulario === TipoFormulario.TF_INCLUSAO) {
        return 'Cadastrar'
      } else if (this.tipoFormulario === TipoFormulario.TF_ALTERACAO) {
        return 'Alterar'
      } else if (this.tipoFormulario === TipoFormulario.TF_EXCLUSAO) {
        return 'Excluir'
      } else if (this.tipoFormulario === TipoFormulario.TF_VISUALIZACAO) {
        return 'Ok'
      }
      return ''
    }
  },
  methods: {
    open(client = null, tf = TipoFormulario.TF_VISUALIZACAO) {
      this.client = {
        name: '',
        email: '',
      }
      if (tf !== TipoFormulario.TF_INCLUSAO) {
        this.client.name = client.name
        this.client.email = client.email
      }
      this.tipoFormulario = tf
      this.visible = true
    },
    submit(result) {
      if (result === ModalResult.MR_OK) {
        this.$v.$touch()
      } else {
        this.$v.$reset()
      }
      if (!this.$v.$error) {
        this.$emit('fechar', this.client, result, this.tipoFormulario)
        this.visible = false
        // this.clear()
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
