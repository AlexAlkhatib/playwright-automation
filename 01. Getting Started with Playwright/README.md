# 🎭 Playwright — Chapitre 1

## Introduction, installation, premiers tests, fixtures, configuration et assertions

> Documentation construite à partir des notes du cours.  
> Elle reprend la progression et les exemples du chapitre, puis ajoute des explications pédagogiques pour faciliter l’apprentissage.
>
> **Complément pédagogique :** les explications qui ne figurent pas explicitement dans les notes du cours sont signalées comme telles.

---

## Sommaire

1. [Objectifs du chapitre](#1-objectifs-du-chapitre)
2. [Qu’est-ce que Playwright ?](#2-quest-ce-que-playwright-)
3. [Préparer l’environnement](#3-préparer-lenvironnement)
4. [Structure du projet](#4-structure-du-projet)
5. [Premier test Playwright](#5-premier-test-playwright)
6. [Pourquoi `async` / `await` ?](#6-pourquoi-async--await-)
7. [Browser, Browser Context et Page](#7-browser-browser-context-et-page)
8. [Création manuelle d’un context et d’une page](#8-création-manuelle-dun-context-et-dune-page)
9. [La fixture `page`](#9-la-fixture-page)
10. [Navigation avec `page.goto()`](#10-navigation-avec-pagegoto)
11. [Le fichier `playwright.config.js`](#11-le-fichier-playwrightconfigjs)
12. [Explication de la configuration](#12-explication-de-la-configuration)
13. [Exécuter les tests](#13-exécuter-les-tests)
14. [`test.only()`](#14-testonly)
15. [Assertions avec `expect()`](#15-assertions-avec-expect)
16. [`console.log()` et assertions : deux rôles différents](#16-consolelog-et-assertions--deux-rôles-différents)
17. [Plusieurs navigateurs](#17-plusieurs-navigateurs)
18. [Exemple complet du chapitre](#18-exemple-complet-du-chapitre)
19. [Comprendre le cycle d’un test](#19-comprendre-le-cycle-dun-test)
20. [Erreurs et points d’attention](#20-erreurs-et-points-dattention)
21. [Mémo des concepts](#21-mémo-des-concepts)
22. [Checklist d’apprentissage](#22-checklist-dapprentissage)
23. [Exercices conseillés](#23-exercices-conseillés)
24. [Sources du chapitre](#24-sources-du-chapitre)
25. [Résumé final](#25-résumé-final)

---

# 1. Objectifs du chapitre

À la fin de ce chapitre, vous serez capable de :

- Comprendre ce qu’est **Playwright** et son rôle dans l’automatisation des tests end-to-end.
- Créer un projet Playwright avec **Node.js**.
- Comprendre la structure de base d’un projet.
- Écrire un premier test avec `test()`.
- Comprendre `async` / `await` dans les tests Playwright.
- Comprendre la relation :

```text
Browser
   ↓
Browser Context
   ↓
Page
````

* Utiliser les fixtures `browser` et `page`.
* Comprendre le fichier `playwright.config.js`.
* Exécuter les tests en mode **headless** ou **headed**.
* Utiliser `test.only()` pour isoler un test.
* Introduire les assertions avec `expect()`.
* Comprendre les premières bases de l’exécution multi-navigateurs.

---

# 2. Qu’est-ce que Playwright ?

Playwright est un framework d’automatisation de navigateurs utilisé notamment pour tester des applications web.

Dans ce chapitre, le cours se concentre sur l’automatisation et les **tests end-to-end**.

L’idée fondamentale est de piloter un navigateur comme le ferait un utilisateur :

```text
Ouvrir le navigateur
       ↓
Ouvrir une page
       ↓
Naviguer vers une URL
       ↓
Interagir avec l’interface
       ↓
Vérifier le résultat attendu
```

Par exemple, un test peut :

1. ouvrir une page de connexion ;
2. saisir un nom d’utilisateur ;
3. saisir un mot de passe ;
4. cliquer sur un bouton ;
5. vérifier le résultat.

Le cours renvoie également à la documentation officielle Playwright concernant l’**actionability** :

[Documentation Playwright — Actionability](https://playwright.dev/docs/actionability)

> **Complément pédagogique :** l’*actionability* correspond aux conditions que Playwright vérifie avant certaines actions, par exemple qu’un élément soit visible, activé et prêt à recevoir une interaction.

---

# 3. Préparer l’environnement

Le cours demande :

* **Node.js**
* **Visual Studio Code (VS Code)**
* Un **projet Playwright vide**

L’initialisation indiquée dans le cours est :

```bash
npm init playwright
```

L’assistant de création du projet permet notamment de choisir :

* JavaScript ou TypeScript ;
* le dossier des tests ;
* le workflow GitHub Actions ;
* l’installation des navigateurs.

Une fois le projet initialisé, Playwright fournit une structure permettant de commencer rapidement à écrire et exécuter des tests.

---

# 4. Structure du projet

Une structure Playwright classique peut contenir :

| Élément                | Rôle                                                                     |
| ---------------------- | ------------------------------------------------------------------------ |
| `node_modules`         | Contient les dépendances installées du projet.                           |
| `tests`                | Contient les tests end-to-end du projet.                                 |
| `package.json`         | Décrit le projet et ses dépendances.                                     |
| `playwright.config.js` | Centralise la configuration Playwright utilisée pour exécuter les tests. |

## 4.1 `node_modules`

Le dossier `node_modules` contient les packages installés avec npm.

Il peut notamment contenir les dépendances nécessaires à Playwright.

> **À retenir :** ce dossier est généralement généré automatiquement et ne doit pas être modifié manuellement.

---

## 4.2 `tests`

Le dossier `tests` contient les fichiers de tests.

Exemple :

```text
tests/
├── example.spec.js
├── login.spec.js
└── clientApp.spec.js
```

---

## 4.3 `package.json`

`package.json` décrit notamment :

* le nom du projet ;
* les dépendances ;
* les scripts npm ;
* les informations du projet.

Le cours compare son rôle à celui de `pom.xml` dans un projet Maven.

---

## 4.4 `playwright.config.js`

Ce fichier centralise les paramètres utilisés par Playwright.

On peut notamment y définir :

* le dossier des tests ;
* les timeouts ;
* le navigateur ;
* le reporter ;
* les traces ;
* plusieurs projets correspondant à différents navigateurs.

---

# 5. Premier test Playwright

Le cours présente `test()` comme la fonction permettant de déclarer un cas de test.

Exemple :

```typescript
import { test } from '@playwright/test';

test("First Playwright Test", async () => {
    // Playwright code
});
```

La structure générale est donc :

```typescript
test("Nom du test", async () => {
    // scénario
});
```

Le premier argument correspond au nom du test.

Le deuxième argument est une fonction contenant les actions du scénario.

---

## 5.1 Structure mentale

```text
test()
  │
  ├── Nom du test
  │
  └── Fonction de test
          │
          ├── Navigation
          ├── Actions
          ├── Lecture
          └── Assertions
```

---

# 6. Pourquoi `async` / `await` ?

Les opérations Playwright sont fréquemment asynchrones.

C’est notamment le cas pour :

* la navigation ;
* la création d’un contexte ;
* la création d’une page ;
* les actions utilisateur ;
* certaines lectures ;
* les assertions.

Le cours insiste donc sur l’utilisation de `async` et `await`.

---

## 6.1 Exemple conceptuel

Imaginons un scénario :

```text
1. Ouvrir le navigateur
       ↓
2. Saisir le nom d’utilisateur
       ↓
3. Saisir le mot de passe
       ↓
4. Cliquer sur Submit
       ↓
5. Vérifier le résultat
```

Avec `await`, on exprime l’idée :

> **Attends que cette opération soit terminée avant de poursuivre.**

Exemple :

```typescript
await page.goto("https://www.google.com/");
```

Puis :

```typescript
await page.locator("#username").fill("Alex");
```

Puis :

```typescript
await page.locator("#password").fill("test123");
```

Puis :

```typescript
await page.locator("#submit").click();
```

---

## 6.2 Pourquoi `async` ?

Dès qu'une fonction utilise `await`, elle doit être déclarée comme fonction asynchrone avec `async`.

Exemple :

```typescript
test("Example", async ({ page }) => {
    await page.goto("https://www.google.com/");
});
```

Schéma :

```text
async
  ↓
autorise await
  ↓
await
  ↓
attend l'opération
```

> **Complément pédagogique :** `async` / `await` permet de rendre le code asynchrone beaucoup plus lisible. Le test ressemble ainsi à une suite d’étapes exécutées dans l’ordre.

---

# 7. Browser, Browser Context et Page

C’est l’un des concepts essentiels du chapitre.

Le cours montre deux façons de travailler :

1. créer explicitement un contexte et une page ;
2. utiliser directement la fixture `page`.

Le modèle mental est :

```text
Browser
   ↓
Browser Context
   ↓
Page
```

---

## 7.1 Browser

`browser` représente le navigateur lancé pour l’exécution du test.

Le type de navigateur est défini dans la configuration.

Par exemple :

```javascript
browserName: 'chromium'
```

---

## 7.2 Browser Context

Un **Browser Context** représente un environnement de navigation isolé.

Le cours mentionne notamment les options liées aux :

* proxies ;
* cookies ;
* permissions.

On peut visualiser un contexte comme une session de navigateur indépendante.

```text
Browser
│
├── Context A
│     └── Page
│
└── Context B
      └── Page
```

> **Complément pédagogique :** cette isolation est particulièrement utile pour éviter que les cookies ou autres données d’une session de test ne contaminent une autre session.

---

## 7.3 Page

Une `page` représente une page ou un onglet du navigateur dans un Browser Context.

C’est principalement sur cet objet que l’on effectue les opérations d’interface.

Exemple :

```typescript
await page.goto("https://www.google.com/");
```

---

## 7.4 Schéma mental

```text
┌───────────────┐
│    Browser    │
└───────┬───────┘
        │
        ▼
┌────────────────────┐
│  Browser Context   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│       Page         │
└────────────────────┘
```

---

# 8. Création manuelle d’un context et d’une page

Le cours montre comment créer explicitement un Browser Context puis une Page.

```typescript
import { test } from '@playwright/test';

test("Browser Context Test", async ({ browser }) => {

    // Browser context options can include proxies,
    // cookies, permissions, etc.

    // Open a new browser context.
    // The browser type is defined in playwright.config.js.
    const context = await browser.newContext();

    // Open a new page within the browser context.
    const page = await context.newPage();

    // Navigate to the specified URL.
    await page.goto("https://www.google.com/");
});
```

---

## 8.1 Décomposition

### Étape 1 — Recevoir `browser`

```typescript
async ({ browser }) => {
```

Le test demande à Playwright de fournir la fixture `browser`.

### Étape 2 — Créer un contexte

```typescript
const context = await browser.newContext();
```

### Étape 3 — Créer une page

```typescript
const page = await context.newPage();
```

### Étape 4 — Naviguer

```typescript
await page.goto("https://www.google.com/");
```

---

## 8.2 Séquence complète

```text
browser
   ↓
browser.newContext()
   ↓
context
   ↓
context.newPage()
   ↓
page
   ↓
page.goto()
```

---

# 9. La fixture `page`

Playwright permet d’utiliser directement une **fixture `page`** dans les paramètres de la fonction de test.

Exemple :

```typescript
import { test } from '@playwright/test';

test("Page Fixture Test", async ({ page }) => {

    await page.goto("https://www.google.com/");

});
```

Playwright gère alors automatiquement la préparation du contexte et de la page nécessaires au test.

C’est généralement la forme la plus simple pour commencer un test UI.

---

## 9.1 Comparaison

### Création manuelle

```typescript
test("Manual Context", async ({ browser }) => {

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto("https://www.google.com/");
});
```

### Avec la fixture `page`

```typescript
test("Page Fixture", async ({ page }) => {

    await page.goto("https://www.google.com/");
});
```

La deuxième forme est plus concise.

---

## 9.2 Quand utiliser `browser` ?

La fixture `page` est généralement suffisante pour les tests UI classiques.

La fixture `browser` devient intéressante lorsque l’on veut contrôler explicitement le contexte.

Par exemple :

```typescript
const context = await browser.newContext();
```

permet de personnaliser la création du contexte.

> **Complément pédagogique :** dans un projet réel, on utilisera très souvent `page`, car Playwright prend en charge automatiquement une grande partie de la gestion de l’environnement du test.

---

# 10. Navigation avec `page.goto()`

`page.goto(url)` demande à la page de naviguer vers l’URL indiquée.

Exemple :

```typescript
await page.goto("https://www.google.com/");
```

Autre exemple :

```typescript
await page.goto(
    "https://practicetestautomation.com/practice-test-login/"
);
```

La logique est :

```text
page
 ↓
goto()
 ↓
URL
 ↓
navigation
```

---

## 10.1 Exemple

```typescript
test("Navigation Test", async ({ page }) => {

    await page.goto("https://www.google.com/");

});
```

---

# 11. Le fichier `playwright.config.js`

La configuration centralise les paramètres communs aux tests.

Le chapitre utilise `defineConfig()` avec une configuration minimale.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({

    testDir: './tests',

    // Set the default timeout for all tests to 40 seconds.
    timeout: 40 * 1000,

    // Set the default timeout for assertions.
    expect: {
        timeout: 40 * 1000,
    },

    // Generate an HTML report after test execution.
    reporter: 'html',

    /* Shared settings for all projects. */
    use: {

        // Use Chromium as the browser.
        browserName: 'chromium',

        /* Collect a trace when retrying a failed test. */
        trace: 'on-first-retry',
    },
});
```

---

# 12. Explication de la configuration

## 12.1 `testDir`

```javascript
testDir: './tests'
```

Indique à Playwright où rechercher les fichiers de tests.

Dans cet exemple :

```text
projet/
│
├── tests/
│   ├── login.spec.js
│   └── example.spec.js
│
└── playwright.config.js
```

Playwright recherchera les tests dans le dossier `tests`.

---

## 12.2 `timeout`

```javascript
timeout: 40 * 1000
```

Définit le délai d’attente par défaut d’un test.

Ici :

```text
40 × 1000 ms
     ↓
40 secondes
```

---

## 12.3 `expect.timeout`

```javascript
expect: {
    timeout: 40 * 1000,
}
```

Définit le délai d’attente par défaut des assertions.

Par exemple :

```typescript
await expect(page).toHaveTitle("Google");
```

Playwright peut attendre pendant la durée configurée que la condition devienne vraie.

> **Complément pédagogique :** le timeout du test et le timeout des assertions sont deux paramètres différents. Le premier concerne l’exécution globale du test ; le second concerne les assertions.

---

## 12.4 `reporter`

```javascript
reporter: 'html'
```

Demande à Playwright de générer un rapport HTML après l’exécution des tests.

Ce rapport permet notamment d’analyser :

* les tests réussis ;
* les tests échoués ;
* les erreurs ;
* certaines informations d’exécution.

---

## 12.5 `use.browserName`

```javascript
use: {
    browserName: 'chromium',
}
```

Définit le navigateur utilisé par défaut.

Ici :

```text
Chromium
```

---

## 12.6 `use.trace`

```javascript
trace: 'on-first-retry'
```

Le cours utilise cette configuration pour collecter une trace lorsqu’un test est relancé après un échec.

Une trace peut être utile pour analyser ce qui s’est passé pendant l’exécution du test.

---

# 13. Exécuter les tests

La commande indiquée dans le cours est :

```bash
npx playwright test
```

Cette commande lance les tests Playwright.

---

## 13.1 Mode headless

Par défaut, le cours indique une exécution **headless**.

Cela signifie que le navigateur s’exécute sans afficher son interface graphique.

```text
Test
 ↓
Browser
 ↓
Exécution invisible
```

C’est particulièrement pratique pour :

* les pipelines CI/CD ;
* les serveurs ;
* les exécutions automatisées.

---

## 13.2 Mode headed

Pour voir le navigateur pendant l’exécution :

```bash
npx playwright test --headed
```

Le navigateur devient alors visible.

```text
Test
 ↓
Browser
 ↓
Fenêtre visible
```

C’est particulièrement utile pendant le développement et le débogage.

---

## 13.3 Comparaison

| Mode     | Commande                       | Navigateur visible ? |
| -------- | ------------------------------ | -------------------- |
| Headless | `npx playwright test`          | Non                  |
| Headed   | `npx playwright test --headed` | Oui                  |

---

# 14. `test.only()`

`test.only()` permet d’exécuter uniquement le test sélectionné.

Exemple :

```typescript
test.only("Page Playwright Test", async ({ page }) => {

    await page.goto("https://www.google.com/");

});
```

Les autres tests concernés par cette sélection sont ignorés pendant l’exécution.

---

## 14.1 Pourquoi utiliser `test.only()` ?

Principalement pendant :

* le développement ;
* le débogage ;
* la mise au point d’un scénario.

Par exemple, si un fichier contient 10 tests mais que vous travaillez uniquement sur le test numéro 4 :

```typescript
test.only("Test 4", async ({ page }) => {
    // ...
});
```

Cela permet de se concentrer uniquement sur ce scénario.

---

## 14.2 Attention

Avant de lancer toute la suite de tests, pensez à retirer :

```typescript
test.only(...)
```

Sinon les autres tests ne seront pas exécutés comme prévu.

> **Bonne pratique :** `test.only()` est un outil de développement, pas quelque chose à laisser dans une suite de tests destinée à être exécutée complètement.

---

# 15. Assertions avec `expect()`

Une **assertion** vérifie qu’un résultat réel correspond à un résultat attendu.

Le chapitre introduit `expect()` avec une vérification du titre de la page.

```typescript
import { expect, test } from '@playwright/test';

test("Page Fixture Test", async ({ page }) => {

    await page.goto("https://www.google.com/");

    console.log(await page.title());

    await expect(page).toHaveTitle("Google");

});
```

La ligne :

```typescript
await expect(page).toHaveTitle("Google");
```

vérifie que le titre de la page correspond à la valeur attendue.

---

## 15.1 Décomposition

```typescript
expect(page)
```

signifie :

> Je souhaite vérifier quelque chose concernant `page`.

Puis :

```typescript
.toHaveTitle("Google")
```

signifie :

> Le titre attendu doit être `Google`.

L’ensemble donne :

```typescript
await expect(page).toHaveTitle("Google");
```

---

## 15.2 Si l’assertion réussit

Si le titre est bien :

```text
Google
```

alors l’assertion réussit.

```text
Résultat réel : Google
Résultat attendu : Google

          ↓

        PASS
```

---

## 15.3 Si l’assertion échoue

Si le titre est :

```text
Bing
```

alors :

```text
Résultat réel : Bing
Résultat attendu : Google

          ↓

        FAIL
```

Le test est considéré comme échoué.

---

# 16. `console.log()` et assertions : deux rôles différents

Il est important de ne pas confondre :

```typescript
console.log()
```

et :

```typescript
expect()
```

---

## 16.1 `console.log()`

`console.log()` sert à afficher une information dans la console.

Exemple :

```typescript
console.log(await page.title());
```

Si le titre est `Google`, la console affichera quelque chose comme :

```text
Google
```

Mais cela ne constitue pas une vérification.

---

## 16.2 `expect()`

Une assertion sert à vérifier une condition.

Exemple :

```typescript
await expect(page).toHaveTitle("Google");
```

Si le titre ne correspond pas, le test échoue.

---

## 16.3 Différence essentielle

| Méthode         | Rôle                     |
| --------------- | ------------------------ |
| `console.log()` | Afficher une information |
| `expect()`      | Vérifier une condition   |

Schéma :

```text
console.log()
    ↓
Information

expect()
    ↓
Vérification
    ↓
PASS / FAIL
```

---

# 17. Plusieurs navigateurs

Le chapitre introduit la configuration de plusieurs navigateurs.

Dans l’exemple fourni, le navigateur est configuré ainsi :

```javascript
browserName: 'chromium'
```

La structure Playwright permet ensuite de définir plusieurs **projets de configuration** pour exécuter les mêmes tests dans différents navigateurs.

Le principe à retenir est :

```text
Test
 ↓
Décrit le comportement attendu
 ↓
Configuration
 ↓
Détermine l'environnement
 ↓
Chromium / Firefox / WebKit
```

---

## 17.1 Pourquoi tester plusieurs navigateurs ?

Une application web peut se comporter différemment selon le navigateur.

Tester plusieurs moteurs permet donc d’augmenter la couverture des tests.

> **Complément pédagogique :** Playwright prend notamment en charge Chromium, Firefox et WebKit. Le test peut rester identique tandis que la configuration détermine le navigateur utilisé.

---

## 17.2 Principe des projets

Une configuration peut définir plusieurs projets.

Exemple conceptuel :

```javascript
projects: [
    {
        name: 'chromium',
        use: { browserName: 'chromium' },
    },
    {
        name: 'firefox',
        use: { browserName: 'firefox' },
    },
    {
        name: 'webkit',
        use: { browserName: 'webkit' },
    },
]
```

Le même test peut ainsi être exécuté dans plusieurs environnements.

---

# 18. Exemple complet du chapitre

Voici un exemple regroupant les principales notions étudiées.

```typescript
import { expect, test } from '@playwright/test';

test("Browser Context Test", async ({ browser }) => {

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto(
        "https://practicetestautomation.com/practice-test-login/"
    );

    console.log(await page.title());

});

test("Page Fixture Test", async ({ page }) => {

    await page.goto("https://www.google.com/");

    console.log(await page.title());

    await expect(page).toHaveTitle("Google");

});
```

---

## 18.1 Premier test

Le premier test utilise :

```typescript
{ browser }
```

Puis crée manuellement :

```typescript
const context = await browser.newContext();
```

et :

```typescript
const page = await context.newPage();
```

Enfin :

```typescript
await page.goto(...);
```

---

## 18.2 Deuxième test

Le deuxième test utilise directement :

```typescript
{ page }
```

Playwright fournit donc la page nécessaire.

Le test effectue ensuite :

```typescript
await page.goto("https://www.google.com/");
```

Puis affiche le titre :

```typescript
console.log(await page.title());
```

Enfin, il vérifie le titre :

```typescript
await expect(page).toHaveTitle("Google");
```

---

# 19. Comprendre le cycle d’un test

Le cycle général présenté dans le chapitre peut être résumé ainsi :

```text
1. Playwright charge la configuration
             ↓
2. Le runner découvre les fichiers de tests
             ↓
3. Le test demande des fixtures
   comme browser ou page
             ↓
4. Playwright prépare l’environnement
             ↓
5. Le test exécute les actions avec await
             ↓
6. Les assertions vérifient les résultats
             ↓
7. Le runner produit le résultat
             ↓
8. Un rapport peut être généré
```

---

## 19.1 Vue simplifiée

```text
playwright.config.js
        ↓
   Test Runner
        ↓
      test()
        ↓
     Fixture
        ↓
 Browser / Context / Page
        ↓
     Actions
        ↓
   Assertions
        ↓
   PASS / FAIL
        ↓
     Report
```

Cette séquence constitue un modèle mental important pour comprendre l’architecture de Playwright.

---

# 20. Erreurs et points d’attention

> **Complément pédagogique :** cette section ne figure pas explicitement dans les notes du cours. Elle ajoute des points pratiques qui peuvent éviter certaines erreurs fréquentes.

---

## 20.1 Utiliser une convention de modules cohérente

Dans un projet, il faut utiliser une configuration cohérente entre :

```typescript
import / export
```

et :

```javascript
require / module.exports
```

Par exemple, le style utilisé dans ce chapitre est :

```typescript
import { test, expect } from '@playwright/test';
```

et :

```typescript
export default defineConfig({
    // ...
});
```

---

## 20.2 Installer les dépendances dans le bon dossier

Les commandes npm doivent être exécutées depuis le dossier du projet Playwright.

Par exemple :

```bash
cd mon-projet-playwright
```

puis :

```bash
npx playwright test
```

---

## 20.3 Vérifier `package.json`

Si Playwright semble manquer alors qu’il devrait être installé, vérifiez notamment :

```text
package.json
```

et les dépendances du projet.

---

## 20.4 Éviter les doublons de versions

Plusieurs installations différentes de `@playwright/test` peuvent provoquer des comportements difficiles à comprendre.

> **Complément pédagogique :** lorsqu’un projet présente des erreurs étranges autour de `test()`, `expect()` ou des fixtures, vérifier les versions installées peut être une bonne première étape.

---

## 20.5 Vérifier le dossier courant

Si `npx` demande d’installer un package alors qu’il est déjà attendu dans le projet, vérifiez :

```text
1. Le dossier courant
2. package.json
3. node_modules
```

La commande :

```bash
pwd
```

sur macOS/Linux, ou :

```powershell
Get-Location
```

dans PowerShell, permet notamment de vérifier le dossier courant.

---

## 20.6 Erreur autour de `test()`

Si Playwright indique que `test()` n’est pas attendu à un endroit donné, vérifiez notamment :

* la version de `@playwright/test` ;
* la présence de plusieurs installations ;
* le dossier depuis lequel la commande est exécutée ;
* le fichier de configuration utilisé.

---

# 21. Mémo des concepts

| Concept                | À retenir                                                 |
| ---------------------- | --------------------------------------------------------- |
| `test()`               | Déclare un cas de test.                                   |
| `async / await`        | Permet d’attendre les opérations asynchrones du scénario. |
| `browser`              | Instance du navigateur utilisée par le test.              |
| `browser context`      | Environnement de navigation isolé.                        |
| `page`                 | Page/onglet sur lequel les actions sont effectuées.       |
| `page.goto()`          | Navigue vers une URL.                                     |
| `expect()`             | Déclare une vérification du résultat attendu.             |
| `toHaveTitle()`        | Vérifie le titre de la page.                              |
| `test.only()`          | Exécute uniquement le test ciblé.                         |
| `playwright.config.js` | Centralise les paramètres d’exécution.                    |
| `headless`             | Exécution sans afficher l’interface du navigateur.        |
| `headed`               | Exécution avec interface visible.                         |

---

# 22. Checklist d’apprentissage

* [ ] Je sais initialiser un projet avec `npm init playwright`.
* [ ] Je sais identifier `node_modules`, `tests` et `package.json`.
* [ ] Je sais créer un test avec `test()`.
* [ ] Je comprends pourquoi `async` et `await` sont utilisés.
* [ ] Je comprends `browser`, Browser Context et `page`.
* [ ] Je sais créer un context et une page manuellement.
* [ ] Je sais utiliser la fixture `page`.
* [ ] Je comprends les principales options du fichier `playwright.config.js`.
* [ ] Je sais lancer `npx playwright test`.
* [ ] Je sais lancer `npx playwright test --headed`.
* [ ] Je sais isoler un test avec `test.only()`.
* [ ] Je sais écrire une première assertion avec `expect()`.
* [ ] Je comprends la différence entre `console.log()` et une assertion.
* [ ] Je comprends le principe de l’exécution multi-navigateurs.
* [ ] Je comprends le cycle général d’un test Playwright.

---

# 23. Exercices conseillés

## Exercice 1 — Ouvrir Google

Créer un test qui ouvre Google avec la fixture `page`.

```typescript
test("Open Google", async ({ page }) => {

    await page.goto("https://www.google.com/");

});
```

---

## Exercice 2 — Afficher le titre

Afficher le titre de la page dans la console.

```typescript
console.log(await page.title());
```

---

## Exercice 3 — Ajouter une assertion

Vérifier que le titre est bien `Google`.

```typescript
await expect(page).toHaveTitle("Google");
```

---

## Exercice 4 — Utiliser `browser`

Créer un deuxième test utilisant :

```typescript
browser
```

puis :

```typescript
browser.newContext()
```

et :

```typescript
context.newPage()
```

Exemple :

```typescript
test("Browser Context Exercise", async ({ browser }) => {

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto("https://www.google.com/");

});
```

---

## Exercice 5 — Headless vs headed

Lancer les tests en mode headless :

```bash
npx playwright test
```

Puis en mode headed :

```bash
npx playwright test --headed
```

Observer la différence.

---

## Exercice 6 — Utiliser `test.only()`

Transformer temporairement un test en :

```typescript
test.only("My Test", async ({ page }) => {

    // ...

});
```

Observer quels tests sont exécutés.

Puis supprimer `only`.

---

## Exercice 7 — Provoquer un échec d’assertion

Modifier temporairement :

```typescript
await expect(page).toHaveTitle("Google");
```

en :

```typescript
await expect(page).toHaveTitle("Facebook");
```

Observer le résultat du test.

Puis remettre la bonne valeur.

---

## Exercice 8 — Modifier le timeout

Modifier temporairement le timeout dans :

```text
playwright.config.js
```

Par exemple :

```javascript
timeout: 10 * 1000,
```

Observer son effet.

---

## Exercice 9 — Explorer le rapport HTML

Après une exécution :

```bash
npx playwright test
```

observer le rapport HTML généré par Playwright.

---

# 24. Sources du chapitre

## Source principale

Les notes du cours fournies avec le chapitre.

Les thèmes couverts sont notamment :

* introduction et fonctionnalités ;
* organisation du cours ;
* installation de Node.js et VS Code ;
* initialisation du projet ;
* structure du projet ;
* premier test ;
* `async` / `await` ;
* Browser Context et Page fixtures ;
* configuration ;
* exécution headless/headed ;
* `test.only()` ;
* assertions ;
* configuration multi-navigateurs.

## Documentation officielle

Documentation Playwright mentionnée dans les notes :

[https://playwright.dev/docs/actionability](https://playwright.dev/docs/actionability)

---

# 25. Résumé final

Le modèle mental à retenir à la fin de ce premier chapitre est simple.

Un projet Playwright possède :

```text
Configuration
     +
Dossier de tests
     +
Dépendances
```

Un test est déclaré avec :

```typescript
test()
```

Il s’exécute de façon asynchrone avec :

```typescript
async / await
```

Il peut utiliser des fixtures comme :

```typescript
browser
```

ou :

```typescript
page
```

La navigation s’effectue avec :

```typescript
await page.goto(...)
```

Puis le résultat est vérifié avec :

```typescript
await expect(...)
```

La configuration détermine notamment :

* le dossier des tests ;
* les timeouts ;
* le reporter ;
* le navigateur ;
* la trace.

---

## 🧠 Le modèle mental du chapitre

```text
                 PLAYWRIGHT
                     │
                     ▼
             CONFIGURATION
                     │
                     ▼
                TEST RUNNER
                     │
                     ▼
                  test()
                     │
             ┌───────┴───────┐
             ▼               ▼
         browser           page
             │               │
             ▼               │
    Browser Context          │
             │               │
             └───────┬───────┘
                     ▼
                  Page
                     │
                     ▼
                page.goto()
                     │
                     ▼
                  ACTIONS
                     │
                     ▼
                ASSERTIONS
                     │
                     ▼
               expect()
                     │
              ┌──────┴──────┐
              ▼             ▼
            PASS           FAIL
              │
              ▼
            REPORT
```

---

## 🎯 Les 5 notions prioritaires

| # | Notion                       | À retenir                                                              |
| - | ---------------------------- | ---------------------------------------------------------------------- |
| 1 | **Playwright**               | Framework d’automatisation et de tests end-to-end web                  |
| 2 | **Browser / Context / Page** | Architecture permettant de contrôler le navigateur                     |
| 3 | **Fixtures**                 | Playwright fournit notamment `browser` et `page` au test               |
| 4 | **`async` / `await`**        | Permettent de gérer les opérations asynchrones                         |
| 5 | **Assertions**               | `expect()` permet de vérifier que le résultat est conforme à l’attendu |

---

## 🚀 Séquence à mémoriser

```text
1. Créer le projet
       ↓
2. Configurer Playwright
       ↓
3. Déclarer un test avec test()
       ↓
4. Obtenir une page avec la fixture page
       ↓
5. Naviguer avec page.goto()
       ↓
6. Effectuer les actions
       ↓
7. Vérifier avec expect()
       ↓
8. Exécuter les tests
       ↓
9. Analyser PASS / FAIL
```

> **Idée centrale du chapitre :** avant de manipuler précisément les éléments d’une page, il faut comprendre comment Playwright organise l’environnement de test. Le modèle **Browser → Browser Context → Page**, les **fixtures**, `async/await`, la **configuration** et les **assertions** constituent les fondations sur lesquelles les chapitres suivants vont s’appuyer.

---

# 🎓 Transition vers le Chapitre 2

Le Chapitre 1 a permis de comprendre **comment fonctionne un projet Playwright et comment exécuter un premier test**.

Le Chapitre 2 va maintenant s’intéresser à la question suivante :

```text
Nous avons une Page...
        ↓
Comment identifier un élément ?
        ↓
Comment interagir avec lui ?
        ↓
Comment récupérer son contenu ?
        ↓
Comment vérifier le résultat ?
        ↓
Comment gérer plusieurs éléments ?
        ↓
Comment attendre les éléments dynamiques ?
```

C’est ici qu’entrent en jeu les notions de :

```text
LOCATORS
   ↓
ACTIONS
   ↓
LECTURE
   ↓
ASSERTIONS
   ↓
COLLECTIONS
   ↓
SYNCHRONISATION
```

> Ce sont les notions fondamentales développées dans le **Chapitre 2 — Locators, Actions, Assertions, Collections & Attente dynamique**.