# 📘 Playwright — Chapitre 4
## End-to-End Web Automation Practice

**Login • Produits dynamiques • Panier • Checkout • Autocomplete • Commande • Order History**

> Documentation d’apprentissage basée sur les notes du cours fournies.

---

## À propos de ce chapitre

Ce chapitre met en pratique plusieurs concepts Playwright dans un véritable scénario **End-to-End**.

Le parcours couvre :

* le login ;
* la recherche dynamique d'un produit ;
* l'ajout au panier ;
* le checkout ;
* la sélection d'un pays ;
* la création de la commande ;
* la récupération de l'**Order ID** ;
* la recherche de cette commande dans l'**Order History**.

L'objectif est de construire un test capable de transporter des données d'une étape à l'autre, de gérer des interfaces dynamiques et de vérifier le résultat final.

---

# Sommaire

1. Objectifs
2. Scénario E2E
3. Login
4. Synchronisation après login
5. Recherche dynamique d'un produit
6. `count()`, `nth()` et boucles
7. Ajouter au panier
8. Vérifier le panier
9. Dropdown autocomplete
10. `pressSequentially()` et `delay`
11. Checkout et assertions
12. Récupérer l'Order ID
13. Order History
14. Vérifier les détails
15. Exemple complet
16. Concepts Playwright
17. Erreurs et bonnes pratiques
18. Exercices
19. Fiche mémo
20. Checklist

---

# 1. Objectifs

À la fin de ce chapitre, je dois être capable de :

* Construire un test End-to-End réaliste.
* Rechercher un produit dynamiquement.
* Parcourir une collection de locators avec `count()` et `nth()`.
* Synchroniser le test avec une interface dynamique.
* Gérer un autocomplete.
* Ajouter des assertions après les actions importantes.
* Capturer une donnée dynamique comme l'Order ID.
* Rechercher cette donnée dans une table d'historique.

---

# 2. Scénario E2E

Le scénario global est le suivant :

```text
Login
  ↓
Sélectionner un produit
  ↓
Ajouter au panier
  ↓
Ouvrir le panier
  ↓
Checkout
  ↓
Saisir les informations
  ↓
Sélectionner le pays
  ↓
Valider la commande
  ↓
Récupérer l'Order ID
  ↓
Ouvrir Order History
  ↓
Rechercher la commande
  ↓
Afficher les détails
  ↓
Vérifier l'Order ID
```

Le scénario général mentionne également :

* l'application d'un coupon ;
* le paiement.

Cependant, ces deux étapes ne sont pas entièrement implémentées dans les extraits fournis.

---

# 3. Login

On commence par ouvrir l'application et renseigner les identifiants.

```javascript
import { expect, test } from '@playwright/test';

test("Client App - E2E", async ({ page }) => {

    await page.goto(
        "https://rahulshettyacademy.com/client"
    );

    const email = "anshika@gmail.com";
    const password = "Iamking@000";

    await page
        .locator("#userEmail")
        .fill(email);

    await page
        .locator("#userPassword")
        .fill(password);

    await page
        .locator("[value='Login']")
        .click();
});
```

## Pourquoi conserver l'email dans une variable ?

L'email sera réutilisé plus tard lors du checkout.

```javascript
const email = "anshika@gmail.com";
```

On pourra ensuite vérifier que l'email affiché au checkout correspond bien à celui utilisé lors du login.

---

# 4. Synchronisation après login

Après le login, les produits sont chargés dynamiquement.

Le test attend donc qu'un produit soit disponible :

```javascript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

Le premier titre de produit sert de **repère de synchronisation**.

## Autre approche

Le support présente également :

```javascript
await page.waitForLoadState("networkidle");
```

### Comparaison

```text
waitForLoadState("networkidle")
        ↓
Attente globale du réseau

locator.waitFor()
        ↓
Attente ciblée d'un élément nécessaire
```

> **Bonne pratique :** lorsqu'un élément précis est nécessaire pour poursuivre le scénario, une attente ciblée est souvent plus pertinente qu'une attente globale du réseau.

---

# 5. Recherche dynamique d'un produit

Le cours montre comment rechercher `ADIDAS ORIGINAL` sans dépendre de sa position dans la page.

```javascript
const products = page.locator(".card-body");
const productName = "ADIDAS ORIGINAL";

const productCount = await products.count();

for (let i = 0; i < productCount; i++) {

    const product = products.nth(i);

    const currentProductName =
        await product.locator("b").textContent();

    if (currentProductName.includes(productName)) {

        await product
            .getByRole("button", { name: "Add To Cart" })
            .click();

        break;
    }
}
```

## Logique

Le test :

1. récupère la collection de produits ;
2. compte le nombre de produits ;
3. parcourt chaque produit ;
4. récupère son nom ;
5. compare le nom avec le produit recherché ;
6. clique sur `Add To Cart` si le produit correspond ;
7. quitte la boucle avec `break`.

```text
Tous les produits
      ↓
    count()
      ↓
   Boucle for
      ↓
    nth(i)
      ↓
 Lire le nom
      ↓
Comparer avec "ADIDAS ORIGINAL"
      ↓
   Correspond ?
    ↙       ↘
  Non       Oui
   ↓         ↓
Continuer   Add To Cart
             ↓
           break
```

> **Idée clé :** on recherche le produit par son contenu métier plutôt que par une position fixe.

---

# 6. `count()`, `nth()` et boucles

Ces trois éléments sont particulièrement importants lorsqu'on travaille avec une collection dynamique.

| Méthode         | Rôle                                |
| --------------- | ----------------------------------- |
| `count()`       | Retourne le nombre d'éléments       |
| `nth(i)`        | Sélectionne l'élément à l'index `i` |
| `first()`       | Sélectionne le premier élément      |
| `textContent()` | Lit le texte d'un élément           |

Exemple :

```javascript
const products = page.locator(".card-body");

const count = await products.count();

for (let i = 0; i < count; i++) {

    const product = products.nth(i);

    console.log(
        await product.locator("b").textContent()
    );
}
```

## Attention aux index

Les index commencent à **0**.

```text
nth(0) → premier élément
nth(1) → deuxième élément
nth(2) → troisième élément
```

---

# 7. Ajouter au panier

Une fois le produit trouvé, on recherche le bouton à l'intérieur du produit courant :

```javascript
await product
    .getByRole("button", { name: "Add To Cart" })
    .click();
```

C'est important car plusieurs produits peuvent posséder un bouton `Add To Cart`.

On évite ainsi de cliquer sur le bouton d'un autre produit.

## Variante

Les notes présentent également :

```javascript
await product
    .locator("text= Add To Cart")
    .click();
```

La première approche avec `getByRole()` est toutefois plus descriptive.

---

# 8. Vérifier le panier

Une fois le produit ajouté, on ouvre le panier :

```javascript
await page
    .locator("[routerLink*='cart']")
    .click();
```

Puis on attend que le produit soit présent :

```javascript
await page
    .locator("h3:has-text('ADIDAS ORIGINAL')")
    .waitFor();
```

On vérifie ensuite sa visibilité :

```javascript
const visible =
    await page
        .locator("h3:has-text('ADIDAS ORIGINAL')")
        .isVisible();

expect(visible).toBeTruthy();
```

## Logique

```text
Ajouter au panier
       ↓
Ouvrir le panier
       ↓
Attendre le produit
       ↓
Vérifier sa visibilité
```

> **Bonne pratique :** attendre l'élément avant de vérifier son état.

---

# 9. Dropdown autocomplete

Le choix du pays utilise un **autocomplete dynamique**.

Ce n'est donc pas un simple :

```html
<select>
```

Le test doit :

1. saisir quelques caractères ;
2. attendre les suggestions ;
3. parcourir les suggestions ;
4. trouver le pays ;
5. cliquer dessus.

Exemple :

```javascript
await page
    .locator("[placeholder*='Country']")
    .pressSequentially("Fra", { delay: 100 });

const dropdown = page.locator(".ta-results");

await dropdown.waitFor();

const optionsCount =
    await dropdown.locator("button").count();

for (let i = 0; i < optionsCount; i++) {

    const option =
        dropdown.locator("button").nth(i);

    const currentOptionName =
        await option.textContent();

    if (currentOptionName.includes("France")) {

        await option.click();

        break;
    }
}
```

---

# 10. `pressSequentially()` et `delay`

Pour les champs autocomplete, une saisie trop rapide peut parfois poser problème lorsque l'application ou le serveur met du temps à mettre à jour les suggestions.

On peut utiliser :

```javascript
await page
    .locator("[placeholder*='Country']")
    .pressSequentially("ind", {
        delay: 150
    });
```

Avec :

```javascript
delay: 150
```

Playwright introduit un délai entre chaque caractère.

```text
i
 ↓
attente
 ↓
n
 ↓
attente
 ↓
d
 ↓
attente
 ↓
Suggestions
```

Cela laisse davantage de temps à l'application pour mettre à jour le dropdown.

> **À retenir :** `delay` est une aide de synchronisation utile dans certains contextes d'autocomplete. Ce n'est pas une règle à appliquer partout.

---

# 11. Checkout et assertions

Après avoir sélectionné le pays, on peut continuer vers le checkout.

```javascript
await page
    .locator("text=Checkout")
    .click();
```

On peut ensuite vérifier que l'email affiché correspond à celui utilisé au login :

```javascript
await expect(
    page
        .locator(".user__name [type='text']")
        .first()
).toHaveText(email);
```

Cette assertion permet de vérifier que la donnée transportée entre les étapes est correcte.

## Placer la commande

```javascript
await page
    .locator(".action__submit")
    .click();
```

Puis vérifier la confirmation :

```javascript
await expect(
    page.locator(".hero-primary")
).toHaveText(
    " Thankyou for the order. "
);
```

Le test valide donc :

```text
Login email
     ↓
Checkout
     ↓
Email affiché
     ↓
expect(email)
```

---

# 12. Récupérer l'Order ID

Après la commande, on récupère l'identifiant généré dynamiquement :

```javascript
const orderId =
    await page
        .locator(".em-spacer-1 .ng-star-inserted")
        .textContent();

console.log(orderId);
```

L'**Order ID** devient une donnée importante du scénario.

On va le conserver afin de pouvoir retrouver exactement cette commande dans l'historique.

```text
Commande créée
      ↓
Capture Order ID
      ↓
Stockage dans orderId
      ↓
Order History
      ↓
Recherche orderId
```

---

# 13. Order History : recherche dynamique

On ouvre l'historique des commandes :

```javascript
await page
    .locator("button[routerlink*='myorders']")
    .click();
```

On attend ensuite le tableau :

```javascript
await page
    .locator("tbody")
    .waitFor();
```

On récupère toutes les lignes :

```javascript
const orders = page.locator("tbody tr");

const ordersCount =
    await orders.count();
```

Puis on parcourt les commandes :

```javascript
for (let i = 0; i < ordersCount; i++) {

    const currentOrderId =
        await orders
            .nth(i)
            .locator("th")
            .textContent();

    if (orderId.includes(currentOrderId)) {

        await orders
            .nth(i)
            .locator("button")
            .first()
            .click();

        break;
    }
}
```

## Pattern utilisé

C'est exactement le même principe que pour la recherche du produit :

```text
Attendre
   ↓
Compter
   ↓
Parcourir
   ↓
Lire
   ↓
Comparer
   ↓
Agir
   ↓
break
```

> **Point important :** attendre `tbody` avant d'utiliser `count()` permet de s'assurer que les données du tableau sont disponibles.

---

# 14. Vérifier les détails

Une fois les détails de la commande ouverts :

```javascript
const orderIdDetails =
    await page
        .locator(".col-text")
        .textContent();
```

On vérifie ensuite que l'identifiant correspond à celui capturé précédemment :

```javascript
expect(
    orderId.includes(orderIdDetails)
).toBeTruthy();
```

## Objectif de l'assertion

On vérifie que :

```text
Order ID après paiement
        =
Order ID dans les détails
```

Cela permet de confirmer que l'on a retrouvé la bonne commande.

---

# 15. Exemple complet commenté

```javascript
import { expect, test } from '@playwright/test';

test("Client App - Complete E2E Order Flow", async ({ page }) => {

    const email = "anshika@gmail.com";
    const password = "Iamking@000";
    const productName = "ADIDAS ORIGINAL";

    // 1. Login
    await page.goto(
        "https://rahulshettyacademy.com/client"
    );

    await page
        .locator("#userEmail")
        .fill(email);

    await page
        .locator("#userPassword")
        .fill(password);

    await page
        .locator("[value='Login']")
        .click();

    // 2. Wait for products
    await page
        .locator(".card-body b")
        .first()
        .waitFor();

    // 3. Find product dynamically
    const products =
        page.locator(".card-body");

    const productCount =
        await products.count();

    for (let i = 0; i < productCount; i++) {

        const product =
            products.nth(i);

        const name =
            await product
                .locator("b")
                .textContent();

        if (name.includes(productName)) {

            await product
                .getByRole(
                    "button",
                    { name: "Add To Cart" }
                )
                .click();

            break;
        }
    }

    // 4. Cart
    await page
        .locator("[routerLink*='cart']")
        .click();

    const cartProduct =
        page.locator(
            `h3:has-text('${productName}')`
        );

    await cartProduct.waitFor();

    expect(
        await cartProduct.isVisible()
    ).toBeTruthy();

    // 5. Checkout
    await page
        .locator("text=Checkout")
        .click();

    // 6. Country autocomplete
    await page
        .locator("[placeholder*='Country']")
        .pressSequentially(
            "Fra",
            { delay: 100 }
        );

    const dropdown =
        page.locator(".ta-results");

    await dropdown.waitFor();

    const optionsCount =
        await dropdown
            .locator("button")
            .count();

    for (let i = 0; i < optionsCount; i++) {

        const option =
            dropdown
                .locator("button")
                .nth(i);

        const name =
            await option.textContent();

        if (name.includes("France")) {

            await option.click();

            break;
        }
    }

    // 7. Validate checkout data
    await expect(
        page
            .locator(".user__name [type='text']")
            .first()
    ).toHaveText(email);

    // 8. Place order
    await page
        .locator(".action__submit")
        .click();

    await expect(
        page.locator(".hero-primary")
    ).toHaveText(
        " Thankyou for the order. "
    );

    // 9. Capture Order ID
    const orderId =
        await page
            .locator(
                ".em-spacer-1 .ng-star-inserted"
            )
            .textContent();

    console.log("Order ID:", orderId);

    // 10. Open Order History
    await page
        .locator(
            "button[routerlink*='myorders']"
        )
        .click();

    await page
        .locator("tbody")
        .waitFor();

    // 11. Find the order dynamically
    const orders =
        page.locator("tbody tr");

    const count =
        await orders.count();

    for (let i = 0; i < count; i++) {

        const currentId =
            await orders
                .nth(i)
                .locator("th")
                .textContent();

        if (orderId.includes(currentId)) {

            await orders
                .nth(i)
                .locator("button")
                .first()
                .click();

            break;
        }
    }

    // 12. Validate details
    const details =
        await page
            .locator(".col-text")
            .textContent();

    expect(
        orderId.includes(details)
    ).toBeTruthy();
});
```

---

# 16. Concepts Playwright mobilisés

| Concept               | Exemple du chapitre                    | Rôle                          |
| --------------------- | -------------------------------------- | ----------------------------- |
| `locator()`           | `#userEmail`, `.card-body`, `tbody tr` | Identifier des éléments       |
| `waitFor()`           | `.card-body b`, `.ta-results`, `tbody` | Synchroniser                  |
| `count()`             | Produits, options, commandes           | Compter une collection        |
| `nth()`               | Produit/option/ligne courant           | Accéder à un élément          |
| `first()`             | Premier élément                        | Sélectionner le premier       |
| `textContent()`       | Nom, pays, Order ID                    | Lire du texte                 |
| `isVisible()`         | Produit dans le panier                 | Lire un état                  |
| `expect()`            | Checkout, confirmation, détails        | Valider                       |
| `getByRole()`         | Add To Cart                            | Locator orienté accessibilité |
| `pressSequentially()` | Country                                | Saisie progressive            |
| `fill()`              | Email/password                         | Remplir un champ              |
| `click()`             | Login, panier, checkout                | Effectuer une action          |

---

## 16.1 Pattern réutilisable

Ce pattern est très important pour l'automatisation de collections dynamiques :

```javascript
const items =
    page.locator("...");

await items
    .first()
    .waitFor();

const count =
    await items.count();

for (let i = 0; i < count; i++) {

    const item =
        items.nth(i);

    const text =
        await item
            .locator("...")
            .textContent();

    if (text.includes("valeur recherchée")) {

        await item
            .locator("button")
            .click();

        break;
    }
}
```

## Pattern mental

```text
Collection
    ↓
waitFor()
    ↓
count()
    ↓
for
    ↓
nth(i)
    ↓
textContent()
    ↓
includes()
    ↓
click()
    ↓
break
```

Ce pattern peut être réutilisé pour :

* des produits ;
* des pays ;
* des commandes ;
* des lignes de tableau ;
* des résultats de recherche ;
* des options de dropdown.

---

# 17. Erreurs fréquentes et bonnes pratiques

## 1. Produit à position fixe

### ❌ Fragile

```javascript
await products.nth(0).click();
```

Le produit pourrait changer de position.

### ✅ Préférer

Rechercher le produit par son nom.

```javascript
if (name.includes(productName)) {
    // ...
}
```

---

## 2. Mauvais bouton `Add To Cart`

Éviter de chercher globalement :

```javascript
page.getByRole("button", {
    name: "Add To Cart"
});
```

Plusieurs produits peuvent avoir ce bouton.

Préférer :

```javascript
product.getByRole("button", {
    name: "Add To Cart"
});
```

Le bouton est ainsi recherché **à l'intérieur du produit courant**.

---

## 3. Attentes arbitraires

Éviter autant que possible les attentes artificielles :

```javascript
await page.waitForTimeout(5000);
```

Préférer une attente liée à un élément ou à un état utile :

```javascript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

---

## 4. Traiter un autocomplete comme un `<select>`

Un autocomplete dynamique n'est pas nécessairement un `<select>`.

Il faut généralement :

```text
Saisir
  ↓
Attendre les suggestions
  ↓
Parcourir les options
  ↓
Trouver l'option
  ↓
Cliquer
```

---

## 5. Saisie trop rapide

Si l'application ne suit pas la saisie :

```javascript
await locator.pressSequentially(
    "Fra",
    { delay: 150 }
);
```

Mais `delay` ne doit pas être utilisé systématiquement.

---

## 6. Ne pas ajouter d'assertions

Après les actions importantes, vérifier le résultat.

Exemple :

```javascript
await expect(
    page.locator(".hero-primary")
).toHaveText(
    " Thankyou for the order. "
);
```

---

## 7. Perdre l'Order ID

L'Order ID doit être conservé dans une variable :

```javascript
const orderId =
    await locator.textContent();
```

Puis réutilisé :

```javascript
if (orderId.includes(currentOrderId)) {
    // ...
}
```

---

## 8. Order History non synchronisé

Avant de parcourir les commandes :

```javascript
await page
    .locator("tbody")
    .waitFor();
```

Puis seulement :

```javascript
const orders =
    page.locator("tbody tr");

const count =
    await orders.count();
```

---

# 18. Exercices

1. Remplacer `ADIDAS ORIGINAL` par `ZARA COAT 3`.
2. Afficher tous les titres avec `allTextContents()`.
3. Ajouter une assertion confirmant la présence du produit dans le panier.
4. Tester un autre pays dans l'autocomplete.
5. Comparer plusieurs valeurs de `delay`.
6. Vérifier que l'email du checkout est identique à celui du login.
7. Capturer et afficher l'Order ID.
8. Rechercher la commande dynamiquement dans Order History.
9. Ouvrir les détails de la bonne commande.
10. Ajouter une assertion finale sur l'Order ID.

---

# 19. Fiche mémo

| Objectif        | Syntaxe                                                 |
| --------------- | ------------------------------------------------------- |
| Naviguer        | `await page.goto(url)`                                  |
| Remplir         | `await locator.fill(value)`                             |
| Cliquer         | `await locator.click()`                                 |
| Attendre        | `await locator.waitFor()`                               |
| Compter         | `await locator.count()`                                 |
| Élément `i`     | `locator.nth(i)`                                        |
| Premier         | `locator.first()`                                       |
| Texte           | `await locator.textContent()`                           |
| Tous les textes | `await locator.allTextContents()`                       |
| Visible         | `await locator.isVisible()`                             |
| Assertion vraie | `expect(value).toBeTruthy()`                            |
| Assertion texte | `await expect(locator).toHaveText(text)`                |
| Autocomplete    | `await locator.pressSequentially(text, { delay: 150 })` |
| Par rôle        | `locator.getByRole('button', { name: 'Add To Cart' })`  |
| Pause debug     | `await page.pause()`                                    |

---

# 20. Checklist de validation

* [ ] Je sais construire un workflow E2E.
* [ ] Je sais attendre le chargement des produits.
* [ ] Je comprends `count()` et `nth()`.
* [ ] Je sais parcourir une liste avec `for`.
* [ ] Je sais rechercher un produit par son nom.
* [ ] Je sais limiter un bouton au produit courant.
* [ ] Je sais vérifier le panier.
* [ ] Je comprends le fonctionnement d'un autocomplete dynamique.
* [ ] Je sais utiliser `pressSequentially()`.
* [ ] Je comprends le rôle de `delay`.
* [ ] Je sais conserver une donnée dynamique.
* [ ] Je sais récupérer un Order ID.
* [ ] Je sais parcourir une table.
* [ ] Je sais retrouver une ligne par son identifiant.
* [ ] Je sais vérifier les détails d'une commande.

---

# Conclusion

Ce chapitre marque le passage vers une véritable **automatisation End-to-End**.

Le test ne vérifie plus une action isolée : il transporte des données d'une étape à l'autre, recherche dynamiquement des éléments et valide le résultat final.

Les deux patterns les plus importants à retenir sont :

### 1. Recherche dynamique dans une collection

```text
Collection
    ↓
count()
    ↓
for
    ↓
nth(i)
    ↓
textContent()
    ↓
Comparaison
    ↓
Action
```

### 2. Synchronisation avec les interfaces dynamiques

```text
Action
  ↓
Attendre l'élément nécessaire
  ↓
Lire / interagir
  ↓
Assertion
```

## Vue globale du scénario

```text
Login
  ↓
Wait for products
  ↓
Find product dynamically
  ↓
Add to cart
  ↓
Verify cart
  ↓
Checkout
  ↓
Autocomplete country
  ↓
Validate checkout
  ↓
Place order
  ↓
Capture Order ID
  ↓
Order History
  ↓
Find order dynamically
  ↓
Verify details
```

### Les notions essentielles du chapitre

> **`count()` + `nth()` + boucle `for`** permettent de parcourir une collection dynamique.

> **`waitFor()`** permet de synchroniser le test avec l'apparition d'éléments nécessaires.

> **`pressSequentially()` + `delay`** sont utiles pour les champs autocomplete dynamiques.

> **Les variables permettent de transporter les données** d'une étape du scénario à une autre.

> **Les assertions** permettent de vérifier que chaque étape importante produit le résultat attendu.