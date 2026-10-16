/* =========================================================================
   COOPÉRATIVE AVEC — logique commune à toutes les pages
   ========================================================================= */
(function () {
  var C = window.AVEC_CONFIG;
  var P = window.AVEC_PRODUITS;
  var CATS = window.AVEC_CATEGORIES;

  var CLE_PANIER = "avec_panier";
  var CLE_DISPO = "avec_dispo";
  var CLE_COMMANDES = "avec_commandes";

  /* ---------- Stockage sûr ----------
     1. localStorage quand il est disponible (site hébergé : Netlify, GitHub Pages…)
     2. Mémoire de la page en secours
     3. Site ouvert en fichier (file://) : localStorage est souvent bloqué ou séparé
        d'une page à l'autre. Les données voyagent alors dans l'adresse (#avec=…)
        à chaque clic sur un lien interne, pour que le panier suive le client. */
  var CLES = [CLE_PANIER, CLE_DISPO, CLE_COMMANDES];
  var memoire = {};
  var localOk = (function () {
    try { localStorage.setItem("avec_test", "1"); localStorage.removeItem("avec_test"); return true; }
    catch (e) { return false; }
  })();
  var transportAdresse = !localOk || location.protocol === "file:" || location.origin === "null";

  function lire(cle, defaut) {
    if (localOk) {
      try {
        var v = localStorage.getItem(cle);
        if (v) return JSON.parse(v);
      } catch (e) {}
    }
    return Object.prototype.hasOwnProperty.call(memoire, cle) ? memoire[cle] : defaut;
  }
  function ecrire(cle, valeur) {
    memoire[cle] = valeur;
    if (localOk) {
      try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) {}
    }
  }

  var MARQUE = "avec=";
  // Au chargement : récupérer les données transmises par la page précédente
  (function recevoir() {
    var h = location.hash.slice(1);
    var i = h.indexOf(MARQUE);
    if (i === -1) return;
    var ancre = h.slice(0, i).replace(/~$/, "");
    try {
      var d = JSON.parse(decodeURIComponent(h.slice(i + MARQUE.length)));
      CLES.forEach(function (cle) {
        if (Object.prototype.hasOwnProperty.call(d, cle)) {
          ecrire(cle, d[cle]);
          memoire[cle] = d[cle];
        }
      });
    } catch (e) {}
    try { history.replaceState(null, "", location.pathname + location.search + (ancre ? "#" + ancre : "")); } catch (e) {}
    if (ancre) {
      document.addEventListener("DOMContentLoaded", function () {
        var cible = document.getElementById(ancre);
        if (cible) setTimeout(function () { cible.scrollIntoView(); }, 50);
      });
    }
  })();

  function paquet() {
    var d = {};
    d[CLE_PANIER] = lire(CLE_PANIER, []);
    d[CLE_DISPO] = lire(CLE_DISPO, {});
    d[CLE_COMMANDES] = lire(CLE_COMMANDES, []).slice(0, 10);
    return encodeURIComponent(JSON.stringify(d));
  }
  // Construit l'adresse d'une page interne en y joignant les données si nécessaire
  function adresse(url) {
    if (!transportAdresse) return url;
    var parts = url.split("#");
    return parts[0] + "#" + (parts[1] ? parts[1] + "~" : "") + MARQUE + paquet();
  }
  function aller(url) { location.href = adresse(url); }
  function lienInterne(a) {
    var href = a.getAttribute("href");
    return href && !/^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(href) && /\.html/i.test(href);
  }

  /* ---------- Outils ---------- */
  function fcfa(n) {
    return Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ") + " FCFA";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function param(nom) {
    return new URLSearchParams(location.search).get(nom);
  }
  function produit(id) {
    for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i];
    return null;
  }
  function categorie(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return null;
  }

  /* ---------- Photos : locale d'abord, puis en ligne, puis dessin ---------- */
  var PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5efd3"/><path d="M200 95c-30 0-52 26-52 58 0 36 26 62 52 62s52-26 52-62c0-32-22-58-52-58z" fill="#9bcb2d" opacity=".55"/><path d="M200 80c6 10 6 22 0 32-6-10-6-22 0-32z" fill="#1d5e20"/></svg>'
  );
  function img(local, dossier, distante, alt, classe) {
    var src = local ? "assets/img/" + dossier + "/" + local : distante;
    return '<img class="' + (classe || "") + '" src="' + esc(src) + '" data-distante="' + esc(distante || "") +
      '" alt="' + esc(alt) + '" loading="lazy" onerror="AVEC.photoSecours(this)">';
  }
  function photoSecours(el) {
    var d = el.getAttribute("data-distante");
    if (d && el.src !== d && !el.dataset.essai) { el.dataset.essai = "1"; el.src = d; return; }
    el.onerror = null;
    el.src = PLACEHOLDER;
  }
  function photoProduit(p, classe) {
    return img(p.photoLocale, "produits", p.photo, p.nom, classe);
  }

  /* ---------- Types de clients ---------- */
  var TYPES = [
    { id: "menage", nom: "Ménage", detail: "Pour la famille" },
    { id: "detaillant", nom: "Détaillant", detail: "Pour revendre au marché" },
    { id: "grossiste", nom: "Grossiste", detail: "Grandes quantités" }
  ];
  function typeClient(qte) {
    if (qte >= C.seuils.grossiste) return "grossiste";
    if (qte >= C.seuils.detaillant) return "detaillant";
    return "menage";
  }
  function nomType(id) {
    for (var i = 0; i < TYPES.length; i++) if (TYPES[i].id === id) return TYPES[i].nom;
    return id;
  }
  function plage(id) {
    if (id === "menage") return C.seuils.menage + " à " + (C.seuils.detaillant - 1) + " kg";
    if (id === "detaillant") return C.seuils.detaillant + " à " + (C.seuils.grossiste - 1) + " kg";
    return "À partir de " + C.seuils.grossiste + " kg";
  }
  function prixUnitaire(p, qte) { return p.prix[typeClient(qte)]; }
  function remise(p, type) {
    return Math.round((1 - p.prix[type] / p.prix.menage) * 100);
  }

  /* ---------- Disponibilité (temps réel entre onglets) ---------- */
  function dispos() { return lire(CLE_DISPO, {}); }
  function estDisponible(id) {
    var d = dispos();
    if (Object.prototype.hasOwnProperty.call(d, id)) return !!d[id];
    var p = produit(id);
    return p ? p.disponibleParDefaut : false;
  }
  function changerDispo(id, valeur) {
    var d = dispos();
    d[id] = !!valeur;
    ecrire(CLE_DISPO, d);
    document.dispatchEvent(new CustomEvent("avec:dispo"));
  }

  /* ---------- Panier ---------- */
  function panier() {
    return lire(CLE_PANIER, []).filter(function (l) { return produit(l.id); });
  }
  function sauverPanier(lignes) {
    ecrire(CLE_PANIER, lignes);
    majCompteurs();
    document.dispatchEvent(new CustomEvent("avec:panier"));
  }
  function ajouter(id, qte, remplacer) {
    var p = produit(id);
    if (!p) return false;
    if (!estDisponible(id)) {
      toast(p.nom + " est indisponible pour le moment.", "erreur");
      return false;
    }
    qte = Math.max(1, Math.floor(qte || 1));
    var lignes = panier();
    var ligne = lignes.filter(function (l) { return l.id === id; })[0];
    if (ligne) ligne.qte = remplacer ? qte : ligne.qte + qte;
    else lignes.push({ id: id, qte: qte });
    sauverPanier(lignes);
    var total = (ligne ? ligne.qte : qte);
    toast(p.nom + " ajouté au panier — " + total + " kg (" + nomType(typeClient(total)) + ")");
    return true;
  }
  function modifierQte(id, qte) {
    var lignes = panier();
    lignes.forEach(function (l) { if (l.id === id) l.qte = Math.max(1, Math.floor(qte) || 1); });
    sauverPanier(lignes);
  }
  function retirer(id) {
    sauverPanier(panier().filter(function (l) { return l.id !== id; }));
  }
  function vider() { sauverPanier([]); }

  function detailPanier(livraisonId) {
    var lignes = panier().map(function (l) {
      var p = produit(l.id);
      var type = typeClient(l.qte);
      var pu = p.prix[type];
      return {
        id: l.id, produit: p, qte: l.qte, type: type, prixUnitaire: pu,
        total: pu * l.qte, economie: (p.prix.menage - pu) * l.qte,
        disponible: estDisponible(l.id)
      };
    });
    var sousTotal = 0, economie = 0, poids = 0, rang = 0;
    var ordre = { menage: 0, detaillant: 1, grossiste: 2 };
    lignes.forEach(function (l) {
      if (!l.disponible) return;
      sousTotal += l.total; economie += l.economie; poids += l.qte;
      rang = Math.max(rang, ordre[l.type]);
    });
    var profil = ["menage", "detaillant", "grossiste"][rang];
    var liv = C.livraisons.filter(function (x) { return x.id === livraisonId; })[0] || C.livraisons[0];
    var fraisLivraison = liv.prix;
    if (C.livraisonOfferteGrossiste && profil === "grossiste") fraisLivraison = 0;
    return {
      lignes: lignes, sousTotal: sousTotal, economie: economie, poids: poids,
      profil: profil, livraison: liv, fraisLivraison: fraisLivraison,
      total: sousTotal + fraisLivraison,
      indisponibles: lignes.filter(function (l) { return !l.disponible; })
    };
  }

  /* ---------- Commandes (enregistrées pour l'espace gestion) ---------- */
  function commandes() { return lire(CLE_COMMANDES, []); }
  function enregistrerCommande(cmd) {
    var liste = commandes();
    liste.unshift(cmd);
    ecrire(CLE_COMMANDES, liste.slice(0, 100));
  }
  function commande(numero) {
    return commandes().filter(function (c) { return c.numero === numero; })[0] || null;
  }
  function majCommande(numero, changements) {
    var liste = commandes();
    liste.forEach(function (c) { if (c.numero === numero) Object.assign(c, changements); });
    ecrire(CLE_COMMANDES, liste);
  }
  function nouveauNumero() {
    var d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return "AVEC-" + pad(d.getDate()) + pad(d.getMonth() + 1) + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  /* ---------- WhatsApp ---------- */
  function lienWhatsApp(texte) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(texte);
  }
  function messageCommande(cmd) {
    var t = "🧺 *NOUVELLE COMMANDE — " + C.nom + "*\n";
    t += "N° " + cmd.numero + " — " + cmd.date + "\n\n";
    t += "👤 *Client* : " + cmd.client.nom + "\n";
    t += "📞 " + cmd.client.telephone + "\n";
    t += "📍 " + cmd.client.localite + (cmd.client.adresse ? " — " + cmd.client.adresse : "") + "\n";
    t += "🏷️ Profil : " + nomType(cmd.profil) + "\n\n";
    t += "*Produits*\n";
    cmd.lignes.forEach(function (l) {
      t += "• " + l.nom + " : " + l.qte + " kg × " + fcfa(l.prixUnitaire) + " (" + nomType(l.type) + ") = " + fcfa(l.total) + "\n";
    });
    t += "\nSous-total : " + fcfa(cmd.sousTotal) + "\n";
    t += "🚚 " + cmd.livraison + " : " + (cmd.fraisLivraison ? fcfa(cmd.fraisLivraison) : "offerte") + "\n";
    t += "💰 *TOTAL : " + fcfa(cmd.total) + "*\n\n";
    t += "💳 Paiement : " + cmd.paiement.moyen + " — " + cmd.paiement.statut + "\n";
    if (cmd.paiement.reference) t += "Réf. : " + cmd.paiement.reference + "\n";
    if (cmd.client.note) t += "\n📝 Note : " + cmd.client.note + "\n";
    return t;
  }
  function notifierVendeur(cmd) {
    var cb = C.callmebot || {};
    if (!cb.apiKey) return Promise.resolve("inactif");
    var url = "https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(cb.telephone) +
      "&text=" + encodeURIComponent(messageCommande(cmd)) + "&apikey=" + encodeURIComponent(cb.apiKey);
    return fetch(url, { mode: "no-cors" })
      .then(function () { return "envoye"; })
      .catch(function () { return "echec"; });
  }

  /* ---------- Icônes ---------- */
  var I = {
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19 13 11"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.8 0 5 2.2 5 5"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    wa: '<svg viewBox="0 0 32 32" aria-hidden="true" class="ico-wa"><path fill="currentColor" stroke="none" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.3.6 4.5 1.8 6.5L3 29l6.9-1.8a13 13 0 0 0 6.1 1.5c7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.5c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4a10.5 10.5 0 0 1-1.6-5.7C5.3 10 10.1 5.3 16 5.3S26.7 10 26.7 15.8 21.9 26.5 16 26.5zm5.9-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.2 1.4 3.4 2.4 3.6 5.8 5c2.1.9 3 1 4 .8.6-.1 1.9-.8 2.2-1.5s.3-1.3.2-1.5-.3-.2-.6-.3z"/></svg>'
  };

  /* ---------- En-tête & pied de page ---------- */
  var NAV = [
    { href: "index.html", label: "Accueil", id: "accueil" },
    { href: "produits.html", label: "Nos produits", id: "produits" },
    { href: "a-propos.html", label: "La coopérative", id: "apropos" },
    { href: "contact.html", label: "Nous contacter", id: "contact" }
  ];

  function enTete(actif) {
    var cats = CATS.map(function (c) {
      return '<a href="produits.html?categorie=' + c.id + '">' + esc(c.nom) + "</a>";
    }).join("");
    var liens = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.id === actif ? ' aria-current="page"' : "") + ">" + n.label + "</a>";
    }).join("");
    var q = param("q") || "";
    return '' +
      '<div class="topbar"><div class="wrap topbar__in">' +
        '<span class="topbar__item">' + I.pin + esc(C.adresse) + '</span>' +
        '<span class="topbar__item topbar__tel">' + I.tel + '<a href="tel:+' + C.whatsapp + '">' + esc(C.telephoneAffiche) + '</a></span>' +
        '<span class="topbar__spacer"></span>' +
        '<a class="topbar__item" href="gestion.html">' + I.lock + 'Espace gestion</a>' +
      '</div></div>' +
      '<div class="masthead"><div class="wrap masthead__in">' +
        '<a class="brand" href="index.html" aria-label="' + esc(C.nom) + ' — accueil"><img src="assets/img/logo.png" alt="' + esc(C.nom) + '"></a>' +
        '<form class="search" action="produits.html" role="search">' +
          '<label class="sr-only" for="q">Rechercher un produit</label>' +
          '<input id="q" name="q" type="search" placeholder="Rechercher : tomate, gombo, manioc…" value="' + esc(q) + '">' +
          '<button type="submit" aria-label="Rechercher">' + I.search + '</button>' +
        '</form>' +
        '<div class="masthead__actions">' +
          '<a class="action action--wa" href="' + lienWhatsApp("Bonjour " + C.nom + ", je voudrais passer une commande.") + '" target="_blank" rel="noopener">' +
            '<span class="action__ico">' + I.wa + '</span><span class="action__txt"><small>Commander par</small>WhatsApp</span></a>' +
          '<a class="action" href="panier.html">' +
            '<span class="action__ico">' + I.cart + '<b class="count" data-compteur>0</b></span><span class="action__txt"><small data-total-panier>0 FCFA</small>Panier</span></a>' +
          '<button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" data-burger>' + I.menu + '</button>' +
        '</div>' +
      '</div></div>' +
      '<nav class="navbar" aria-label="Navigation principale"><div class="wrap navbar__in">' +
        '<div class="catmenu">' +
          '<button type="button" class="catmenu__btn" aria-expanded="false" data-catmenu>' + I.menu + '<span>Catégories</span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>' +
          '<div class="catmenu__list" hidden>' + cats + '</div>' +
        '</div>' +
        '<div class="navbar__links" data-navlinks>' + liens + '</div>' +
      '</div></nav>';
  }

  function piedDePage() {
    var annee = new Date().getFullYear();
    return '' +
      '<div class="footer__band"><div class="wrap footer__grid">' +
        '<div class="footer__col footer__about">' +
          '<img class="footer__logo" src="assets/img/logo.png" alt="' + esc(C.nom) + '">' +
          '<p>' + esc(C.nomComplet) + ' de ' + esc(C.village) + '. ' + C.membres + ' membres, en grande majorité des femmes, qui cultivent et vendent ensemble depuis ' + C.creation + '.</p>' +
        '</div>' +
        '<div class="footer__col"><h3>Boutique</h3>' +
          CATS.map(function (c) { return '<a href="produits.html?categorie=' + c.id + '">' + esc(c.nom) + '</a>'; }).join("") +
        '</div>' +
        '<div class="footer__col"><h3>La coopérative</h3>' +
          '<a href="a-propos.html">Notre histoire</a><a href="a-propos.html#femmes">Les membres</a><a href="contact.html">Nous contacter</a><a href="gestion.html">Espace gestion</a>' +
        '</div>' +
        '<div class="footer__col"><h3>Contact</h3>' +
          '<p class="footer__line">' + I.pin + esc(C.adresse) + '</p>' +
          '<p class="footer__line">' + I.tel + '<a href="tel:+' + C.whatsapp + '">' + esc(C.telephoneAffiche) + '</a></p>' +
          '<p class="footer__line">' + I.clock + esc(C.horaires) + '</p>' +
          '<div class="footer__pay" aria-label="Moyens de paiement acceptés">' + logosPaiement() + '</div>' +
        '</div>' +
      '</div></div>' +
      '<div class="footer__legal"><div class="wrap">© ' + annee + ' ' + esc(C.nom) + ' — ' + esc(C.village) + ', Côte d\'Ivoire. Site de démonstration.</div></div>';
  }

  /* ---------- Logos Mobile Money (fichiers dans assets/img/) ---------- */
  var OPERATEURS_LOGOS = {
    orange: { fichier: "orange.jpeg", nom: "Orange Money" },
    mtn: { fichier: "mtn.jpeg", nom: "MTN Mobile Money" },
    moov: { fichier: "moov.jpeg", nom: "Moov Money" },
    wave: { fichier: "wave.jpeg", nom: "Wave" }
  };
  function logoMM(id) {
    var o = OPERATEURS_LOGOS[id];
    return '<img src="assets/img/' + o.fichier + '" alt="' + o.nom + '">';
  }
  function logosPaiement() {
    return ["orange", "mtn", "moov", "wave"].map(function (id) {
      return '<span class="mm mm--' + id + '">' + logoMM(id) + '</span>';
    }).join("");
  }

  /* ---------- Carte produit ---------- */
  function carteProduit(p) {
    var dispo = estDisponible(p.id);
    var cat = categorie(p.categorie);
    return '' +
      '<article class="pcard' + (dispo ? "" : " is-off") + '" data-produit="' + p.id + '">' +
        '<a class="pcard__media" href="produit.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' +
          photoProduit(p) +
          (p.badge && dispo ? '<span class="pcard__badge">' + esc(p.badge) + '</span>' : "") +
          '<span class="dispo ' + (dispo ? "dispo--on" : "dispo--off") + '">' + (dispo ? "Disponible" : "Indisponible") + '</span>' +
        '</a>' +
        '<div class="pcard__body">' +
          '<span class="pcard__cat">' + esc(cat ? cat.court : "") + '</span>' +
          '<h3 class="pcard__title"><a href="produit.html?id=' + p.id + '">' + esc(p.nom) + '</a></h3>' +
          '<p class="pcard__seller">Vendu par <span>' + esc(C.nom) + '</span></p>' +
          '<div class="pcard__prices">' +
            '<span class="pcard__price">' + fcfa(p.prix.menage) + '<small>/kg</small></span>' +
            '<span class="pcard__gros">dès ' + fcfa(p.prix.grossiste) + ' en gros</span>' +
          '</div>' +
          '<div class="pcard__actions">' +
            '<button class="btn btn--soft" type="button" data-ajouter="' + p.id + '"' + (dispo ? "" : " disabled") + '>' +
              (dispo ? "Ajouter au panier" : "Indisponible") + '</button>' +
            '<a class="iconbtn" href="' + lienWhatsApp("Bonjour, je souhaite commander : " + p.nom + ". Est-ce disponible ?") + '" target="_blank" rel="noopener" aria-label="Commander ' + esc(p.nom) + ' sur WhatsApp">' + I.wa + '</a>' +
            '<a class="iconbtn" href="produit.html?id=' + p.id + '" aria-label="Voir ' + esc(p.nom) + '">' + I.eye + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /* ---------- Sélecteur de type de client + quantité ---------- */
  // Retourne le HTML ; brancher ensuite avec lierSelecteur(racine, options)
  function selecteur(nom, qte, compact) {
    var type = typeClient(qte);
    return '' +
      '<div class="picker' + (compact ? " picker--compact" : "") + '" data-picker>' +
        '<div class="seg" role="radiogroup" aria-label="Type de client">' +
          TYPES.map(function (t) {
            return '<label class="seg__opt">' +
              '<input type="radio" name="' + nom + '" value="' + t.id + '"' + (t.id === type ? " checked" : "") + '>' +
              '<span><b>' + t.nom + '</b>' + (compact ? "" : '<small>' + plage(t.id) + '</small>') + '</span>' +
            '</label>';
          }).join("") +
          '<span class="seg__thumb" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="qty">' +
          '<button type="button" class="qty__btn" data-moins aria-label="Diminuer la quantité">' + I.minus + '</button>' +
          '<label class="sr-only" for="' + nom + '-qte">Quantité en kg</label>' +
          '<input class="qty__input" id="' + nom + '-qte" type="number" inputmode="numeric" min="1" step="1" value="' + qte + '">' +
          '<span class="qty__unit">kg</span>' +
          '<button type="button" class="qty__btn" data-plus aria-label="Augmenter la quantité">' + I.plus + '</button>' +
        '</div>' +
      '</div>';
  }

  function lierSelecteur(racine, onChange) {
    var input = racine.querySelector(".qty__input");
    var radios = racine.querySelectorAll('input[type="radio"]');
    var seg = racine.querySelector(".seg");

    function positionner(type) {
      var idx = { menage: 0, detaillant: 1, grossiste: 2 }[type];
      seg.style.setProperty("--i", idx);
      seg.setAttribute("data-type", type);
      radios.forEach(function (r) { r.checked = r.value === type; });
    }
    function depuisQte(emettre) {
      var q = Math.max(1, Math.floor(Number(input.value) || 1));
      input.value = q;
      positionner(typeClient(q));
      if (emettre !== false) onChange(q);
    }
    radios.forEach(function (r) {
      r.addEventListener("change", function () {
        input.value = C.seuils[r.value];
        positionner(r.value);
        onChange(Number(input.value));
      });
    });
    input.addEventListener("input", function () {
      var q = Math.floor(Number(input.value));
      if (q >= 1) { positionner(typeClient(q)); onChange(q); }
    });
    input.addEventListener("change", function () { depuisQte(); });
    racine.querySelector("[data-moins]").addEventListener("click", function () {
      input.value = Math.max(1, (Number(input.value) || 1) - 1); depuisQte();
    });
    racine.querySelector("[data-plus]").addEventListener("click", function () {
      input.value = (Number(input.value) || 0) + 1; depuisQte();
    });
    depuisQte(false);
  }

  /* ---------- Toast ---------- */
  function toast(message, genre) {
    var zone = document.querySelector(".toasts");
    if (!zone) {
      zone = document.createElement("div");
      zone.className = "toasts";
      zone.setAttribute("role", "status");
      zone.setAttribute("aria-live", "polite");
      document.body.appendChild(zone);
    }
    var t = document.createElement("div");
    t.className = "toast" + (genre === "erreur" ? " toast--err" : "");
    t.innerHTML = (genre === "erreur" ? "" : I.check) + "<span>" + esc(message) + "</span>" +
      (genre === "erreur" ? "" : '<a href="panier.html">Voir le panier</a>');
    zone.appendChild(t);
    setTimeout(function () { t.classList.add("is-out"); }, 3200);
    setTimeout(function () { t.remove(); }, 3700);
  }

  /* ---------- Compteurs ---------- */
  function majCompteurs() {
    var d = detailPanier();
    var nb = d.lignes.length;
    document.querySelectorAll("[data-compteur]").forEach(function (el) { el.textContent = nb; });
    document.querySelectorAll("[data-total-panier]").forEach(function (el) { el.textContent = fcfa(d.sousTotal); });
  }

  /* ---------- Initialisation commune ---------- */
  function init() {
    var h = document.querySelector("[data-header]");
    if (h) h.innerHTML = enTete(document.body.getAttribute("data-page"));
    var f = document.querySelector("[data-footer]");
    if (f) f.innerHTML = piedDePage();

    // Bouton WhatsApp flottant
    if (!document.body.hasAttribute("data-sans-flottant")) {
      var wa = document.createElement("a");
      wa.className = "wa-float";
      wa.href = lienWhatsApp("Bonjour " + C.nom + ", je voudrais des informations sur vos produits.");
      wa.target = "_blank"; wa.rel = "noopener";
      wa.setAttribute("aria-label", "Écrire à la coopérative sur WhatsApp");
      wa.innerHTML = I.wa + '<span>Écrivez-nous</span>';
      document.body.appendChild(wa);
    }

    // Menu catégories
    var cb = document.querySelector("[data-catmenu]");
    if (cb) {
      var liste = cb.nextElementSibling;
      cb.addEventListener("click", function (e) {
        e.stopPropagation();
        var ouvert = cb.getAttribute("aria-expanded") === "true";
        cb.setAttribute("aria-expanded", String(!ouvert));
        liste.hidden = ouvert;
      });
      document.addEventListener("click", function () { cb.setAttribute("aria-expanded", "false"); liste.hidden = true; });
    }
    // Menu mobile
    var burger = document.querySelector("[data-burger]");
    if (burger) {
      burger.addEventListener("click", function () {
        var nav = document.querySelector(".navbar");
        var ouvert = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", String(ouvert));
        burger.innerHTML = ouvert ? I.close : I.menu;
      });
    }

    // Liens internes : joindre le panier à l'adresse quand le site est ouvert en fichier
    if (transportAdresse) {
      var avantNavigation = function (e) {
        var a = e.target.closest && e.target.closest("a[href]");
        if (!a || !lienInterne(a)) return;
        var brut = a.getAttribute("data-href") || a.getAttribute("href");
        a.setAttribute("data-href", brut);
        a.setAttribute("href", adresse(brut));
      };
      document.addEventListener("click", avantNavigation, true);
      document.addEventListener("auxclick", avantNavigation, true);
      document.addEventListener("submit", function (e) {
        var f = e.target;
        if ((f.getAttribute("action") || "").indexOf(".html") === -1) return;
        e.preventDefault();
        aller(f.getAttribute("action") + "?" + new URLSearchParams(new FormData(f)).toString());
      });
    }

    // En-tête fixe : la barre du logo, du panier et le menu restent visibles
    var entete = document.querySelector("[data-header]");
    if (entete) {
      var topbar = entete.querySelector(".topbar");
      var mesurer = function () {
        var decalage = topbar ? topbar.offsetHeight : 0;
        document.documentElement.style.setProperty("--topbar-h", decalage + "px");
        document.documentElement.style.setProperty("--entete-h", (entete.offsetHeight - decalage) + "px");
      };
      var compact = false;
      var auDefilement = function () {
        var y = window.scrollY;
        // hystérésis pour éviter que l'en-tête clignote en changeant de taille
        if (!compact && y > 220) { compact = true; entete.classList.add("is-compact"); mesurer(); }
        else if (compact && y < 40) { compact = false; entete.classList.remove("is-compact"); mesurer(); }
      };
      mesurer();
      window.addEventListener("resize", mesurer);
      window.addEventListener("scroll", auDefilement, { passive: true });
      window.addEventListener("load", mesurer);
      auDefilement();
    }

    // Boutons "Ajouter au panier" (délégation)
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-ajouter]");
      if (!b) return;
      e.preventDefault();
      ajouter(b.getAttribute("data-ajouter"), 1);
    });

    // Temps réel : un autre onglet (espace gestion) modifie les données
    window.addEventListener("storage", function (e) {
      if (e.key === CLE_DISPO) document.dispatchEvent(new CustomEvent("avec:dispo"));
      if (e.key === CLE_PANIER) { majCompteurs(); document.dispatchEvent(new CustomEvent("avec:panier")); }
      if (e.key === CLE_COMMANDES) document.dispatchEvent(new CustomEvent("avec:commandes"));
    });

    majCompteurs();
  }

  window.AVEC = {
    C: C, I: I, TYPES: TYPES,
    fcfa: fcfa, esc: esc, param: param, produit: produit, categorie: categorie,
    img: img, photoSecours: photoSecours, photoProduit: photoProduit,
    typeClient: typeClient, nomType: nomType, plage: plage, prixUnitaire: prixUnitaire, remise: remise,
    estDisponible: estDisponible, changerDispo: changerDispo,
    panier: panier, ajouter: ajouter, modifierQte: modifierQte, retirer: retirer, vider: vider, detailPanier: detailPanier,
    commandes: commandes, enregistrerCommande: enregistrerCommande, commande: commande, majCommande: majCommande, nouveauNumero: nouveauNumero,
    lienWhatsApp: lienWhatsApp, messageCommande: messageCommande, notifierVendeur: notifierVendeur,
    carteProduit: carteProduit, selecteur: selecteur, lierSelecteur: lierSelecteur, logosPaiement: logosPaiement, logoMM: logoMM,
    toast: toast, majCompteurs: majCompteurs, aller: aller, adresse: adresse
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
