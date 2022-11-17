import {auth, db, fb} from './main'
import firebase from "firebase";


export var user = {
    loggedIn: false,
    data: null,

    async register(email, password) {
        await auth
            .createUserWithEmailAndPassword(email, password)
            .then((user) => {
                console.log(user);
                this.loggedIn = true
                this.data = user
                return {'Status': true, 'Msg': 'Registrado com sucesso!'}
            })
            .catch((error) => {
                console.log(error);
                return {'status': false, 'Msg': `Falha ao se registrar (${error})!`}
            })
    },
    async login() {
        await auth
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((data) => {
                console.log(data)
                this.loggedIn = true
                this.data = data.user
                return {'Status': true, 'Msg': 'Login efetuado com sucesso!'}
            })
            .catch((error) => {
                console.log(error);
                return {'status': false, 'Msg': `Falha ao se registrar (${error})!`}
            })
    },
    async logOut() {
        await auth
            .signOut()
            .then(user => {
                this.loggedIn = false
                this.data = null
                return {'Status': true, 'Msg': 'Logout efetuado com sucesso!'}
            })
            .catch((error) => {
                console.log(error);
                return {'status': false, 'Msg': `Falha ao efetuar logout (${error})!`}
            })
    }
}