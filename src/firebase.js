import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const config = {
    apiKey: 'AIzaSyCjJnKJ2Ene69JTgsRAY9usgUjckYE8kHU',
    authDomain: 'workshop-dv-siripan.firebaseapp.com',
    databaseURL: 'https://workshop-dv-siripan.firebaseio.com/',
    projectId: 'workshop-dv-siripan',
    storageBucket: 'workshop-dv-siripan.appspot.com/',
    messagingSenderId: '346634482731153'
}

firebase.initializeApp(config)

const database = firebase.database()
const auth = firebase.auth()
const provider = new firebase.auth.FacebookAuthProvider()

export {
    database,
    auth,
    provider
}