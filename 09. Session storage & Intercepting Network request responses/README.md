# 🎭 Playwright — Chapitre 9

## Session Storage & Intercepting Network Requests / Responses

---

## 🎯 Objectifs du chapitre

À la fin de ce chapitre, il faut savoir :

-   sauvegarder l'état d'une session Playwright dans un fichier JSON ;
-   réutiliser cet état dans un nouveau `BrowserContext` ;
-   éviter de refaire un login UI à chaque test ;
-   utiliser `request.newContext()` pour effectuer des appels API ;
-   récupérer un token depuis une réponse API ;
-   injecter un token dans `localStorage` avec `addInitScript()` ;
-   comprendre et utiliser `page.route()` pour intercepter le trafic
    réseau ;
-   modifier une réponse réseau avant qu'elle soit rendue par le
    navigateur ;
-   modifier une requête avant son envoi avec `route.continue()` ;
-   bloquer une requête avec `route.abort()` ;
-   utiliser le Trace Viewer pour analyser les actions et les requêtes ;
-   déboguer les étapes API avec VS Code.

> ⚠️ Les identifiants, tokens et secrets présents dans les notes
> originales ne doivent pas être commités dans le projet. Utiliser des
> variables d'environnement ou des placeholders.

---

# 001 — Sauvegarder le Session Storage avec Playwright

## 🧠 Le problème

Lorsqu'un test doit être authentifié, refaire le login via l'interface
pour chaque test peut être inutile.

L'idée est :

``` text
Login API
   ↓
Récupération du token
   ↓
Injection du token dans localStorage
   ↓
Création du contexte authentifié
   ↓
Sauvegarde de l'état
   ↓
state.json
   ↓
Réutilisation dans les tests
```

Playwright permet de sauvegarder l'état d'un `BrowserContext` avec :

``` js
await context.storageState({
  path: "state.json"
});
```

---

## 🔐 Étape 1 — Effectuer le login avec l'API

On peut utiliser `request.newContext()` pour créer un contexte HTTP
permettant d'effectuer des appels API.

``` js
import { expect, test, request } from '@playwright/test';

const loginPayload = {
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD
};

let token;

test.beforeAll(async ({ browser }) => {
  const apiContext = await request.newContext();

  const loginResponse = await apiContext.post(
    "https://example.com/api/ecom/auth/login",
    {
      data: loginPayload
    }
  );

  expect(loginResponse.ok()).toBeTruthy();

  const loginResponseJson = await loginResponse.json();

  token = loginResponseJson.token;

  await apiContext.dispose();
});
```

### 🔑 Points importants

``` js
request.newContext()
```

permet de créer un contexte pour effectuer des requêtes HTTP.

``` js
await apiContext.post(...)
```

envoie une requête `POST`.

``` js
expect(loginResponse.ok()).toBeTruthy();
```

vérifie que la réponse HTTP est correcte.

``` js
const loginResponseJson = await loginResponse.json();
```

transforme la réponse en objet JSON.

``` js
token = loginResponseJson.token;
```

récupère le token d'authentification.

---

# 002 — Injecter le token dans `localStorage`

Une fois le token récupéré, on crée un contexte navigateur :

``` js
const context = await browser.newContext();
```

Puis une page :

``` js
const initialPage = await context.newPage();
```

On peut injecter le token avant le chargement de la page :

``` js
await initialPage.addInitScript((value) => {
  window.localStorage.setItem("token", value);
}, token);
```

## 🧠 Pourquoi `addInitScript()` ?

Le script est exécuté lors de l'initialisation de la page.

On peut donc préparer le `localStorage` avant que l'application ne
s'exécute normalement.

``` text
Browser Context
      ↓
New Page
      ↓
addInitScript()
      ↓
localStorage.token = token
      ↓
page.goto()
      ↓
Application récupère le token
      ↓
Session authentifiée
```

---

## 🌐 Charger l'application

``` js
await initialPage.goto(
  "https://example.com/client/"
);
```

Puis on attend qu'un élément de l'application soit disponible :

``` js
await initialPage.locator(".card-body b").first().waitFor();
```

Cette étape permet de vérifier que l'application est bien chargée avant
de sauvegarder l'état.

---

# 003 — Sauvegarder le `BrowserContext`

Une fois le contexte authentifié, on sauvegarde son état :

``` js
await context.storageState({
  path: "state.json"
});
```

Playwright génère alors un fichier :

``` text
state.json
```

Ce fichier peut contenir notamment :

``` json
{
  "cookies": [],
  "origins": [
    {
      "origin": "https://example.com",
      "localStorage": [
        {
          "name": "token",
          "value": "..."
        }
      ]
    }
  ]
}
```

### 🧠 À retenir

Le fichier `state.json` représente l'état de session du contexte.

Il peut notamment contenir :

-   les cookies ;
-   le `localStorage` ;
-   les informations nécessaires pour retrouver une session
    authentifiée.

> ⚠️ Un fichier de storage state peut contenir des informations
> sensibles. Il ne faut généralement pas le versionner publiquement.

---

# 004 — Réutiliser le `state.json`

Une fois le fichier créé, on peut créer un nouveau contexte avec :

``` js
webContext = await browser.newContext({
  storageState: "state.json"
});
```

On peut ensuite créer plusieurs pages à partir de ce même contexte :

``` js
const page = await webContext.newPage();

await page.goto(
  "https://example.com/client/"
);
```

La session sauvegardée est alors disponible.

---

## 🧪 Exemple complet

``` js
import { expect, test, request } from '@playwright/test';

const loginPayload = {
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD
};

let token;
let webContext;

test.beforeAll(async ({ browser }) => {

  // =========================
  // Login API
  // =========================

  const apiContext = await request.newContext();

  const loginResponse = await apiContext.post(
    "https://example.com/api/ecom/auth/login",
    {
      data: loginPayload
    }
  );

  expect(loginResponse.ok()).toBeTruthy();

  const loginResponseJson = await loginResponse.json();

  token = loginResponseJson.token;

  await apiContext.dispose();

  // =========================
  // Create context with token
  // =========================

  const context = await browser.newContext();

  const initialPage = await context.newPage();

  await initialPage.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await initialPage.goto(
    "https://example.com/client/"
  );

  await initialPage.locator(".card-body b").first().waitFor();

  // =========================
  // Save storage state
  // =========================

  await context.storageState({
    path: "state.json"
  });

  await context.close();

  // =========================
  // Create webContext
  // =========================

  webContext = await browser.newContext({
    storageState: "state.json"
  });
});

test("Client App", async () => {

  const page = await webContext.newPage();

  await page.goto(
    "https://example.com/client/"
  );

  await page.locator(".card-body b").first().waitFor();

  await expect(
    page.getByText("ADIDAS ORIGINAL")
  ).toBeVisible();

  await page.close();
});

test("Check Page Title", async () => {

  const page = await webContext.newPage();

  await page.goto(
    "https://example.com/client/"
  );

  await expect(page).toHaveTitle(
    "Let's Shop"
  );

  await page.close();
});

test.afterAll(async () => {
  await webContext.close();
});
```

---

# 005 — Pourquoi utiliser un `webContext` partagé ?

Dans les notes, plusieurs tests créent une nouvelle `page` à partir du
même `webContext` :

``` js
const page = await webContext.newPage();
```

Cela permet d'utiliser le même état de session.

``` text
webContext
   │
   ├── page 1
   │
   ├── page 2
   │
   └── page 3
```

Les pages appartiennent au même `BrowserContext`.

---

# 006 — Déboguer les étapes API avec VS Code

Une commande de debug peut être utilisée pour lancer Playwright en mode
visible et debug :

``` bash
node ./node_modules/@playwright/test/cli.js test tests/WebAPIPart2.spec.js --headed --debug
```

Dans `package.json`, on peut également avoir un script :

``` json
{
  "scripts": {
    "test": "node ./node_modules/@playwright/test/cli.js test"
  }
}
```

## 🐞 Debug avec VS Code

Dans VS Code :

1.  placer des points d'arrêt (**breakpoints**) ;
2.  lancer le script de test ;
3.  utiliser le debugger ;
4.  inspecter les variables et les étapes du test.

### ⚠️ Attention aux timeouts

Un test peut échouer simplement parce qu'il dépasse le délai autorisé.

Lors du debug, il faut donc tenir compte du `timeout`.

---

# 007 — Trace Viewer

Le **Trace Viewer** permet d'analyser en détail l'exécution d'un test.

Il permet notamment de comprendre :

-   les actions effectuées ;
-   les requêtes réseau ;
-   les réponses ;
-   les screenshots ;
-   les étapes du test ;
-   le contexte dans lequel une erreur apparaît.

L'outil peut être consulté avec :

``` text
trace.playwright.dev
```

---

## ⚙️ Activer la trace

Dans les notes, la configuration utilise :

``` js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },

  reporter: 'html',

  use: {
    browserName: 'chromium',

    headless: false,

    screenshot: 'on',

    trace: 'on',
  },
});
```

### 🔎 Configuration importante

``` js
timeout: 30 * 1000
```

Temps maximum autorisé pour un test.

``` js
expect: {
  timeout: 5000
}
```

Temps maximum autorisé pour les assertions.

``` js
reporter: 'html'
```

Génère un rapport HTML.

``` js
headless: false
```

Lance le navigateur avec son interface visible.

``` js
screenshot: 'on'
```

Capture des screenshots pendant l'exécution.

``` js
trace: 'on'
```

Collecte les traces Playwright.

---

# 008 — Intercepter les réponses réseau avec `page.route()`

## 🧠 Principe

Playwright permet d'intercepter les appels réseau effectués par la page.

La méthode principale est :

``` js
page.route()
```

On peut alors :

``` text
Application
     ↓
Request
     ↓
Playwright intercepte
     ↓
Modification / remplacement
     ↓
Response
     ↓
Application
```

L'objectif peut être de simuler une réponse backend sans modifier
réellement le serveur.

---

# 009 — Fausser une réponse réseau

## 🎯 Exemple

On souhaite simuler une situation où la liste des commandes est vide.

Payload réel :

``` text
API
 ↓
Commandes
```

Payload simulé :

``` js
const fakePayLoadOrders = {
  data: [],
  message: "No Orders"
};
```

---

## 🔧 Utiliser `page.route()`

``` js
await page.route(
  "https://example.com/api/ecom/order/get-orders-for-customer/*",
  async route => {

    const response = await page.request.fetch(
      route.request()
    );

    const body = JSON.stringify(
      fakePayLoadOrders
    );

    route.fulfill({
      response,
      body,
    });
  }
);
```

### 🧠 Ce qui se passe

``` text
Application
    ↓
Request API
    ↓
page.route()
    ↓
Playwright intercepte
    ↓
Récupération de la vraie réponse
    ↓
Remplacement du body
    ↓
route.fulfill()
    ↓
Application reçoit la fausse réponse
```

---

## 🔥 `route.fulfill()`

`route.fulfill()` permet de fournir une réponse personnalisée.

Exemple :

``` js
route.fulfill({
  response,
  body
});
```

On peut donc laisser la réponse originale servir de base et remplacer
son contenu.

---

# 010 — Exemple : simuler une liste de commandes vide

``` js
test('Place the order', async () => {

  const page = await webContext.newPage();

  await page.goto(
    "https://example.com/client/"
  );

  await page.route(
    "https://example.com/api/ecom/order/get-orders-for-customer/*",
    async route => {

      const response = await page.request.fetch(
        route.request()
      );

      const body = JSON.stringify({
        data: [],
        message: "No Orders"
      });

      await route.fulfill({
        response,
        body
      });
    }
  );

  await page.locator(
    "button[routerlink*='myorders']"
  ).click();

  await page.waitForResponse(
    "https://example.com/api/ecom/order/get-orders-for-customer/*"
  );

  console.log(
    await page.locator(".mt-4").textContent()
  );
});
```

---

# 011 — Intercepter et modifier une requête

Il est également possible d'intercepter une requête et de modifier sa
destination.

Exemple :

``` js
await page.route(
  "https://example.com/api/ecom/order/get-orders-details?id=*",
  route =>
    route.continue({
      url: "https://example.com/api/ecom/order/get-orders-details?id=123456"
    })
);
```

## 🧠 `route.continue()`

`route.continue()` permet de laisser continuer la requête.

On peut cependant modifier certains éléments avant qu'elle poursuive son
chemin.

Dans cet exemple :

``` text
Request initiale
      ↓
page.route()
      ↓
Modification de l'URL
      ↓
route.continue()
      ↓
Backend
```

---

# 012 — Exemple de Security Test avec interception

L'objectif de l'exemple est de vérifier qu'un utilisateur ne peut pas
consulter une commande qui ne lui appartient pas.

``` js
test('@QW Security test request intercept', async ({ page }) => {

  // Login
  await page.goto(
    "https://example.com/client"
  );

  await page.locator("#userEmail")
    .fill(process.env.USER_EMAIL);

  await page.locator("#userPassword")
    .fill(process.env.USER_PASSWORD);

  await page.locator("[value='Login']")
    .click();

  await page.waitForLoadState('networkidle');

  await page.locator(".card-body b")
    .first()
    .waitFor();

  // Go to My Orders
  await page.locator(
    "button[routerlink*='myorders']"
  ).click();

  // Intercept request
  await page.route(
    "https://example.com/api/ecom/order/get-orders-details?id=*",
    route =>
      route.continue({
        url: "https://example.com/api/ecom/order/get-orders-details?id=123456"
      })
  );

  // Click View
  await page.locator(
    "button:has-text('View')"
  ).first()
  .click();

  // Verify authorization error
  await expect(
    page.locator("p").last()
  ).toHaveText(
    "You are not authorize to view this order"
  );
});
```

### 🎯 Intérêt du test

Le test cherche à vérifier le comportement de sécurité côté application
:

``` text
Utilisateur
    ↓
Clique sur une commande
    ↓
Request interceptée
    ↓
ID remplacé
    ↓
Backend reçoit un autre ID
    ↓
Application refuse l'accès
    ↓
Assertion
```

---

# 013 — Bloquer les requêtes avec `route.abort()`

Playwright permet également d'empêcher une requête d'atteindre le
navigateur.

Exemple :

``` js
await page.route(
  "**/*.css",
  route => route.abort()
);
```

Cela bloque les fichiers CSS.

---

## 🧠 Principe

``` text
Page
 ↓
Request CSS
 ↓
page.route()
 ↓
route.abort()
 ↓
❌ Request bloquée
```

Contrairement à `route.continue()`, la requête ne continue pas.

---

# 014 — Exemple avec `route.abort()`

``` js
test('@QW Security test request intercept', async ({ page }) => {

  await page.goto(
    "https://example.com/client"
  );

  await page.locator("#userEmail")
    .fill(process.env.USER_EMAIL);

  await page.locator("#userPassword")
    .fill(process.env.USER_PASSWORD);

  await page.locator("[value='Login']")
    .click();

  await page.waitForLoadState('networkidle');

  await page.locator(".card-body b")
    .first()
    .waitFor();

  await page.locator(
    "button[routerlink*='myorders']"
  ).click();

  // Block CSS requests
  await page.route(
    "**/*.css",
    route => route.abort()
  );

  // Modify order request
  await page.route(
    "https://example.com/api/ecom/order/get-orders-details?id=*",
    route =>
      route.continue({
        url: "https://example.com/api/ecom/order/get-orders-details?id=123456"
      })
  );

  await page.locator(
    "button:has-text('View')"
  ).first()
  .click();

  await expect(
    page.locator("p").last()
  ).toHaveText(
    "You are not authorize to view this order"
  );
});
```

---

# 🧩 Les méthodes réseau à retenir

  -----------------------------------------------------------------------
  Méthode                             Rôle
  ----------------------------------- -----------------------------------
  `page.route()`                      Intercepte une requête

  `route.continue()`                  Laisse continuer la requête,
                                      éventuellement modifiée

  `route.fulfill()`                   Fournit une réponse personnalisée

  `route.abort()`                     Bloque la requête

  `page.request.fetch()`              Effectue/récupère la requête dans
                                      le contexte Playwright

  `page.waitForResponse()`            Attend une réponse réseau
                                      spécifique
  -----------------------------------------------------------------------

---

# 🔄 Comparaison des trois stratégies

## `route.continue()`

``` js
route.continue();
```

➡️ La requête continue normalement.

Avec modification :

``` js
route.continue({
  url: "https://example.com/another-endpoint"
});
```

**Utilisation :** - modifier une URL ; - modifier une requête ; - tester
des scénarios de sécurité.

---

## `route.fulfill()`

``` js
route.fulfill({
  response,
  body
});
```

➡️ Playwright fournit directement une réponse.

**Utilisation :** - mocker une API ; - simuler une erreur ; - simuler
une liste vide ; - tester différents scénarios frontend.

---

## `route.abort()`

``` js
route.abort();
```

➡️ La requête est bloquée.

**Utilisation :** - tester le comportement lorsque certaines ressources
sont indisponibles ; - bloquer des ressources inutiles ; - tester des
scénarios réseau particuliers.

---

# 🧠 Mental Model — Chapitre 9

``` text
                    PLAYWRIGHT
                         │
          ┌──────────────┴──────────────┐
          │                             │
   Session / Auth                 Network
          │                             │
     Login API                   page.route()
          │                             │
       Token               ┌────────────┼────────────┐
          │                │            │            │
   addInitScript()   continue()    fulfill()     abort()
          │                │            │            │
   localStorage       Modifier       Fake         Bloquer
          │             request      response      request
          │                │            │            │
   storageState()         Backend / Application
          │
      state.json
          │
   browser.newContext()
          │
      Page / Tests
```

---

# 📝 Résumé des concepts

  Concept                        À retenir
  ------------------------------ -------------------------------------------------
  `request.newContext()`         Créer un contexte pour les appels API
  `apiContext.post()`            Effectuer un appel POST
  `response.ok()`                Vérifier que la réponse HTTP est OK
  `response.json()`              Lire la réponse JSON
  `addInitScript()`              Injecter du JavaScript lors de l'initialisation
  `localStorage`                 Stocker le token côté navigateur
  `storageState()`               Sauvegarder l'état du contexte
  `state.json`                   Fichier contenant l'état de session
  `storageState: "state.json"`   Réutiliser l'état sauvegardé
  `page.route()`                 Intercepter les requêtes réseau
  `route.continue()`             Continuer une requête
  `route.fulfill()`              Retourner une réponse personnalisée
  `route.abort()`                Bloquer une requête
  `page.waitForResponse()`       Attendre une réponse réseau
  Trace Viewer                   Analyser l'exécution du test
  VS Code Debugger               Déboguer étape par étape

---

# 🔥 Séquence à mémoriser

## Authentification et session

``` text
request.newContext()
        ↓
POST Login
        ↓
response.json()
        ↓
token
        ↓
browser.newContext()
        ↓
addInitScript()
        ↓
localStorage
        ↓
page.goto()
        ↓
storageState()
        ↓
state.json
        ↓
browser.newContext({
  storageState: "state.json"
})
```

## Interception réseau

``` text
page.route()
     │
     ├── route.continue()
     │       → modifier / continuer la request
     │
     ├── route.fulfill()
     │       → fake response
     │
     └── route.abort()
             → bloquer la request
```

---

# ✅ Checklist de révision

-   [ ] Je sais créer un `request.newContext()`.
-   [ ] Je sais faire un login via API.
-   [ ] Je sais récupérer un token depuis `response.json()`.
-   [ ] Je comprends le rôle de `addInitScript()`.
-   [ ] Je sais injecter un token dans `localStorage`.
-   [ ] Je sais sauvegarder un `BrowserContext` avec `storageState()`.
-   [ ] Je sais réutiliser `state.json`.
-   [ ] Je comprends la différence entre `Browser`, `BrowserContext` et
    `Page`.
-   [ ] Je sais utiliser `page.route()`.
-   [ ] Je connais `route.continue()`.
-   [ ] Je connais `route.fulfill()`.
-   [ ] Je connais `route.abort()`.
-   [ ] Je sais attendre une réponse avec `page.waitForResponse()`.
-   [ ] Je sais utiliser le Trace Viewer.
-   [ ] Je sais déboguer un test avec VS Code.
-   [ ] Je sais utiliser ces techniques pour tester des scénarios réseau
    et de sécurité.

---

# 🎯 À retenir absolument

### 1. Session Storage

``` js
await context.storageState({
  path: "state.json"
});
```

Sauvegarde l'état de session.

### 2. Réutilisation

``` js
await browser.newContext({
  storageState: "state.json"
});
```

Réutilise l'état sauvegardé.

### 3. Interception

``` js
await page.route("**/*", route => {
  // interception
});
```

Permet de contrôler les requêtes réseau.

### 4. Modifier / continuer

``` js
route.continue(...)
```

### 5. Fausser une réponse

``` js
route.fulfill(...)
```

### 6. Bloquer une requête

``` js
route.abort()
```

---

# 🚀 Transition

Le chapitre 9 introduit une partie plus avancée de Playwright :

``` text
Tests UI
   +
API
   +
Session State
   +
Network Interception
   +
Mocking
   +
Security Testing
   ↓
Tests plus rapides et plus réalistes
```

L'idée principale est de ne plus considérer le navigateur comme une
simple interface graphique : Playwright permet également de contrôler
**l'état de session**, les **appels API** et le **trafic réseau** autour
de l'application.