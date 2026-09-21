# -*- coding: utf-8 -*-
"""
BIN1000 - Atelier 01 : traduction en Python des 6 algorithmes.

Chaque fonction suit LIGNE PAR LIGNE le pseudocode du fichier
atelier-01-algorithme.md, pour qu'on puisse verifier les traces.

Lancer :  python3 atelier01.py          -> execute toutes les traces
          python3 atelier01.py --saisie -> version interactive (vraies saisies)
"""

import sys


# --------------------------------------------------------------------------
# Exercice 1 : surface d'un rectangle
# --------------------------------------------------------------------------
def surface_rectangle(longueur, largeur):
    surface = longueur * largeur          # surface <- longueur * largeur
    return surface


# --------------------------------------------------------------------------
# Exercice 2 : permutation circulaire A->B, B->C, C->A
# --------------------------------------------------------------------------
def permutation_circulaire(a, b, c):
    temp = c                              # 1. sauvegarde de C
    c = b                                 # 2. B passe dans C
    b = a                                 # 3. A passe dans B
    a = temp                              # 4. l'ancien C passe dans A
    return a, b, c


def permutation_fausse(a, b, c):
    """Version SANS variable temporaire : sert a montrer le bug."""
    b = a
    c = b
    a = c
    return a, b, c


# --------------------------------------------------------------------------
# Exercice 3 : prix TTC
# --------------------------------------------------------------------------
def prix_ttc(prix_ht, quantite, taux):
    total_ht = prix_ht * quantite         # total_HT <- prixHT * quantite
    taxes = total_ht * taux / 100         # taxes    <- total_HT * taux / 100
    total_ttc = total_ht + taxes          # total_TTC<- total_HT + taxes
    return total_ht, taxes, total_ttc


# --------------------------------------------------------------------------
# Exercice 4 : signe d'un nombre
# --------------------------------------------------------------------------
def signe(n):
    if n > 0:
        return "positif"
    elif n < 0:
        return "negatif"
    else:
        return "nul"


# --------------------------------------------------------------------------
# Exercice 5 : le plus petit de trois nombres
# --------------------------------------------------------------------------
def plus_petit(a, b, c):
    mini = a                              # hypothese : a est le plus petit
    if b < mini:                          # b detrone-t-il le champion ?
        mini = b
    if c < mini:                          # c detrone-t-il le champion ?
        mini = c
    return mini


# --------------------------------------------------------------------------
# Exercice 6 : categorie d'un enfant
# --------------------------------------------------------------------------
def categorie(age):
    if age < 6:
        return "Trop jeune : aucune categorie"
    elif age <= 7:
        return "Poussin"
    elif age <= 9:
        return "Pupille"
    elif age <= 11:
        return "Minime"
    else:
        return "Cadet"


# --------------------------------------------------------------------------
# Verification des traces du document
# --------------------------------------------------------------------------
def titre(t):
    print()
    print("=" * 62)
    print(t)
    print("=" * 62)


def demo():
    titre("Ex.1 - Surface d'un rectangle")
    print("  longueur=5, largeur=3  ->  surface =", surface_rectangle(5, 3))
    print("  longueur=2.5, largeur=4 ->  surface =", surface_rectangle(2.5, 4))

    titre("Ex.2 - Permutation circulaire")
    for jeu in [(10, 20, 30), (7, 7, 7), (-1, 0, 5)]:
        a, b, c = jeu
        na, nb, nc = permutation_circulaire(a, b, c)
        ok = (nb == a and nc == b and na == c)
        print("  AVANT A=%-4s B=%-4s C=%-4s   ->   APRES A=%-4s B=%-4s C=%-4s   %s"
              % (a, b, c, na, nb, nc, "OK" if ok else "ECHEC"))
    a, b, c = permutation_fausse(10, 20, 30)
    print("  Version FAUSSE (sans temp) : A=%s B=%s C=%s  <- tout est ecrase !" % (a, b, c))

    titre("Ex.3 - Prix TTC")
    ht, tx, ttc = prix_ttc(1000, 3, 18)
    print("  prixHT=1000, quantite=3, taux=18%")
    print("     Total HT  : %.2f" % ht)
    print("     Taxes     : %.2f" % tx)
    print("     TOTAL TTC : %.2f" % ttc)

    titre("Ex.4 - Signe d'un nombre")
    for n in [-7, 12, 0, -0.5, 3.14]:
        print("  n = %-6s  ->  %s" % (n, signe(n)))

    titre("Ex.5 - Le plus petit de trois nombres")
    for jeu in [(12, 7, 9), (4, 15, 2), (5, 5, 5), (-3, -8, -1)]:
        a, b, c = jeu
        resultat = plus_petit(a, b, c)
        print("  a=%-4s b=%-4s c=%-4s  ->  min = %-4s   %s"
              % (a, b, c, resultat, "OK" if resultat == min(a, b, c) else "ECHEC"))

    titre("Ex.6 - Categorie d'un enfant (test des bornes)")
    attendu = {4: "Trop jeune : aucune categorie", 5: "Trop jeune : aucune categorie",
               6: "Poussin", 7: "Poussin", 8: "Pupille", 9: "Pupille",
               10: "Minime", 11: "Minime", 12: "Cadet", 20: "Cadet"}
    for age in sorted(attendu):
        obtenu = categorie(age)
        print("  age = %-3d ->  %-32s %s"
              % (age, obtenu, "OK" if obtenu == attendu[age] else "ECHEC"))


def saisie():
    """Version interactive, fidele au pseudocode (Lire / Ecrire)."""
    titre("Ex.1 - Surface d'un rectangle")
    L = float(input("  Entrez la longueur : "))
    l = float(input("  Entrez la largeur  : "))
    print("  La surface est :", surface_rectangle(L, l))

    titre("Ex.3 - Prix TTC")
    p = float(input("  Prix hors taxes  : "))
    q = int(input("  Quantite         : "))
    t = float(input("  Taux de taxe (%) : "))
    ht, tx, ttc = prix_ttc(p, q, t)
    print("  Total HT  : %.2f" % ht)
    print("  Taxes     : %.2f" % tx)
    print("  TOTAL TTC : %.2f" % ttc)

    titre("Ex.4 - Signe")
    print(" ", signe(float(input("  Entrez un nombre : "))))

    titre("Ex.5 - Plus petit de trois")
    a = float(input("  1er nombre : "))
    b = float(input("  2e  nombre : "))
    c = float(input("  3e  nombre : "))
    print("  Le plus petit est :", plus_petit(a, b, c))

    titre("Ex.6 - Categorie")
    print(" ", categorie(int(input("  Age de l'enfant : "))))


if __name__ == "__main__":
    if "--saisie" in sys.argv:
        saisie()
    else:
        demo()
