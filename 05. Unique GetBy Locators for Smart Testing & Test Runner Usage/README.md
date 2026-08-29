# 🎭 Playwright — Chapitre 5

## Smart GetBy Locators, Test Runner & Calendars

> **Objectif du chapitre :** apprendre à construire des locators Playwright plus lisibles et plus proches du comportement utilisateur, utiliser le **Playwright UI Runner**, puis automatiser et valider un **calendrier**.

---

## 📚 Sommaire

* [🎯 Objectifs](#-objectifs)
* [🔎 GetBy Locators](#-getby-locators)

  * [`getByLabel()`](#getbylabel)
  * [`getByPlaceholder()`](#getbyplaceholder)
  * [`getByRole()`](#getbyrole)
  * [`getByText()`](#getbytext)
  * [`filter()` et chaining](#filter-et-chaining)
* [🖥️ Playwright UI Runner](#️-playwright-ui-runner)
* [🧪 Test E2E avec GetBy](#-test-e2e-avec-getby)
* [🏷️ Limites de `getByLabel()`](#️-limites-de-getbylabel)
* [📅 Automatiser un calendrier](#-automatiser-un-calendrier)

  * [Ouvrir le calendrier](#ouvrir-le-calendrier)
  * [Sélectionner l'année](#sélectionner-lannée)
  * [Sélectionner le mois](#sélectionner-le-mois)
  * [Sélectionner le jour](#sélectionner-le-jour)
* [✅ Valider la date](#-valider-la-date)
* [🧩 Exemple complet](#-exemple-complet)
* [⚠️ Pièges et bonnes pratiques](#️-pièges-et-bonnes-pratiques)
* [🏋️ Exercices](#️-exercices)
* [📝 Fiche mémo](#-fiche-mémo)
* [☑️ Checklist](#️-checklist)
* [🎓 Conclusion](#-conclusion)

---

# 🎯 Objectifs

À la fin de ce chapitre, je dois être capable de :

* Comprendre les **GetBy locators**.
* Utiliser `getByLabel()` pour les contrôles associés à un label.
* Utiliser `getByPlaceholder()` pour les champs avec placeholder.
* Utiliser `getByRole()` pour cibler un élément grâce à son rôle.
* Utiliser `getByText()` pour cibler un texte affiché.
* Combiner `locator()`, `filter()` et les GetBy locators.
* Utiliser le **Playwright UI Runner**.
* Automatiser l'année, le mois et le jour dans un calendrier.
* Lire la valeur d'un input avec `inputValue()`.
* Valider une date avec `expect()` et `toEqual()`.

---

# 🔎 GetBy Locators

Playwright propose plusieurs méthodes permettant de cibler les éléments de manière plus descriptive.

La stratégie utilisée peut dépendre des pratiques de l'entreprise.

| Locator              | Utilisation                     | Exemple                                        |
| -------------------- | ------------------------------- | ---------------------------------------------- |
| `locator()`          | CSS, XPath ou locator classique | `page.locator(".card-body")`                   |
| `getByLabel()`       | Label associé à un contrôle     | `page.getByLabel("Gender")`                    |
| `getByPlaceholder()` | Placeholder d'un champ          | `page.getByPlaceholder("Password")`            |
| `getByRole()`        | Rôle + nom accessible           | `page.getByRole("button", { name: "Submit" })` |
| `getByText()`        | Texte affiché                   | `page.getByText("Success!")`                   |

### Pourquoi utiliser les GetBy locators ?

Les GetBy locators permettent généralement d'obtenir des tests :

* plus lisibles ;
* plus descriptifs ;
* plus proches du comportement réel de l'utilisateur.

---

# 🏷️ `getByLabel()`

`getByLabel()` permet de cibler un contrôle de formulaire associé à un élément `<label>`.

Le cours l'utilise notamment pour :

* une checkbox ;
* un radio button ;
* un dropdown.

### Exemple

```javascript
await page
    .getByLabel("Check me out if you Love IceCreams!")
    .check();

await page
    .getByLabel("Employed")
    .check();

await page
    .getByLabel("Gender")
    .selectOption("Female");
```

> 💡 **À retenir :** `selectOption()` s'applique ici à un dropdown HTML `<select>`.

---

# 🔤 `getByPlaceholder()`

`getByPlaceholder()` permet de cibler un champ grâce à son attribut `placeholder`.

### Exemple

```javascript
await page
    .getByPlaceholder("Password")
    .fill("abc123");
```

### Autres exemples

```javascript
await page
    .getByPlaceholder("email@example.com")
    .fill("anshika@gmail.com");
```

```javascript
await page
    .getByPlaceholder("enter your passsword")
    .fill("Iamking@000");
```

Cette approche est notamment utilisée dans la réécriture du test E2E du cours.

---

# 🎭 `getByRole()`

`getByRole()` permet de cibler un élément grâce à son **rôle**, puis éventuellement grâce à son **nom accessible**.

### Exemples

```javascript
await page
    .getByRole("button", { name: "Submit" })
    .click();

await page
    .getByRole("link", { name: "Shop" })
    .click();

await page
    .getByRole("button", { name: "Login" })
    .click();

await page
    .getByRole("button", { name: "Checkout" })
    .click();
```

## Pourquoi utiliser `name` ?

Le paramètre `name` permet de rendre le locator plus précis lorsqu'il existe plusieurs éléments ayant le même rôle.

### Moins précis

```javascript
page.getByRole("button")
```

### Plus précis

```javascript
page.getByRole("button", { name: "Login" })
```

> 💡 **Bonne pratique :** lorsque plusieurs éléments possèdent le même rôle, utiliser `name` permet de mieux identifier l'élément attendu.

---

# 📝 `getByText()`

`getByText()` permet de retrouver un élément à partir du texte qu'il affiche.

### Exemple

```javascript
await expect(
    page.getByText(
        "Success! The Form has been submitted successfully!."
    )
).toBeVisible();
```

### Autres exemples

```javascript
await expect(
    page.getByText("ADIDAS ORIGINAL")
).toBeVisible();
```

```javascript
await expect(
    page.getByText("Thankyou for the order.")
).toBeVisible();
```

Dans les exemples du cours, `getByText()` est notamment utilisé pour :

* les messages de succès ;
* le produit dans le panier ;
* la confirmation de commande.

---

# 🔗 `filter()` et chaining

`filter()` permet de réduire un ensemble d'éléments selon un critère.

Cette méthode est particulièrement utile lorsqu'on souhaite :

1. trouver un composant parmi plusieurs ;
2. identifier ce composant grâce à son texte ;
3. rechercher un élément enfant à l'intérieur de ce composant.

## Exemple

```javascript
await page
    .locator("app-card")
    .filter({ hasText: "iphone X" })
    .getByRole("button")
    .click();
```

### Exemple avec un produit

```javascript
await page
    .locator(".card-body")
    .filter({ hasText: "ADIDAS ORIGINAL" })
    .getByRole("button", { name: "Add To Cart" })
    .click();
```

## Décomposition

```text
.card-body
    ↓
filter({ hasText: "ADIDAS ORIGINAL" })
    ↓
Carte contenant ADIDAS ORIGINAL
    ↓
getByRole("button", { name: "Add To Cart" })
    ↓
Bouton Add To Cart
```

> 💡 **Bonne pratique :** filtrer le composant parent avant de rechercher le bouton ou l'élément enfant.

---

# 🖥️ Playwright UI Runner

Le **UI Runner** permet d'exécuter et d'observer les tests dans une interface graphique.

Il est particulièrement utile pendant :

* l'apprentissage ;
* l'exploration des tests ;
* le débogage.

## Lancer le UI Runner

```bash
npx playwright test --ui
```

Une autre syntaxe possible :

```bash
node ./node_modules/@playwright/test/cli.js test --ui
```

---

## Ajouter un script npm

Dans `package.json` :

```json
{
  "scripts": {
    "test": "node ./node_modules/@playwright/test/cli.js test"
  }
}
```

Puis :

```bash
npm test
```

---

# 🧪 Test E2E avec GetBy

Voici un scénario complet utilisant plusieurs types de locators :

```javascript
import { expect, test } from '@playwright/test';

test("Client App - GetBy Locators", async ({ page }) => {

    await page.goto(
        "https://rahulshettyacademy.com/client"
    );

    // Login using placeholders.
    await page
        .getByPlaceholder("email@example.com")
        .fill("anshika@gmail.com");

    await page
        .getByPlaceholder("enter your passsword")
        .fill("Iamking@000");

    // Click Login using its role and name.
    await page
        .getByRole("button", { name: "Login" })
        .click();

    // Wait for products.
    await page.waitForLoadState("networkidle");

    await page
        .locator(".card-body b")
        .first()
        .waitFor();

    // Find the product card and click Add To Cart.
    await page
        .locator(".card-body")
        .filter({ hasText: "ADIDAS ORIGINAL" })
        .getByRole("button", { name: "Add To Cart" })
        .click();

    // Open the cart.
    await page
        .getByRole("listitem")
        .getByRole("button", { name: "Cart" })
        .click();

    // Verify product.
    await expect(
        page.getByText("ADIDAS ORIGINAL")
    ).toBeVisible();

    // Checkout.
    await page
        .getByRole("button", { name: "Checkout" })
        .click();

    // Type the first characters of the country.
    await page
        .getByPlaceholder("Select Country")
        .pressSequentially("Fra", { delay: 100 });

    // Wait for autocomplete results.
    await page
        .locator(".ta-results")
        .waitFor();

    // Select the first matching option.
    await page
        .getByRole("button", { name: "Fra" })
        .nth(0)
        .click();

    // Place the order.
    await page
        .getByText("PLACE ORDER")
        .click();

    // Validate confirmation.
    await expect(
        page.getByText("Thankyou for the order.")
    ).toBeVisible();
});
```

---

## 🔄 Déroulement du scénario

```text
Login
  ↓
Attendre les produits
  ↓
Trouver ADIDAS ORIGINAL
  ↓
Add To Cart
  ↓
Ouvrir le panier
  ↓
Vérifier le produit
  ↓
Checkout
  ↓
Rechercher "Fra"
  ↓
Sélectionner le pays
  ↓
Place Order
  ↓
Vérifier la confirmation
```

### Locators utilisés dans ce test

| Étape                | Locator                  |
| -------------------- | ------------------------ |
| Email                | `getByPlaceholder()`     |
| Password             | `getByPlaceholder()`     |
| Login                | `getByRole()`            |
| Produit              | `locator()` + `filter()` |
| Add To Cart          | `getByRole()`            |
| Cart                 | `getByRole()`            |
| Vérification produit | `getByText()`            |
| Checkout             | `getByRole()`            |
| Pays                 | `getByPlaceholder()`     |
| Confirmation         | `getByText()`            |

---

# 🏷️ Limites de `getByLabel()`

`getByLabel()` fonctionne lorsque le champ est correctement associé au label.

Deux structures sont notamment possibles.

## Association directe

```html
<label>
    Password
    <input type="password" />
</label>
```

## Association avec `for` et `id`

```html
<label for="passwordField">
    Password
</label>

<input
    id="passwordField"
    type="password"
/>
```

Dans les deux cas, le label est correctement relié au contrôle.

> ⚠️ **Important :** si cette relation n'existe pas dans le HTML, il ne faut pas supposer que `getByLabel()` fonctionnera.

---

# 📅 Automatiser un calendrier

Le cours utilise le calendrier disponible sur :

`https://rahulshettyacademy.com/seleniumPractise/#/offers`

On définit une date attendue :

```javascript
const day = "7";
const month = "7";
const year = "2026";
```

Puis on ouvre la page :

```javascript
await page.goto(
    "https://rahulshettyacademy.com/seleniumPractise/#/offers"
);
```

---

## Ouvrir le calendrier

```javascript
await page
    .locator(".react-date-picker__inputGroup")
    .click();
```

---

## Sélectionner l'année

Le cours clique deux fois sur le bouton de navigation afin d'accéder à la sélection des années :

```javascript
await page
    .locator(".react-calendar__navigation__label")
    .click();

await page
    .locator(".react-calendar__navigation__label")
    .click();
```

### Choisir l'année

```javascript
await page
    .getByText(year)
    .click();
```

Avec :

```javascript
const year = "2026";
```

Playwright recherche donc le texte :

```text
2026
```

---

## Sélectionner le mois

Le cours utilise :

```javascript
const month = "7";
```

Ici, `7` correspond à **juillet**.

Cependant, `nth()` commence à `0`.

| Mois      | Index `nth()` |
| --------- | ------------: |
| Janvier   |      `nth(0)` |
| Février   |      `nth(1)` |
| Mars      |      `nth(2)` |
| Avril     |      `nth(3)` |
| Mai       |      `nth(4)` |
| Juin      |      `nth(5)` |
| Juillet   |      `nth(6)` |
| Août      |      `nth(7)` |
| Septembre |      `nth(8)` |
| Octobre   |      `nth(9)` |
| Novembre  |     `nth(10)` |
| Décembre  |     `nth(11)` |

On utilise donc :

```javascript
await page
    .locator(
        ".react-calendar__year-view__months__month"
    )
    .nth(Number(month) - 1)
    .click();
```

### Pourquoi `month - 1` ?

Parce que :

```text
7 - 1 = 6
```

Donc :

```javascript
nth(6)
```

correspond au **septième élément**, c'est-à-dire juillet.

> 💡 **À retenir :** les index Playwright sont **zero-based**.

---

## Sélectionner le jour

Le cours utilise XPath :

```javascript
await page
    .locator("//abbr[text()='" + day + "']")
    .click();
```

Avec :

```javascript
const day = "7";
```

le locator devient :

```xpath
//abbr[text()='7']
```

> ⚠️ **Remarque :** les notes indiquent qu'un locator CSS basé sur les classes du bouton du calendrier ne fonctionnait pas dans cet exemple. Le cours utilise donc cet XPath.

---

# ✅ Valider la date

Après la sélection, le cours lit les trois inputs du date picker et compare leurs valeurs avec les valeurs attendues.

```javascript
const expectedList = [month, day, year];

const inputs = page.locator(
    ".react-date-picker__inputGroup__input"
);

for (let i = 0; i < expectedList.length; i++) {

    const value = await inputs
        .nth(i)
        .inputValue();

    expect(value).toEqual(expectedList[i]);
}
```

---

## `inputValue()`

`inputValue()` permet de lire la valeur d'un élément `<input>`.

```javascript
const value = await locator.inputValue();
```

---

## `expect().toEqual()`

Permet de comparer la valeur obtenue avec la valeur attendue :

```javascript
expect(value).toEqual(expectedValue);
```

Dans notre exemple :

```text
Mois  → 7
Jour  → 7
Année → 2026
```

---

# 🧩 Exemple complet : calendrier

```javascript
import { expect, test } from '@playwright/test';

test("Calendar validations", async ({ page }) => {

    const day = "7";
    const month = "7";
    const year = "2026";

    await page.goto(
        "https://rahulshettyacademy.com/seleniumPractise/#/offers"
    );

    // Open date picker.
    await page
        .locator(".react-date-picker__inputGroup")
        .click();

    // Open year selection.
    await page
        .locator(".react-calendar__navigation__label")
        .click();

    await page
        .locator(".react-calendar__navigation__label")
        .click();

    // Select year.
    await page
        .getByText(year)
        .click();

    // month "7" -> nth(6), because nth() starts at 0.
    await page
        .locator(
            ".react-calendar__year-view__months__month"
        )
        .nth(Number(month) - 1)
        .click();

    // Select day.
    await page
        .locator("//abbr[text()='" + day + "']")
        .click();

    // Validate all three date fields.
    const expectedList = [month, day, year];

    const inputs = page.locator(
        ".react-date-picker__inputGroup__input"
    );

    for (let i = 0; i < expectedList.length; i++) {

        const value = await inputs
            .nth(i)
            .inputValue();

        expect(value).toEqual(expectedList[i]);
    }
});
```

---

# ⚠️ Pièges et bonnes pratiques

## `getByLabel()`

Vérifier que le label est réellement associé au contrôle.

---

## `getByPlaceholder()`

Le placeholder doit correspondre au champ visé.

```javascript
page.getByPlaceholder("Password")
```

---

## `getByRole()`

Utiliser `name` pour désambiguïser les éléments ayant le même rôle.

```javascript
page.getByRole("button", { name: "Login" })
```

---

## `getByText()`

Utiliser un texte suffisamment stable pour éviter les locators fragiles.

```javascript
page.getByText("Success!")
```

---

## `filter()`

Filtrer le composant parent avant de chercher son bouton ou un autre élément enfant.

```javascript
locator(".card")
    .filter({ hasText: "Product" })
    .getByRole("button")
```

---

## `nth()`

Le premier élément est :

```javascript
nth(0)
```

et non :

```javascript
nth(1)
```

> 💡 Les index commencent à **0**.

---

## 📅 Calendrier

La stratégie XPath utilisée dans le cours dépend de la structure HTML spécifique de ce calendrier.

```javascript
locator("//abbr[text()='" + day + "']")
```

---

## ⏳ Attentes

Dans le scénario client, le cours utilise :

```javascript
await page.waitForLoadState("networkidle");
```

puis attend le premier titre produit :

```javascript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

---

## 🖥️ UI Runner

Pendant l'apprentissage et le débogage :

```bash
npx playwright test --ui
```

---

# 🏋️ Exercices

### Exercice 1 — `getByLabel()`

Réécrire un locator CSS de champ en utilisant :

```javascript
getByLabel()
```

### Exercice 2 — `getByPlaceholder()`

Réécrire un champ avec :

```javascript
getByPlaceholder()
```

### Exercice 3 — `getByRole()`

Réécrire un bouton avec :

```javascript
getByRole()
```

### Exercice 4 — `getByText()`

Réécrire une vérification de message avec :

```javascript
getByText()
```

### Exercice 5 — `filter()`

Créer un locator utilisant :

```javascript
locator()
    .filter({ hasText: ... })
    .getByRole(...)
```

### Exercice 6 — Produit

Changer le produit :

```text
ADIDAS ORIGINAL
```

par un autre produit dans le test E2E.

### Exercice 7 — Pays

Modifier le pays recherché dans le checkout.

### Exercice 8 — Année

Choisir une autre année dans le calendrier.

### Exercice 9 — Mois

Choisir un autre mois et vérifier le calcul de l'index.

### Exercice 10 — Assertion

Ajouter une assertion supplémentaire après la sélection du jour.

### Exercice 11 — UI Runner

Lancer :

```bash
npx playwright test --ui
```

et observer les différentes étapes du test.

---

# 📝 Fiche mémo

| Besoin              | Syntaxe                                           |
| ------------------- | ------------------------------------------------- |
| Label               | `page.getByLabel("Gender")`                       |
| Placeholder         | `page.getByPlaceholder("Password")`               |
| Role + nom          | `page.getByRole("button", { name: "Submit" })`    |
| Texte               | `page.getByText("Success!")`                      |
| Filtrer             | `locator(".card").filter({ hasText: "Product" })` |
| Premier             | `locator.first()`                                 |
| Index               | `locator.nth(i)`                                  |
| Select              | `locator.selectOption("Female")`                  |
| Lire un input       | `await locator.inputValue()`                      |
| Visible             | `await expect(locator).toBeVisible()`             |
| UI Runner           | `npx playwright test --ui`                        |
| Pause               | `await page.pause()`                              |
| Attendre le réseau  | `await page.waitForLoadState("networkidle")`      |
| Attendre un locator | `await locator.waitFor()`                         |

---

# ☑️ Checklist

Avant de considérer ce chapitre comme maîtrisé :

* [ ] Je comprends le rôle d'un locator.
* [ ] Je sais utiliser `getByLabel()`.
* [ ] Je sais reconnaître les deux associations label/contrôle montrées dans le cours.
* [ ] Je sais utiliser `getByPlaceholder()`.
* [ ] Je sais utiliser `getByRole()` avec `name`.
* [ ] Je sais utiliser `getByText()`.
* [ ] Je comprends le chaining de locators.
* [ ] Je sais utiliser `filter({ hasText: ... })`.
* [ ] Je sais lancer le UI Runner.
* [ ] Je sais sélectionner une année dans le calendrier.
* [ ] Je sais sélectionner un mois dans le calendrier.
* [ ] Je sais sélectionner un jour dans le calendrier.
* [ ] Je comprends pourquoi le mois `7` correspond à `nth(6)`.
* [ ] Je comprends que `nth()` est zero-based.
* [ ] Je sais lire un input avec `inputValue()`.
* [ ] Je sais valider une valeur avec `expect().toEqual()`.

---

# 🎓 Conclusion

Le chapitre 5 fait évoluer l'utilisation des locators Playwright vers une approche plus **descriptive et lisible** avec les **GetBy locators**.

Les principales méthodes étudiées sont :

* `getByLabel()`
* `getByRole()`
* `getByText()`
* `getByPlaceholder()`
* `filter()`
* le **chaining**

La partie calendrier ajoute une compétence importante : savoir **décomposer un composant complexe en plusieurs étapes**, puis vérifier que le résultat obtenu correspond à la valeur attendue.

La validation repose notamment sur :

```javascript
inputValue()
```

et :

```javascript
expect().toEqual()
```

---

## ⭐ Les 5 notions essentielles à retenir

### 1. `getByRole()` + `name`

Pour cibler précisément les boutons et les liens.

```javascript
page.getByRole("button", { name: "Login" })
```

### 2. `getByLabel()`

Pour les contrôles associés à un label.

```javascript
page.getByLabel("Gender")
```

### 3. `getByPlaceholder()`

Pour les champs identifiés par leur placeholder.

```javascript
page.getByPlaceholder("Password")
```

### 4. `filter({ hasText: ... })`

Pour cibler un composant précis dans une collection.

```javascript
locator(".card")
    .filter({ hasText: "Product" })
    .getByRole("button")
```

### 5. `nth()` + `inputValue()`

`nth()` est **zero-based** :

```text
nth(0) → premier élément
nth(1) → deuxième élément
nth(2) → troisième élément
```

Et `inputValue()` permet de lire la valeur d'un input :

```javascript
const value = await locator.inputValue();
```

---

> 🚀 **À retenir :** de bons locators rendent les tests Playwright plus lisibles, plus compréhensibles et plus proches de la manière dont un utilisateur interagit avec l'application.