/* =========================================================================
   PRODUITS & CATÉGORIES
   Prix en FCFA par kg, selon le type de client.
   Pour mettre votre propre photo : déposez-la dans assets/img/produits/ puis
   écrivez son nom dans "photoLocale" (ex. photoLocale: "tomate.jpg"). Sinon la photo
   en ligne est utilisée.
   ========================================================================= */
(function () {
  var U = function (id, w) {
    return "https://images.unsplash.com/photo-" + id + "?w=" + (w || 900) + "&q=75&auto=format&fit=crop";
  };

  window.AVEC_UNSPLASH = U;

  window.AVEC_CATEGORIES = [
    { id: "legumes", nom: "Légumes frais", court: "Légumes", photo: U("1582284540020-8acbe03f4924", 500) },
    { id: "condiments", nom: "Piments & condiments", court: "Condiments", photo: U("1610216339841-a0456a6c86a9", 500) },
    { id: "tubercules", nom: "Tubercules", court: "Tubercules", photo: U("1757281096972-10fd02b0f5ea", 500) },
    { id: "bananes", nom: "Bananes", court: "Bananes", photo: U("1617631716600-6a454b430367", 500) },
    { id: "seches", nom: "Produits séchés", court: "Séchés", photo: U("1766158554170-1e8b1899c8ae", 500) }
  ];

  window.AVEC_PRODUITS = [
    {
      id: "tomate",
      nom: "Tomate fraîche",
      categorie: "legumes",
      photoLocale: "",
      photo: U("1582284540020-8acbe03f4924"),
      prix: { menage: 800, detaillant: 700, grossiste: 600 },
      disponibleParDefaut: true,
      badge: "Récolte du jour",
      resume: "Tomates bien rouges et fermes, cueillies à maturité le matin même.",
      description: "Nos tomates poussent sur les parcelles des femmes de la coopérative, arrosées à l'eau du bas-fond et fertilisées au compost. Idéales pour la sauce graine, la sauce claire ou la salade. Triées à la main : les fruits abîmés ne sont jamais expédiés.",
      conservation: "3 à 5 jours à l'air libre, à l'abri du soleil.",
      saison: "Toute l'année, pic de production de novembre à mars."
    },
    {
      id: "piment-rouge",
      nom: "Piment rouge frais",
      categorie: "condiments",
      photoLocale: "",
      photo: U("1610216339841-a0456a6c86a9"),
      prix: { menage: 1500, detaillant: 1300, grossiste: 1100 },
      disponibleParDefaut: true,
      badge: "",
      resume: "Piment long et bien fort, parfait pour relever toutes les sauces.",
      description: "Cultivé en association avec le gombo, notre piment rouge est récolté bien mûr pour un goût puissant et une belle couleur. Vendu frais, prêt à écraser ou à sécher.",
      conservation: "1 semaine au frais, plusieurs mois une fois séché.",
      saison: "Toute l'année."
    },
    {
      id: "piment-vert",
      nom: "Petit piment vert",
      categorie: "condiments",
      photoLocale: "",
      photo: U("1599987141071-f5810d32e21a"),
      prix: { menage: 2000, detaillant: 1750, grossiste: 1500 },
      disponibleParDefaut: true,
      badge: "",
      resume: "Petit piment vert très parfumé, le préféré des maquis.",
      description: "Le petit piment vert du village, piquant et aromatique. Récolté tous les deux jours pour garantir sa fraîcheur. Très demandé par les restaurants et les vendeuses de garba.",
      conservation: "5 à 7 jours au frais.",
      saison: "Toute l'année."
    },
    {
      id: "gombo",
      nom: "Gombo frais",
      categorie: "legumes",
      photoLocale: "",
      photo: U("1558408525-1092038389ae"),
      prix: { menage: 1000, detaillant: 850, grossiste: 700 },
      disponibleParDefaut: true,
      badge: "Récolte du jour",
      resume: "Gombo tendre et bien vert, récolté jeune pour une sauce bien gluante.",
      description: "Nos gombos sont cueillis jeunes, quand ils sont encore tendres. Parfaits pour la sauce gombo, le kopè ou la sauce feuille. Les femmes récoltent à la main, tôt le matin, pour garder toute leur fraîcheur.",
      conservation: "2 à 3 jours à l'ombre, dans un panier aéré.",
      saison: "Saison des pluies, d'avril à octobre."
    },
    {
      id: "gombo-seche",
      nom: "Gombo séché en poudre",
      categorie: "seches",
      photoLocale: "",
      photo: U("1568640895956-e2bad65027b0"),
      prix: { menage: 3500, detaillant: 3000, grossiste: 2600 },
      disponibleParDefaut: false,
      badge: "",
      resume: "Gombo séché au soleil puis moulu, pour la sauce toute l'année.",
      description: "Pendant la grande récolte, les femmes coupent et sèchent le gombo au soleil sur des claies, puis le moulent au village. Une poudre qui se garde longtemps et donne une sauce gombo même en saison sèche.",
      conservation: "6 mois dans un bocal fermé.",
      saison: "Disponible selon les stocks de séchage."
    },
    {
      id: "manioc",
      nom: "Manioc frais",
      categorie: "tubercules",
      photoLocale: "",
      photo: U("1757281096972-10fd02b0f5ea"),
      prix: { menage: 300, detaillant: 250, grossiste: 200 },
      disponibleParDefaut: true,
      badge: "",
      resume: "Racines de manioc doux, arrachées sur commande pour l'attiéké ou le placali.",
      description: "Variété douce, bien farineuse, adaptée à la fabrication d'attiéké, de placali ou à la cuisson à l'eau. Nous arrachons le manioc au moment de la commande : il reste frais et ne noircit pas.",
      conservation: "2 jours après arrachage.",
      saison: "Toute l'année."
    },
    {
      id: "aubergine",
      nom: "Aubergine violette",
      categorie: "legumes",
      photoLocale: "",
      photo: U("1683543122945-513029986574"),
      prix: { menage: 700, detaillant: 600, grossiste: 500 },
      disponibleParDefaut: true,
      badge: "",
      resume: "Aubergines brillantes et charnues, pour vos sauces et ragoûts.",
      description: "Aubergines à la peau fine et à la chair ferme, sans amertume. Elles se marient très bien à la sauce claire, au ragoût de poisson ou grillées au feu de bois.",
      conservation: "5 à 7 jours au frais.",
      saison: "Toute l'année."
    },
    {
      id: "banane-plantain",
      nom: "Banane plantain",
      categorie: "bananes",
      photoLocale: "",
      photo: U("1617631716600-6a454b430367"),
      prix: { menage: 400, detaillant: 350, grossiste: 300 },
      disponibleParDefaut: true,
      badge: "Très demandé",
      resume: "Plantain bien plein, vert ou mûr selon votre choix : alloco, foutou, braisé.",
      description: "Les régimes de plantain de la coopérative sont coupés à bonne maturité. Précisez dans votre commande si vous le voulez vert (foutou, bouilli) ou mûr (alloco, braisé).",
      conservation: "1 semaine, mûrit progressivement.",
      saison: "Toute l'année."
    },
    {
      id: "banane-douce",
      nom: "Banane douce",
      categorie: "bananes",
      photoLocale: "",
      photo: U("1552709607-08d00227833d"),
      prix: { menage: 600, detaillant: 500, grossiste: 420 },
      disponibleParDefaut: true,
      badge: "",
      resume: "Petite banane dessert, sucrée et parfumée.",
      description: "Bananes douces cultivées à l'ombre des cacaoyers du village. Sucrées, parfumées, parfaites pour le goûter des enfants ou la revente au détail.",
      conservation: "4 à 6 jours à température ambiante.",
      saison: "Toute l'année."
    }
  ];

  // Photos de l'équipe (page À propos). Déposez vos photos dans assets/img/femmes/
  // puis écrivez leur nom dans photoLocale (ex. "femme-1.jpg"). Modifiez noms et rôles ici.
  window.AVEC_FEMMES = [
    { photoLocale: "", photo: U("1509100194014-d49809396daa", 700), nom: "Nom de la présidente", role: "Présidente" },
    { photoLocale: "", photo: U("1509099381441-ea3c0cf98b94", 700), nom: "Nom de la secrétaire", role: "Secrétaire générale" },
    { photoLocale: "", photo: U("1761370980657-22586ea44093", 700), nom: "Nom de la trésorière", role: "Trésorière" },
    { photoLocale: "", photo: U("1509099342178-e323b1717dba", 700), nom: "Nom du membre", role: "Responsable des cultures" },
    { photoLocale: "", photo: U("1553775927-a071d5a6a39a", 700), nom: "Nom du membre", role: "Responsable des ventes" },
    { photoLocale: "", photo: U("1708417145375-ed79c7131fab", 700), nom: "Groupe des productrices", role: "Équipe des champs" }
  ];
})();
