
const terminerLaVerification = document.getElementById("terminerlaverification");
const wating_bordereau_a_ajouter = document.getElementById("wating_bordereau_a_ajouter");


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
    
    wating_bordereau_a_ajouter.style.display="flex";

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

             const totalAmount = (billets_2000 * 2000) + (billets_1000 * 1000) + (billets_500 * 500) +
             (pieces_200 * 200) + (pieces_100 * 100) + (pieces_50 * 50) +
             (pieces_20 * 20) + (pieces_10 * 10) + (pieces_5 * 5);

             // Mise à jour des éléments DOM avec les données de Firestore
        // Mise à jour des éléments DOM avec les données de Firestore
        document.getElementById("envoyer_par_ver").innerHTML = "Envoyé par : " + envoyerParVer_;
        document.getElementById("id_ver").innerHTML = "ID : " + idVer_;
        document.getElementById("statut_ver").innerHTML = "Statut du bordereau : " + statutVer_;
        document.getElementById("2000_ver").innerHTML = "2000 DA : " + billets_2000;
        document.getElementById("1000_ver").innerHTML = "1000 DA : " + billets_1000;
        document.getElementById("500_ver").innerHTML = "500 DA : " + billets_500;
        document.getElementById("200_ver").innerHTML = "200 DA : " + pieces_200;
        document.getElementById("100_ver").innerHTML = "100 DA : " + pieces_100;
        document.getElementById("50_ver").innerHTML = "50 DA : " + pieces_50;
        document.getElementById("20_ver").innerHTML = "20 DA : " + pieces_20;
        document.getElementById("10_ver").innerHTML = "10 DA : " + pieces_10;
        document.getElementById("5_ver").innerHTML = "5 DA : " + pieces_5;

        // Mise à jour des totaux dans la caisse et dans le logiciel
        document.getElementById("total_encaisser_ver").innerHTML = "Total encaissé : " + totalAmount + " DA";
        document.getElementById("total_logicel_ver").innerHTML = "Total (logiciel) : " + tot_logiciel + " DA";

   
        wating_bordereau_a_ajouter.style.display="none";


         } else {
             console.log("Document does not exist");
             wating_bordereau_a_ajouter.style.display="none";

         }


}

terminerLaVerification.onclick = function() {
    window.location.href = "home.html"; // Remplacez par l'URL de la page d'accueil
};





