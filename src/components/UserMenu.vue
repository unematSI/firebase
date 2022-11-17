<template>
  <div class="text-center">
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-avatar color="black" v-bind="attrs" v-on="on">
          <img :src="user.data.photoURL" v-if="user.loggedIn" alt="profile"/>
          <v-icon dark v-else> mdi-account-circle</v-icon>
        </v-avatar>
      </template>

      <v-card v-if="!user.loggedIn">
        <v-list>
          <v-list-item>
            <v-list-item-title @click.prevent="user.register('andre.luis@unemat.br', '12342Asdf*')">Cadastrar</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click.prevent="user.login()">Login</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card v-else>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img :src="user.data.photoURL" alt="profilepic"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ user.data.displayName }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.data.email }}</v-list-item-subtitle>
            </v-list-item-content>

          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-title @click.prevent="user.logOut()">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import {user} from "@/user";
export default {
  data: () => ({
    user: user,
    fav: true,
    menu: false,
    message: false,
    hints: true,
  }),
}
</script>