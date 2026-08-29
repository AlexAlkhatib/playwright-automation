# 🎭 Playwright — Chapitre 8

## API Testing with Playwright & Build mix of Web + API tests

> Documentation construite à partir des notes du cours.  
> Elle reprend la progression et les exemples du chapitre, puis ajoute des explications pédagogiques pour faciliter l’apprentissage.
>
> **Complément pédagogique :** les explications qui ne figurent pas explicitement dans les notes du cours sont signalées comme telles.

---

## Sommaire

1. [Objectifs du chapitre](#1-objectifs-du-chapitre)
2. [Pourquoi utiliser les APIs dans les tests Web ?](#2-pourquoi-utiliser-les-apis-dans-les-tests-web-)
3. [Le principe JSON / Endpoint / Response](#3-le-principe-json--endpoint--response)
4. [Cas d’usage : authentification](#4-cas-dusage--authentification)
5. [Tester les APIs avec Playwright](#5-tester-les-apis-avec-playwright)
6. [La fixture `request`](#6-la-fixture-request)
7. [Créer un Request Context](#7-créer-un-request-context)
8. [Effectuer un appel POST de login](#8-effectuer-un-appel-post-de-login)
9. [Vérifier la réponse avec `expect()`](#9-vérifier-la-réponse-avec-expect)
10. [Parser une réponse JSON et récupérer le token](#10-parser-une-réponse-json-et-récupérer-le-token)
11. [Injecter le token dans le Local Storage](#11-injecter-le-token-dans-le-local-storage)
12. [Construire un test Web avec authentification API](#12-construire-un-test-web-avec-authentification-api)
13. [Exemple : ajouter un produit au panier](#13-exemple--ajouter-un-produit-au-panier)
14. [Exemple : passer une commande dans l’UI](#14-exemple--passer-une-commande-dans-lui)
15. [Pourquoi mixer API et Web ?](#15-pourquoi-mixer-api-et-web-)
16. [Créer une commande directement avec l’API](#16-créer-une-commande-directement-avec-lapi)
17. [Validation End-to-End avec API + Web](#17-validation-end-to-end-avec-api--web)
18. [Refactoriser les appels API dans `utils`](#18-refactoriser-les-appels-api-dans-utils)
19. [La classe `APiUtils`](#19-la-classe-apiutils)
20. [Réutiliser `APiUtils` dans un test](#20-réutiliser-apiutils-dans-un-test)
21. [Vérifier la commande dans l’historique](#21-vérifier-la-commande-dans-lhistorique)
22. [Cycle général d’un test Web + API](#22-cycle-général-dun-test-web--api)
23. [Erreurs et points d’attention](#23-erreurs-et-points-dattention)
24. [Mémo des concepts](#24-mémo-des-concepts)
25. [Résumé final et séquence à mémoriser](#25-résumé-final-et-séquence-à-mémoriser)

---

# 1. Objectifs du chapitre

À la fin de ce chapitre, vous devez être capable de :

- comprendre l’intérêt des appels API dans les tests Web ;
- utiliser Playwright pour effectuer des appels API ;
- créer un `request context` ;
- envoyer une requête POST ;
- récupérer et parser une réponse JSON ;
- récupérer un token d’authentification ;
- injecter ce token dans le `localStorage` du navigateur ;
- commencer un test Web directement depuis une application déjà authentifiée ;
- créer une commande via l’API ;
- combiner API et automatisation Web dans un même scénario ;
- réduire le temps d’exécution d’un test End-to-End ;
- isoler les appels API dans une classe utilitaire ;
- réutiliser cette logique dans plusieurs tests.

Le principe central du chapitre est :

```text
API
 ↓
Préparer les données / authentification
 ↓
WEB
 ↓
Valider le comportement visible par l’utilisateur
```

Les notes insistent notamment sur le fait que les appels API peuvent rendre les automatisations Web **plus rapides et plus stables**.

---

# 2. Pourquoi utiliser les APIs dans les tests Web ?

Un test Web classique peut devoir effectuer de nombreuses actions avant d’arriver au scénario réellement intéressant.

Par exemple, pour tester une commande, on pourrait devoir :

```text
Ouvrir le navigateur
        ↓
Afficher la page de login
        ↓
Saisir email
        ↓
Saisir mot de passe
        ↓
Cliquer sur Login
        ↓
Attendre la connexion
        ↓
Arriver sur la page d’accueil
        ↓
Ajouter un produit
        ↓
Passer la commande
```

Cette approche peut être relativement longue.

Avec un appel API, certaines étapes peuvent être réalisées directement :

```text
API Login
   ↓
Récupération du token
   ↓
Injection du token dans le navigateur
   ↓
Ouverture directe de l’application
```

On évite ainsi de reproduire certaines étapes de préparation dans l’interface.

## 2.1 Les deux bénéfices mis en avant dans le chapitre

### Réduire le temps d’exécution

Les APIs permettent d’effectuer certaines opérations directement sans passer par l’interface graphique.

### Rendre l’automatisation plus stable

Le test dépend moins d’une longue succession d’actions UI pour préparer son état initial.

> **Complément pédagogique :** l’idée est de conserver l’UI pour ce que l’on souhaite réellement valider visuellement, et d’utiliser l’API pour préparer rapidement les préconditions.

---

# 3. Le principe JSON / Endpoint / Response

Une API communique généralement avec des **endpoints**.

Une requête peut envoyer des données JSON :

```text
JSON
 ↓
Endpoint API
 ↓
Response
```

Dans le cas présenté dans le chapitre :

```text
Login Payload
 ↓
POST /api/ecom/auth/login
 ↓
Login Response
 ↓
Token
```

Exemple de payload :

```javascript
const loginPayload = {
    userEmail: "anshika@gmail.com",
    userPassword: "Iamking@000"
};
```

La réponse est ensuite récupérée sous forme de JSON.

```javascript
const loginResponseJson = await loginResponse.json();
```

Puis le token peut être extrait :

```javascript
const token = loginResponseJson.token;
```

---

# 4. Cas d’usage : authentification

L’authentification constitue un cas d’usage important du chapitre.

En mode navigation privée / contexte sans cookies, le navigateur ne possède pas les informations de session nécessaires :

```text
Incognito / nouveau contexte
        ↓
Pas de cookies
        ↓
Pas de token
        ↓
Pas de session authentifiée
```

Une solution consiste à appeler directement l’API de login :

```text
Login API
   ↓
Token
   ↓
Navigateur
   ↓
Application déjà authentifiée
```

L’objectif est donc de **préparer l’état d’authentification avec l’API**, puis de poursuivre le test dans l’interface.

---

# 5. Tester les APIs avec Playwright

Playwright supporte également les tests API.

Pour utiliser les fonctionnalités correspondantes, les notes indiquent l’import :

```typescript
import { expect, test, request } from '@playwright/test';
```

On retrouve donc dans le même framework :

```text
Playwright
 ├── Tests Web
 └── Tests API
```

Cela permet de construire des scénarios hybrides :

```text
API + Web
```

---

# 6. La fixture `request`

La bibliothèque Playwright expose `request`, qui permet de créer un contexte destiné aux appels API.

Exemple d’import :

```typescript
import { expect, test, request } from '@playwright/test';
```

Le principe est ensuite :

```javascript
const apiContext = await request.newContext();
```

Ce `apiContext` sera utilisé pour effectuer les appels HTTP.

---

# 7. Créer un Request Context

La création du contexte API se fait avec :

```javascript
const apiContext = await request.newContext();
```

On peut visualiser la séquence ainsi :

```text
request
   ↓
request.newContext()
   ↓
apiContext
   ↓
API calls
```

Le contexte est ensuite utilisé pour appeler les endpoints.

> **Complément pédagogique :** le `request context` joue ici un rôle comparable à un environnement dédié aux requêtes HTTP du scénario.

---

# 8. Effectuer un appel POST de login

Le chapitre utilise une requête POST pour effectuer le login.

Payload :

```javascript
const loginPayload = {
    userEmail: "anshika@gmail.com",
    userPassword: "Iamking@000"
};
```

Appel API :

```typescript
const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
        data: loginPayload
    }
);
```

La structure mentale est :

```text
apiContext
    ↓
post()
    ↓
URL
    ↓
data: loginPayload
    ↓
loginResponse
```

---

# 9. Vérifier la réponse avec `expect()`

Après l'appel API, le chapitre vérifie que la réponse est correcte :

```typescript
expect(loginResponse.ok()).toBeTruthy();
```

Cela permet de contrôler que la réponse HTTP est considérée comme OK.

Le test peut donc suivre la logique :

```text
POST Login
   ↓
loginResponse
   ↓
ok() ?
   ↓
PASS / FAIL
```

Cette vérification évite de continuer silencieusement avec une réponse invalide.

---

# 10. Parser une réponse JSON et récupérer le token

Une fois la réponse reçue, il faut récupérer son contenu JSON :

```typescript
const loginResponseJson = await loginResponse.json();
```

Puis récupérer le token :

```typescript
const token = loginResponseJson.token;
```

Dans les notes, le token est stocké dans une variable accessible au test :

```typescript
let token;
```

Puis :

```typescript
token = loginResponseJson.token;
```

La séquence complète est :

```text
loginResponse
      ↓
response.json()
      ↓
loginResponseJson
      ↓
loginResponseJson.token
      ↓
token
```

Exemple complet :

```typescript
let token;

test.beforeAll(async () => {

    const apiContext = await request.newContext();

    const loginResponse = await apiContext.post(
        "https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: loginPayload
        }
    );

    expect(loginResponse.ok()).toBeTruthy();

    const loginResponseJson = await loginResponse.json();

    token = loginResponseJson.token;

    console.log(token);
});
```

---

# 11. Injecter le token dans le Local Storage

Une fois le token récupéré, les notes montrent comment l’injecter dans le navigateur.

Le principe est :

```typescript
await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
}, token);
```

Cette instruction permet de placer le token dans le `localStorage` avant le chargement de l’application.

On peut représenter le mécanisme ainsi :

```text
Login API
   ↓
Token
   ↓
page.addInitScript()
   ↓
window.localStorage
   ↓
token
   ↓
Application authentifiée
```

La ligne importante est :

```javascript
window.localStorage.setItem("token", value);
```

> **Complément pédagogique :** l’intérêt est de reproduire l’état attendu par l’application sans refaire tout le parcours de connexion avec l’interface.

---

# 12. Construire un test Web avec authentification API

Après avoir préparé le token, le test Web peut naviguer directement vers l’application :

```typescript
await page.goto("https://rahulshettyacademy.com/client/");
```

Puis attendre que les produits soient chargés :

```typescript
await page.locator(".card-body b").first().waitFor();
```

Le scénario devient :

```text
API Login
    ↓
Token
    ↓
Injection Local Storage
    ↓
page.goto()
    ↓
Application
    ↓
Actions Web
```

---

# 13. Exemple : ajouter un produit au panier

Les notes utilisent le produit :

```text
ADIDAS ORIGINAL
```

Pour cibler la carte correspondante :

```typescript
await page
    .locator(".card-body")
    .filter({ hasText: "ADIDAS ORIGINAL" })
    .getByRole("button", { name: "Add To Cart" })
    .click();
```

La logique est :

```text
Toutes les cartes
      ↓
.filter({ hasText: "ADIDAS ORIGINAL" })
      ↓
Carte du produit
      ↓
Add To Cart
```

Puis le panier est ouvert :

```typescript
await page
    .getByRole("listitem")
    .getByRole("button", { name: "Cart" })
    .click();
```

Et le produit est vérifié :

```typescript
await expect(
    page.getByText("ADIDAS ORIGINAL")
).toBeVisible();
```

---

# 14. Exemple : passer une commande dans l’UI

Après l’ajout du produit au panier, le scénario continue avec le checkout.

## 14.1 Cliquer sur Checkout

```typescript
await page
    .getByRole("button", { name: "Checkout" })
    .click();
```

## 14.2 Sélectionner la France

Le champ est rempli progressivement :

```typescript
await page
    .getByPlaceholder("Select Country")
    .pressSequentially("Fra", { delay: 100 });
```

Puis on attend les résultats :

```typescript
await page.locator(".ta-results").waitFor();
```

Et on sélectionne l’option :

```typescript
await page
    .getByRole("button", { name: "Fra" })
    .first()
    .click();
```

## 14.3 Passer la commande

```typescript
await page.getByText("PLACE ORDER").click();
```

## 14.4 Vérifier la confirmation

```typescript
await expect(
    page.getByText("Thankyou for the order.")
).toBeVisible();
```

Le scénario complet côté UI est donc :

```text
Application
   ↓
Produit
   ↓
Add To Cart
   ↓
Cart
   ↓
Checkout
   ↓
France
   ↓
PLACE ORDER
   ↓
Thankyou for the order.
```

---

# 15. Pourquoi mixer API et Web ?

Le chapitre introduit ensuite une idée importante :

> **Préparer certaines données avec l’API et conserver les validations fonctionnelles dans le Web.**

Par exemple :

```text
API
 ├── Login
 └── Create Order
        ↓
WEB
 ├── Ouvrir l’application
 ├── Consulter le panier
 ├── Checkout
 └── Vérifier la commande
```

L’avantage est de supprimer les étapes UI inutiles.

Au lieu de créer une commande uniquement avec l’interface :

```text
Login UI
 ↓
Product UI
 ↓
Cart UI
 ↓
Checkout UI
 ↓
Create Order
```

on peut créer la commande avec l’API :

```text
Login API
 ↓
Create Order API
 ↓
WEB
 ↓
Validation
```

Cela permet de réduire le temps du test.

---

# 16. Créer une commande directement avec l’API

Le chapitre présente un `orderPayload` :

```javascript
const orderPayload = {
    orders: [
        {
            country: "France",
            productOrderId: "6a92a86b21054ba465fbb376"
        }
    ]
};
```

Une commande peut ensuite être créée avec :

```typescript
const orderResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
        data: orderPayload,
        headers: {
            Authorization: token,
            "Content-Type": "application/json"
        }
    }
);
```

On vérifie la réponse :

```typescript
expect(orderResponse.ok()).toBeTruthy();
```

Puis on parse la réponse :

```typescript
const orderResponseJson = await orderResponse.json();
```

Et on récupère l’identifiant de commande :

```typescript
orderId = orderResponseJson.orders[0];
```

La séquence est :

```text
Token
   ↓
Order Payload
   ↓
POST create-order
   ↓
Order Response
   ↓
Order ID
```

---

# 17. Validation End-to-End avec API + Web

Voici l’un des scénarios principaux du chapitre.

## 17.1 Précondition avec l’API

Avant le test Web :

```text
Login API
   ↓
Token
   ↓
Create Order API
   ↓
Order ID
```

Le code stocke :

```typescript
let token;
let orderId;
```

Puis les récupère dans `beforeAll()`.

## 17.2 Démarrage du test Web

Le token est injecté :

```typescript
await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
}, token);
```

Puis l’application est ouverte :

```typescript
await page.goto("https://rahulshettyacademy.com/client/");
```

## 17.3 Validation côté Web

Le test peut ensuite naviguer dans l’application et vérifier les éléments attendus.

Le principe devient :

```text
              API
               │
       ┌───────┴───────┐
       ↓               ↓
    Login          Create Order
       │               │
       ↓               ↓
     Token          Order ID
       │               │
       └───────┬───────┘
               ↓
              WEB
               ↓
        Application
               ↓
        Validation UI
```

---

# 18. Refactoriser les appels API dans `utils`

Le chapitre montre ensuite comment sortir les appels API du fichier de test.

L’objectif est d’éviter de mélanger :

```text
Logique API
+
Logique Web
```

dans le même fichier.

On crée donc un dossier / fichier utilitaire :

```text
utils/
   └── APiUtils.js
```

Puis le test peut importer cette classe :

```javascript
const { APiUtils } = require('./utils/APiUtils');
```

Le principe est :

```text
APiUtils
   ↓
Login API
   ↓
Create Order API
```

et :

```text
Test
   ↓
APiUtils
   ↓
Données API
   ↓
Test Web
```

> **Complément pédagogique :** cette séparation améliore la réutilisabilité et rend les tests plus faciles à lire.

---

# 19. La classe `APiUtils`

Les notes présentent une classe :

```javascript
class APiUtils {

    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

}
```

Elle reçoit :

- `apiContext` ;
- `loginPayLoad`.

## 19.1 Méthode `getToken()`

La classe contient une méthode :

```javascript
async getToken() {

    const loginResponse = await this.apiContext.post(
        "https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: this.loginPayLoad
        }
    );

    const loginResponseJson = await loginResponse.json();

    const token = loginResponseJson.token;

    console.log(token);

    return token;
}
```

La méthode :

```text
getToken()
```

effectue donc :

```text
Login API
   ↓
JSON
   ↓
Token
   ↓
return token
```

## 19.2 Méthode `createOrder()`

La deuxième méthode reçoit le payload de commande :

```javascript
async createOrder(orderPayLoad) {

    let response = {};

    response.token = await this.getToken();

    const orderResponse = await this.apiContext.post(
        "https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayLoad,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            }
        }
    );

    const orderResponseJson = await orderResponse.json();

    console.log(orderResponseJson);

    const orderId = orderResponseJson.orders[0];

    response.orderId = orderId;

    return response;
}
```

Cette méthode regroupe donc :

```text
getToken()
   ↓
Token
   ↓
Create Order API
   ↓
Order ID
   ↓
return {
    token,
    orderId
}
```

La classe est ensuite exportée :

```javascript
module.exports = { APiUtils };
```

---

# 20. Réutiliser `APiUtils` dans un test

Le test importe les éléments nécessaires :

```javascript
const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('./utils/APiUtils');
```

Les données sont définies :

```javascript
const loginPayLoad = {
    userEmail: "anshika@gmail.com",
    userPassword: "Iamking@000"
};

const orderPayLoad = {
    orders: [
        {
            country: "France",
            productOrderedId: "67a8dde5c0d3e6622a297cc8"
        }
    ]
};
```

Puis une variable est préparée :

```javascript
let response;
```

Dans `beforeAll()` :

```javascript
test.beforeAll(async () => {

    const apiContext = await request.newContext();

    const apiUtils = new APiUtils(
        apiContext,
        loginPayLoad
    );

    response = await apiUtils.createOrder(orderPayLoad);
});
```

Le résultat contient notamment :

```text
response.token
response.orderId
```

Le test Web peut alors utiliser ces informations.

---

# 21. Vérifier la commande dans l’historique

Le test navigue vers l’application :

```javascript
await page.addInitScript(value => {
    window.localStorage.setItem('token', value);
}, response.token);

await page.goto("https://rahulshettyacademy.com/client");
```

Puis ouvre l’historique des commandes :

```javascript
await page
    .locator("button[routerlink*='myorders']")
    .click();
```

On attend le tableau :

```javascript
await page.locator("tbody").waitFor();
```

Puis on récupère les lignes :

```javascript
const rows = await page.locator("tbody tr");
```

Le test parcourt ensuite les commandes :

```javascript
for (let i = 0; i < await rows.count(); ++i) {

    const rowOrderId =
        await rows.nth(i).locator("th").textContent();

    if (response.orderId.includes(rowOrderId)) {

        await rows.nth(i).locator("button").first().click();

        break;
    }
}
```

Une fois sur le détail de la commande :

```javascript
const orderIdDetails =
    await page.locator(".col-text").textContent();
```

Puis l’assertion finale :

```javascript
expect(
    response.orderId.includes(orderIdDetails)
).toBeTruthy();
```

Le test vérifie donc :

```text
Order ID créé par API
          ↓
Historique des commandes
          ↓
Order ID affiché dans l'UI
          ↓
Comparaison
          ↓
PASS / FAIL
```

---

# 22. Cycle général d’un test Web + API

Le cycle du chapitre peut être résumé ainsi :

```text
1. Créer le Request Context
              ↓
2. Appeler Login API
              ↓
3. Récupérer le token
              ↓
4. Préparer les données API
              ↓
5. Créer éventuellement une commande avec l’API
              ↓
6. Récupérer l’Order ID
              ↓
7. Injecter le token dans Local Storage
              ↓
8. Ouvrir l’application Web
              ↓
9. Effectuer les actions UI nécessaires
              ↓
10. Vérifier les données visibles
              ↓
11. Comparer avec les données obtenues par API
              ↓
12. PASS / FAIL
```

Le modèle mental essentiel est donc :

```text
                 PLAYWRIGHT
                     │
             ┌───────┴───────┐
             ▼               ▼
            API              WEB
             │                │
       Login / Order      UI Actions
             │                │
             └───────┬────────┘
                     ▼
                 Validation
                     │
                 PASS / FAIL
```

---

# 23. Erreurs et points d’attention

## 23.1 Ne pas confondre API et UI

Un appel API :

```javascript
apiContext.post(...)
```

n’est pas une interaction avec un bouton de la page.

Une action UI :

```javascript
page.getByRole("button", { name: "Checkout" }).click();
```

agit sur l’interface.

Il faut garder en tête :

```text
API → données / état / préconditions
UI  → comportement visible / parcours utilisateur
```

## 23.2 Vérifier les réponses API

Après un appel important, les notes utilisent :

```javascript
expect(response.ok()).toBeTruthy();
```

Cela permet de ne pas continuer avec une réponse qui n’est pas correcte.

## 23.3 Parser la réponse avant d’utiliser ses données

Une réponse HTTP n’est pas directement l’objet JSON attendu.

Il faut notamment :

```javascript
const responseJson = await response.json();
```

puis récupérer la donnée :

```javascript
const token = responseJson.token;
```

ou :

```javascript
const orderId = responseJson.orders[0];
```

## 23.4 Ne pas mélanger toute la logique dans le test

Lorsque les appels API deviennent nombreux, les notes proposent de les déplacer dans :

```text
utils/APiUtils.js
```

Le test devient alors plus lisible.

## 23.5 Attention aux données d’authentification

Les exemples du cours contiennent des identifiants dans le code.

> **Complément pédagogique :** dans un vrai projet, il est préférable d’éviter de versionner des identifiants réels directement dans le dépôt. La méthode exacte de gestion des secrets n’est pas détaillée dans ces notes.

---

# 24. Mémo des concepts

| Concept | À retenir |
|---|---|
| `request` | Permet d’utiliser les fonctionnalités API de Playwright |
| `request.newContext()` | Crée un contexte pour effectuer les appels API |
| `apiContext.post()` | Effectue un appel HTTP POST |
| `data` | Permet d’envoyer le payload |
| `headers` | Permet notamment de transmettre le token |
| `response.ok()` | Vérifie que la réponse est OK |
| `response.json()` | Parse la réponse en JSON |
| `token` | Information d’authentification récupérée par l’API |
| `page.addInitScript()` | Permet d’injecter le token dans le navigateur avant l’application |
| `localStorage` | Stocke ici le token utilisé par l’application |
| `orderPayload` | Données envoyées pour créer une commande |
| `orderId` | Identifiant de la commande créée |
| `beforeAll()` | Permet de préparer les données avant les tests |
| `APiUtils` | Classe qui isole et réutilise les appels API |
| API + Web | Permet de combiner préparation rapide et validation UI |

---

# 25. Résumé final et séquence à mémoriser

## 🧠 Le modèle mental du chapitre

```text
                       PLAYWRIGHT
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
            API                          WEB
             │                           │
      request.newContext()          page fixture
             │                           │
             ▼                           ▼
        Login API                    page.goto()
             │                           │
             ▼                           ▼
           Token                     Actions UI
             │                           │
             ▼                           ▼
       Create Order                  Assertions
             │                           │
             ▼                           │
         Order ID                       │
             │                           │
             └─────────────┬─────────────┘
                           ▼
                       Validation
                           │
                     ┌─────┴─────┐
                     ▼           ▼
                    PASS        FAIL
```

## 🎯 Les 5 notions prioritaires

| # | Notion | À retenir |
|---|---|---|
| 1 | **API Testing** | Playwright peut effectuer des appels API en plus des tests Web |
| 2 | **Request Context** | `request.newContext()` permet de préparer un environnement d’appels API |
| 3 | **Token** | Le token récupéré par l’API peut servir à authentifier l’application Web |
| 4 | **Mix API + Web** | L’API prépare rapidement l’état, le Web valide le comportement |
| 5 | **APiUtils** | Une classe utilitaire permet d’isoler et de réutiliser la logique API |

## 🚀 Séquence à mémoriser

```text
1. Créer un request context
        ↓
2. Appeler le Login API
        ↓
3. Vérifier response.ok()
        ↓
4. Parser response.json()
        ↓
5. Récupérer le token
        ↓
6. Injecter le token dans localStorage
        ↓
7. Ouvrir l’application avec page.goto()
        ↓
8. Effectuer les actions Web
        ↓
9. Vérifier les résultats avec expect()
        ↓
10. Utiliser l’API pour préparer des données si nécessaire
        ↓
11. Comparer les données API avec les données affichées dans l’UI
        ↓
12. Refactoriser les appels API dans APiUtils
```

## 💡 Idée centrale du chapitre

Le chapitre montre qu’un test End-to-End n’a pas besoin de réaliser **toutes** les étapes par l’interface graphique.

On peut utiliser l’API pour :

```text
AUTHENTIFICATION
      +
PRÉPARATION DES DONNÉES
      ↓
       WEB
      ↓
VALIDATION DU COMPORTEMENT
```

Cela permet de construire des tests **plus rapides**, tout en conservant la validation des parcours et des résultats visibles dans l’application.

---

## Exemple complet de référence

Voici la structure générale étudiée dans le chapitre :

```javascript
const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('./utils/APiUtils');

const loginPayLoad = {
    userEmail: "anshika@gmail.com",
    userPassword: "Iamking@000"
};

const orderPayLoad = {
    orders: [
        {
            country: "France",
            productOrderedId: "67a8dde5c0d3e6622a297cc8"
        }
    ]
};

let response;

test.beforeAll(async () => {

    const apiContext = await request.newContext();

    const apiUtils = new APiUtils(
        apiContext,
        loginPayLoad
    );

    response = await apiUtils.createOrder(orderPayLoad);
});

test('@API Place the order', async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    await page
        .locator("button[routerlink*='myorders']")
        .click();

    await page.locator("tbody").waitFor();

    const rows = await page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); ++i) {

        const rowOrderId =
            await rows.nth(i).locator("th").textContent();

        if (response.orderId.includes(rowOrderId)) {

            await rows.nth(i).locator("button").first().click();

            break;
        }
    }

    const orderIdDetails =
        await page.locator(".col-text").textContent();

    expect(
        response.orderId.includes(orderIdDetails)
    ).toBeTruthy();
});
```

### Ce qu’il faut être capable d’expliquer

```text
Pourquoi request.newContext() ?
→ Pour effectuer les appels API.

Pourquoi getToken() ?
→ Pour récupérer le token d’authentification.

Pourquoi addInitScript() ?
→ Pour injecter le token dans le Local Storage avant l’ouverture de l’application.

Pourquoi créer la commande avec l’API ?
→ Pour éviter de parcourir toute l’interface uniquement pour préparer une donnée.

Pourquoi utiliser APiUtils ?
→ Pour isoler et réutiliser les appels API.

Pourquoi continuer avec la page ?
→ Pour effectuer la validation End-to-End côté Web.
```

---

> **À retenir absolument :**
>
> **API pour préparer rapidement l’état du test → Web pour valider le comportement de l’application → Assertions pour confirmer le résultat.**
