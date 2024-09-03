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
        <h2 id="valideBnumber">(0)</h2>
    </div>
    <div class="btngoroptions" id="reception">
        <h1>Boîte de réception</h1>
        <p>Les bordereaux reçus qui sont en attente de votre validation.</p>
        <br>
        <img src="img/undraw_mailbox_re_dvds.svg" alt="">
        <br>
        <h2 id="receptionnumber">(0)</h2>
    </div>
    
    <div class="btngoroptions" id="messagesented">
        <h1>messages envoyé</h1>
        <p>Les bordereaux qui sont envoyer ou en cours de validation.</p>
        <br>
        <img src="img/undraw_messaging_fun_re_vic9.svg" alt="">
        <br>
        <h2 messagesentednumber>(0)</h2>
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
    <div class="btngoroptions" id="gestion_de_stock">
        <h1>Gestion de Stock</h1>
        <p>Voir ici toutes les nouvelles informations concernant le stock.</p>
        <br>
        <img src="img/undraw_order_delivered_re_v4ab.svg" alt="">
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
import { getFirestore, doc,getDoc, getDocs, collection, addDoc ,query, orderBy,where,deleteDoc} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-firestore.js";

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
    valideB.onclick = async function() {
      fermerlemenu();
      datashowbg.innerHTML="";
    }



    async function actualiserdraft(){
      datashowbg.innerHTML="";

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

       const img_de_fenetre = document.createElement("img");
       img_de_fenetre.src="img/undraw_file_manager_re_ms29.svg";
       img_de_fenetre.className="img_de_fenetre";
       dataShowBg.appendChild(img_de_fenetre);
       
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

       draftactualiserbtn.addEventListener('click', async () => {
        actualiserdraft();
      });
       
       dataShowBg.appendChild(document.createElement("br"));
       dataShowBg.appendChild(document.createElement("br"));
 
       // Création de la liste des bordereaux validés
       const listBordereaux = document.createElement("div");
       listBordereaux.classList.add("listborderaux");
       
 
       const Annulerenvoyerbordo = document.getElementById('Annulerenvoyerbordo');
       const envoyerbordo = document.getElementById('envoyerbordo');
       const supprimerledraftbordo = document.getElementById('supprimerledraftbordo');
       const afficherlafacture = document.getElementById('afficherlafacture');
 
 
       draftCollectionQuery_.forEach((doc) => {
           const data = doc.data();
           const borderauid = doc.id;
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
           createBordereaubru(nomuser, total_livree_draft, formattedDate,borderauid,archiveId,userid);

           Annulerenvoyerbordo.onclick = async function() {
             afficherlafacture.style.display="none";
             envoyerbordo.style.display="none";

 
 
           }
           
 
       
            
       });
       
      function createBordereaubru(nomuser, total_livree_draft, formattedDate,borderauid,archiveId,userid){

           const selectpersonne = document.getElementById("selectpersonne");
           const h2select = document.getElementById('h2select');
           const pselect = document.getElementById('pselect'); 
   
           Annulerenvoyerbordo.style.display="flex";
           supprimerledraftbordo.style.display="flex";
           envoyerbordo.style.display="none";
           selectpersonne.style.display="flex";
           h2select.style.display="flex";
           pselect.style.display="flex";
           
           
           const bordereau = document.createElement("div");
           bordereau.classList.add("listborderauxoptions");
         
           const nomDiv = document.createElement("div");
           nomDiv.classList.add("option_b");
           nomDiv.setAttribute("id", "nom_b");
           const nomP = document.createElement("p");
           nomP.textContent = nomuser;
           nomDiv.appendChild(nomP);
         
           const montantDiv = document.createElement("div");
           montantDiv.classList.add("option_b");
           montantDiv.setAttribute("id", "montant_b");
           const montantP = document.createElement("p");
           montantP.textContent = total_livree_draft +" DA";
           montantDiv.appendChild(montantP);
         
           const dateDiv = document.createElement("div");
           dateDiv.classList.add("option_b");
           dateDiv.setAttribute("id", "date_b");
           const dateP = document.createElement("p");
           dateP.textContent = formattedDate;
           dateDiv.appendChild(dateP);
         
           bordereau.appendChild(nomDiv);
           bordereau.appendChild(montantDiv);
           bordereau.appendChild(dateDiv);
   
           listBordereaux.appendChild(bordereau);
   
           bordereau.onclick = async function() {
             importerlesdonnersss(nomuser,total_livree_draft,archiveId,userid,borderauid);
           }
           
       }
       btnValider.onclick = async function() {
 
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
               const borderauid = doc.id;
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
               createBordereaubru(nomuser, total_livree_draft, formattedDate,borderauid,archiveId,userid);
               
       
               // getdatageneralofborderau(archiveId);
           });
 
         }
 
       }
       function resetForm() {
            const inputs = document.querySelectorAll('#bg_add_info input[type="number"]');
            inputs.forEach(input => {
                input.value = 0;
            });
       }
        document.getElementById('savetodraftbtn').onclick = resetForm;
        document.getElementById('anulertosavetodraftbtn').onclick = resetForm;


 
       async function importerlesdonnersss(nomuser,total_livree_draft,archiveId,userid,borderauid){




         const statut = document.getElementById("statut");
         statut.textContent="Statut : Brouillon";
         statut.style.color= "orange";
         selectpersonne.innerHTML='<option value="" disabled selected>Sélectionner une personne</option>';
         
         afficherlafacture.style.display = "flex";
     
         // Sélection des éléments du DOM
         const nomsurborderau = document.getElementById('nomsurborderau');
         const content_tableau_bor_tot_livre = document.getElementById('content_tableau_bor_tot_livre');
         const totdanslacaisse = document.getElementById('totdanslacaisse');
         const totdanslogiciel = document.getElementById('totdanslogiciel');
 
         const nombner2000 = document.getElementById("nombner2000");
         const tot2000 = document.getElementById("tot2000");
 
         const nombner1000 = document.getElementById("nombner1000");
         const tot1000 = document.getElementById("tot1000");
 
         const nombner500 = document.getElementById("nombner500");
         const tot500 = document.getElementById("tot500");
 
         const nombner200 = document.getElementById("nombner200");
         const tot200 = document.getElementById("tot200");
 
         const nombner100 = document.getElementById("nombner100");
         const tot100 = document.getElementById("tot100");
 
         const nombner50 = document.getElementById("nombner50");
         const tot50 = document.getElementById("tot50");
 
         const nombner20 = document.getElementById("nombner20");
         const tot20 = document.getElementById("tot20");
 
         const nombner10 = document.getElementById("nombner10");
         const tot10 = document.getElementById("tot10");
 
         const nombner5 = document.getElementById("nombner5");
         const tot5 = document.getElementById("tot5");
 
         // Déclaration des valeurs des billets/pièces
         const p2000 = 2000;
         const p1000 = 1000;
         const p500 = 500;
         const p200 = 200;
         const p100 = 100;
         const p50 = 50;
         const p20 = 20;
         const p10 = 10;
         const p5 = 5;
 
         // Mise à jour des informations sur le bordereau
         nomsurborderau.innerHTML = "Créé par : " + nomuser;
         content_tableau_bor_tot_livre.innerHTML = total_livree_draft + " DA";
 
         // Référence et récupération des données depuis Firestore
         const docRef = doc(db, 'archive', archiveId);
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
 
             // Mise à jour des éléments DOM avec les données de Firestore
             nombner2000.innerHTML = billets_2000;
             nombner1000.innerHTML = billets_1000;
             nombner500.innerHTML = billets_500;
             nombner200.innerHTML = pieces_200;
             nombner100.innerHTML = pieces_100;
             nombner50.innerHTML = pieces_50;
             nombner20.innerHTML = pieces_20;
             nombner10.innerHTML = pieces_10;
             nombner5.innerHTML = pieces_5;
             
             // Calcul des totaux
             tot2000.innerHTML = (billets_2000 * p2000 ) + " DA";
             tot1000.innerHTML = (billets_1000 * p1000 ) + " DA";
             tot500.innerHTML = (billets_500  * p500 ) + " DA";
             tot200.innerHTML = (pieces_200 * p200 ) + " DA";
             tot100.innerHTML = (pieces_100   * p100 ) + " DA";
             tot50.innerHTML = (pieces_50  * p50 ) + " DA";
             tot20.innerHTML = (pieces_20  * p20 ) + " DA";
             tot10.innerHTML = (pieces_10  * p10 ) + " DA";
             tot5.innerHTML = (pieces_5  * p5 ) + " DA";
 
             // Mise à jour des totaux dans la caisse et dans le logiciel
             totdanslacaisse.innerHTML = total_caisse + " DA";
             totdanslogiciel.innerHTML = tot_logiciel + " DA";

         } else {
             console.log("Document does not exist");
         }


          // Référence à la collection 'users'
          const usersCollectionRef = collection(db, 'users');
          
          // Récupération des documents de la collection
          const usersSnapshot = await getDocs(usersCollectionRef);
          // Parcours des documents
          usersSnapshot.forEach((doc) => {
              const data = doc.data();
              const UserUid_imported = doc.id;
              const email = data.email;
              const nom = data.nom;
              const servis = data.servis;


              if(UserUid_imported !== userid){
                const option_selectpersonne = document.createElement("option")
                option_selectpersonne.value= UserUid_imported;
                option_selectpersonne.textContent = nom + " ( service " +servis+ " )";
  
                selectpersonne.appendChild(option_selectpersonne);


              }


          });
          
          selectpersonne.addEventListener('change', async (event) => {
            envoyerbordo.style.display = "flex";
            const selectedValue = event.target.value;
            
            console.log("id selected: " + selectedValue);
            console.log("useer id : " + userid);
            console.log("facture_draft id : " + borderauid);
            console.log("archiveId : " + archiveId);
            console.log("total livree draft : " + total_livree_draft);
            console.log("nomuser de crateur: " + nomuser);

            
            
            envoyerbordo.onclick = async function() {
              
              const waiting_bordereau_a_ajouter1 = document.getElementById("waiting_bordereau_a_ajouter1");
              waiting_bordereau_a_ajouter1.style.display="flex";
                  const code = generateCode();
      
                  await addDoc(collection(db,"users",userid,"facture_envoyer"), {
                    
                      archiveId: archiveId ,
                      timestamp: Date.now(),
                      creepar: nomuser,
                      total_livree_envoyer: total_livree_draft,
                      statut:"pending",
                      motdepass: code,
                      envoyerVersID: selectedValue,
                  });
     
                  await deleteDoc(doc(db, "users", userid, "facture_draft", borderauid)); 

                  await addDoc(collection(db,"users",selectedValue,"facture_reseptionner"), {
                    archiveId: archiveId ,
                    timestamp: Date.now(),
                    creepar: nomuser,
                    total_livree_envoyer: total_livree_draft,
                    statut:"pending",
                    motdepass: code,
                    envoyerVersID: selectedValue,
                  });

                  waiting_bordereau_a_ajouter1.style.display="none";
                  Annulerenvoyerbordo.click();
                  actualiserdraft();


            }

          });

          
          
          const supprimerledraftbordo = document.getElementById('supprimerledraftbordo');
          supprimerledraftbordo.onclick = async function() {
            envoyerbordo.style.display="none";
              if (borderauid) {  // Vérifie si borderauid est défini

                  try {
                      await deleteDoc(doc(db, "users", userid, "facture_draft", borderauid)); 
          
                      notification.classList.add('show');
                      notification.style.backgroundColor = "#289f00";
                      notification.innerHTML = `Document supprimé avec succès!`; 
                      Annulerenvoyerbordo.click();
                      draftactualiserbtn.click();
                      setTimeout(() => {
                          notification.classList.remove('show');
                      }, 5000);  
                  } catch (error) {
                      notification.classList.add('show');
                      notification.style.backgroundColor = "#e30000";
                      notification.innerHTML = `Erreur lors de la suppression du document : ${error.message}`; 
                      setTimeout(() => {
                          notification.classList.remove('show');
                      }, 5000);  
                  }
              } else {
                  notification.classList.add('show');
                  notification.style.backgroundColor = "#e30000";
                  notification.innerHTML = `Veuillez sélectionner un document valide.`; 
                  setTimeout(() => {
                      notification.classList.remove('show');
                  }, 5000);               
              }
          }
          

       
          
     
       }
 
 
 
       // Ajouter la liste des bordereaux au div principal
       dataShowBg.appendChild(listBordereaux);
       
 
    }

    function generateCode() {
      let code = '';
      for (let i = 0; i < 4; i++) {
          const randomDigit = Math.floor(Math.random() * 10);
          code += randomDigit;
      }
      return code;
     }

    async function actualisermessageSent(){
      datashowbg.innerHTML="";

      fermerlemenu();
 
 
      const draftCollectionQuery_ = await getDocs(
       query(collection(db, 'users', userid, 'facture_envoyer'), orderBy('timestamp', 'desc'))
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
       bordereauxTitle.textContent = "Messages envoyé ("+ numberOfDocuments +")";
       dataShowBg.appendChild(bordereauxTitle);

       const img_de_fenetre = document.createElement("img");
       img_de_fenetre.src="img/undraw_messaging_fun_re_vic9.svg";
       img_de_fenetre.className="img_de_fenetre";
       dataShowBg.appendChild(img_de_fenetre);
       
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
       const MessageSentactualiserbtn = document.createElement("button");
       MessageSentactualiserbtn.classList.add("btn");
       MessageSentactualiserbtn.textContent = "Actualiser";
       dataShowBg.appendChild(MessageSentactualiserbtn);

       MessageSentactualiserbtn.addEventListener('click', async () => {
        actualisermessageSent();
      });
       
       dataShowBg.appendChild(document.createElement("br"));
       dataShowBg.appendChild(document.createElement("br"));
 
       // Création de la liste des bordereaux validés
       const listBordereaux = document.createElement("div");
       listBordereaux.classList.add("listborderaux");
       
 
       const Annulerenvoyerbordo = document.getElementById('Annulerenvoyerbordo');
       const envoyerbordo = document.getElementById('envoyerbordo');
       const supprimerledraftbordo = document.getElementById('supprimerledraftbordo');
       const afficherlafacture = document.getElementById('afficherlafacture');
       const h2select = document.getElementById('h2select');
       const pselect = document.getElementById('pselect'); 
       const selectpersonne = document.getElementById("selectpersonne");


       draftCollectionQuery_.forEach((doc) => {
           const data = doc.data();
           const borderauid = doc.id;
           const archiveId = data.archiveId;
           const timestampMillis = data.timestamp; // Supposons que le timestamp soit en millisecondes
           const total_livree_envoyer = data.total_livree_envoyer;
           const nomuser = data.creepar;
           const statutsentborderau = data.statut;
           const motdepasss = data.motdepass;
           const envoyerVersID = data.envoyerVersID;


 
           totargentdanslesb = totargentdanslesb+total_livree_envoyer;
       
           montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";
       
       
           const date = new Date(timestampMillis);
       
           // Formatter la date au format "dd mm yyyy hh:mm"
           const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
       
           // Ajouter un bordereau dans la liste avec la date formatée
           createBordereauMESSAGESENT(nomuser, total_livree_envoyer, formattedDate,borderauid,archiveId,userid,statutsentborderau,motdepasss,envoyerVersID);



           Annulerenvoyerbordo.onclick = async function() {
                 afficherlafacture.style.display="none";
                //  // Réinitialiser les valeurs des éléments de texte
                //  document.getElementById('statut').innerText = 'Statut : Brouillon';
                //  document.getElementById('nomsurborderau').innerText = 'cree par :';
                //  document.getElementById('content_tableau_bor_tot_livre').innerText = '0 DA';
                //  document.getElementById('totdanslogiciel').innerText = '0 DA';
                //  document.getElementById('totdanslacaisse').innerText = '0 DA';
             
                //  // Réinitialiser les valeurs des champs de contenu
                //  const idsToReset = [
                //      'nombner2000', 'tot2000',
                //      'nombner1000', 'tot1000',
                //      'nombner500', 'tot500',
                //      'nombner200', 'tot200',
                //      'nombner100', 'tot100',
                //      'nombner50', 'tot50',
                //      'nombner20', 'tot20',
                //      'nombner10', 'tot10',
                //      'nombner5', 'tot5'
                //  ];
             
                //  idsToReset.forEach(id => {
                //      document.getElementById(id).innerText = '';
                //  });
             
                //  // Réinitialiser la sélection de la personne
                //  document.getElementById('selectpersonne').selectedIndex = 0;
             
                //  // Masquer les boutons ou les sections si nécessaire
                //  document.getElementById('envoyerbordo').style.display = 'none';
                //  document.getElementById('waiting_bordereau_a_ajouter1').style.display = 'none';
          };
           
 
       
            
       });
       
      function createBordereauMESSAGESENT(nomuser, total_livree_envoyer, formattedDate,borderauid,archiveId,userid,statutsentborderau,motdepasss,envoyerVersID){

           Annulerenvoyerbordo.style.display="flex";
           supprimerledraftbordo.style.display="none";
           envoyerbordo.style.display="none";
           selectpersonne.style.display="none";
           h2select.style.display="none";
           pselect.style.display="none";
           
           const bordereau = document.createElement("div");
           bordereau.classList.add("listborderauxoptions");
           
           if(statutsentborderau === "pending"){
           // bordereau.style.backgroundColor="#da990e8e"; 
           bordereau.style.backgroundColor="#da990e8e"; 

           }
            else if (statutsentborderau === "valide"){
            bordereau.style.backgroundColor="#51d84467";  
           }
           else if (statutsentborderau === "NoValide"){
            bordereau.style.backgroundColor="#ff000070";  
           }
           else{
            bordereau.style.backgroundColor="#356d7913"; 
           }

           const nomDiv = document.createElement("div");
           nomDiv.classList.add("option_b");


           let sentversuserName ="";

           recupererlenomderecepteur(envoyerVersID);
           async function recupererlenomderecepteur(envoyerVersID){

            // Référence au document spécifique dans la collection 'users'
            const userDocRef = doc(db, 'users', envoyerVersID);

            // Récupération du document
            const userDocSnapshot = await getDoc(userDocRef);
            
            // Vérification si le document existe et récupération du nom
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                sentversuserName = userData.nom; // Remplace 'nom' par le nom du champ correspondant
                console.log("Nom de l'utilisateur :", sentversuserName);
                nomDiv.setAttribute("id", "nom_b");
                const nomenvoyerversp = document.createElement("p");
                nomenvoyerversp.textContent = sentversuserName;
                nomDiv.appendChild(nomenvoyerversp); 
                return sentversuserName;
            } else {
                console.log("Aucun document trouvé !");
            }
         }


         
           const montantDiv = document.createElement("div");
           montantDiv.classList.add("option_b");
           montantDiv.setAttribute("id", "montant_b");
           const montantP = document.createElement("p");
           montantP.textContent = total_livree_envoyer +" DA";
           montantDiv.appendChild(montantP);
         
           const dateDiv = document.createElement("div");
           dateDiv.classList.add("option_b");
           dateDiv.setAttribute("id", "date_b");
           const dateP = document.createElement("p");
           dateP.textContent = formattedDate ;
           dateDiv.appendChild(dateP);
         
           bordereau.appendChild(nomDiv);
           bordereau.appendChild(montantDiv);
           bordereau.appendChild(dateDiv);
   
           listBordereaux.appendChild(bordereau);

           bordereau.onclick = async function() {
            importerlesdonnersssMESSAGESENT(nomuser, total_livree_envoyer, archiveId, userid, borderauid,statutsentborderau,motdepasss,sentversuserName);
           };
        

       }
       btnValider.onclick = async function() {
        
 
        listBordereaux.innerHTML="";
 
        let totargentdanslesb = 0;
        montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";

        
        const dateDebut = inputDebut.value ? new Date(inputDebut.value).getTime() : null;
        const dateFin = inputFin.value ? new Date(inputFin.value).getTime() : null;

        if(inputFin.value === ""){
          notification.classList.add('show');
          notification.style.backgroundColor="#e30000"
          notification.innerHTML = `Veuillez choisir une date de fin de filtrage pour afficher les résultats.`;

          bordereauxTitle.textContent = "Messages envoyé (0)";

          setTimeout(() => {
                notification.classList.remove('show');
                
          }, 5000);
        }else{
          const datedebut = new Date(dateDebut);
          const formattedDatedebut = `${datedebut.getDate().toString().padStart(2, '0')} ${datedebut.toLocaleString('default', { month: 'long' })} ${datedebut.getFullYear()} ${datedebut.getHours().toString().padStart(2, '0')}:${datedebut.getMinutes().toString().padStart(2, '0')}`;
          const datefin = new Date(dateFin);
          const formattedDatefin = `${datefin.getDate().toString().padStart(2, '0')} ${datefin.toLocaleString('default', { month: 'long' })} ${datefin.getFullYear()} ${datefin.getHours().toString().padStart(2, '0')}:${datefin.getMinutes().toString().padStart(2, '0')}`;
      
          filtrePar.textContent = "Filtre par :      de "+formattedDatedebut+" AM ,         au  "+ formattedDatefin +" AM .";
  
      
          let firestoreQuery = query(collection(db, 'users', userid, 'facture_envoyer'), orderBy('timestamp', 'desc'));
      
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
          bordereauxTitle.textContent = "Messages envoyé ("+ numberOfDocuments +")";
      
          // Traiter chaque document
          draftCollectionQuery_.forEach((doc) => {
              const data = doc.data();
              const borderauid = doc.id;
              const archiveId = data.archiveId;
              const timestampMillis = data.timestamp;  // Timestamp en millisecondes
              const total_livree_envoyer = data.total_livree_envoyer;
              const nomuser = data.creepar;
  
  
              totargentdanslesb = totargentdanslesb +  total_livree_envoyer;
              montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";
  
              // Convertir le timestamp en objet Date
              const date = new Date(timestampMillis);
      
              // Formatter la date au format "dd mm yyyy hh:mm"
              const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
              // Ajouter un bordereau dans la liste avec la date formatée
              createBordereauMESSAGESENT(nomuser, total_livree_envoyer, formattedDate,borderauid,archiveId,userid);
              
      
              // getdatageneralofborderau(archiveId);
          });

        }

     
       }
 
       async function importerlesdonnersssMESSAGESENT(nomuser,total_livree_envoyer,archiveId,userid,borderauid,statutsentborderau,motdepasss,sentversuserName){
         const statut = document.getElementById("statut");
         statut.innerHTML="statut :' "+ statutsentborderau + " ' &  mot de passe  : "+ motdepasss;


         if(statutsentborderau === "pending"){
          // bordereau.style.backgroundColor="#da990e8e"; 
          statut.style.color="#dd8500";  
          statut.innerHTML="mot de passe  : "+ motdepasss;
          supprimerledraftbordo.style.display="none";   


          }
          else if (statutsentborderau === "valide") {
            statut.style.color = "#237a00";      
            statut.innerHTML = "BORDEREAU CONFIRMÉ PAR LE RÉCEPTEUR";
            supprimerledraftbordo.style.display="none";   

          } 
          else if (statutsentborderau === "NoValide") {
              statut.style.color = "#ff0000e7";   
              statut.innerHTML = "BORDEREAU REFUSÉ PAR LE RÉCEPTEUR";
              supprimerledraftbordo.style.display="flex";   

          }
          


         selectpersonne.innerHTML='<option value="" disabled selected>Sélectionner une personne</option>';
         
         afficherlafacture.style.display = "flex";
     
         // Sélection des éléments du DOM
         const nomsurborderau = document.getElementById('nomsurborderau');
         const content_tableau_bor_tot_livre = document.getElementById('content_tableau_bor_tot_livre');
         const totdanslacaisse = document.getElementById('totdanslacaisse');
         const totdanslogiciel = document.getElementById('totdanslogiciel');
 
         const nombner2000 = document.getElementById("nombner2000");
         const tot2000 = document.getElementById("tot2000");
 
         const nombner1000 = document.getElementById("nombner1000");
         const tot1000 = document.getElementById("tot1000");
 
         const nombner500 = document.getElementById("nombner500");
         const tot500 = document.getElementById("tot500");
 
         const nombner200 = document.getElementById("nombner200");
         const tot200 = document.getElementById("tot200");
 
         const nombner100 = document.getElementById("nombner100");
         const tot100 = document.getElementById("tot100");
 
         const nombner50 = document.getElementById("nombner50");
         const tot50 = document.getElementById("tot50");
 
         const nombner20 = document.getElementById("nombner20");
         const tot20 = document.getElementById("tot20");
 
         const nombner10 = document.getElementById("nombner10");
         const tot10 = document.getElementById("tot10");
 
         const nombner5 = document.getElementById("nombner5");
         const tot5 = document.getElementById("tot5");
 
         // Déclaration des valeurs des billets/pièces
         const p2000 = 2000;
         const p1000 = 1000;
         const p500 = 500;
         const p200 = 200;
         const p100 = 100;
         const p50 = 50;
         const p20 = 20;
         const p10 = 10;
         const p5 = 5;
 
         // Mise à jour des informations sur le bordereau
         nomsurborderau.innerHTML = "Créé par : " + nomuser + " & receptionner par : "+sentversuserName;
         content_tableau_bor_tot_livre.innerHTML = total_livree_envoyer + " DA";
 
         // Référence et récupération des données depuis Firestore
         const docRef = doc(db, 'archive', archiveId);
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
 
             // Mise à jour des éléments DOM avec les données de Firestore
             nombner2000.innerHTML = billets_2000;
             nombner1000.innerHTML = billets_1000;
             nombner500.innerHTML = billets_500;
             nombner200.innerHTML = pieces_200;
             nombner100.innerHTML = pieces_100;
             nombner50.innerHTML = pieces_50;
             nombner20.innerHTML = pieces_20;
             nombner10.innerHTML = pieces_10;
             nombner5.innerHTML = pieces_5;
             
             // Calcul des totaux
             tot2000.innerHTML = (billets_2000 * p2000 ) + " DA";
             tot1000.innerHTML = (billets_1000 * p1000 ) + " DA";
             tot500.innerHTML = (billets_500  * p500 ) + " DA";
             tot200.innerHTML = (pieces_200 * p200 ) + " DA";
             tot100.innerHTML = (pieces_100   * p100 ) + " DA";
             tot50.innerHTML = (pieces_50  * p50 ) + " DA";
             tot20.innerHTML = (pieces_20  * p20 ) + " DA";
             tot10.innerHTML = (pieces_10  * p10 ) + " DA";
             tot5.innerHTML = (pieces_5  * p5 ) + " DA";
 
             // Mise à jour des totaux dans la caisse et dans le logiciel
             totdanslacaisse.innerHTML = total_caisse + " DA";
             totdanslogiciel.innerHTML = tot_logiciel + " DA";

         } else {
             console.log("Document does not exist");
         }


         supprimerledraftbordo.onclick = async function() {
             if (borderauid) {  // Vérifie si borderauid est défini

                 try {
                     await deleteDoc(doc(db, "users", userid, "facture_envoyer", borderauid)); 
         
                     notification.classList.add('show');
                     notification.style.backgroundColor = "#289f00";
                     notification.innerHTML = `Document supprimé avec succès!`; 
                     Annulerenvoyerbordo.click();
                     MessageSentactualiserbtn.click();
                     setTimeout(() => {
                         notification.classList.remove('show');
                     }, 5000);  
                 } catch (error) {
                     notification.classList.add('show');
                     notification.style.backgroundColor = "#e30000";
                     notification.innerHTML = `Erreur lors de la suppression du document : ${error.message}`; 
                     setTimeout(() => {
                         notification.classList.remove('show');
                     }, 5000);  
                 }
             } else {
                 notification.classList.add('show');
                 notification.style.backgroundColor = "#e30000";
                 notification.innerHTML = `Veuillez sélectionner un document valide.`; 
                 setTimeout(() => {
                     notification.classList.remove('show');
                 }, 5000);               
             }
         }


          
     
       }
 
 
 
       // Ajouter la liste des bordereaux au div principal
       dataShowBg.appendChild(listBordereaux);
       
 
    }

    async function actualisermessageReceptionner(){
      datashowbg.innerHTML="";

      fermerlemenu();
 
 
      const draftCollectionQuery_ = await getDocs(
       query(collection(db, 'users', userid, 'facture_reseptionner'), orderBy('timestamp', 'desc'))
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
       bordereauxTitle.textContent = "Messages Receptionné ("+ numberOfDocuments +")";
       dataShowBg.appendChild(bordereauxTitle);


       const img_de_fenetre = document.createElement("img");
       img_de_fenetre.src="img/undraw_mailbox_re_dvds.svg";
       img_de_fenetre.className="img_de_fenetre";
       dataShowBg.appendChild(img_de_fenetre);

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
       const MessageSentactualiserbtn = document.createElement("button");
       MessageSentactualiserbtn.classList.add("btn");
       MessageSentactualiserbtn.textContent = "Actualiser";
       dataShowBg.appendChild(MessageSentactualiserbtn);

       MessageSentactualiserbtn.addEventListener('click', async () => {
        actualisermessageReceptionner();
      });
       
       dataShowBg.appendChild(document.createElement("br"));
       dataShowBg.appendChild(document.createElement("br"));
 
       // Création de la liste des bordereaux validés
       const listBordereaux = document.createElement("div");
       listBordereaux.classList.add("listborderaux");
       
 
       const Annulerenvoyerbordo = document.getElementById('Annulerenvoyerbordo');
       const envoyerbordo = document.getElementById('envoyerbordo');
       const supprimerledraftbordo = document.getElementById('supprimerledraftbordo');
       const afficherlafacture = document.getElementById('afficherlafacture');
       const h2select = document.getElementById('h2select');
       const pselect = document.getElementById('pselect'); 
       const selectpersonne = document.getElementById("selectpersonne");


       draftCollectionQuery_.forEach((doc) => {
           const data = doc.data();
           const borderauid = doc.id;
           const archiveId = data.archiveId;
           const timestampMillis = data.timestamp; // Supposons que le timestamp soit en millisecondes
           const total_livree_envoyer = data.total_livree_envoyer;
           const nomuser = data.creepar;
           const statutsentborderau = data.statut;
           const motdepasss = data.motdepass;
           const envoyerVersID = data.envoyerVersID;


 
           totargentdanslesb = totargentdanslesb+total_livree_envoyer;
       
           montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";
       
       
           const date = new Date(timestampMillis);
       
           // Formatter la date au format "dd mm yyyy hh:mm"
           const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
       
           // Ajouter un bordereau dans la liste avec la date formatée
           createBordereauMesssageReceptionner(nomuser, total_livree_envoyer, formattedDate,borderauid,archiveId,userid,statutsentborderau,motdepasss,envoyerVersID);



           Annulerenvoyerbordo.onclick = async function() {
                 afficherlafacture.style.display="none";
                //  // Réinitialiser les valeurs des éléments de texte
                //  document.getElementById('statut').innerText = 'Statut : Brouillon';
                //  document.getElementById('nomsurborderau').innerText = 'cree par :';
                //  document.getElementById('content_tableau_bor_tot_livre').innerText = '0 DA';
                //  document.getElementById('totdanslogiciel').innerText = '0 DA';
                //  document.getElementById('totdanslacaisse').innerText = '0 DA';
             
                //  // Réinitialiser les valeurs des champs de contenu
                //  const idsToReset = [
                //      'nombner2000', 'tot2000',
                //      'nombner1000', 'tot1000',
                //      'nombner500', 'tot500',
                //      'nombner200', 'tot200',
                //      'nombner100', 'tot100',
                //      'nombner50', 'tot50',
                //      'nombner20', 'tot20',
                //      'nombner10', 'tot10',
                //      'nombner5', 'tot5'
                //  ];
             
                //  idsToReset.forEach(id => {
                //      document.getElementById(id).innerText = '';
                //  });
             
                //  // Réinitialiser la sélection de la personne
                //  document.getElementById('selectpersonne').selectedIndex = 0;
             
                //  // Masquer les boutons ou les sections si nécessaire
                //  document.getElementById('envoyerbordo').style.display = 'none';
                //  document.getElementById('waiting_bordereau_a_ajouter1').style.display = 'none';
          };
           
 
       
            
       });
       
      function createBordereauMesssageReceptionner(nomuser, total_livree_envoyer, formattedDate,borderauid,archiveId,userid,statutsentborderau,motdepasss,envoyerVersID){

           Annulerenvoyerbordo.style.display="flex";
           supprimerledraftbordo.style.display="none";
           envoyerbordo.style.display="none";
           selectpersonne.style.display="none";
           h2select.style.display="none";
           pselect.style.display="none";
           
           const bordereau = document.createElement("div");
           bordereau.classList.add("listborderauxoptions");
           
           if(statutsentborderau === "pending"){
           bordereau.style.backgroundColor="#51d84467"; 


           }
          //   else if (statutsentborderau === "valide"){
          //   bordereau.style.backgroundColor="#51d84467";  
          //  }
          //  else if (statutsentborderau === "NoValide"){
          //   bordereau.style.backgroundColor="#ff000070";  
          //  }
          //  else{
          //   bordereau.style.backgroundColor="#356d7913"; 
          //  }

           const nomDiv = document.createElement("div");
           nomDiv.classList.add("option_b");


           let sentversuserName ="";

           recupererlenomderecepteur(envoyerVersID);
           async function recupererlenomderecepteur(envoyerVersID){

            // Référence au document spécifique dans la collection 'users'
            const userDocRef = doc(db, 'users', envoyerVersID);

            // Récupération du document
            const userDocSnapshot = await getDoc(userDocRef);
            
            // Vérification si le document existe et récupération du nom
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                sentversuserName = userData.nom; // Remplace 'nom' par le nom du champ correspondant
                console.log("Nom de l'utilisateur :", sentversuserName);
                nomDiv.setAttribute("id", "nom_b");
                const nomenvoyerversp = document.createElement("p");
                nomenvoyerversp.textContent = sentversuserName;
                nomDiv.appendChild(nomenvoyerversp); 
                return sentversuserName;
            } else {
                console.log("Aucun document trouvé !");
            }
         }


         
           const montantDiv = document.createElement("div");
           montantDiv.classList.add("option_b");
           montantDiv.setAttribute("id", "montant_b");
           const montantP = document.createElement("p");
           montantP.textContent = total_livree_envoyer +" DA";
           montantDiv.appendChild(montantP);
         
           const dateDiv = document.createElement("div");
           dateDiv.classList.add("option_b");
           dateDiv.setAttribute("id", "date_b");
           const dateP = document.createElement("p");
           dateP.textContent = formattedDate ;
           dateDiv.appendChild(dateP);
         
           bordereau.appendChild(nomDiv);
           bordereau.appendChild(montantDiv);
           bordereau.appendChild(dateDiv);
   
           listBordereaux.appendChild(bordereau);

           bordereau.onclick = async function() {
            importerlesdonnersssMESSAGESENT(nomuser, total_livree_envoyer, archiveId, userid, borderauid,statutsentborderau,motdepasss,sentversuserName);
           };
        

       }
       btnValider.onclick = async function() {
        
 
        listBordereaux.innerHTML="";
 
        let totargentdanslesb = 0;
        montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";

        
        const dateDebut = inputDebut.value ? new Date(inputDebut.value).getTime() : null;
        const dateFin = inputFin.value ? new Date(inputFin.value).getTime() : null;

        if(inputFin.value === ""){
          notification.classList.add('show');
          notification.style.backgroundColor="#e30000"
          notification.innerHTML = `Veuillez choisir une date de fin de filtrage pour afficher les résultats.`;

          bordereauxTitle.textContent = "Messages envoyé (0)";

          setTimeout(() => {
                notification.classList.remove('show');
                
          }, 5000);
        }else{
          const datedebut = new Date(dateDebut);
          const formattedDatedebut = `${datedebut.getDate().toString().padStart(2, '0')} ${datedebut.toLocaleString('default', { month: 'long' })} ${datedebut.getFullYear()} ${datedebut.getHours().toString().padStart(2, '0')}:${datedebut.getMinutes().toString().padStart(2, '0')}`;
          const datefin = new Date(dateFin);
          const formattedDatefin = `${datefin.getDate().toString().padStart(2, '0')} ${datefin.toLocaleString('default', { month: 'long' })} ${datefin.getFullYear()} ${datefin.getHours().toString().padStart(2, '0')}:${datefin.getMinutes().toString().padStart(2, '0')}`;
      
          filtrePar.textContent = "Filtre par :      de "+formattedDatedebut+" AM ,         au  "+ formattedDatefin +" AM .";
  
      
          let firestoreQuery = query(collection(db, 'users', userid, 'facture_reseptionner'), orderBy('timestamp', 'desc'));
      
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
          bordereauxTitle.textContent = "Messages envoyé ("+ numberOfDocuments +")";
      
          // Traiter chaque document
          draftCollectionQuery_.forEach((doc) => {
              const data = doc.data();
              const borderauid = doc.id;
              const archiveId = data.archiveId;
              const timestampMillis = data.timestamp;  // Timestamp en millisecondes
              const total_livree_envoyer = data.total_livree_envoyer;
              const nomuser = data.creepar;
  
  
              totargentdanslesb = totargentdanslesb +  total_livree_envoyer;
              montantTotal.textContent = "Montant total : "+totargentdanslesb+" DA";
  
              // Convertir le timestamp en objet Date
              const date = new Date(timestampMillis);
      
              // Formatter la date au format "dd mm yyyy hh:mm"
              const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
              // Ajouter un bordereau dans la liste avec la date formatée
              createBordereauMesssageReceptionner(nomuser, total_livree_envoyer, formattedDate,borderauid,archiveId,userid);
              
      
              // getdatageneralofborderau(archiveId);
          });

        }

     
       }
 
       async function importerlesdonnersssMESSAGESENT(nomuser,total_livree_envoyer,archiveId,userid,borderauid,statutsentborderau,motdepasss,sentversuserName){
         const statut = document.getElementById("statut");
         statut.innerHTML="statut :' "+ statutsentborderau + " ' &  mot de passe  : "+ motdepasss;


         if(statutsentborderau === "pending"){
          // bordereau.style.backgroundColor="#da990e8e"; 
          statut.style.color="#dd8500";  
          statut.innerHTML="mot de passe  : "+ motdepasss;
          supprimerledraftbordo.style.display="none";   


          }
          else if (statutsentborderau === "valide") {
            statut.style.color = "#237a00";      
            statut.innerHTML = "BORDEREAU CONFIRMÉ PAR LE RÉCEPTEUR";
            supprimerledraftbordo.style.display="none";   

          } 
          else if (statutsentborderau === "NoValide") {
              statut.style.color = "#ff0000e7";   
              statut.innerHTML = "BORDEREAU REFUSÉ PAR LE RÉCEPTEUR";
              supprimerledraftbordo.style.display="flex";   

          }
          


         selectpersonne.innerHTML='<option value="" disabled selected>Sélectionner une personne</option>';
         
         afficherlafacture.style.display = "flex";
     
         // Sélection des éléments du DOM
         const nomsurborderau = document.getElementById('nomsurborderau');
         const content_tableau_bor_tot_livre = document.getElementById('content_tableau_bor_tot_livre');
         const totdanslacaisse = document.getElementById('totdanslacaisse');
         const totdanslogiciel = document.getElementById('totdanslogiciel');
 
         const nombner2000 = document.getElementById("nombner2000");
         const tot2000 = document.getElementById("tot2000");
 
         const nombner1000 = document.getElementById("nombner1000");
         const tot1000 = document.getElementById("tot1000");
 
         const nombner500 = document.getElementById("nombner500");
         const tot500 = document.getElementById("tot500");
 
         const nombner200 = document.getElementById("nombner200");
         const tot200 = document.getElementById("tot200");
 
         const nombner100 = document.getElementById("nombner100");
         const tot100 = document.getElementById("tot100");
 
         const nombner50 = document.getElementById("nombner50");
         const tot50 = document.getElementById("tot50");
 
         const nombner20 = document.getElementById("nombner20");
         const tot20 = document.getElementById("tot20");
 
         const nombner10 = document.getElementById("nombner10");
         const tot10 = document.getElementById("tot10");
 
         const nombner5 = document.getElementById("nombner5");
         const tot5 = document.getElementById("tot5");
 
         // Déclaration des valeurs des billets/pièces
         const p2000 = 2000;
         const p1000 = 1000;
         const p500 = 500;
         const p200 = 200;
         const p100 = 100;
         const p50 = 50;
         const p20 = 20;
         const p10 = 10;
         const p5 = 5;
 
         // Mise à jour des informations sur le bordereau
         nomsurborderau.innerHTML = "Créé par : " + nomuser + " & receptionner par : "+sentversuserName;
         content_tableau_bor_tot_livre.innerHTML = total_livree_envoyer + " DA";
 
         // Référence et récupération des données depuis Firestore
         const docRef = doc(db, 'archive', archiveId);
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
 
             // Mise à jour des éléments DOM avec les données de Firestore
             nombner2000.innerHTML = billets_2000;
             nombner1000.innerHTML = billets_1000;
             nombner500.innerHTML = billets_500;
             nombner200.innerHTML = pieces_200;
             nombner100.innerHTML = pieces_100;
             nombner50.innerHTML = pieces_50;
             nombner20.innerHTML = pieces_20;
             nombner10.innerHTML = pieces_10;
             nombner5.innerHTML = pieces_5;
             
             // Calcul des totaux
             tot2000.innerHTML = (billets_2000 * p2000 ) + " DA";
             tot1000.innerHTML = (billets_1000 * p1000 ) + " DA";
             tot500.innerHTML = (billets_500  * p500 ) + " DA";
             tot200.innerHTML = (pieces_200 * p200 ) + " DA";
             tot100.innerHTML = (pieces_100   * p100 ) + " DA";
             tot50.innerHTML = (pieces_50  * p50 ) + " DA";
             tot20.innerHTML = (pieces_20  * p20 ) + " DA";
             tot10.innerHTML = (pieces_10  * p10 ) + " DA";
             tot5.innerHTML = (pieces_5  * p5 ) + " DA";
 
             // Mise à jour des totaux dans la caisse et dans le logiciel
             totdanslacaisse.innerHTML = total_caisse + " DA";
             totdanslogiciel.innerHTML = tot_logiciel + " DA";

         } else {
             console.log("Document does not exist");
         }


         supprimerledraftbordo.onclick = async function() {
             if (borderauid) {  // Vérifie si borderauid est défini

                 try {
                     await deleteDoc(doc(db, "users", userid, "facture_reseptionner", borderauid)); 
         
                     notification.classList.add('show');
                     notification.style.backgroundColor = "#289f00";
                     notification.innerHTML = `Document supprimé avec succès!`; 
                     Annulerenvoyerbordo.click();
                     MessageSentactualiserbtn.click();
                     setTimeout(() => {
                         notification.classList.remove('show');
                     }, 5000);  
                 } catch (error) {
                     notification.classList.add('show');
                     notification.style.backgroundColor = "#e30000";
                     notification.innerHTML = `Erreur lors de la suppression du document : ${error.message}`; 
                     setTimeout(() => {
                         notification.classList.remove('show');
                     }, 5000);  
                 }
             } else {
                 notification.classList.add('show');
                 notification.style.backgroundColor = "#e30000";
                 notification.innerHTML = `Veuillez sélectionner un document valide.`; 
                 setTimeout(() => {
                     notification.classList.remove('show');
                 }, 5000);               
             }
         }


          
     
       }
 
 
 
       // Ajouter la liste des bordereaux au div principal
       dataShowBg.appendChild(listBordereaux);
       
 
    }







  



















    const reception = document.getElementById('reception');
    reception.onclick = async function() {
      actualisermessageReceptionner();
      
    }

   
   const draft = document.getElementById('draft');
   draft.onclick = async function() {
    actualiserdraft();

    }

    const rapport = document.getElementById('rapport');
    rapport.onclick = async function() {
      fermerlemenu();
      datashowbg.innerHTML="";
    }
    const testfiabilite = document.getElementById('testfiabilite');
    testfiabilite.onclick = async function() {
      fermerlemenu();
      datashowbg.innerHTML="";
    }
    const gestion_de_stock = document.getElementById('gestion_de_stock');
    gestion_de_stock.onclick = async function() {
      fermerlemenu();
      datashowbg.innerHTML="";
    }
    const messagesented = document.getElementById('messagesented');
    messagesented.onclick = async function() {
      actualisermessageSent();
    }
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


















