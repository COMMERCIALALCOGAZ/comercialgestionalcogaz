

const statutVer = document.getElementById("statut_ver");
const ver2000 = document.getElementById("2000_ver");
const ver1000 = document.getElementById("1000_ver");
const ver500 = document.getElementById("500_ver");
const ver200 = document.getElementById("200_ver");
const ver100 = document.getElementById("100_ver");
const ver50 = document.getElementById("50_ver");
const ver20 = document.getElementById("20_ver");
const ver10 = document.getElementById("10_ver");
const ver5 = document.getElementById("5_ver");
const totalEncaisserVer = document.getElementById("total_encaisser_ver");
const totalLogicelVer = document.getElementById("total_logicel_ver");
const terminerLaVerification = document.getElementById("terminerlaverification");
const id_ver = document.getElementById("id_ver");
const envoyer_par_ver = document.getElementById("envoyer_par_ver");


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import { getAuth,signOut } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-auth.js";
import { getFirestore, doc,getDoc, getDocs, collection, addDoc ,query, orderBy,where,deleteDoc,updateDoc} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA-n9iWjHoTgEOrPaK-U-A5ACg7TX0LPUo",
    authDomain: "commercialalcogaz.firebaseapp.com",
    databaseURL: "https://commercialalcogaz-default-rtdb.firebaseio.com",
    projectId: "commercialalcogaz",
    storageBucket: "commercialalcogaz.appspot.com",
    messagingSenderId: "35491946319",
    appId: "1:35491946319:web:2730318c7cfc42ea8b2f3a"
};

// Initialiser Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();



recupereddata();
async function recupereddata(){
    const urlParams = new URLSearchParams(window.location.search);
    const idValue = urlParams.get('id');
    console.log(idValue); // This will log "idbebhaeja"
    affiche(idValue);
}


async function affiche(idValue) {
    


         // Référence et récupération des données depuis Firestore
         const docRef = doc(db, 'archive', idValue);
         const docSnap = await getDoc(docRef);
 
         if (docSnap.exists()) {
             console.log("Document exists");
             const datas = docSnap.data();
             const total_caisse = datas.total_caisse;
             const tot_logiciel = datas.tot_logiciel;
 
             const billets_2000 = datas.billets_2000;
             const billets_1000 = datas.billets_1000;
             const billets_500 = datas.billets_500;
 
             const pieces_200 = datas.pieces_200;
             const pieces_100 = datas.pieces_100;
             const pieces_50 = datas.pieces_50;
             const pieces_20 = datas.pieces_20;
             const pieces_10 = datas.pieces_10;
             const pieces_5 = datas.pieces_5;

             const statutVer_ = datas.statut;
             const envoyerParVer_=  datas.creepar;
             const idVer_= datas.archiveId;

             // Mise à jour des éléments DOM avec les données de Firestore
             envoyer_par_ver.innerHTML = envoyerParVer_;
             id_ver.innerHTML = idVer_;
             statutVer.innerHTML = statutVer_;
             ver2000.innerHTML = billets_2000;
             ver1000.innerHTML = billets_1000;
             ver500.innerHTML = billets_500;
             ver200.innerHTML = pieces_200;
             ver100.innerHTML = pieces_100;
             ver50.innerHTML = pieces_50;
             ver20.innerHTML = pieces_20;
             ver10.innerHTML = pieces_10;
             ver5.innerHTML = pieces_5;

 
             // Mise à jour des totaux dans la caisse et dans le logiciel
             totalEncaisserVer.innerHTML = total_caisse + " DA";
             totalLogicelVer.innerHTML = tot_logiciel + " DA";


         } else {
             console.log("Document does not exist");
         }


}

terminerLaVerification.onclick = function() {
    window.location.href = "home.html"; // Remplacez par l'URL de la page d'accueil
};





