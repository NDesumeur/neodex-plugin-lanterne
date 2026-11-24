# Lanterne

Un jeu de vol sans fin dans le noir : une petite voyageuse traverse une grotte avec sa lanterne. La flamme baisse sans arrêt ; ramasse les fioles d'huile pour la raviver, et évite la roche, les stalactites et les chauves-souris. Va le plus loin possible.

*English version: [README.en.md](README.en.md)*

## Ombres et braseros (nouveau en 1.2.0)

- La lumière devient une vraie ressource : au-delà de 150 m, des **ombres** sortent du noir et viennent vers toi. Elles fondent dans ta lumière, d'autant plus vite que la flamme est grande ; si l'une t'atteint, elle **vole de l'huile**.
- Des **braseros** au sol, tous les 250 à 400 m : ils s'allument quand tu passes tout près, ou de loin avec l'**éclat**. Allumés, ils éclairent la grotte autour d'eux et ravivent la flamme quand tu passes devant.

## Commandes

- Maintiens **Espace**, **clic** ou **↑** pour monter ; relâche pour redescendre.
- **X** ou **clic droit** : **éclat de lumière**. Il coûte de l'huile mais fait fuir les chauves-souris proches.
- **P** : pause.

- **Plein écran** : le bouton du même nom ; Échap pour en sortir. Hors plein écran, le jeu prend toute la place que laisse la fenêtre.
- **Musique : oui / non** : la musique d'ambiance, différente dans chaque zone.

## Règles

- La voyageuse avance toute seule ; tu ne règles que sa hauteur, entre le plafond et le sol de la grotte.
- La **flamme** baisse toute seule, et la lanterne n'éclaire qu'autour d'elle. Les **fioles d'huile** la ravivent ; elles scintillent un peu dans le noir pour qu'on les repère.
- Un **feu de camp** tous les 1000 m remplit entièrement la lanterne.
- Ramasse aussi les **cristaux**, qui brillent dans l'ombre.
- La partie s'arrête si la flamme s'éteint, si tu touches la roche, une stalactite qui tombe ou une chauve-souris.

## Les zones

Tous les 500 m, la grotte change : **la grotte**, **la mine de cristal**, **le lac souterrain** puis **le cœur de lave**, chacune avec ses dangers (stalactites qui tombent, gouttes qui affaiblissent la flamme, chauves-souris plus nombreuses…).

## Créatures et musique des zones

- **La mine de cristal** : des **araignées** descendent du plafond au bout de leur fil et s'y balancent.
- **Le lac souterrain** : des **poissons** sautent hors de l'eau quand tu approches (des ronds dans l'eau les annoncent).
- **Le cœur de lave** : des **feux follets** flottent vers toi, lentement, à travers la roche.
- Les toucher éteint la partie ; l'**éclat de lumière** les fait fuir comme les chauves-souris. Leurs yeux et les feux follets se voient dans le noir.
- Chaque zone a sa **musique** : une note grave qui tient et des notes au hasard dans sa gamme, lente dans la grotte, cristalline avec écho dans la mine, longue au lac, pressée dans la lave. Elle se tait en pause.

## Lanternes

Les **cristaux** ramassés au fil des parties débloquent de nouvelles lanternes, à choisir avant de partir :

| Lanterne | Cristaux | Ce qu'elle change |
| --- | --- | --- |
| Cuivre | — | Celle du départ. |
| Verre | 120 | Plus d'huile (108) et elle brûle 10 % moins vite. |
| Phare | 350 | Éclat bien plus large (140 px) et moins cher (13 d'huile). |
| Or | 800 | Le plus d'huile (122), brûle 20 % moins vite, grand éclat. |

La voyageuse tient sa lanterne au bout du bras ; elle se balance quand tu montes ou descends, et ses montants prennent la couleur de la lanterne choisie.

## Statistiques

Après chaque partie : la distance, les fioles et les cristaux ramassés. Le panneau Records garde ta **plus longue distance**, le nombre de **parties**, le total de **fioles**, de **cristaux** et la **distance totale**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Lanterne → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
