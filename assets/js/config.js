/* =========================================================================
   CONFIGURATION DE LA COOPÉRATIVE
   ➜ C'est le SEUL fichier à modifier pour mettre vos vraies informations.
   ========================================================================= */
window.AVEC_CONFIG = {
  // --- Identité ---------------------------------------------------------
  nom: "Coopérative AVEC",
  nomComplet: "Association de valorisation de l'entraide communautaire",
  slogan: "Du champ du village à votre marmite",
  village: "Dabou",
  adresse: "Coopérative AVEC de Dabou, Côte d'Ivoire",
  carteRecherche: "Dabou, Côte d'Ivoire",   // utilisé pour la carte Google Maps
  creation: 2020,
  membres: 48,          // nombre total de membres (coopérative mixte, en grande majorité des femmes)
  hectares: 35,         // surface cultivée

  // --- Contacts -----------------------------------------------------------
  telephoneAffiche: "+225 07 05 30 58 90",
  whatsapp: "2250705305890",            // format international SANS "+" ni espaces
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
    telephone: "+2250705305890",
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
    { id: "retrait", nom: "Retrait à la coopérative", detail: "Au siège de la coopérative à Dabou, sous 24 h", prix: 0 },
    { id: "local", nom: "Livraison dans la zone", detail: "Dabou, Jacqueville et environs — 24 à 48 h", prix: 1000 },
    { id: "abidjan", nom: "Livraison à Abidjan", detail: "Par car de transport — 48 à 72 h", prix: 3000 }
  ],
  livraisonOfferteGrossiste: true,       // livraison gratuite si la commande contient un achat grossiste

  // --- Espace gestion -----------------------------------------------------
  codeGestion: "1234"
};
