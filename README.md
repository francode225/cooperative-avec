# Site de la Coopérative AVEC

Site de vente de produits vivriers (tomate, piment, gombo, manioc, aubergine, banane) pour une coopérative de village.
Site **100 % statique** (HTML, CSS, JavaScript) : aucune installation, aucun serveur, hébergement gratuit.

---

## 1. Voir le site sur votre ordinateur

Double-cliquez sur `index.html`. C'est tout.

---

## 2. Mettre le site en ligne gratuitement (2 minutes)

### Option A : Netlify Drop (le plus simple)
1. Allez sur **https://app.netlify.com/drop**
2. Créez un compte gratuit (ou connectez-vous avec Google).
3. **Glissez-déposez le dossier entier** `cooperative avec` dans la page.
4. Netlify vous donne un lien du type `https://nom-au-hasard.netlify.app`.
   Vous pouvez le renommer dans *Site configuration → Change site name* (ex. `cooperative-avec.netlify.app`).

Pour mettre à jour : *Deploys* → glissez à nouveau le dossier.

### Option B : GitHub Pages
1. Créez un dépôt sur GitHub et envoyez-y tous les fichiers.
2. *Settings → Pages → Branch : main / root → Save*.

---

## 3. Mettre vos vraies informations

Tout se trouve dans **`assets/js/config.js`** :

| Champ | À quoi ça sert |
|---|---|
| `nom`, `village`, `adresse`, `creation`, `membres`, `hectares` | Informations de la coopérative (affichées partout) |
| `telephoneAffiche` | Numéro affiché, ex. `"+225 05 56 89 42 12"` |
| `whatsapp` | Numéro WhatsApp du vendeur **sans + ni espaces**, ex. `"2250705305890"` |
| `waveLienPaiement` | Votre lien Wave Business (voir section 5) |
| `callmebot` | Notification WhatsApp automatique (voir section 4) |
| `seuils` | Quantités minimales : ménage 1 kg, détaillant 10 kg, grossiste 50 kg |
| `livraisons` | Modes et frais de livraison |
| `codeGestion` | Code de l'espace gestion (par défaut `1234`) |

Les **produits et les prix** sont dans **`assets/js/data.js`** (prix par kg pour chaque type de client).

---

## 4. Recevoir chaque commande automatiquement sur votre WhatsApp

Le site utilise **CallMeBot**, un service gratuit qui envoie un message WhatsApp *à vous-même*.

1. Allez sur **https://www.callmebot.com/blog/free-api-whatsapp-messages/** et ajoutez le numéro du bot indiqué sur cette page dans vos contacts.
2. Depuis **votre** WhatsApp (celui qui doit recevoir les commandes), envoyez à ce contact le message :
   `I allow callmebot to send me messages`
3. Vous recevez en retour : *« API Activated for your phone number. Your APIKEY is 123456 »*.
4. Dans `assets/js/config.js`, remplissez :
   ```js
   callmebot: {
     telephone: "+2250705305890",   // votre numéro, avec +225
     apiKey: "123456"               // la clé reçue
   },
   ```

Dès qu'un client valide un paiement, vous recevez sur WhatsApp : n° de commande, nom et téléphone du client, lieu, chaque produit avec quantité, type de client et prix, livraison, total et moyen de paiement.

> Sans clé, le site fonctionne quand même : la page de reçu propose au client le bouton **« Envoyer la commande sur WhatsApp »** qui ouvre WhatsApp avec le message déjà rédigé.
> Si la clé n'arrive pas en 2 minutes, CallMeBot demande de réessayer 24 h plus tard.

---

## 5. Paiement Wave réel

1. Dans l'application **Wave Business**, créez votre **lien de paiement** (il ressemble à `https://pay.wave.com/m/M_ci_XXXXXXXX/c/ci/`).
2. Collez-le dans `config.js` :
   ```js
   waveLienPaiement: "https://pay.wave.com/m/M_ci_XXXXXXXX/c/ci/",
   ```
3. Le site ajoute automatiquement le montant de la commande (`?amount=52000`). Le client arrive sur la page Wave, scanne le QR code et paie la somme exacte.

⚠️ Faites un test avec un petit montant et vérifiez que la page Wave affiche bien le montant rempli.

Orange Money, MTN MoMo et Moov Money restent en **simulation** (numéro → demande sur le téléphone → code secret → reçu). Aucun argent n'est débité.

---

## 6. Mettre vos propres photos

- **Produits** : copiez la photo dans `assets/img/produits/` (ex. `tomate.jpg`), puis dans `assets/js/data.js` écrivez `photoLocale: "tomate.jpg"` pour ce produit.
- **Femmes de la coopérative** : copiez les photos dans `assets/img/femmes/` (ex. `femme-1.jpg`), puis dans `data.js`, section `AVEC_FEMMES`, écrivez `photoLocale: "femme-1.jpg"` et changez `nom` et `role`.

Photos conseillées : format JPG, environ 1000 px de large.
Les photos de démonstration viennent d'Unsplash (licence gratuite).

---

## 7. Démonstration devant le jury : scénario conseillé

1. **Accueil** → montrer les catégories, les 3 types de clients, Mobile Money.
2. **Fiche produit** (ex. Tomate) → cliquer *Grossiste* : la quantité passe à 50 kg et le prix baisse. Taper `12` : le switch passe tout seul sur *Détaillant*.
3. **Disponibilité en temps réel** : ouvrir `gestion.html` (code `1234`) dans un **deuxième onglet**, désactiver un produit → dans le premier onglet il devient *Indisponible* immédiatement, sans recharger.
4. **Panier** → plusieurs produits avec des types de clients différents, remise calculée.
5. **Commande** → paiement Orange Money simulé (code secret à 4 chiffres au choix) → reçu.
6. **WhatsApp** → la commande arrive sur le téléphone du vendeur (si CallMeBot est configuré) ou via le bouton.
7. **Espace gestion** → la commande apparaît dans *Commandes reçues*.

> Le bouton **« Réinitialiser la démo »** (espace gestion) remet tout à zéro avant la présentation.
> Les disponibilités et les commandes sont enregistrées dans le navigateur (localStorage) : le temps réel fonctionne entre les onglets d'un même navigateur.
> Pour la présentation, utilisez de préférence **le site en ligne** (lien Netlify). Ouvert en double-cliquant sur le fichier, le panier et les commandes fonctionnent aussi (les données passent d'une page à l'autre dans l'adresse), mais le temps réel entre deux onglets peut ne pas marcher selon le navigateur.

---

## Structure

```
index.html          Accueil
produits.html       Catalogue (filtres, recherche, tri)
produit.html        Fiche produit + choix du type de client
panier.html         Panier
commande.html       Coordonnées, livraison, paiement Mobile Money
confirmation.html   Reçu + envoi WhatsApp
a-propos.html       Histoire, chiffres, les femmes de la coopérative
contact.html        Contact, carte, formulaire vers WhatsApp
gestion.html        Espace gestion : disponibilités et commandes
assets/js/config.js Informations de la coopérative   ← à modifier
assets/js/data.js   Produits, prix, photos           ← à modifier
assets/js/app.js    Logique commune
assets/css/style.css
```
