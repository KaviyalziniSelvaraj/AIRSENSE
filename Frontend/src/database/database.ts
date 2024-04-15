import firebase from "firebase";


class Database{
    // Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
static firebaseConfig :any= {
  apiKey: "AIzaSyDi6ab0alRtc8yUwzcgP9atkwxmY7O164I",
  authDomain: "airsense-6b00b.firebaseapp.com",
  projectId: "airsense-6b00b",
  storageBucket: "airsense-6b00b.appspot.com",
  messagingSenderId: "373258691827",
  appId: "1:373258691827:web:250cbee727487f08c44386",
  measurementId: "G-Z0MXGTHB8L"
};

// Initialize Firebase
static app = firebase.initializeApp(this.firebaseConfig);
static database=firebase.database();

}

export default Database;