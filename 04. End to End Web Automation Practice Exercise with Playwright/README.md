# 🎭 Playwright — Chapitre 4

## End-to-End Web Automation Practice

**Login • Produits dynamiques • Panier • Checkout • Autocomplete • Commande • Order History**

> Documentation construite à partir des notes du cours.

> Elle reprend la progression et les exemples du chapitre, puis ajoute des explications pédagogiques pour faciliter l’apprentissage.

> **Complément pédagogique :** les explications qui ne figurent pas explicitement dans les notes du cours sont signalées comme telles.

---

## Sommaire

1. [Objectifs du chapitre](#1-objectifs-du-chapitre)
2. [Le scénario End-to-End](#2-le-scénario-end-to-end)
3. [Login](#3-login)
4. [Synchronisation après le login](#4-synchronisation-après-le-login)
5. [Recherche dynamique d’un produit](#5-recherche-dynamique-dun-produit)
6. [`count()`, `nth()` et les boucles](#6-count-nth-et-les-boucles)
7. [Ajouter un produit au panier](#7-ajouter-un-produit-au-panier)
8. [Vérifier le panier](#8-vérifier-le-panier)
9. [Le dropdown autocomplete](#9-le-dropdown-autocomplete)
10. [`pressSequentially()` et `delay`](#10-presssequentially-et-delay)
11. [Checkout et assertions](#11-checkout-et-assertions)
12. [Récupérer l’Order ID](#12-récupérer-lorder-id)
13. [Order History](#13-order-history)
14. [Vérifier les détails de la commande](#14-vérifier-les-détails-de-la-commande)
15. [Exemple complet du chapitre](#15-exemple-complet-du-chapitre)
16. [Concepts Playwright mobilisés](#16-concepts-playwright-mobilisés)
17. [Pattern : parcourir une collection dynamique](#17-pattern-parcourir-une-collection-dynamique)
18. [Erreurs et points d’attention](#18-erreurs-et-points-dattention)
19. [Exercices conseillés](#19-exercices-conseillés)
20. [Mémo des concepts](#20-mémo-des-concepts)
21. [Checklist d’apprentissage](#21-checklist-dapprentissage)
22. [Résumé final](#22-résumé-final)
23. [Transition vers le chapitre suivant](#23-transition-vers-le-chapitre-suivant)

---

# 1. Objectifs du chapitre

À la fin de ce chapitre, vous serez capable de :

* Construire un véritable scénario **End-to-End** avec Playwright.
* Réutiliser des données entre différentes étapes d’un scénario.
* Rechercher dynamiquement un produit dans une collection.
* Utiliser `count()` pour connaître le nombre d’éléments.
* Utiliser `nth()` pour accéder à un élément précis d’une collection.
* Parcourir une collection avec une boucle `for`.
* Limiter une action au contexte de l’élément actuellement recherché.
* Synchroniser le test avec une interface dynamique.
* Manipuler un champ **autocomplete**.
* Utiliser `pressSequentially()` pour simuler une saisie progressive.
* Comprendre le rôle de `delay` dans une saisie dynamique.
* Ajouter des assertions après les étapes importantes.
* Capturer une donnée générée dynamiquement comme un **Order ID**.
* Réutiliser cet identifiant pour retrouver une commande dans l’historique.
* Vérifier que les détails affichés correspondent à la commande créée.

Le chapitre marque donc une évolution importante :

```text
Tests simples

      ↓

Interactions avec la page

      ↓

Collections dynamiques

      ↓

Données transportées entre les étapes

      ↓

Workflow End-to-End complet
```

---

# 2. Le scénario End-to-End

Le scénario étudié simule le parcours complet d’un utilisateur dans une application e-commerce.

Le workflow général est :

```text
Login

   ↓

Charger les produits

   ↓

Rechercher un produit

   ↓

Ajouter au panier

   ↓

Ouvrir le panier

   ↓

Vérifier le produit

   ↓

Checkout

   ↓

Saisir / sélectionner les informations

   ↓

Sélectionner le pays

   ↓

Valider la commande

   ↓

Récupérer l’Order ID

   ↓

Ouvrir Order History

   ↓

Rechercher la commande

   ↓

Afficher les détails

   ↓

Vérifier l’Order ID
```

Le scénario général mentionne également :

* l’application d’un coupon ;
* le paiement.

Cependant, ces deux étapes ne sont pas entièrement implémentées dans les extraits fournis.

> **Complément pédagogique :** ce scénario illustre une caractéristique importante des tests E2E : une donnée produite à une étape peut devenir l’entrée d’une étape ultérieure.

Par exemple :

```text
Login
  ↓
email
  ↓
Checkout
  ↓
Order ID
  ↓
Order History
  ↓
Détails de la commande
```

Le test ne se contente donc plus de vérifier des actions isolées.

Il vérifie la **continuité du parcours utilisateur**.

---

# 3. Login

Le scénario commence par l’ouverture de l’application et la saisie des identifiants.

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

Le test utilise ici directement la fixture :

```javascript
{ page }
```

Playwright fournit automatiquement la page nécessaire au scénario.

---

## 3.1 Pourquoi conserver l’email dans une variable ?

L’email est stocké dans une variable :

```javascript
const email = "anshika@gmail.com";
```

Cette donnée pourra être réutilisée plus tard.

Par exemple, lors du checkout :

```javascript
await expect(
    page
        .locator(".user__name [type='text']")
        .first()
).toHaveText(email);
```

Le test vérifie alors que l’adresse affichée correspond à celle utilisée au début du scénario.

On obtient donc :

```text
Login

  ↓

email

  ↓

Checkout

  ↓

email affiché

  ↓

expect(email)
```

> **Idée clé :** les variables permettent de transporter des données entre différentes étapes du test.

---

# 4. Synchronisation après le login

Après le login, les produits sont chargés dynamiquement.

Le test doit donc attendre qu’un élément nécessaire soit disponible avant de continuer.

Une approche présentée dans le chapitre est :

```javascript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

Le premier titre de produit sert ici de **repère de synchronisation**.

---

## 4.1 Pourquoi attendre ?

Sans synchronisation, le test pourrait essayer de parcourir les produits avant qu’ils soient disponibles.

Le scénario deviendrait alors :

```text
Login

  ↓

Produits encore en chargement

  ↓

Recherche des produits

  ↓

Risque d'échec
```

Avec une attente :

```text
Login

  ↓

Attendre un produit

  ↓

Produits disponibles

  ↓

Recherche
```

---

## 4.2 `waitForLoadState("networkidle")`

Le support présente également :

```javascript
await page.waitForLoadState("networkidle");
```

Cette instruction correspond à une attente plus globale liée à l’activité réseau.

On peut comparer les deux approches :

```text
waitForLoadState("networkidle")

        ↓

Attente globale du réseau


locator.waitFor()

        ↓

Attente ciblée d’un élément
```

> **Complément pédagogique :** lorsqu’un élément précis est nécessaire pour poursuivre le scénario, une attente ciblée permet de décrire plus directement la condition utile au test.

---

# 5. Recherche dynamique d’un produit

Le chapitre montre comment rechercher :

```text
ADIDAS ORIGINAL
```

sans dépendre de la position du produit dans la page.

On récupère d’abord la collection :

```javascript
const products = page.locator(".card-body");
```

Puis le nom recherché :

```javascript
const productName = "ADIDAS ORIGINAL";
```

On compte ensuite les produits :

```javascript
const productCount = await products.count();
```

Enfin, on parcourt la collection :

```javascript
for (let i = 0; i < productCount; i++) {

    const product = products.nth(i);

    const currentProductName =
        await product
            .locator("b")
            .textContent();

    if (currentProductName.includes(productName)) {

        await product
            .getByRole(
                "button",
                { name: "Add To Cart" }
            )
            .click();

        break;
    }
}
```

---

## 5.1 Décomposition

Le test effectue les opérations suivantes :

1. récupérer la collection de produits ;
2. compter les produits ;
3. parcourir chaque produit ;
4. récupérer le nom du produit courant ;
5. comparer ce nom avec le produit recherché ;
6. cliquer sur `Add To Cart` si le produit correspond ;
7. quitter la boucle avec `break`.

Schéma :

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

Comparer avec
"ADIDAS ORIGINAL"

      ↓

Correspond ?

   ↙          ↘

 Non          Oui

  ↓             ↓

Continuer    Add To Cart

                ↓

              break
```

> **Idée clé :** on recherche le produit selon son contenu métier plutôt que selon sa position dans la page.

---

# 6. `count()`, `nth()` et les boucles

Ces trois notions sont essentielles lorsqu’on travaille avec une collection dynamique.

| Méthode         | Rôle                                |
| --------------- | ----------------------------------- |
| `count()`       | Retourne le nombre d’éléments       |
| `nth(i)`        | Sélectionne l’élément à l’index `i` |
| `first()`       | Sélectionne le premier élément      |
| `textContent()` | Lit le texte d’un élément           |

Exemple :

```javascript
const products = page.locator(".card-body");

const count = await products.count();

for (let i = 0; i < count; i++) {

    const product = products.nth(i);

    console.log(
        await product
            .locator("b")
            .textContent()
    );

}
```

---

## 6.1 Les index commencent à 0

Il faut retenir que les index commencent à **0**.

```text
nth(0) → premier élément

nth(1) → deuxième élément

nth(2) → troisième élément

nth(3) → quatrième élément
```

> **Complément pédagogique :** c’est une convention classique dans beaucoup de langages de programmation et de structures de données.

---

# 7. Ajouter un produit au panier

Une fois le produit trouvé, le bouton `Add To Cart` est recherché **à l’intérieur du produit courant** :

```javascript
await product
    .getByRole(
        "button",
        { name: "Add To Cart" }
    )
    .click();
```

Cette notion est importante.

La page peut contenir plusieurs boutons :

```text
Product A
  └── Add To Cart

Product B
  └── Add To Cart

Product C
  └── Add To Cart

Product D
  └── Add To Cart
```

Si l’on recherche globalement :

```javascript
page.getByRole(
    "button",
    { name: "Add To Cart" }
);
```

plusieurs boutons peuvent correspondre.

En revanche :

```javascript
product.getByRole(
    "button",
    { name: "Add To Cart" }
);
```

limite la recherche au produit actuellement sélectionné.

---

## 7.1 Variante présentée dans les notes

Une autre syntaxe est présentée :

```javascript
await product
    .locator("text= Add To Cart")
    .click();
```

La version avec `getByRole()` est toutefois plus descriptive :

```javascript
product.getByRole(
    "button",
    { name: "Add To Cart" }
);
```

---

# 8. Vérifier le panier

Après l’ajout du produit, le test ouvre le panier :

```javascript
await page
    .locator("[routerLink*='cart']")
    .click();
```

On attend ensuite que le produit apparaisse :

```javascript
await page
    .locator("h3:has-text('ADIDAS ORIGINAL')")
    .waitFor();
```

Puis on vérifie sa visibilité :

```javascript
const visible =
    await page
        .locator("h3:has-text('ADIDAS ORIGINAL')")
        .isVisible();

expect(visible).toBeTruthy();
```

---

## 8.1 Séquence de vérification

```text
Ajouter au panier

       ↓

Ouvrir le panier

       ↓

Attendre le produit

       ↓

Vérifier sa visibilité

       ↓

PASS / FAIL
```

> **Bonne pratique :** synchroniser le test avec l’élément nécessaire avant de lire son état.

---

# 9. Le dropdown autocomplete

Le choix du pays utilise un **autocomplete dynamique**.

Ce n’est donc pas nécessairement un simple élément HTML :

```html
<select>
```

Le test doit interagir avec une interface dynamique.

La logique est :

```text
Saisir quelques caractères

        ↓

Attendre les suggestions

        ↓

Parcourir les suggestions

        ↓

Trouver le pays

        ↓

Cliquer
```

Exemple :

```javascript
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

    const currentOptionName =
        await option.textContent();

    if (currentOptionName.includes("France")) {

        await option.click();

        break;
    }
}
```

---

## 9.1 Structure mentale

```text
Country input

     ↓

"Fra"

     ↓

Autocomplete

     ↓

.ta-results

     ↓

Liste de suggestions

     ↓

for

     ↓

nth(i)

     ↓

textContent()

     ↓

"France"

     ↓

click()
```

---

# 10. `pressSequentially()` et `delay`

Pour certains champs autocomplete, une saisie progressive peut être utile.

Le test utilise :

```javascript
await page
    .locator("[placeholder*='Country']")
    .pressSequentially(
        "Fra",
        {
            delay: 150
        }
    );
```

`pressSequentially()` permet de saisir progressivement les caractères.

Avec :

```javascript
delay: 150
```

un délai est introduit entre les caractères.

On peut représenter le fonctionnement ainsi :

```text
F

↓

attente

↓

r

↓

attente

↓

a

↓

attente

↓

Suggestions
```

Cette technique laisse davantage de temps à l’application pour mettre à jour les suggestions.

> **À retenir :** `delay` peut être utile dans certains contextes d’autocomplete dynamique. Il ne doit pas être ajouté systématiquement à toutes les saisies.

---

# 11. Checkout et assertions

Après avoir sélectionné le pays, le scénario continue vers le checkout.

```javascript
await page
    .locator("text=Checkout")
    .click();
```

On peut ensuite vérifier que l’email affiché correspond à celui utilisé au login :

```javascript
await expect(
    page
        .locator(".user__name [type='text']")
        .first()
).toHaveText(email);
```

Cette assertion vérifie le transport correct de la donnée entre les étapes.

```text
Login

  ↓

email

  ↓

Checkout

  ↓

email affiché

  ↓

expect(email)
```

---

## 11.1 Placer la commande

Le test valide ensuite la commande :

```javascript
await page
    .locator(".action__submit")
    .click();
```

Puis il vérifie le message de confirmation :

```javascript
await expect(
    page.locator(".hero-primary")
).toHaveText(
    " Thankyou for the order. "
);
```

Le scénario valide donc :

```text
Checkout

   ↓

Place Order

   ↓

Confirmation

   ↓

Assertion

   ↓

PASS / FAIL
```

---

# 12. Récupérer l’Order ID

Après la création de la commande, l’application génère dynamiquement un **Order ID**.

Le test récupère cette donnée :

```javascript
const orderId =
    await page
        .locator(
            ".em-spacer-1 .ng-star-inserted"
        )
        .textContent();

console.log(orderId);
```

Cette donnée est ensuite conservée dans :

```javascript
orderId
```

Elle pourra être utilisée pour retrouver exactement la commande créée.

---

## 12.1 Transport de la donnée

Le rôle de cette variable est particulièrement important :

```text
Commande créée

      ↓

Capture Order ID

      ↓

orderId

      ↓

Order History

      ↓

Recherche orderId

      ↓

Détails
```

Le test devient ainsi capable de suivre une donnée dynamique produite pendant son exécution.

> **Idée clé :** un scénario E2E peut utiliser le résultat d’une étape comme donnée d’entrée pour une étape suivante.

---

# 13. Order History

Le test ouvre ensuite l’historique des commandes :

```javascript
await page
    .locator(
        "button[routerlink*='myorders']"
    )
    .click();
```

Il attend ensuite que le tableau soit disponible :

```javascript
await page
    .locator("tbody")
    .waitFor();
```

Puis il récupère les lignes :

```javascript
const orders =
    page.locator("tbody tr");

const ordersCount =
    await orders.count();
```

Enfin, il parcourt les commandes :

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

---

## 13.1 Le même pattern que pour les produits

La recherche d’une commande reprend exactement la logique utilisée pour rechercher le produit.

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

Pour les produits :

```text
Produits
  ↓
Nom
  ↓
Comparaison
  ↓
Add To Cart
```

Pour les commandes :

```text
Commandes
  ↓
Order ID
  ↓
Comparaison
  ↓
View Details
```

> **Idée clé :** un même pattern Playwright peut être réutilisé sur des données très différentes.

---

# 14. Vérifier les détails de la commande

Une fois les détails de la commande ouverts, le test récupère l’identifiant affiché :

```javascript
const orderIdDetails =
    await page
        .locator(".col-text")
        .textContent();
```

Puis il vérifie que l’identifiant correspond à celui capturé précédemment :

```javascript
expect(
    orderId.includes(orderIdDetails)
).toBeTruthy();
```

---

## 14.1 Objectif de l’assertion

Le test vérifie que :

```text
Order ID après création

          =

Order ID dans les détails
```

Cela permet de confirmer que la bonne commande a été retrouvée.

Le scénario complet devient :

```text
Créer une commande

      ↓

Capturer Order ID

      ↓

Ouvrir Order History

      ↓

Chercher Order ID

      ↓

Ouvrir la commande

      ↓

Lire Order ID

      ↓

Comparer

      ↓

PASS / FAIL
```

---

# 15. Exemple complet du chapitre

Voici un exemple regroupant les principales notions étudiées.

```javascript
import { expect, test } from '@playwright/test';

test(
    "Client App - Complete E2E Order Flow",
    async ({ page }) => {

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
            .locator(
                ".user__name [type='text']"
            )
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

    console.log(
        "Order ID:",
        orderId
    );

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
| `nth()`               | Produit, option, ligne courante        | Accéder à un élément          |
| `first()`             | Premier produit / premier bouton       | Sélectionner le premier       |
| `textContent()`       | Nom, pays, Order ID                    | Lire du texte                 |
| `isVisible()`         | Produit dans le panier                 | Lire un état                  |
| `expect()`            | Checkout, confirmation, détails        | Vérifier un résultat          |
| `getByRole()`         | `Add To Cart`                          | Locator orienté accessibilité |
| `fill()`              | Email / password                       | Remplir un champ              |
| `click()`             | Login, panier, checkout                | Effectuer une action          |
| `pressSequentially()` | Country                                | Saisie progressive            |
| `includes()`          | Produit / Order ID                     | Comparer du contenu           |

---

# 17. Pattern : parcourir une collection dynamique

Un des patterns les plus importants du chapitre est le parcours d’une collection dynamique.

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

    if (
        text.includes(
            "valeur recherchée"
        )
    ) {

        await item
            .locator("button")
            .click();

        break;
    }
}
```

---

## 17.1 Pattern mental

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

Ce pattern peut être utilisé pour :

* des produits ;
* des pays ;
* des commandes ;
* des lignes de tableau ;
* des résultats de recherche ;
* des options de dropdown.

---

## 17.2 Deux exemples du chapitre

### Recherche d’un produit

```text
.card-body

   ↓

Nom du produit

   ↓

ADIDAS ORIGINAL

   ↓

Add To Cart
```

### Recherche d’une commande

```text
tbody tr

   ↓

Order ID

   ↓

Order ID recherché

   ↓

View Details
```

Le mécanisme est identique.

---

# 18. Erreurs et points d’attention

> **Complément pédagogique :** cette section rassemble des points pratiques permettant d’éviter certaines erreurs fréquentes lors de l’écriture de scénarios E2E.

---

## 18.1 Dépendre d’une position fixe

### ❌ Fragile

```javascript
await products
    .nth(0)
    .click();
```

Le produit peut changer de position.

### ✅ Préférer

Rechercher le produit selon son nom :

```javascript
if (name.includes(productName)) {

    // ...

}
```

---

## 18.2 Chercher globalement `Add To Cart`

### ❌ Risqué

```javascript
page.getByRole(
    "button",
    { name: "Add To Cart" }
);
```

Plusieurs produits peuvent posséder ce bouton.

### ✅ Préférer

```javascript
product.getByRole(
    "button",
    { name: "Add To Cart" }
);
```

Le bouton est alors recherché dans le contexte du produit courant.

---

## 18.3 Utiliser des attentes arbitraires

Éviter autant que possible :

```javascript
await page.waitForTimeout(5000);
```

Une attente de durée fixe ne garantit pas que la condition nécessaire soit réellement satisfaite.

Préférer une attente liée à un élément utile :

```javascript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

---

## 18.4 Traiter un autocomplete comme un `<select>`

Un autocomplete dynamique n'est pas nécessairement un :

```html
<select>
```

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

## 18.5 Saisie trop rapide

Si l'application ne suit pas correctement la saisie :

```javascript
await locator.pressSequentially(
    "Fra",
    {
        delay: 150
    }
);
```

Mais `delay` ne doit pas être utilisé systématiquement.

---

## 18.6 Ne pas ajouter d’assertions

Une action réussie ne signifie pas nécessairement que le résultat attendu est correct.

Après une étape importante, ajouter une vérification.

Par exemple :

```javascript
await expect(
    page.locator(".hero-primary")
).toHaveText(
    " Thankyou for the order. "
);
```

---

## 18.7 Perdre l’Order ID

L’identifiant doit être conservé :

```javascript
const orderId =
    await locator.textContent();
```

Puis réutilisé :

```javascript
if (
    orderId.includes(currentOrderId)
) {

    // ...

}
```

---

## 18.8 Parcourir Order History trop tôt

Avant de parcourir les commandes :

```javascript
await page
    .locator("tbody")
    .waitFor();
```

Puis :

```javascript
const orders =
    page.locator("tbody tr");

const count =
    await orders.count();
```

Cela permet de synchroniser le test avec la présence du tableau.

---

# 19. Exercices conseillés

## Exercice 1 — Changer de produit

Remplacer :

```javascript
const productName =
    "ADIDAS ORIGINAL";
```

par :

```javascript
const productName =
    "ZARA COAT 3";
```

Observer si la recherche dynamique fonctionne toujours.

---

## Exercice 2 — Afficher tous les produits

Utiliser :

```javascript
allTextContents()
```

pour afficher les noms des produits.

---

## Exercice 3 — Vérifier le panier

Ajouter une assertion confirmant que le produit sélectionné est bien présent dans le panier.

---

## Exercice 4 — Tester un autre pays

Modifier le pays recherché dans l’autocomplete.

Par exemple :

```text
France
```

vers un autre pays disponible.

---

## Exercice 5 — Modifier `delay`

Tester plusieurs valeurs :

```javascript
delay: 50
```

```javascript
delay: 100
```

```javascript
delay: 150
```

Observer le comportement de l’autocomplete.

---

## Exercice 6 — Vérifier l’email

Vérifier que l’email affiché au checkout correspond exactement à celui utilisé lors du login.

---

## Exercice 7 — Capturer l’Order ID

Afficher l’Order ID dans la console :

```javascript
console.log(orderId);
```

---

## Exercice 8 — Rechercher une commande

Parcourir Order History et retrouver dynamiquement la commande créée.

---

## Exercice 9 — Ouvrir les détails

Après avoir trouvé la bonne ligne, ouvrir les détails de la commande.

---

## Exercice 10 — Assertion finale

Vérifier que l’Order ID affiché dans les détails correspond à celui capturé après la création de la commande.

---

# 20. Mémo des concepts

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

# 21. Checklist d’apprentissage

* [ ] Je sais construire un workflow End-to-End.
* [ ] Je sais gérer un login avec la fixture `page`.
* [ ] Je sais conserver une donnée dans une variable.
* [ ] Je sais attendre le chargement des produits.
* [ ] Je comprends `count()`.
* [ ] Je comprends `nth()`.
* [ ] Je sais parcourir une collection avec `for`.
* [ ] Je sais rechercher un produit par son nom.
* [ ] Je sais limiter un bouton au produit courant.
* [ ] Je sais ajouter un produit au panier.
* [ ] Je sais vérifier la présence du produit dans le panier.
* [ ] Je comprends le fonctionnement d’un autocomplete dynamique.
* [ ] Je sais utiliser `pressSequentially()`.
* [ ] Je comprends le rôle de `delay`.
* [ ] Je sais ajouter des assertions au checkout.
* [ ] Je sais récupérer une donnée générée dynamiquement.
* [ ] Je sais récupérer un Order ID.
* [ ] Je sais parcourir une table de commandes.
* [ ] Je sais retrouver une ligne grâce à son identifiant.
* [ ] Je sais ouvrir les détails d’une commande.
* [ ] Je sais vérifier l’Order ID final.
* [ ] Je comprends le pattern `waitFor → count → for → nth → textContent → comparaison → action`.

---

# 22. Résumé final

Ce chapitre marque le passage d’un test Playwright simple vers un véritable **workflow End-to-End**.

Le test ne vérifie plus une seule page ou une seule action.

Il reproduit un parcours complet :

```text
Login

  ↓

Produits

  ↓

Recherche dynamique

  ↓

Panier

  ↓

Checkout

  ↓

Autocomplete

  ↓

Commande

  ↓

Order ID

  ↓

Order History

  ↓

Détails

  ↓

Assertion finale
```

---

## 🧠 Le modèle mental du chapitre

```text
                     PLAYWRIGHT
                          │
                          ▼
                    TEST E2E
                          │
                          ▼
                        LOGIN
                          │
                          ▼
                   LOAD PRODUCTS
                          │
                          ▼
                COLLECTION DYNAMIQUE
                          │
                          ▼
                 count() + nth()
                          │
                          ▼
                  RECHERCHE PRODUIT
                          │
                          ▼
                    Add To Cart
                          │
                          ▼
                       CART
                          │
                          ▼
                     CHECKOUT
                          │
                          ▼
                    AUTOCOMPLETE
                          │
                          ▼
                      COUNTRY
                          │
                          ▼
                    PLACE ORDER
                          │
                          ▼
                    ORDER ID
                          │
                          ▼
                   ORDER HISTORY
                          │
                          ▼
                 RECHERCHE DYNAMIQUE
                          │
                          ▼
                      DETAILS
                          │
                          ▼
                     ASSERTION
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                  PASS         FAIL
```

---

## 🎯 Les 5 notions prioritaires

| # | Notion                     | À retenir                                                                  |
| - | -------------------------- | -------------------------------------------------------------------------- |
| 1 | **Workflow E2E**           | Un test peut reproduire un parcours utilisateur complet                    |
| 2 | **Collections dynamiques** | `count()` + `nth()` + boucle permettent de parcourir des éléments          |
| 3 | **Synchronisation**        | `waitFor()` permet d’attendre qu’un élément nécessaire soit disponible     |
| 4 | **Données transportées**   | Les variables permettent de réutiliser des données entre les étapes        |
| 5 | **Assertions**             | `expect()` permet de vérifier que les résultats correspondent aux attentes |

---

## 🚀 Les deux patterns à mémoriser

### 1. Recherche dynamique dans une collection

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

Comparaison

    ↓

Action

    ↓

break
```

Ce pattern est utilisé pour :

* les produits ;
* les pays ;
* les commandes ;
* les lignes de tableau ;
* les options de dropdown.

---

### 2. Synchronisation avec une interface dynamique

```text
Action

  ↓

Attendre l’élément nécessaire

  ↓

Lire / interagir

  ↓

Assertion
```

L’objectif est d’éviter que le test continue alors que l’application n’est pas encore prête.

---

## 🔄 Transport des données dans un scénario E2E

Une autre notion fondamentale du chapitre est la circulation des données :

```text
LOGIN

  ↓

email
  │
  └───────────────┐
                  ▼
              CHECKOUT
                  │
                  ▼
             PLACE ORDER
                  │
                  ▼
              orderId
                  │
                  ▼
           ORDER HISTORY
                  │
                  ▼
          SEARCH orderId
                  │
                  ▼
              DETAILS
                  │
                  ▼
          VERIFY orderId
```

Le scénario devient ainsi **contextuel** : chaque étape s’appuie sur les informations produites précédemment.

---

# 23. Transition vers le chapitre suivant

Le Chapitre 4 a permis de passer d’actions isolées à un **scénario End-to-End complet**.

Nous savons maintenant :

```text
Créer un scénario

      ↓

Naviguer

      ↓

Interagir

      ↓

Parcourir des collections

      ↓

Synchroniser

      ↓

Transporter des données

      ↓

Créer une commande

      ↓

Retrouver une donnée dynamique

      ↓

Vérifier le résultat final
```

La question suivante devient alors :

```text
Notre scénario fonctionne...

        ↓

Comment le rendre plus robuste ?

        ↓

Comment éviter de répéter le même code ?

        ↓

Comment organiser les données ?

        ↓

Comment réutiliser les actions ?

        ↓

Comment créer des fonctions et des Page Objects ?

        ↓

Comment rendre les tests maintenables ?
```

C’est ici qu’interviennent les notions des chapitres suivants autour de la **réutilisation, de la structuration et de la maintenabilité des tests Playwright**.

> **Idée centrale du chapitre :** un test End-to-End efficace ne consiste pas simplement à enchaîner des `click()` et des `fill()`. Il doit savoir **attendre, rechercher dynamiquement, transporter des données, agir sur le bon élément et vérifier les résultats**. Les patterns `count()` + `nth()` + boucle, la synchronisation et les assertions constituent les fondations de scénarios E2E plus réalistes.