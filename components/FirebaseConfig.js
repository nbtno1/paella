import * as firebase from 'firebase'

const config = {
  apiKey: "AIzaSyBdw02IZoUy-JEPQkuvELyadvWIanUzBw0",
  authDomain: "paella-d7d5c.firebaseapp.com",
  databaseURL: "https://paella-d7d5c.firebaseio.com",
  projectId: "paella-d7d5c",
  storageBucket: "paella-d7d5c.appspot.com",
  messagingSenderId: "1049821543203",
  appId: "1:1049821543203:web:c979e6b50cf76cbe"
};

export default class Firebase {

    static auth

    static init() {
      firebase.initializeApp(config)
      Firebase.auth = firebase.auth()
    }
}
