# Refund Helper

Application React entièrement statique qui remplit le formulaire officiel de remboursement de l’AGEG, ajoute les factures à sa suite et télécharge un PDF unique. Les fichiers sont traités uniquement dans le navigateur.

## Installation et développement

Prérequis : Node.js 22 ou plus récent.

```bash
npm install
npm run dev
```

Vite affiche l’adresse locale. Pour produire et vérifier la version de production :

```bash
npm test
npm run build
npm run preview
```

Le build est écrit dans `dist/`. La propriété `base: './'` de `vite.config.ts` rend les ressources compatibles avec un sous-répertoire GitHub Pages.

## Modèle PDF officiel

Le modèle se trouve dans `public/assets/Remboursement Achat.pdf`. Il doit conserver ce nom et cet emplacement. L’application ne recrée pas le formulaire : `pdf-lib` charge ce fichier et dessine les réponses sur sa page originale de 612 × 792 points.

Les placements sont regroupés dans `src/pdf/fieldCoordinates.ts`. Les coordonnées `x` et `y` de pdf-lib partent du coin inférieur gauche.

L’utilisateur peut aussi téléverser son propre modèle PDF depuis l’application. Les réponses sont dessinées sur sa première page avec les mêmes coordonnées que le modèle officiel. Dans un modèle de plusieurs pages, les pages suivantes restent dans leur ordre original. Les factures ajoutées sont ensuite placées après la dernière page du modèle téléversé. Le modèle personnalisé est temporaire et reste uniquement en mémoire dans le navigateur.

## Calibration des coordonnées

Ouvrez l’application avec `?debugPdf=1`, par exemple :

```text
http://localhost:5173/?debugPdf=1
```

Le mode développeur affiche une grille, les rectangles et noms de tous les champs. En cliquant sur le document, la coordonnée PDF apparaît et est copiée dans le presse-papiers. Une croix rouge marque le dernier clic. Le bouton « Générer le PDF de calibration » dessine aussi les rectangles et libellés directement dans un PDF, ce qui permet de comparer le résultat au modèle. Corrigez ensuite uniquement les valeurs de `fieldCoordinates.ts`.

## Factures

Formats directs : PDF, JPG/JPEG, PNG et WebP. Toutes les pages d’un PDF sont conservées. Les images sont tournées selon le réglage choisi, redimensionnées sans découpe et centrées sur une page lettre.

Le DOCX est pris en charge de façon approximative avec Mammoth et html2canvas. La conversion peut modifier les polices, sauts de page et tableaux; exportez en PDF avant l’ajout lorsqu’une mise en page fidèle est importante. Les anciens fichiers `.doc` ne sont pas acceptés.

Limites configurées dans `src/utils/fileUtils.ts` : 20 fichiers, 50 Mo par fichier et 150 Mo au total. Le traitement de gros documents peut demander beaucoup de mémoire.

## Confidentialité et mémorisation

Aucun backend, service externe, outil d’analyse ou CDN n’est utilisé. Les données et factures ne quittent pas le navigateur. Seuls les champs réutilisables indiqués dans `src/storage/savedFields.ts` peuvent être stockés dans `localStorage`, lorsque l’option de mémorisation est cochée. Montant, description détaillée, dates, factures et signatures ne sont jamais mémorisés automatiquement.

## Publication GitHub Pages

Dans les paramètres GitHub du dépôt, choisissez **Settings → Pages → Source: GitHub Actions**. Le workflow `.github/workflows/deploy.yml` exécute les tests, construit l’application et publie `dist` à chaque poussée sur `main`. Aucun nom de dépôt n’a besoin d’être codé dans la configuration Vite.

## Navigateurs

Les versions récentes de Chrome, Edge, Firefox et Safari sont supportées. La mémoire disponible du navigateur limite la taille pratique des fichiers. Le presse-papiers du mode calibration peut demander une origine sécurisée (HTTPS ou localhost).

## Procédure de test manuel

1. Démarrer avec `npm run dev` et confirmer que le formulaire officiel apparaît dans l’aperçu.
2. Remplir tous les champs avec accents, un montant avec virgule et une adresse courriel complète; vérifier qu’aucun double domaine n’apparaît.
3. Essayer de générer sans facture et vérifier les erreurs près des champs.
4. Ajouter plusieurs PDF et images, les réordonner, les tourner et en supprimer une.
5. Ajouter un DOCX et confirmer l’avertissement de conversion approximative.
6. Téléverser un modèle PDF de plusieurs pages; vérifier que la première page est remplie, que ses autres pages sont conservées et que toutes les pages des factures suivent dans le bon ordre.
7. Retirer le modèle personnalisé, générer le document et vérifier le nom `Remboursement_Groupe_YYYY-MM-DD.pdf` ainsi que le retour au modèle officiel.
8. Recharger la page; vérifier que seuls les champs autorisés ont été retenus. Effacer les informations mémorisées et recharger de nouveau.
9. Tester à largeur téléphone, au clavier et avec un lecteur d’écran si disponible.
10. Ouvrir `?debugPdf=1`, cliquer sur plusieurs lignes, afficher/masquer les rectangles et produire le PDF de calibration.
11. Exécuter `npm test` et `npm run build` avant publication.
