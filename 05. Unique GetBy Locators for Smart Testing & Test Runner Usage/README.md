# 📘 Playwright — Chapitre 5
## Smart GetBy Locators, Test Runner & Calendars

## À propos de ce chapitre

Ce chapitre introduit une approche plus lisible pour localiser les éléments avec Playwright :

* `getByLabel()`
* `getByRole()`
* `getByText()`
* `getByPlaceholder()`
* `filter()`

Il montre également comment utiliser le **Playwright UI Runner** pour observer et déboguer les tests.

La dernière partie présente une stratégie d’automatisation et de validation d’un **calendrier**.

---

## Sommaire

1. Objectifs
2. GetBy locators
3. `getByLabel()`
4. `getByPlaceholder()`
5. `getByRole()`
6. `getByText()`
7. `filter()` et chaining
8. Playwright UI Runner
9. Test E2E avec GetBy
10. Limites de `getByLabel()`
11. Automatiser un calendrier
12. Valider la date
13. Exemple complet
14. Pièges et bonnes pratiques
15. Exercices
16. Fiche mémo
17. Checklist

---

# 1. Objectifs

* Comprendre les locators GetBy.
* Utiliser `getByLabel()` pour les contrôles associés à un label.
* Utiliser `getByPlaceholder()` pour les champs avec placeholder.
* Utiliser `getByRole()` pour les éléments identifiés par leur rôle.
* Utiliser `getByText()` pour cibler un texte.
* Combiner `locator()`, `filter()` et les GetBy locators.
* Lancer les tests avec le UI Runner.
* Automatiser l'année, le mois et le jour dans un calendrier.
* Valider une date avec `inputValue()` et `expect()`.

---

# 2. GetBy locators

La stratégie de locator peut dépendre des pratiques de l'entreprise :

| Locator              | Utilisation                    | Exemple                                        |
| -------------------- | ------------------------------ | ---------------------------------------------- |
| `locator()`          | CSS/XPath ou locator classique | `page.locator(".card-body")`                   |
| `getByLabel()`       | Label associé à un contrôle    | `page.getByLabel("Gender")`                    |
| `getByPlaceholder()` | Placeholder d'un champ         | `page.getByPlaceholder("Password")`            |
| `getByRole()`        | Rôle + nom accessible          | `page.getByRole("button", { name: "Submit" })` |
| `getByText()`        | Texte affiché                  | `page.getByText("Success!")`                   |

Les GetBy locators rendent généralement les tests plus lisibles et plus proches du comportement réel de l'utilisateur.

---

# 3. `getByLabel()`

`getByLabel()` permet de cibler un contrôle de formulaire associé à un `<label>`.

Le cours l'utilise notamment pour :

* une checkbox ;
* un radio button ;
* un dropdown.

```javascript
await page.getByLabel("Check me out if you Love IceCreams!").check();

await page.getByLabel("Employed").check();

await page.getByLabel("Gender").selectOption("Female");
```

> **À retenir :** `selectOption()` s'applique ici au dropdown HTML `<select>`.

---

# 4. `getByPlaceholder()`

`getByPlaceholder()` cible un champ grâce à son attribut `placeholder`.

```javascript
await page.getByPlaceholder("Password").fill("abc123");
```

Autres exemples :

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

Cette approche est notamment utilisée dans la réécriture E2E du cours.

---

# 5. `getByRole()`

`getByRole()` permet de cibler un élément par son **rôle**, puis éventuellement par son **nom accessible**.

```javascript
await page.getByRole("button", { name: "Submit" }).click();

await page.getByRole("link", { name: "Shop" }).click();

await page.getByRole("button", { name: "Login" }).click();

await page.getByRole("button", { name: "Checkout" }).click();
```

## Pourquoi utiliser `name` ?

Le paramètre `name` permet de rendre le locator plus précis lorsqu'il existe plusieurs éléments ayant le même rôle.

Par exemple :

```javascript
page.getByRole("button", { name: "Login" })
```

est plus précis que :

```javascript
page.getByRole("button")
```

---

# 6. `getByText()`

`getByText()` permet de retrouver un élément à partir du texte qu'il affiche.

```javascript
await expect(
    page.getByText(
        "Success! The Form has been submitted successfully!."
    )
).toBeVisible();
```

Autres exemples :

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

Les notes utilisent `getByText()` notamment pour :

* les messages de succès ;
* le produit dans le panier ;
* la confirmation de commande.

---

# 7. `filter()` et chaining

`filter()` permet de réduire un ensemble d'éléments selon un critère.

Il est particulièrement utile lorsqu'on veut :

1. trouver un composant parmi plusieurs ;
2. identifier ce composant grâce à son texte ;
3. rechercher un élément enfant à l'intérieur de ce composant.

## Exemple

```javascript
await page.locator("app-card")
    .filter({ hasText: "iphone X" })
    .getByRole("button")
    .click();
```

Autre exemple :

```javascript
await page.locator(".card-body")
    .filter({ hasText: "ADIDAS ORIGINAL" })
    .getByRole("button", { name: "Add To Cart" })
    .click();
```

### Décomposition

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

> **Bonne pratique :** filtrer le composant parent avant de rechercher le bouton ou l'élément enfant.

---

# 8. Playwright UI Runner

Le **UI Runner** permet d'exécuter et d'observer les tests dans une interface graphique.

Pour le lancer :

```bash
npx playwright test --ui
```

Une autre syntaxe possible :

```bash
node ./node_modules/@playwright/test/cli.js test --ui
```

## Créer un script npm

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

Le UI Runner est particulièrement utile pendant l'apprentissage et le débogage.

---

# 9. Réécriture d'un test E2E avec GetBy

Voici un scénario complet utilisant plusieurs GetBy locators :

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

## Déroulement du scénario

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

---

# 10. Limites de `getByLabel()`

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

> **Important :** si cette relation n'existe pas dans le HTML, il ne faut pas supposer que `getByLabel()` fonctionnera.

---

# 11. Automatiser un calendrier

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

## 11.1 Ouvrir le calendrier

```javascript
await page
    .locator(".react-date-picker__inputGroup")
    .click();
```

---

## 11.2 Aller à la sélection de l'année

Le cours clique deux fois sur le bouton de navigation :

```javascript
await page
    .locator(".react-calendar__navigation__label")
    .click();

await page
    .locator(".react-calendar__navigation__label")
    .click();
```

---

## 11.3 Sélectionner l'année

```javascript
await page.getByText(year).click();
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

## 11.4 Sélectionner le mois

Le cours rappelle que :

```text
month = 7
```

correspond à **juillet**.

Mais `nth()` commence à **0**.

Donc :

```text
Janvier   → nth(0)
Février   → nth(1)
Mars      → nth(2)
Avril     → nth(3)
Mai       → nth(4)
Juin      → nth(5)
Juillet   → nth(6)
...
Décembre  → nth(11)
```

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

correspond au septième élément, c'est-à-dire juillet.

---

## 11.5 Sélectionner le jour

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

> **Remarque :** les notes indiquent qu'un locator CSS basé sur les classes du bouton du calendrier ne fonctionnait pas dans cet exemple. Le cours utilise donc cet XPath.

---

# 12. Valider la date

Après la sélection, le cours lit les trois inputs du date picker et compare leurs valeurs aux valeurs attendues.

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

## `inputValue()`

`inputValue()` permet de lire la valeur d'un élément `<input>`.

```javascript
const value = await locator.inputValue();
```

## `expect().toEqual()`

Permet de comparer la valeur obtenue avec la valeur attendue :

```javascript
expect(value).toEqual(expectedValue);
```

Dans notre exemple :

```text
Valeur du mois  → 7
Valeur du jour  → 7
Valeur année    → 2026
```

---

# 13. Exemple complet : calendrier

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

# 14. Pièges et bonnes pratiques

### `getByLabel()`

Vérifier que le label est réellement associé au contrôle.

### `getByPlaceholder()`

Le placeholder doit correspondre exactement au champ visé.

### `getByRole()`

Utiliser `name` pour désambiguïser les éléments ayant le même rôle.

```javascript
page.getByRole("button", { name: "Login" })
```

### `getByText()`

Utiliser un texte suffisamment stable pour éviter les locators fragiles.

### `filter()`

Filtrer le composant parent avant de chercher son bouton ou un autre élément enfant.

```javascript
locator(".card")
    .filter({ hasText: "Product" })
    .getByRole("button")
```

### `nth()`

Le premier élément est :

```javascript
nth(0)
```

et non :

```javascript
nth(1)
```

### Calendrier

La stratégie XPath utilisée dans le cours dépend de la structure HTML spécifique de ce calendrier.

### Attentes

Dans le scénario client, le cours utilise :

```javascript
await page.waitForLoadState("networkidle");
```

puis attend le premier titre produit :

```javascript
await page.locator(".card-body b").first().waitFor();
```

### UI Runner

Pendant l'apprentissage et le débogage :

```bash
npx playwright test --ui
```

---

# 15. Exercices d'entraînement

1. Réécrire un locator CSS de champ en `getByLabel()`.
2. Réécrire un champ avec `getByPlaceholder()`.
3. Réécrire un bouton avec `getByRole()`.
4. Réécrire une vérification de message avec `getByText()`.
5. Créer un locator avec `locator().filter({ hasText: ... }).getByRole(...)`.
6. Changer le produit `ADIDAS ORIGINAL` par un autre produit dans le test E2E.
7. Modifier le pays recherché dans le checkout.
8. Choisir une autre année dans le calendrier.
9. Choisir un autre mois et vérifier le calcul de l'index.
10. Ajouter une assertion supplémentaire après la sélection du jour.
11. Lancer le test avec :

```bash
npx playwright test --ui
```

et observer les différentes étapes.

---

# 16. Fiche mémo

| Besoin           | Syntaxe                                           |
| ---------------- | ------------------------------------------------- |
| Label            | `page.getByLabel("Gender")`                       |
| Placeholder      | `page.getByPlaceholder("Password")`               |
| Role + nom       | `page.getByRole("button", { name: "Submit" })`    |
| Texte            | `page.getByText("Success!")`                      |
| Filtrer          | `locator(".card").filter({ hasText: "Product" })` |
| Premier          | `locator.first()`                                 |
| Index            | `locator.nth(i)`                                  |
| Select           | `locator.selectOption("Female")`                  |
| Lire input       | `await locator.inputValue()`                      |
| Visible          | `await expect(locator).toBeVisible()`             |
| UI Runner        | `npx playwright test --ui`                        |
| Pause            | `await page.pause()`                              |
| Attendre réseau  | `await page.waitForLoadState("networkidle")`      |
| Attendre locator | `await locator.waitFor()`                         |

---

# 17. Checklist de validation

* [ ] Je comprends le rôle d'un locator.
* [ ] Je sais utiliser `getByLabel()`.
* [ ] Je sais reconnaître les deux associations label/contrôle montrées dans le cours.
* [ ] Je sais utiliser `getByPlaceholder()`.
* [ ] Je sais utiliser `getByRole()` avec `name`.
* [ ] Je sais utiliser `getByText()`.
* [ ] Je comprends le chaining de locators.
* [ ] Je sais utiliser `filter({ hasText: ... })`.
* [ ] Je sais lancer le UI Runner.
* [ ] Je sais sélectionner une année, un mois et un jour dans le calendrier du cours.
* [ ] Je comprends pourquoi le mois 7 correspond à `nth(6)`.
* [ ] Je sais lire un input avec `inputValue()`.
* [ ] Je sais valider une valeur avec `expect().toEqual()`.

---

# Conclusion

Le chapitre 5 fait passer d'une recherche principalement basée sur les sélecteurs CSS à une approche plus descriptive avec les **GetBy locators**.

Les concepts à maîtriser sont :

* `getByLabel()`
* `getByRole()`
* `getByText()`
* `getByPlaceholder()`
* `filter()`
* le **chaining**

La partie calendrier ajoute une compétence importante : **décomposer un composant complexe en plusieurs étapes**, puis valider le résultat avec `inputValue()` et des assertions.

## Les 5 notions essentielles

1. **`getByRole()` + `name`** pour cibler précisément les boutons et les liens.
2. **`getByLabel()`** pour les contrôles associés à un label.
3. **`getByPlaceholder()`** pour les champs identifiés par leur placeholder.
4. **`filter({ hasText: ... })`** pour cibler un composant dans une collection.
5. **`nth()` est zéro-based** et `inputValue()` permet de lire la valeur d'un input.