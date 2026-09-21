# BIN1000 — Principes de programmation
## Atelier 01 — Algorithmique
*Professeur Youness Boukouchi*

---

## Comment lire ce document

Pour chaque exercice, on suit toujours les **4 mêmes étapes**. C'est la méthode :

| Étape | Question à se poser |
|---|---|
| **1. Entrées** | De quoi ai-je besoin ? (ce que l'utilisateur tape) |
| **2. Sorties** | Qu'est-ce que je dois afficher à la fin ? |
| **3. Traitement** | Quels calculs / décisions relient les entrées aux sorties ? |
| **4. Vérification** | Je déroule l'algo ligne par ligne avec des vraies valeurs = **la trace** |

### Conventions de notation utilisées

| Symbole | Signification |
|---|---|
| `←` | affectation : `S ← 15` veut dire « on range 15 dans la boîte S » |
| `Lire(x)` | l'utilisateur tape une valeur, elle entre dans `x` |
| `Écrire(...)` | on affiche à l'écran |
| `Réel` / `Entier` / `Chaîne` | type de la variable (nombre à virgule / nombre entier / texte) |

### Symboles de l'organigramme

```
 ( ovale )        Début / Fin
 [ parallélogramme ]  Entrée (Lire) ou Sortie (Écrire)
 [ rectangle ]     Traitement (un calcul, une affectation)
 < losange >       Test / Décision (2 sorties : Oui / Non)
```

> Dans les schémas ASCII ci-dessous, un cadre contenant un **`?`** représente un **losange** (test).

---
---

# Exercice 1 — Surface d'un rectangle

## Énoncé
Calculer la surface d'un rectangle à partir de sa longueur et de sa largeur.

## 1. Analyse

| | |
|---|---|
| **Entrées** | `longueur` (Réel), `largeur` (Réel) |
| **Traitement** | `surface ← longueur × largeur` |
| **Sortie** | `surface` |

C'est le schéma de base de TOUT programme : **Entrée → Traitement → Sortie** (modèle *IPO*).

## 2. Pseudocode

```
ALGORITHME SurfaceRectangle

VARIABLES
    longueur, largeur, surface : Réel

DÉBUT
    Écrire("Entrez la longueur du rectangle : ")
    Lire(longueur)

    Écrire("Entrez la largeur du rectangle : ")
    Lire(largeur)

    surface ← longueur * largeur

    Écrire("La surface du rectangle est : ", surface)
FIN
```

## 3. Organigramme

```
              ┌───────────┐
              │  Début    │
              └─────┬─────┘
                    │
        ┌───────────▼────────────┐
        │  Lire longueur         │   (entrée)
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │  Lire largeur          │   (entrée)
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │  surface ← longueur    │   (traitement)
        │            * largeur   │
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │  Écrire surface        │   (sortie)
        └───────────┬────────────┘
                    │
              ┌─────▼─────┐
              │   Fin     │
              └───────────┘
```

## 4. Trace d'exécution — avec `longueur = 5` et `largeur = 3`

| N° | Instruction exécutée | longueur | largeur | surface | Écran |
|---|---|---|---|---|---|
| 0 | *(état initial)* | ? | ? | ? | |
| 1 | `Lire(longueur)` | **5** | ? | ? | |
| 2 | `Lire(largeur)` | 5 | **3** | ? | |
| 3 | `surface ← 5 * 3` | 5 | 3 | **15** | |
| 4 | `Écrire(surface)` | 5 | 3 | 15 | `La surface est : 15` |

> **Lecture de la trace** : chaque ligne = une instruction. On ne change qu'**une seule** case à la fois (en gras). `?` = la variable existe mais ne contient encore rien.

## Pourquoi c'est optimal
3 lectures/écritures + **1 seule multiplication**. On ne peut pas faire moins : il n'y a aucun test, aucune répétition. La complexité est **O(1)** (temps constant).

---
---

# Exercice 2 — Permutation circulaire de 3 variables

## Énoncé
`A → B`, `B → C`, `C → A`, quelles que soient les valeurs de départ.

## 1. Le piège à comprendre AVANT d'écrire l'algorithme

C'est **l'exercice le plus important** de l'atelier. Essayons naïvement :

```
B ← A      ← on écrase B... mais B contenait une valeur dont on a encore besoin !
C ← B      ← B ne contient plus l'ancien B, il contient A. ✗ PERDU
A ← C
```

**Trace de la version FAUSSE** (A=10, B=20, C=30) :

| Instruction | A | B | C | Commentaire |
|---|---|---|---|---|
| état initial | 10 | 20 | 30 | |
| `B ← A` | 10 | **10** | 30 | 💥 l'ancien 20 est **détruit** |
| `C ← B` | 10 | 10 | **10** | on recopie 10, pas 20 ✗ |
| `A ← C` | **10** | 10 | 10 | résultat : 10,10,10 ✗✗✗ |

**Attendu :** A=30, B=10, C=20. **Obtenu :** 10,10,10. Catastrophe.

> 🔑 **Règle d'or** : une affectation **écrase** l'ancien contenu. Avant d'écraser une variable, il faut avoir **sauvegardé** sa valeur ailleurs, ou avoir déjà fini de s'en servir.

## 2. La solution : une variable temporaire + le bon ordre

Deux stratégies possibles :

**Stratégie A — sauvegarder puis remonter à l'envers** (la meilleure, 1 seule variable temporaire)

On écrit les affectations **dans l'ordre inverse de la chaîne** : on remplit d'abord la case dont on a sauvegardé le contenu.

```
temp ← C        (1) je sauve C, car C va être écrasé
C    ← B        (2) C reçoit B  — l'ancien C est en sécurité dans temp
B    ← A        (3) B reçoit A  — l'ancien B vient d'être recopié dans C ✓
A    ← temp     (4) A reçoit l'ancien C ✓
```

À chaque instant, **la valeur que j'écrase a déjà été copiée quelque part**. C'est ça, le secret.

## 3. Pseudocode

```
ALGORITHME PermutationCirculaire

VARIABLES
    A, B, C : Entier
    temp    : Entier        // variable tampon (ou "temporaire")

DÉBUT
    Écrire("Entrez la valeur de A : ")
    Lire(A)
    Écrire("Entrez la valeur de B : ")
    Lire(B)
    Écrire("Entrez la valeur de C : ")
    Lire(C)

    Écrire("AVANT  ->  A = ", A, "  B = ", B, "  C = ", C)

    temp ← C            // 1. sauvegarde de C
    C    ← B            // 2. B passe dans C
    B    ← A            // 3. A passe dans B
    A    ← temp         // 4. l'ancien C passe dans A

    Écrire("APRÈS  ->  A = ", A, "  B = ", B, "  C = ", C)
FIN
```

## 4. Organigramme

```
              ┌───────────┐
              │  Début    │
              └─────┬─────┘
                    │
        ┌───────────▼────────────┐
        │   Lire A, B, C         │
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │     temp ← C           │  ① sauvegarde
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │     C ← B              │  ②
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │     B ← A              │  ③
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │     A ← temp           │  ④
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │   Écrire A, B, C       │
        └───────────┬────────────┘
              ┌─────▼─────┐
              │   Fin     │
              └───────────┘
```

## 5. Trace d'exécution — avec `A = 10`, `B = 20`, `C = 30`

| N° | Instruction | A | B | C | temp | Ce qui se passe |
|---|---|---|---|---|---|---|
| 0 | état initial | 10 | 20 | 30 | ? | |
| 1 | `temp ← C` | 10 | 20 | 30 | **30** | on met 30 de côté |
| 2 | `C ← B` | 10 | 20 | **20** | 30 | C prend 20 ✓ (l'ancien 30 est sauvé) |
| 3 | `B ← A` | 10 | **10** | 20 | 30 | B prend 10 ✓ (l'ancien 20 est déjà dans C) |
| 4 | `A ← temp` | **30** | 10 | 20 | 30 | A prend 30 ✓ |

**Résultat : A = 30, B = 10, C = 20.**

Vérification avec l'énoncé :
- « la valeur de A est affectée à B » → ancien A = 10 → nouveau B = 10 ✓
- « la valeur de B est affectée à C » → ancien B = 20 → nouveau C = 20 ✓
- « la valeur de C est affectée à A » → ancien C = 30 → nouveau A = 30 ✓

### Vérification avec des valeurs identiques (le cas piège)
`A = 7, B = 7, C = 7` → temp=7, C=7, B=7, A=7 → tout reste à 7. ✓ Normal : permuter des valeurs égales ne change rien. L'algorithme fonctionne bien **quelles que soient** les valeurs, y compris négatives ou nulles, car il ne fait aucun calcul — que des copies.

## Pourquoi c'est optimal
- **4 affectations et 1 seule variable supplémentaire.** C'est le minimum théorique : pour faire tourner 3 valeurs, il faut forcément en libérer une d'avance, donc au moins 1 tampon et au moins 4 copies.
- ⚠️ *Variante « sans variable temporaire »* (`A ← A+B+C`, puis soustractions, ou XOR) : elle existe, mais elle est **à éviter** — elle ne marche que sur des nombres, risque de débordement, et devient illisible. En algorithmique on privilégie la **clarté**.

---
---

# Exercice 3 — Prix TTC

## Énoncé
Saisir le prix HT d'un article, la quantité et le taux de taxe ; afficher le total TTC.

## 1. Analyse

| | |
|---|---|
| **Entrées** | `prixHT` (Réel), `quantite` (Entier), `taux` (Réel, en %) |
| **Traitement** | `totalHT ← prixHT * quantite` puis `totalTTC ← totalHT * (1 + taux/100)` |
| **Sortie** | `totalHT`, `montantTaxes`, `totalTTC` |

### La formule, expliquée
Un taux de **18 %** signifie « on ajoute 18 pour chaque 100 ».
- En fraction : `18 / 100 = 0,18`
- Ajouter 18 % = multiplier par `1 + 0,18 = 1,18`

D'où : **`TTC = HT × (1 + taux/100)`**

> ⚠️ Erreur classique : écrire `TTC ← HT * (1 + taux)` avec taux = 18. On obtiendrait ×19, soit 1900 % ! Le `/100` est indispensable **si l'utilisateur tape 18**. (S'il tape 0,18, alors on n'en met pas — d'où l'intérêt d'écrire clairement dans le message de saisie : *« taux en % »*.)

## 2. Pseudocode

```
ALGORITHME PrixTTC

VARIABLES
    prixHT, taux          : Réel
    quantite              : Entier
    totalHT, taxes, totalTTC : Réel

DÉBUT
    Écrire("Prix hors taxes de l'article : ")
    Lire(prixHT)

    Écrire("Quantité achetée : ")
    Lire(quantite)

    Écrire("Taux de taxe (en %) : ")
    Lire(taux)

    totalHT  ← prixHT * quantite
    taxes    ← totalHT * taux / 100
    totalTTC ← totalHT + taxes

    Écrire("Total HT    : ", totalHT)
    Écrire("Taxes       : ", taxes)
    Écrire("TOTAL TTC   : ", totalTTC)
FIN
```

> On aurait pu écrire directement `totalTTC ← prixHT * quantite * (1 + taux/100)` en une seule ligne.
> C'est plus court, mais **moins pédagogique** et on perd le détail des taxes, que l'énoncé d'une facture demande presque toujours. Les deux sont justes ; la version en 3 étapes est plus **lisible** et **réutilisable**.

## 3. Organigramme

```
              ┌───────────┐
              │  Début    │
              └─────┬─────┘
        ┌───────────▼────────────┐
        │ Lire prixHT, quantite, │
        │      taux              │
        └───────────┬────────────┘
        ┌───────────▼────────────┐
        │ totalHT ← prixHT       │
        │           * quantite   │
        └───────────┬────────────┘
        ┌───────────▼────────────┐
        │ taxes ← totalHT        │
        │          * taux / 100  │
        └───────────┬────────────┘
        ┌───────────▼────────────┐
        │ totalTTC ← totalHT     │
        │             + taxes    │
        └───────────┬────────────┘
        ┌───────────▼────────────┐
        │ Écrire totalHT, taxes, │
        │        totalTTC        │
        └───────────┬────────────┘
              ┌─────▼─────┐
              │   Fin     │
              └───────────┘
```

## 4. Trace — `prixHT = 1000`, `quantite = 3`, `taux = 18`

| N° | Instruction | prixHT | quantite | taux | totalHT | taxes | totalTTC |
|---|---|---|---|---|---|---|---|
| 0 | initial | ? | ? | ? | ? | ? | ? |
| 1 | `Lire(prixHT)` | **1000** | ? | ? | ? | ? | ? |
| 2 | `Lire(quantite)` | 1000 | **3** | ? | ? | ? | ? |
| 3 | `Lire(taux)` | 1000 | 3 | **18** | ? | ? | ? |
| 4 | `totalHT ← 1000*3` | 1000 | 3 | 18 | **3000** | ? | ? |
| 5 | `taxes ← 3000*18/100` | 1000 | 3 | 18 | 3000 | **540** | ? |
| 6 | `totalTTC ← 3000+540` | 1000 | 3 | 18 | 3000 | 540 | **3540** |

**Affichage final :**
```
Total HT    : 3000
Taxes       : 540
TOTAL TTC   : 3540
```

**Vérification mentale** : 10 % de 3000 = 300 ; 18 % ≈ 300 + 240 = 540. ✓

## Pourquoi c'est optimal
3 opérations arithmétiques, aucun test, aucune boucle → **O(1)**. On calcule `totalHT` **une seule fois** et on le réutilise, au lieu de recalculer `prixHT * quantite` deux fois.

---
---

# Exercice 4 — Signe d'un nombre

## Énoncé
Afficher « positif », « négatif » ou « nul » selon le nombre saisi.

## 1. Analyse
3 cas mutuellement exclusifs → structure **`Si … Sinon Si … Sinon`**.

> 🔑 **Point clé** : comme les 3 cas sont exclusifs (un nombre ne peut pas être à la fois positif et nul), on utilise `Sinon Si`. Dès qu'un test réussit, **les autres ne sont même pas évalués**. Avec trois `Si` indépendants, on ferait 3 tests à chaque fois : c'est correct mais inutilement coûteux.

## 2. Pseudocode

```
ALGORITHME SigneNombre

VARIABLES
    n : Réel

DÉBUT
    Écrire("Entrez un nombre : ")
    Lire(n)

    Si (n > 0) Alors
        Écrire("positif")
    Sinon Si (n < 0) Alors
        Écrire("négatif")
    Sinon
        Écrire("nul")
    FinSi
FIN
```

> Remarquez le dernier `Sinon` : **pas besoin de tester `n = 0`**. Si `n` n'est ni `> 0` ni `< 0`, il ne reste mathématiquement qu'une possibilité : `n = 0`. Écrire `Sinon Si (n = 0)` serait redondant (et, pire, laisserait croire qu'un 4e cas existe).

## 3. Organigramme

```
              ┌───────────┐
              │  Début    │
              └─────┬─────┘
        ┌───────────▼────────────┐
        │       Lire n           │
        └───────────┬────────────┘
                    │
          ┌─────────▼──────────┐
          │      n > 0  ?      │  ◄── losange
          └───┬────────────┬───┘
         Oui  │            │  Non
    ┌─────────▼──────┐     │
    │Écrire "positif"│     │
    └─────────┬──────┘     │
              │  ┌─────────▼──────────┐
              │  │      n < 0  ?      │  ◄── losange
              │  └───┬────────────┬───┘
              │ Oui  │            │  Non
              │ ┌────▼─────────┐ ┌▼──────────────┐
              │ │Écrire        │ │Écrire "nul"   │
              │ │   "négatif"  │ │               │
              │ └────┬─────────┘ └┬──────────────┘
              │      │            │
              └──────┴─────┬──────┘
                           │
                     ┌─────▼─────┐
                     │    Fin    │
                     └───────────┘
```

> Notez que les 3 branches **se rejoignent** avant `Fin` : c'est la marque d'une structure conditionnelle bien formée (une entrée, une sortie).

## 4. Traces (3 jeux d'essai — il en faut un par branche !)

**Cas 1 : `n = -7`**

| N° | Instruction | n | Test | Résultat | Écran |
|---|---|---|---|---|---|
| 1 | `Lire(n)` | **-7** | | | |
| 2 | `Si (n > 0)` | -7 | `-7 > 0` | **FAUX** → on saute | |
| 3 | `Sinon Si (n < 0)` | -7 | `-7 < 0` | **VRAI** | |
| 4 | `Écrire("négatif")` | -7 | | | `négatif` |
| 5 | *(on saute le Sinon)* | -7 | | | |

**Cas 2 : `n = 12`**

| N° | Instruction | n | Test | Résultat | Écran |
|---|---|---|---|---|---|
| 1 | `Lire(n)` | **12** | | | |
| 2 | `Si (n > 0)` | 12 | `12 > 0` | **VRAI** | |
| 3 | `Écrire("positif")` | 12 | | | `positif` |
| 4 | *(tout le reste est ignoré)* | 12 | | | |

**Cas 3 : `n = 0`**

| N° | Instruction | n | Test | Résultat | Écran |
|---|---|---|---|---|---|
| 1 | `Lire(n)` | **0** | | | |
| 2 | `Si (n > 0)` | 0 | `0 > 0` | FAUX | |
| 3 | `Sinon Si (n < 0)` | 0 | `0 < 0` | FAUX | |
| 4 | `Sinon → Écrire("nul")` | 0 | — | branche par défaut | `nul` |

## Pourquoi c'est optimal
**Au maximum 2 comparaisons**, et une seule dans le cas le plus fréquent (nombre positif). Impossible de faire mieux : avec une seule comparaison on ne peut distinguer que 2 cas, or il y en a 3.

---
---

# Exercice 5 — Le plus petit de trois nombres

## Énoncé
Afficher le plus petit de trois nombres saisis.

## 1. Analyse — la bonne stratégie

Beaucoup d'étudiants écrivent des conditions imbriquées géantes :

```
Si (a < b) ET (a < c) Alors ... Sinon Si (b < a) ET (b < c) Alors ...   ← lourd, 4+ tests
```

La méthode **du champion** est bien plus simple et se généralise à 10, 100 ou 1000 nombres :

> 🏆 **« Je suppose que le premier est le plus petit, puis je le défie avec chacun des autres. Si un challenger est plus petit, il devient le nouveau champion. »**

```
min ← a                   je pars du principe que a gagne
Si b < min Alors min ← b  b détrône a ?
Si c < min Alors min ← c  c détrône le champion actuel ?
```

## 2. Pseudocode

```
ALGORITHME PlusPetitDeTrois

VARIABLES
    a, b, c, min : Réel

DÉBUT
    Écrire("Entrez le 1er nombre : ")
    Lire(a)
    Écrire("Entrez le 2e nombre : ")
    Lire(b)
    Écrire("Entrez le 3e nombre : ")
    Lire(c)

    min ← a                     // hypothèse de départ

    Si (b < min) Alors
        min ← b
    FinSi

    Si (c < min) Alors
        min ← c
    FinSi

    Écrire("Le plus petit est : ", min)
FIN
```

> ⚠️ Ici les deux `Si` sont **indépendants** (pas de `Sinon Si`) : après avoir comparé `b`, il faut **de toute façon** comparer `c`. Ce n'est pas le même cas de figure qu'à l'exercice 4 où les cas s'excluaient.

## 3. Organigramme

```
              ┌───────────┐
              │  Début    │
              └─────┬─────┘
        ┌───────────▼────────────┐
        │     Lire a, b, c       │
        └───────────┬────────────┘
        ┌───────────▼────────────┐
        │       min ← a          │
        └───────────┬────────────┘
                    │
          ┌─────────▼──────────┐
          │     b < min  ?     │
          └───┬────────────┬───┘
         Oui  │            │ Non
       ┌──────▼──────┐     │
       │  min ← b    │     │
       └──────┬──────┘     │
              └─────┬──────┘
                    │
          ┌─────────▼──────────┐
          │     c < min  ?     │
          └───┬────────────┬───┘
         Oui  │            │ Non
       ┌──────▼──────┐     │
       │  min ← c    │     │
       └──────┬──────┘     │
              └─────┬──────┘
                    │
        ┌───────────▼────────────┐
        │     Écrire min         │
        └───────────┬────────────┘
              ┌─────▼─────┐
              │   Fin     │
              └───────────┘
```

## 4. Trace — `a = 12`, `b = 7`, `c = 9`

| N° | Instruction | a | b | c | min | Test | Commentaire |
|---|---|---|---|---|---|---|---|
| 0 | initial | ? | ? | ? | ? | | |
| 1 | `Lire(a,b,c)` | 12 | 7 | 9 | ? | | |
| 2 | `min ← a` | 12 | 7 | 9 | **12** | | champion provisoire = 12 |
| 3 | `Si b < min` | 12 | 7 | 9 | 12 | `7 < 12` → **VRAI** | 7 détrône 12 |
| 4 | `min ← b` | 12 | 7 | 9 | **7** | | nouveau champion = 7 |
| 5 | `Si c < min` | 12 | 7 | 9 | 7 | `9 < 7` → **FAUX** | 9 perd, on ne change rien |
| 6 | `Écrire(min)` | 12 | 7 | 9 | 7 | | affiche `7` ✓ |

**Deuxième trace — `a = 4`, `b = 15`, `c = 2`** (pour vérifier la branche « c gagne ») :

| N° | Instruction | min | Test | Commentaire |
|---|---|---|---|---|
| 2 | `min ← a` | **4** | | |
| 3 | `Si b < min` | 4 | `15 < 4` → FAUX | 15 perd |
| 5 | `Si c < min` | 4 | `2 < 4` → VRAI | |
| 6 | `min ← c` | **2** | | affiche `2` ✓ |

**Cas d'égalité — `a = 5, b = 5, c = 5`** : `5 < 5` est FAUX deux fois → `min` reste 5. ✓

## Pourquoi c'est optimal
- **Exactement 2 comparaisons**, toujours. C'est le minimum théorique démontré : trouver le minimum de *n* valeurs exige au moins **n − 1** comparaisons (chaque comparaison ne peut éliminer qu'un seul candidat ; il faut en éliminer 2).
- **Bonus : ça se généralise.** Pour 100 nombres, on garde exactement la même idée avec une boucle :
  ```
  min ← premier
  Pour chaque nombre suivant x Faire
      Si x < min Alors min ← x FinSi
  FinPour
  ```
  La version « conditions imbriquées » serait, elle, impossible à écrire.

---
---

# Exercice 6 — Catégorie d'un enfant

## Énoncé
| Catégorie | Âge |
|---|---|
| Poussin | 6 à 7 ans |
| Pupille | 8 à 9 ans |
| Minime | 10 à 11 ans |
| Cadet | 12 ans et plus |

## 1. Analyse — l'astuce de l'ordre croissant

Réflexe naïf : tester les deux bornes de chaque intervalle.

```
Si (age >= 6) ET (age <= 7) Alors ...      ← 2 conditions
Sinon Si (age >= 8) ET (age <= 9) Alors ... ← encore 2
```
C'est **juste**, mais 2× trop de conditions.

> 🔑 **L'astuce** : si je teste les intervalles **dans l'ordre croissant** avec des `Sinon Si`, alors quand j'arrive au 2e test **je sais déjà que `age > 7`** (sinon le 1er test aurait réussi). La borne inférieure est donc **garantie gratuitement** : une seule comparaison par catégorie suffit.

Il reste un cas que l'énoncé ne couvre pas : **un enfant de moins de 6 ans**. Un bon algorithme ne laisse **jamais** un cas sans réponse → on le traite en premier.

## 2. Pseudocode

```
ALGORITHME CategorieEnfant

VARIABLES
    age : Entier

DÉBUT
    Écrire("Quel est l'âge de l'enfant ? ")
    Lire(age)

    Si (age < 6) Alors
        Écrire("Trop jeune : aucune catégorie")
    Sinon Si (age <= 7) Alors
        Écrire("Poussin")
    Sinon Si (age <= 9) Alors
        Écrire("Pupille")
    Sinon Si (age <= 11) Alors
        Écrire("Minime")
    Sinon
        Écrire("Cadet")
    FinSi
FIN
```

**Pourquoi chaque test tient en une seule comparaison :**

| Test atteint | Ce que je sais déjà | Il me reste à vérifier |
|---|---|---|
| 1er | rien | `age < 6` |
| 2e | `age >= 6` | `age <= 7` → Poussin |
| 3e | `age >= 8` | `age <= 9` → Pupille |
| 4e | `age >= 10` | `age <= 11` → Minime |
| `Sinon` | `age >= 12` | rien → Cadet |

## 3. Organigramme

```
              ┌───────────┐
              │  Début    │
              └─────┬─────┘
        ┌───────────▼────────────┐
        │      Lire age          │
        └───────────┬────────────┘
          ┌─────────▼──────────┐
          │     age < 6  ?     │
          └───┬────────────┬───┘
          Oui │            │ Non
   ┌──────────▼────────┐   │
   │Écrire "Trop jeune"│   │
   └──────────┬────────┘   │
              │  ┌─────────▼──────────┐
              │  │     age <= 7  ?    │
              │  └───┬────────────┬───┘
              │  Oui │            │ Non
              │ ┌────▼─────────┐  │
              │ │Écrire        │  │
              │ │   "Poussin"  │  │
              │ └────┬─────────┘  │
              │      │  ┌─────────▼──────────┐
              │      │  │     age <= 9  ?    │
              │      │  └───┬────────────┬───┘
              │      │  Oui │            │ Non
              │      │ ┌────▼─────────┐  │
              │      │ │Écrire        │  │
              │      │ │   "Pupille"  │  │
              │      │ └────┬─────────┘  │
              │      │      │  ┌─────────▼──────────┐
              │      │      │  │    age <= 11  ?    │
              │      │      │  └───┬────────────┬───┘
              │      │      │  Oui │            │ Non
              │      │      │ ┌────▼────────┐ ┌─▼────────────┐
              │      │      │ │Écrire       │ │Écrire        │
              │      │      │ │   "Minime"  │ │   "Cadet"    │
              │      │      │ └────┬────────┘ └─┬────────────┘
              │      │      │      │            │
              └──────┴──────┴──────┴──────┬─────┘
                                          │
                                    ┌─────▼─────┐
                                    │    Fin    │
                                    └───────────┘
```

## 4. Traces (une par catégorie)

**Cas `age = 9` :**

| N° | Test | Évaluation | Suite |
|---|---|---|---|
| 1 | `age < 6` | `9 < 6` → **FAUX** | on continue |
| 2 | `age <= 7` | `9 <= 7` → **FAUX** | on continue (donc age ≥ 8) |
| 3 | `age <= 9` | `9 <= 9` → **VRAI** | ✅ `Pupille` |
| — | *(le reste est ignoré)* | | |

**Cas `age = 4` :**

| N° | Test | Évaluation | Suite |
|---|---|---|---|
| 1 | `age < 6` | `4 < 6` → **VRAI** | ✅ `Trop jeune : aucune catégorie` |

**Cas `age = 15` :**

| N° | Test | Évaluation | Suite |
|---|---|---|---|
| 1 | `age < 6` | FAUX | |
| 2 | `age <= 7` | FAUX | |
| 3 | `age <= 9` | FAUX | |
| 4 | `age <= 11` | FAUX | donc age ≥ 12 |
| 5 | `Sinon` | branche par défaut | ✅ `Cadet` |

**Tableau récapitulatif des tests de validation (à mettre dans votre rapport) :**

| âge testé | attendu | obtenu |
|---|---|---|
| 4 | aucune catégorie | aucune catégorie ✓ |
| 5 | aucune catégorie | aucune catégorie ✓ |
| 6 | Poussin | Poussin ✓ |
| 7 | Poussin | Poussin ✓ |
| 8 | Pupille | Pupille ✓ |
| 9 | Pupille | Pupille ✓ |
| 10 | Minime | Minime ✓ |
| 11 | Minime | Minime ✓ |
| 12 | Cadet | Cadet ✓ |
| 20 | Cadet | Cadet ✓ |

> 💡 **Méthode de test** : on teste toujours **les bornes** (6, 7, 8, 9, 10, 11, 12) et non des valeurs au hasard. 90 % des bugs de ce type d'algorithme sont des erreurs de `<` au lieu de `<=` — et elles n'apparaissent **que** sur les bornes.

## Pourquoi c'est optimal
- **1 seule comparaison par test**, 4 au maximum (au lieu de 8 avec la version « ET »).
- Grâce aux `Sinon Si`, dès qu'une catégorie est trouvée, **aucun autre test n'est évalué**.
- **Aucun cas orphelin** : tout âge possible, de 0 à 120, reçoit une réponse.

---
---

# Synthèse : les 3 structures vues dans cet atelier

| Structure | Forme | Exercices |
|---|---|---|
| **Séquence** — les instructions s'exécutent l'une après l'autre, de haut en bas | `instr1 ; instr2 ; instr3` | 1, 2, 3 |
| **Alternative simple** — on fait quelque chose *seulement si* une condition est vraie | `Si … Alors … FinSi` | 5 |
| **Alternative multiple** — on choisit *une seule* branche parmi plusieurs | `Si … Sinon Si … Sinon … FinSi` | 4, 6 |

## Les 5 réflexes à retenir

1. **Toujours identifier Entrées / Traitement / Sorties avant d'écrire une ligne.**
2. **Une affectation écrase** : avant d'écraser, sauvegarder (exercice 2).
3. **Cas exclusifs → `Sinon Si`** ; cas indépendants → plusieurs `Si` (comparer ex. 4 et ex. 5).
4. **Ordonner les tests** permet de supprimer la moitié des conditions (exercice 6).
5. **Tester aux bornes**, jamais au hasard, et faire une trace écrite pour chaque branche.
