# 🎭 Playwright — Chapitre 11

# 11 - Build Excel Utils and Drive Uploads & Downloads Using Playwright

> **ExcelJS + Playwright : lire, modifier, télécharger, uploader et valider des fichiers Excel dans un test end-to-end.**

---

## 📌 À propos de ce chapitre

Ce chapitre montre comment intégrer la manipulation de fichiers **Excel** dans des tests automatisés avec **Playwright** grâce au module Node.js **ExcelJS**.

L'objectif est de construire un scénario complet permettant de :

* télécharger un fichier Excel depuis une application web ;
* lire son contenu avec ExcelJS ;
* parcourir les lignes et les colonnes ;
* rechercher une valeur dans une cellule ;
* récupérer la position d'une cellule ;
* modifier une valeur ;
* sauvegarder le fichier Excel ;
* uploader le fichier modifié dans l'application ;
* vérifier que la modification est correctement prise en compte dans l'interface.

Le chapitre aboutit donc à un véritable scénario **end-to-end** :

```text
Application Web
      │
      ▼
Download Excel
      │
      ▼
Read Excel with ExcelJS
      │
      ▼
Search for a value
      │
      ▼
Update Excel
      │
      ▼
Save Excel
      │
      ▼
Upload Excel
      │
      ▼
Validate UI
```

---

# 📚 Sommaire

1. [Introduction à ExcelJS et configuration du projet](#1--introduction-à-exceljs-et-configuration-du-projet)
2. [Parcourir les lignes et colonnes d'un fichier Excel](#2--parcourir-les-lignes-et-colonnes-dun-fichier-excel)
3. [Créer des fonctions utilitaires pour lire et modifier Excel](#3--créer-des-fonctions-utilitaires-pour-lire-et-modifier-excel)
4. [Rechercher et modifier une donnée selon un critère](#4--rechercher-et-modifier-une-donnée-selon-un-critère)
5. [Gérer les téléchargements et uploads avec Playwright](#5--gérer-les-téléchargements-et-uploads-avec-playwright)
6. [Exemple end-to-end complet](#6--exemple-end-to-end-complet)
7. [Bonnes pratiques](#7--bonnes-pratiques)
8. [Pièges courants](#8--pièges-courants)
9. [Exercices](#9--exercices)
10. [Cheat Sheet](#10--cheat-sheet)
11. [Checklist](#11--checklist)
12. [Conclusion](#12--conclusion)

---

# 🎯 Objectifs pédagogiques

À la fin de ce chapitre, vous devez être capable de :

* installer et utiliser **ExcelJS** ;
* créer et manipuler un `Workbook` ;
* charger un fichier `.xlsx` ;
* récupérer une feuille Excel ;
* parcourir les lignes et les cellules ;
* identifier une cellule à partir de sa valeur ;
* récupérer ses coordonnées ;
* modifier une cellule ;
* sauvegarder un nouveau fichier Excel ;
* écraser un fichier existant si nécessaire ;
* attendre un téléchargement avec Playwright ;
* récupérer le fichier téléchargé ;
* uploader un fichier avec `setInputFiles()` ;
* vérifier que les données Excel sont correctement affichées dans l'application.

---

# 1 - Introduction à ExcelJS et configuration du projet

## 🔗 Application utilisée

Le chapitre utilise la page de démonstration :

[RS Web Table Automation Page](https://rahulshettyacademy.com/upload-download-test/index.html)

Cette page permet notamment de tester :

* le téléchargement d'un fichier Excel ;
* la modification du fichier ;
* l'upload du fichier ;
* la validation des données.

---

## 📦 Qu'est-ce qu'ExcelJS ?

**ExcelJS** est un module Node.js permettant de manipuler des fichiers Excel `.xlsx` avec JavaScript.

Il permet notamment de :

* lire des fichiers Excel ;
* créer des fichiers Excel ;
* parcourir des feuilles ;
* lire et modifier des cellules ;
* sauvegarder les modifications.

---

## ⚙️ Installation

Initialiser un projet Node.js :

```bash
npm init
```

Puis installer ExcelJS :

```bash
npm install exceljs
```

Après l'installation, le dossier suivant apparaît dans le projet :

```text
node_modules/
```

---

## 📁 Exemple de structure

On peut par exemple avoir :

```text
project/
│
├── node_modules/
├── exceldownload.xlsx
├── excelDemo.js
├── package.json
└── package-lock.json
```

Le fichier Excel `exceldownload.xlsx` est ensuite utilisé comme fichier de démonstration.

---

## Importer ExcelJS

Avec CommonJS :

```js
const ExcelJS = require('exceljs');
```

On peut ensuite créer un objet `Workbook` :

```js
const workbook = new ExcelJS.Workbook();
```

---

# 2 - Parcourir les lignes et colonnes d'un fichier Excel

La première étape consiste à charger le fichier Excel et à parcourir son contenu.

## 📄 Exemple

```js
const ExcelJS = require('exceljs');

async function excelTest() {

    // Create a workbook
    const workbook = new ExcelJS.Workbook();

    // Read the Excel file
    await workbook.xlsx.readFile("./exceldownload.xlsx");

    // Get the worksheet
    const worksheet = workbook.getWorksheet("Sheet1");

    // Print all rows and cells
    worksheet.eachRow((row, rowNumber) => {

        row.eachCell((cell, colNumber) => {

            console.log(cell.value);

        });

    });
}

excelTest();
```

---

## 🔎 Décomposition

### 1. Créer le Workbook

```js
const workbook = new ExcelJS.Workbook();
```

Le `Workbook` représente le fichier Excel chargé en mémoire.

---

### 2. Lire le fichier

```js
await workbook.xlsx.readFile("./exceldownload.xlsx");
```

On indique ici le chemin du fichier Excel à lire.

---

### 3. Récupérer une feuille

```js
const worksheet = workbook.getWorksheet("Sheet1");
```

On récupère la feuille appelée :

```text
Sheet1
```

---

### 4. Parcourir les lignes

```js
worksheet.eachRow((row, rowNumber) => {
    // ...
});
```

`eachRow()` permet d'itérer sur les différentes lignes de la feuille.

---

### 5. Parcourir les cellules

```js
row.eachCell((cell, colNumber) => {
    console.log(cell.value);
});
```

Pour chaque ligne, on parcourt ensuite les cellules.

La valeur d'une cellule est accessible avec :

```js
cell.value
```

---

## 🧠 Structure logique

```text
Workbook
   │
   └── Worksheet
          │
          ├── Row 1
          │     ├── Cell 1
          │     ├── Cell 2
          │     └── Cell 3
          │
          ├── Row 2
          │     ├── Cell 1
          │     ├── Cell 2
          │     └── Cell 3
          │
          └── ...
```

---

# 3 - Créer des fonctions utilitaires pour lire et modifier Excel

Maintenant que nous savons parcourir un fichier Excel, nous pouvons construire un utilitaire permettant de rechercher une valeur.

### 🎯 Objectif

Supposons que le fichier contient :

```text
Orange     Apple     Mango
Banana     Kiwi      Ananas
```

Nous voulons :

1. rechercher `Apple` ;
2. trouver sa position ;
3. récupérer son numéro de ligne ;
4. récupérer son numéro de colonne ;
5. remplacer `Apple` par `Ananas`.

---

## 🔍 Rechercher la cellule

```js
const ExcelJS = require('exceljs');

async function excelTest() {

    let output = {
        row: -1,
        column: -1
    };

    // Create a workbook
    const workbook = new ExcelJS.Workbook();

    // Read the Excel file
    await workbook.xlsx.readFile("./exceldownload.xlsx");

    // Get the worksheet
    const worksheet = workbook.getWorksheet("Sheet1");

    // Search for Apple
    worksheet.eachRow((row, rowNumber) => {

        row.eachCell((cell, colNumber) => {

            if (cell.value === "Apple") {

                output.row = rowNumber;
                output.column = colNumber;

            }

        });

    });

    console.log(output);
}

excelTest();
```

---

## 📍 Résultat

Si `Apple` se trouve en :

* ligne `3`
* colonne `2`

on obtient :

```js
{
    row: 3,
    column: 2
}
```

La structure :

```js
{
    row: -1,
    column: -1
}
```

sert à indiquer que la cellule n'a pas encore été trouvée.

---

## ✏️ Modifier la cellule

Une fois les coordonnées récupérées :

```js
const cell = worksheet.getCell(output.row, output.column);

cell.value = "Ananas";
```

On récupère donc la cellule grâce à :

```js
worksheet.getCell(row, column)
```

Puis on modifie sa valeur :

```js
cell.value = "Ananas";
```

---

## 💾 Sauvegarder le fichier

Pour créer un nouveau fichier :

```js
await workbook.xlsx.writeFile("./newexcel.xlsx");
```

Le fichier original :

```text
exceldownload.xlsx
```

reste inchangé et un nouveau fichier est créé :

```text
newexcel.xlsx
```

---

# 4 - Rechercher et modifier une donnée selon un critère

Il est préférable de séparer les responsabilités dans des fonctions utilitaires.

Nous allons créer :

```text
readExcel()
```

pour rechercher une cellule, puis :

```text
writeExcel()
```

pour effectuer la modification.

---

## 🔎 Fonction `readExcel()`

```js
async function readExcel(worksheet, searchText) {

    let output = {
        row: -1,
        column: -1
    };

    worksheet.eachRow((row, rowNumber) => {

        row.eachCell((cell, colNumber) => {

            if (cell.value === searchText) {

                output.row = rowNumber;
                output.column = colNumber;

            }

        });

    });

    return output;
}
```

Cette fonction reçoit :

```text
worksheet
searchText
```

et retourne :

```js
{
    row: ...,
    column: ...
}
```

---

## ✏️ Fonction `writeExcel()`

```js
const ExcelJS = require('exceljs');

async function writeExcel(
    searchText,
    replaceText,
    inputFilePath,
    outputFilePath
) {

    // Create a workbook
    const workbook = new ExcelJS.Workbook();

    // Read the Excel file
    await workbook.xlsx.readFile(inputFilePath);

    // Get the worksheet
    const worksheet = workbook.getWorksheet("Sheet1");

    // Find the cell
    const output = await readExcel(worksheet, searchText);

    // Check whether the text was found
    if (output.row === -1) {

        throw new Error(
            `"${searchText}" was not found in Sheet1`
        );

    }

    // Get the cell
    const cell = worksheet.getCell(
        output.row,
        output.column
    );

    // Replace the value
    cell.value = replaceText;

    // Save the modified workbook
    await workbook.xlsx.writeFile(outputFilePath);
}
```

---

## ▶️ Utilisation

```js
writeExcel(
    "Apple",
    "Ananas",
    "./exceldownload.xlsx",
    "./newexcel.xlsx"
);
```

Le workflow est :

```text
Apple
  │
  ▼
Recherche dans Excel
  │
  ▼
Coordonnées de la cellule
  │
  ▼
Modification
  │
  ▼
Ananas
  │
  ▼
newexcel.xlsx
```

---

## ♻️ Écraser le fichier existant

L'utilitaire peut également être utilisé pour modifier directement le fichier original.

Il suffit de fournir le même chemin en entrée et en sortie :

```js
writeExcel(
    "Apple",
    "Ananas",
    "./exceldownload.xlsx",
    "./exceldownload.xlsx"
);
```

Dans ce cas :

```text
inputFilePath
      │
      ▼
exceldownload.xlsx
      │
      ▼
Modification
      │
      ▼
outputFilePath
      │
      ▼
exceldownload.xlsx
```

⚠️ Cette approche écrase le fichier existant. Il faut donc l'utiliser avec précaution.

---

# 5 - Gérer les téléchargements et uploads avec Playwright

Nous pouvons maintenant connecter **ExcelJS** à **Playwright**.

L'objectif est de réaliser le workflow suivant :

```text
1. Ouvrir l'application
        ↓
2. Télécharger Excel
        ↓
3. Récupérer le fichier
        ↓
4. Modifier Excel avec ExcelJS
        ↓
5. Sauvegarder le fichier
        ↓
6. Uploader le fichier
        ↓
7. Vérifier le résultat
```

---

## 📥 Télécharger un fichier avec Playwright

Pour attendre un téléchargement, on écoute l'événement :

```js
page.waitForEvent('download')
```

Exemple :

```js
const download = page.waitForEvent('download');

await page.getByRole('button', {
    name: 'Download'
}).click();

const dl = await download;
```

---

## Pourquoi attendre le téléchargement avant de cliquer ?

Le `waitForEvent()` doit être préparé **avant** l'action susceptible de déclencher le téléchargement.

```js
const download = page.waitForEvent('download');

await page.getByRole('button', {
    name: 'Download'
}).click();

const dl = await download;
```

Cela permet d'éviter de manquer l'événement de téléchargement.

---

## 📂 Récupérer le fichier téléchargé

Dans le scénario présenté, on peut utiliser un chemin de fichier connu :

```js
const filePath = '/Users/alex/downloads/download.xlsx';
```

Ou exploiter le téléchargement Playwright pour obtenir des informations sur le fichier.

Dans un projet réel, il est préférable de centraliser la gestion des chemins de fichiers plutôt que de coder en dur un chemin spécifique à une machine.

---

# 6 - Exemple end-to-end complet

Nous allons maintenant combiner :

* Playwright ;
* ExcelJS ;
* téléchargement ;
* modification Excel ;
* upload ;
* assertions.

---

## 🎯 Scénario

Nous allons :

1. ouvrir la page ;
2. télécharger le fichier Excel ;
3. rechercher `Mango` ;
4. remplacer sa valeur par `350` ;
5. sauvegarder le fichier ;
6. uploader le fichier ;
7. vérifier que `Mango` contient bien `350`.

---

## 🧪 Code complet

```js
const ExcelJS = require('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcel(
    searchText,
    replaceText,
    inputFilePath,
    outputFilePath
) {

    // Create a workbook
    const workbook = new ExcelJS.Workbook();

    // Read the Excel file
    await workbook.xlsx.readFile(inputFilePath);

    // Get the worksheet
    const worksheet = workbook.getWorksheet("Sheet1");

    // Find the cell
    const output = readExcel(
        worksheet,
        searchText
    );

    // Check whether the text was found
    if (output.row === -1) {

        throw new Error(
            `"${searchText}" was not found in Sheet1`
        );

    }

    // Get the cell
    const cell = worksheet.getCell(
        output.row,
        output.column
    );

    // Replace the value
    cell.value = replaceText;

    // Save the modified workbook
    await workbook.xlsx.writeFile(outputFilePath);
}

function readExcel(worksheet, searchText) {

    let output = {
        row: -1,
        column: -1
    };

    worksheet.eachRow((row, rowNumber) => {

        row.eachCell((cell, colNumber) => {

            if (cell.value === searchText) {

                output.row = rowNumber;
                output.column = colNumber;

            }

        });

    });

    return output;
}

test('Upload download excel validation', async ({ page }) => {

    const textSearch = 'Mango';
    const updateValue = '350';

    await page.goto(
        'https://rahulshettyacademy.com/upload-download-test/index.html'
    );

    // Wait for the download
    const downloadPromise = page.waitForEvent('download');

    // Start the download
    await page.getByRole('button', {
        name: 'Download'
    }).click();

    // Retrieve the download
    const download = await downloadPromise;

    // File path used by the test
    const filePath = '/Users/alex/downloads/download.xlsx';

    // Update Excel before uploading it
    await writeExcel(
        textSearch,
        updateValue,
        filePath,
        filePath
    );

    // Upload the modified Excel file
    await page.locator('#fileinput').setInputFiles(filePath);

    // Locate the row containing Mango
    const desiredRow = page.getByRole('row').filter({
        has: page.getByText(textSearch)
    });

    // Validate the updated value
    await expect(
        desiredRow.locator('#cell-4-undefined')
    ).toContainText(updateValue);
});
```

---

# 🔍 Décomposition du scénario

## Étape 1 — Naviguer vers l'application

```js
await page.goto(
    'https://rahulshettyacademy.com/upload-download-test/index.html'
);
```

---

## Étape 2 — Attendre le téléchargement

```js
const downloadPromise = page.waitForEvent('download');
```

---

## Étape 3 — Cliquer sur Download

```js
await page.getByRole('button', {
    name: 'Download'
}).click();
```

---

## Étape 4 — Récupérer le téléchargement

```js
const download = await downloadPromise;
```

Le test sait maintenant qu'un téléchargement a été déclenché et peut exploiter l'objet `Download`.

---

## Étape 5 — Modifier Excel

```js
await writeExcel(
    textSearch,
    updateValue,
    filePath,
    filePath
);
```

Dans notre exemple :

```text
Mango → 350
```

---

## Étape 6 — Uploader le fichier

```js
await page.locator('#fileinput')
    .setInputFiles(filePath);
```

Playwright permet d'associer directement un fichier à un élément `<input type="file">`.

---

## Étape 7 — Vérifier le résultat

On localise la ligne contenant `Mango` :

```js
const desiredRow = page.getByRole('row').filter({
    has: page.getByText(textSearch)
});
```

Puis on vérifie la nouvelle valeur :

```js
await expect(
    desiredRow.locator('#cell-4-undefined')
).toContainText(updateValue);
```

---

# 🔄 Vue d'ensemble du test

```text
┌───────────────────────────────┐
│       Playwright Test         │
└───────────────┬───────────────┘
                │
                ▼
       Open Web Application
                │
                ▼
          Download Excel
                │
                ▼
       Receive Download
                │
                ▼
       ┌────────────────┐
       │    ExcelJS     │
       └───────┬────────┘
               │
               ▼
        Read Excel File
               │
               ▼
        Search "Mango"
               │
               ▼
         Find Cell
               │
               ▼
         Update → 350
               │
               ▼
        Save Excel File
               │
               ▼
       Upload Excel File
               │
               ▼
        Validate UI Data
```

---

# 7 - Bonnes pratiques

## ✅ Séparer les responsabilités

Évitez de mettre toute la logique Excel directement dans le test Playwright.

Préférez :

```text
utils/
└── excelUtils.js
```

avec des fonctions comme :

```js
readExcel()
writeExcel()
```

Puis le test reste centré sur le scénario métier.

---

## ✅ Utiliser des chemins configurables

Évitez de dépendre d'un chemin spécifique à une machine :

```js
'/Users/alex/downloads/download.xlsx'
```

Préférez une gestion centralisée des chemins ou le répertoire de téléchargement prévu pour le test.

---

## ✅ Vérifier que la cellule existe

Avant de modifier une cellule :

```js
if (output.row === -1) {
    throw new Error(
        `"${searchText}" was not found in Sheet1`
    );
}
```

Cela permet d'échouer avec un message explicite.

---

## ✅ Réutiliser les fonctions utilitaires

Une fonction générique comme :

```js
writeExcel(
    searchText,
    replaceText,
    inputFilePath,
    outputFilePath
);
```

peut être réutilisée pour plusieurs tests.

Exemple :

```js
writeExcel("Apple", "Ananas", input, output);
```

ou :

```js
writeExcel("Mango", "350", input, output);
```

---

## ✅ Garder les tests lisibles

Le test Playwright doit idéalement exprimer le scénario :

```text
Download
→ Modify
→ Upload
→ Assert
```

et non contenir toute l'implémentation interne d'ExcelJS.

---

# 8 - Pièges courants

## ❌ Modifier Excel avant que le téléchargement soit terminé

Incorrect :

```js
await page.getByRole('button', {
    name: 'Download'
}).click();

await writeExcel(...);
```

Il faut d'abord attendre le téléchargement.

Préférer :

```js
const downloadPromise = page.waitForEvent('download');

await page.getByRole('button', {
    name: 'Download'
}).click();

const download = await downloadPromise;
```

---

## ❌ Utiliser un chemin absolu spécifique à une machine

Exemple :

```js
/Users/alex/downloads/download.xlsx
```

Ce chemin ne fonctionnera pas nécessairement sur :

* Windows ;
* Linux ;
* une autre machine ;
* un pipeline CI/CD.

---

## ❌ Ne pas vérifier que la donnée existe

Sans vérification :

```js
const cell = worksheet.getCell(
    output.row,
    output.column
);
```

Si la recherche échoue, les coordonnées peuvent rester :

```js
{
    row: -1,
    column: -1
}
```

Il faut donc vérifier le résultat avant de modifier le fichier.

---

## ❌ Coupler fortement le test à un sélecteur fragile

L'exemple utilise :

```js
'#cell-4-undefined'
```

Ce type de sélecteur peut être spécifique à l'application de démonstration.

Dans un projet réel, privilégiez des locators plus robustes lorsque c'est possible :

* `getByRole()`
* `getByText()`
* `getByLabel()`
* attributs dédiés aux tests

---

# 9 - Exercices

## 📝 Exercice 1 — Lire un fichier Excel

Créer un script qui :

1. charge `exceldownload.xlsx` ;
2. récupère `Sheet1` ;
3. affiche toutes les cellules dans la console.

---

## 📝 Exercice 2 — Rechercher une valeur

Créer une fonction :

```js
readExcel(worksheet, searchText)
```

qui retourne :

```js
{
    row: ...,
    column: ...
}
```

Tester avec :

```text
Apple
Mango
Banana
```

---

## 📝 Exercice 3 — Modifier une cellule

Modifier :

```text
Apple
```

en :

```text
Ananas
```

et sauvegarder le résultat dans :

```text
newexcel.xlsx
```

---

## 📝 Exercice 4 — Modifier directement le fichier

Modifier le fichier original :

```text
exceldownload.xlsx
```

sans créer de fichier supplémentaire.

---

## 📝 Exercice 5 — Download + Upload

Automatiser le scénario :

```text
Download Excel
       ↓
Modify Excel
       ↓
Upload Excel
       ↓
Validate
```

---

## 📝 Exercice 6 — Modifier le prix de Mango

Reprendre le scénario du chapitre et modifier :

```text
Mango
```

pour obtenir :

```text
350
```

Puis vérifier la valeur dans l'application.

---

# 10 - Cheat Sheet

## 📦 Installation

```bash
npm install exceljs
```

---

## 📚 Import

```js
const ExcelJS = require('exceljs');
```

---

## 📕 Créer un Workbook

```js
const workbook = new ExcelJS.Workbook();
```

---

## 📂 Lire un fichier

```js
await workbook.xlsx.readFile('./file.xlsx');
```

---

## 📄 Récupérer une feuille

```js
const worksheet = workbook.getWorksheet('Sheet1');
```

---

## 🔁 Parcourir les lignes

```js
worksheet.eachRow((row, rowNumber) => {
    // ...
});
```

---

## 🔁 Parcourir les cellules

```js
row.eachCell((cell, colNumber) => {
    console.log(cell.value);
});
```

---

## 🔍 Lire une cellule

```js
cell.value
```

---

## 📍 Récupérer une cellule

```js
worksheet.getCell(row, column);
```

---

## ✏️ Modifier une cellule

```js
cell.value = 'Ananas';
```

---

## 💾 Sauvegarder

```js
await workbook.xlsx.writeFile('./newexcel.xlsx');
```

---

## 📥 Attendre un téléchargement

```js
const downloadPromise = page.waitForEvent('download');

await page.getByRole('button', {
    name: 'Download'
}).click();

const download = await downloadPromise;
```

---

## 📤 Uploader un fichier

```js
await page.locator('#fileinput')
    .setInputFiles(filePath);
```

---

## ✅ Vérifier une valeur

```js
await expect(locator)
    .toContainText(updateValue);
```

---

# 11 - Checklist

Avant de considérer le chapitre comme maîtrisé, vérifier que vous savez :

* [ ] Installer ExcelJS avec npm
* [ ] Créer un `Workbook`
* [ ] Lire un fichier `.xlsx`
* [ ] Récupérer une worksheet
* [ ] Parcourir les lignes
* [ ] Parcourir les cellules
* [ ] Lire `cell.value`
* [ ] Rechercher une valeur
* [ ] Récupérer les coordonnées d'une cellule
* [ ] Modifier une cellule
* [ ] Sauvegarder un fichier Excel
* [ ] Écraser un fichier existant
* [ ] Attendre un téléchargement avec Playwright
* [ ] Récupérer un téléchargement
* [ ] Uploader un fichier
* [ ] Ajouter des assertions après l'upload
* [ ] Séparer les utilitaires Excel du test Playwright

---

# 12 - Conclusion

Dans ce chapitre, nous avons appris à connecter **ExcelJS** et **Playwright** afin de manipuler des fichiers Excel dans un scénario d'automatisation end-to-end.

Le point essentiel est de séparer les responsabilités :

```text
ExcelJS
  │
  ├── Lire Excel
  ├── Rechercher une cellule
  ├── Modifier une cellule
  └── Sauvegarder Excel

Playwright
  │
  ├── Ouvrir l'application
  ├── Télécharger le fichier
  ├── Uploader le fichier
  └── Vérifier le résultat
```

La combinaison des deux permet de tester des workflows dans lesquels **les données Excel font partie intégrante du scénario métier**.

Le workflow à retenir est :

```text
DOWNLOAD
    ↓
READ
    ↓
SEARCH
    ↓
UPDATE
    ↓
SAVE
    ↓
UPLOAD
    ↓
ASSERT
```

---

## 🧠 Notions essentielles à retenir

> **ExcelJS** permet de manipuler les fichiers Excel côté Node.js.

> **`eachRow()`** permet de parcourir les lignes d'une feuille.

> **`eachCell()`** permet de parcourir les cellules d'une ligne.

> **`getCell(row, column)`** permet d'accéder à une cellule à partir de ses coordonnées.

> **`writeFile()`** permet de sauvegarder les modifications.

> **`page.waitForEvent('download')`** permet d'attendre un téléchargement Playwright.

> **`setInputFiles()`** permet d'uploader un fichier via un input de type file.

> **Playwright + ExcelJS** permettent de construire des scénarios end-to-end combinant interface utilisateur et validation des données Excel.

---

## 🚀 Workflow final

```text
                    PLAYWRIGHT
                         │
                         ▼
                  Web Application
                         │
                         ▼
                   Download XLSX
                         │
                         ▼
                       ExcelJS
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
           Search                Update
              │                     │
              └──────────┬──────────┘
                         ▼
                    Save XLSX
                         │
                         ▼
                     Upload
                         │
                         ▼
                  UI Validation
                         │
                         ▼
                      PASS ✅
```

**Chapitre 11 terminé : vous disposez maintenant des bases nécessaires pour intégrer des fichiers Excel dans vos tests Playwright et automatiser un workflow complet de téléchargement, modification, upload et validation.**