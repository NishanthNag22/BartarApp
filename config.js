import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyDZxPVm9p5AGe-cbTVvkXa4A5m9URnsbDo",
    authDomain: "bartarapp-10500.firebaseapp.com",
    databaseURL: "https://bartarapp-10500-default-rtdb.firebaseio.com",
    projectId: "bartarapp-10500",
    storageBucket: "bartarapp-10500.appspot.com",
    messagingSenderId: "1052275870551",
    appId: "1:1052275870551:web:695e5619c18827fe98cc12"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();