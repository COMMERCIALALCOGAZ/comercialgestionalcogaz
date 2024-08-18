 const m = document.getElementById('m');
 const x = document.getElementById('x');
 const controlbg = document.getElementById('controlbg');
 const datashowbg = document.getElementById('datashowbg');
 const affichebgaddbordero = document.getElementById('affichebgaddbordero');
 const bg_add_info  = document.getElementById('bg_add_info'); 
 const anulertosavetodraftbtn = document.getElementById('anulertosavetodraftbtn'); 
 const wating_bordereau_a_ajouter = document.getElementById('wating_bordereau_a_ajouter'); 
 
 const notification = document.getElementById('notification'); 

 affichebgaddbordero.addEventListener('click', () => {
     bg_add_info.style.display="flex";
 });
 anulertosavetodraftbtn.addEventListener('click', () => {
  bg_add_info.style.display="none";
});

// Définir le contenu HTML à insérer
const content = `
    <div class="btngoroptions" id="valideB">
        <h1>Bordereaux validés</h1>
        <p>Tous les bordereaux qui ont été validés sont reçus par vous.</p>
        <br>
        <img src="img/undraw_message_sent_re_q2kl.svg" alt="">
        <br>
        <h2>(0)</h2>
    </div>
    <div class="btngoroptions" id="reception">
        <h1>Boîte de réception</h1>
        <p>Les bordereaux reçus qui sont en attente de votre validation.</p>
        <br>
        <img src="img/undraw_mailbox_re_dvds.svg" alt="">
        <br>
        <h2>(0)</h2>
    </div>
        <div class="btngoroptions" id="draft">
        <h1>Brouillon</h1>
        <p>Les bordereaux qui sont encore en cours de rédaction.</p>
        <br>
        <img src="img/undraw_file_manager_re_ms29.svg" alt="">
        <br>
        <h2>(0)</h2>
    </div>
    <div class="btngoroptions" id="rapport">
        <h1>Rapports</h1>
        <p>Les rapports mensuels pour toutes les transmissions de bordereaux.</p>
        <br>
        <img src="img/undraw_data_report_re_p4so.svg" alt="">
        <br>
    </div>
    <div class="btngoroptions" id="testfiabilite">
        <h1>verifier la fiabilite</h1>
        <p>verifier la fiabiliter des bordereaux par scan le qr code </p>
        <br>
        <img src="img/undraw_mobile_photos_psm5.svg" alt="">
        <br>
    </div>
        <div class="btngoroptions" id="logoutButton">
        <h1>déconnecter</h1>
        <p></p>
        <br>
         <img src="img/undraw_login_re_4vu2.svg" alt="">

        <br>
    </div>

`;








import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import { getAuth,signOut } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-auth.js";
import { getFirestore, doc,getDoc, getDocs, collection, addDoc ,query, orderBy,where} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-firestore.js";

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


auth.onAuthStateChanged(async (user) => {
  if (user) {
    const  id_user = user.uid;

     notification.classList.add('show');
     notification.style.backgroundColor="#289f00"
     notification.innerHTML = `Vous vous êtes connecté avec succès.`;

     setTimeout(() => {
         notification.classList.remove('show');
     }, 5000);


     m.addEventListener('click', () => {
      ouvrirlemenu(user.uid);
    });
    
    x.addEventListener('click', () => {
      fermerlemenu();
    });


    async function handleSave() {
      await saveToFirebase(id_user);
    }
    
    document.getElementById('savetodraftbtn').addEventListener('click', handleSave);
    

     
  }


  else{
    notification.classList.add('show');
    notification.style.backgroundColor="#e30000"
    notification.innerHTML = `Déconnexion en cours...`;
    setTimeout(() => {
          notification.classList.remove('show');
          signOutUser();
    }, 5000);

  }

});
 
function fermerlemenu(){
  x.classList.add('rotate');
  m.classList.remove('rotate');
  controlbg.style.width ="0%";
  datashowbg.style.width ="100%";
  controlbg.innerHTML = "";

  setTimeout(() => {
    x.style.display = 'none';
    m.style.display = 'flex';


  }, 500);
}
function ouvrirlemenu(userid){
  m.classList.add('rotate');
  x.classList.remove('rotate');
  controlbg.style.width ="100%";
  datashowbg.style.width ="0%";
  

  setTimeout(() => {
    m.style.display = 'none';
    x.style.display = 'flex';
    controlbg.innerHTML = content;

    const valideB = document.getElementById('valideB');
    valideB.addEventListener('click', () => {
      fermerlemenu();
    });
    const reception = document.getElementById('reception');
    reception.addEventListener('click', () => {
      fermerlemenu();
    });

   
   const draft = document.getElementById('draft');
   draft.addEventListener('click', async () => {

     fermerlemenu();

     const draftCollectionQuery_ = await getDocs(
      query(collection(db, 'users', userid, 'facture_draft'), orderBy('timestamp', 'desc'))
     );     const numberOfDocuments = draftCollectionQuery_.size;

      // Sélection de l'élément où tout sera inséré
      const dataShowBg = document.getElementById("datashowbg");
      
      // Création du conteneur principal
      const filtrageSettingsBg = document.createElement("div");
      filtrageSettingsBg.classList.add("filtragesetingsbg");
      
      // Titre "Filtrage"
      const filtrageTitle = document.createElement("h3");
      filtrageTitle.textContent = "Filtrage";
      filtrageSettingsBg.appendChild(filtrageTitle);
      
      // Ajout de la section de filtrage par date
      const filtrageParDate = document.createElement("div");
      filtrageParDate.classList.add("filtragepardate");
      
      // Label et input pour la date de début
      const labelDebut = document.createElement("label");
      labelDebut.setAttribute("for", "datedebut");
      labelDebut.textContent = "Du:";
      filtrageParDate.appendChild(labelDebut);
      
      const inputDebut = document.createElement("input");
      inputDebut.setAttribute("type", "date");
      inputDebut.setAttribute("id", "datedebut");
      inputDebut.setAttribute("name", "datedebut");
      filtrageParDate.appendChild(inputDebut);
      
      filtrageParDate.appendChild(document.createElement("br"));
      filtrageParDate.appendChild(document.createElement("br"));
      
      // Label et input pour la date de fin
      const labelFin = document.createElement("label");
      labelFin.setAttribute("for", "datefin");
      labelFin.textContent = "Au:";
      filtrageParDate.appendChild(labelFin);
      
      const inputFin = document.createElement("input");
      inputFin.setAttribute("type", "date");
      inputFin.setAttribute("id", "datefin");
      inputFin.setAttribute("name", "datefin");
      filtrageParDate.appendChild(inputFin);
      

      filtrageParDate.appendChild(document.createElement("br"));
      filtrageParDate.appendChild(document.createElement("br"));
      
      // Bouton de validation
      const btnValider = document.createElement("button");
      btnValider.classList.add("btn");
      btnValider.textContent = "Valider";
      filtrageParDate.appendChild(btnValider);
      
      // Ajout de la section de filtrage au conteneur principal
      filtrageSettingsBg.appendChild(filtrageParDate);
      
      // Ajout du conteneur principal à l'élément avec l'ID "datashowbg"
      dataShowBg.appendChild(filtrageSettingsBg);
      dataShowBg.appendChild(document.createElement("br"));
      
      // Ajout du titre "Bordereaux validés"
      const bordereauxTitle = document.createElement("h1");
      bordereauxTitle.textContent = "Brouillons ("+ numberOfDocuments +")";
      dataShowBg.appendChild(bordereauxTitle);
      
      dataShowBg.appendChild(document.createElement("br"));
      // Filtre par
      const filtrePar = document.createElement("h3");
      filtrePar.textContent = "Filtre par : Tout. ";
      dataShowBg.appendChild(filtrePar);
      dataShowBg.appendChild(document.createElement("br"));
      
      // Montant total
      const montantTotal = document.createElement("h2");
      let totargentdanslesb = 0;
      montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";
      dataShowBg.appendChild(montantTotal);
      dataShowBg.appendChild(document.createElement("br"));

      // Bouton de validation
      const draftactualiserbtn = document.createElement("button");
      draftactualiserbtn.classList.add("btn");
      draftactualiserbtn.textContent = "Actualiser";
      dataShowBg.appendChild(draftactualiserbtn);
      
      dataShowBg.appendChild(document.createElement("br"));
      dataShowBg.appendChild(document.createElement("br"));

      // Création de la liste des bordereaux validés
      const listBordereaux = document.createElement("div");
      listBordereaux.classList.add("listborderaux");

      draftCollectionQuery_.forEach((doc) => {
          const data = doc.data();
          const archiveId = data.archiveId;
          const timestampMillis = data.timestamp; // Supposons que le timestamp soit en millisecondes
          const total_livree_draft = data.total_livree_draft;
          const nomuser = data.creepar;

          totargentdanslesb = totargentdanslesb+total_livree_draft;
      
          montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";
      
      
          const date = new Date(timestampMillis);
      
          // Formatter la date au format "dd mm yyyy hh:mm"
          const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
          // Ajouter un bordereau dans la liste avec la date formatée
          listBordereaux.appendChild(createBordereau(nomuser, total_livree_draft, formattedDate));
      
          // getdatageneralofborderau(archiveId);
      });
      
      btnValider.addEventListener("click", async () => {

        listBordereaux.innerHTML="";

        let totargentdanslesb = 0;
        montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";

        
        const dateDebut = inputDebut.value ? new Date(inputDebut.value).getTime() : null;
        const dateFin = inputFin.value ? new Date(inputFin.value).getTime() : null;

        if(inputFin.value === ""){
          notification.classList.add('show');
          notification.style.backgroundColor="#e30000"
          notification.innerHTML = `Veuillez choisir une date de fin de filtrage pour afficher les résultats.`;

          bordereauxTitle.textContent = "Brouillons (0)";

          setTimeout(() => {
                notification.classList.remove('show');
                
          }, 5000);
        }else{
          const datedebut = new Date(dateDebut);
          const formattedDatedebut = `${datedebut.getDate().toString().padStart(2, '0')} ${datedebut.toLocaleString('default', { month: 'long' })} ${datedebut.getFullYear()} ${datedebut.getHours().toString().padStart(2, '0')}:${datedebut.getMinutes().toString().padStart(2, '0')}`;
          const datefin = new Date(dateFin);
          const formattedDatefin = `${datefin.getDate().toString().padStart(2, '0')} ${datefin.toLocaleString('default', { month: 'long' })} ${datefin.getFullYear()} ${datefin.getHours().toString().padStart(2, '0')}:${datefin.getMinutes().toString().padStart(2, '0')}`;
      
          filtrePar.textContent = "Filtre par :      de "+formattedDatedebut+" AM ,         au  "+ formattedDatefin +" AM .";
  
      
          let firestoreQuery = query(collection(db, 'users', userid, 'facture_draft'), orderBy('timestamp', 'desc'));
      
          // Ajouter les filtres en fonction des dates sélectionnées
          if (dateDebut) {
              firestoreQuery = query(firestoreQuery, where('timestamp', '>=', dateDebut));
  
          }
          if (dateFin) {
              firestoreQuery = query(firestoreQuery, where('timestamp', '<=', dateFin));
          }
      
          // Récupérer les documents filtrés
          const draftCollectionQuery_ = await getDocs(firestoreQuery);
      
          // Obtenir le nombre de documents récupérés
          const numberOfDocuments = draftCollectionQuery_.size;
          bordereauxTitle.textContent = "Brouillons ("+ numberOfDocuments +")";
      
          // Traiter chaque document
          draftCollectionQuery_.forEach((doc) => {
              const data = doc.data();
              const archiveId = data.archiveId;
              const timestampMillis = data.timestamp;  // Timestamp en millisecondes
              const total_livree_draft = data.total_livree_draft;
              const nomuser = data.creepar;
  
  
              totargentdanslesb = totargentdanslesb +  total_livree_draft;
              montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";
  
              // Convertir le timestamp en objet Date
              const date = new Date(timestampMillis);
      
              // Formatter la date au format "dd mm yyyy hh:mm"
              const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
              // Ajouter un bordereau dans la liste avec la date formatée
              listBordereaux.appendChild(createBordereau(nomuser, total_livree_draft, formattedDate));
      
              // getdatageneralofborderau(archiveId);
          });

        }

      });
      
      async function getdatageneralofborderau(archiveId){
          const docRef = doc(db, 'users', archiveId);
          const docSnap = await getDoc(docRef);
          const datas = docSnap.data();
          const namefulluser = datas.nom;
      }



            // Création d'une fonction pour ajouter des bordereaux
      function createBordereau(nom, montant, date) {
        const bordereau = document.createElement("div");
        bordereau.classList.add("listborderauxoptions");
      
        const nomDiv = document.createElement("div");
        nomDiv.classList.add("option_b");
        nomDiv.setAttribute("id", "nom_b");
        const nomP = document.createElement("p");
        nomP.textContent = nom;
        nomDiv.appendChild(nomP);
      
        const montantDiv = document.createElement("div");
        montantDiv.classList.add("option_b");
        montantDiv.setAttribute("id", "montant_b");
        const montantP = document.createElement("p");
        montantP.textContent = montant +" DA";
        montantDiv.appendChild(montantP);
      
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("option_b");
        dateDiv.setAttribute("id", "date_b");
        const dateP = document.createElement("p");
        dateP.textContent = date;
        dateDiv.appendChild(dateP);
      
        bordereau.appendChild(nomDiv);
        bordereau.appendChild(montantDiv);
        bordereau.appendChild(dateDiv);
      
        return bordereau;
      }

      // Ajouter la liste des bordereaux au div principal
      dataShowBg.appendChild(listBordereaux);
      

    });



    const rapport = document.getElementById('rapport');
    rapport.addEventListener('click', () => {
      fermerlemenu();
    });
    const testfiabilite = document.getElementById('testfiabilite');
    testfiabilite.addEventListener('click', () => {
      fermerlemenu();
    });
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
      fermerlemenu();
      signOutUser();
    });

    

  }, 500);
}


// Fonction pour sauvegarder les données dans Firestore
async function saveToFirebase(userId) {
    try {
        wating_bordereau_a_ajouter.style.display="flex";

        const b2000 = parseFloat(document.getElementById("b2000").value) || 0;
        const b1000 = parseFloat(document.getElementById("b1000").value) || 0;
        const b500 = parseFloat(document.getElementById("b500").value) || 0;
        const p200 = parseFloat(document.getElementById("p200").value) || 0;
        const p100 = parseFloat(document.getElementById("p100").value) || 0;
        const p50 = parseFloat(document.getElementById("p50").value) || 0;
        const p20 = parseFloat(document.getElementById("p20").value) || 0;
        const p10 = parseFloat(document.getElementById("p10").value) || 0;
        const p5 = parseFloat(document.getElementById("p5").value) || 0;
        const totlogiciel = parseFloat(document.getElementById("totlogiciel").value) || 0;
        const totcaisse = parseFloat(document.getElementById("totcaisse").value) || 0;
    
    
        // Calculer le montant total
        const total = (b2000 * 2000) + (b1000 * 1000) + (b500 * 500) + (p200 * 200) + (p100 * 100) + (p50 * 50) + (p20 * 20) + (p10 * 10) + (p5 * 5);
        
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        const namefulluser = data.nom;

        // Ajouter les données à la collection "archive" dans Firestore
        const archiveRef = await addDoc(collection(db, "archive"), {
          billets_2000: b2000,
          billets_1000: b1000,
          billets_500: b500,
          pieces_200: p200,
          pieces_100: p100,
          pieces_50: p50,
          pieces_20: p20,
          pieces_10: p10,
          pieces_5: p5,
          total_caisse: totcaisse,
          tot_logiciel: totlogiciel, // Le montant total
          total_livree: total, // Le montant total
          timestamp: Date.now(),
          startut:"brouillion"
          
        });
        
        // Créer un nouveau document dans la sous-collection "facture_draft" de l'utilisateur avec un ID généré automatiquement
        await addDoc(collection(db, `users/${userId}/facture_draft`), {
          archiveId: archiveRef.id,
          timestamp: Date.now(),
          creepar: namefulluser,
          total_livree_draft: total // Le montant total


      });
        notification.classList.add('show');
        notification.innerHTML=`borderau sauvegardées avec succès avec mantant Totale de : ${total} DA `;
        console.log(`Données sauvegardées avec succès avec ID ${archiveRef.id} dans users/${userId}/facture_draft.`);
        wating_bordereau_a_ajouter.style.display="none";
        bg_add_info.style.display="none";
        setTimeout(() => {
          notification.classList.remove('show');
        }, 5000);

    } catch (error) {
        console.error("Erreur lors de la sauvegarde des données :", error);
    }
}



// Fonction de déconnexion
function signOutUser() {
  signOut(auth).then(() => {
      console.log('Déconnexion réussie.');
      window.location.href = 'index.html';
  }).catch((error) => {
      console.error('Erreur lors de la déconnexion:', error); 
  });
}


















