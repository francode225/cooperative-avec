/* =========================================================================
   CONFIGURATION DE LA COOPÉRATIVE
   ➜ C'est le SEUL fichier à modifier pour mettre vos vraies informations.
   ========================================================================= */
window.AVEC_CONFIG = {
  // --- Identité ---------------------------------------------------------
  nom: "Coopérative AVEC",
  nomComplet: "Association Villageoise d'Épargne et de Crédit",
  slogan: "Du champ du village à votre marmite",
  village: "N'Guessankro",
  adresse: "Village de N'Guessankro, Sous-préfecture de Tiébissou, Côte d'Ivoire",
  carteRecherche: "Tiébissou, Côte d'Ivoire",   // utilisé pour la carte Google Maps
  creation: 2016,
  membres: 48,          // nombre de femmes membres
  hectares: 35,         // surface cultivée

  // --- Contacts -----------------------------------------------------------
  telephoneAffiche: "+225 05 56 89 42 12",
  whatsapp: "2250556894212",            // format international SANS "+" ni espaces
  email: "contact@cooperative-avec.ci",
  horaires: "Lundi – Samedi : 7h – 18h",

  // --- Paiement Wave (vrai lien Wave Business) ----------------------------
  // Collez ici votre lien de paiement Wave Business, par ex. :
  //   "https://pay.wave.com/m/M_ci_XXXXXXXX/c/ci/"
  // Le site ajoute automatiquement ?amount=MONTANT à la fin.
  // Laisser vide = Wave passe aussi en mode simulation.
  waveLienPaiement: "",

  // --- Notification WhatsApp automatique au vendeur -----------------------
  // Service gratuit CallMeBot (voir README.md pour obtenir la clé en 2 min).
  // Laisser vide = pas d'envoi automatique (le bouton WhatsApp reste disponible).
  callmebot: {
    telephone: "+2250556894212",
    apiKey: ""
  },

  // --- Types de clients (quantité minimale en kg) -------------------------
  seuils: {
    menage: 1,
    detaillant: 10,
    grossiste: 50
  },

  // --- Livraison ----------------------------------------------------------
  livraisons: [
    { id: "retrait", nom: "Retrait à la coopérative", detail: "Au magasin du village, sous 24 h", prix: 0 },
    { id: "local", nom: "Livraison dans la zone", detail: "Tiébissou, Yamoussoukro et environs — 24 à 48 h", prix: 1000 },
    { id: "abidjan", nom: "Livraison à Abidjan", detail: "Par car de transport — 48 à 72 h", prix: 3000 }
  ],
  livraisonOfferteGrossiste: true,       // livraison gratuite si la commande contient un achat grossiste

  // --- Espace gestion -----------------------------------------------------
  codeGestion: "1234"
};
