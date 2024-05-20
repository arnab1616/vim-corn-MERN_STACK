import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDn4JmSgOlqZT47jNAiax1I0zKp9EUB6GY",
  authDomain: "vim-corn-14c9a.firebaseapp.com",
  projectId: "vim-corn-14c9a",
  storageBucket: "vim-corn-14c9a.appspot.com",
  messagingSenderId: "949155288036",
  appId: "1:949155288036:web:fea6c194afdbc18105edf1"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
