# 📘 Playwright — Chapitre 6

## Inspectors, Codegen & Trace Viewer

> Documentation d’apprentissage basée sur les notes de cours du chapitre 6.
> Objectif : comprendre les outils qui permettent **d’écrire, observer, déboguer et analyser** les tests Playwright.

---

# 📑 Sommaire

1. [Objectifs du chapitre](#1-objectifs-du-chapitre)
2. [Playwright Inspector](#2-playwright-inspector)
3. [Mode Debug avec `--debug`](#3-mode-debug-avec---debug)
4. [Codegen](#4-codegen)
5. [HTML Report](#5-html-report)
6. [Trace Viewer](#6-trace-viewer)
7. [Screenshots et traces](#7-screenshots-et-traces)
8. [`playwright.config.js`](#8-playwrightconfigjs)
9. [Configuration complète](#9-configuration-complète)
10. [Stratégie de debugging](#10-stratégie-de-debugging)
11. [Différences entre les outils](#11-différences-entre-les-outils)
12. [Bonnes pratiques](#12-bonnes-pratiques)
13. [Exercices](#13-exercices)
14. [Fiche mémo](#14-fiche-mémo)
15. [Checklist](#15-checklist)
16. [Conclusion](#16-conclusion)

---

# 1. Objectifs du chapitre

À la fin de ce chapitre, tu dois être capable de :

* Comprendre le rôle du **Playwright Inspector**.
* Lancer un test en **mode debug**.
* Comprendre le fonctionnement de **Codegen**.
* Générer une première version d'un test automatiquement.
* Comprendre le **HTML Report**.
* Comprendre ce qu'est une **trace Playwright**.
* Utiliser le **Trace Viewer**.
* Comprendre le rôle des **screenshots**.
* Configurer `headless`, `screenshot` et `trace`.
* Comprendre `trace: 'on'`.
* Comprendre `trace: 'retain-on-failure'`.
* Comprendre les principaux paramètres de `playwright.config.js`.
* Savoir quel outil utiliser lorsqu'un test échoue.

---

# 2. Playwright Inspector

## 2.1 Qu'est-ce que le Playwright Inspector ?

Le **Playwright Inspector** est un outil de debugging permettant d'observer et de contrôler l'exécution d'un test Playwright.

Il est particulièrement utile lorsque tu veux comprendre :

* quelle étape est en train de s'exécuter ;
* quelle action provoque l'erreur ;
* quel locator est utilisé ;
* pourquoi une interaction ne fonctionne pas ;
* à quel moment le test échoue.

---

## 2.2 Lancer Playwright Inspector

La commande utilisée dans le cours est :

```bash
npx playwright test --debug
```

Cette commande permet de lancer les tests en mode debugging.

---

## 2.3 Pourquoi utiliser Inspector ?

Imaginons ce test :

```javascript
test("Login test", async ({ page }) => {
    await page.goto("https://example.com");

    await page.locator("#username").fill("Alex");

    await page.locator("#password").fill("password");

    await page.locator("#login").click();
});
```

Si le test échoue sur :

```javascript
await page.locator("#login").click();
```

le mode debug permet de mieux observer ce qui se passe au moment de cette action.

---

# 3. Mode Debug avec `--debug`

## 3.1 Commande principale

```bash
npx playwright test --debug
```

### Exécution normale

```bash
npx playwright test
```

### Exécution en mode debug

```bash
npx playwright test --debug
```

---

## 3.2 Comparaison

| Commande                      | Utilisation          |
| ----------------------------- | -------------------- |
| `npx playwright test`         | Exécution normale    |
| `npx playwright test --debug` | Debug avec Inspector |
| `npx playwright test --ui`    | UI Runner            |

---

## 3.3 Quand utiliser `--debug` ?

Utilise `--debug` lorsque :

* ton locator ne fonctionne pas ;
* ton test échoue à une étape particulière ;
* tu veux observer les interactions ;
* tu veux comprendre l'ordre d'exécution ;
* tu veux analyser un problème de timing.

---

# 4. Codegen

## 4.1 Qu'est-ce que Codegen ?

**Codegen** est un outil Playwright permettant d'enregistrer les interactions réalisées dans un navigateur et de générer automatiquement une première version du code Playwright.

L'idée est :

```text
Actions utilisateur
       ↓
    Codegen
       ↓
Code Playwright généré
```

---

## 4.2 Lancer Codegen

La commande présentée dans le cours est :

```bash
npx playwright codegen <url>
```

Par exemple :

```bash
npx playwright codegen https://example.com
```

---

## 4.3 Fonctionnement

Lorsque Codegen est lancé :

1. Le navigateur s'ouvre.
2. Tu navigues sur la page.
3. Tu cliques sur les éléments.
4. Tu remplis les champs.
5. Tu sélectionnes des options.
6. Playwright observe tes actions.
7. Du code Playwright est généré.

---

## 4.4 Exemple

Si tu fais :

```text
Ouvrir une page
      ↓
Cliquer sur Login
      ↓
Remplir Username
      ↓
Remplir Password
      ↓
Cliquer sur Submit
```

Codegen peut produire une base ressemblant à :

```javascript
await page.goto("https://example.com");

await page.getByRole("link", { name: "Login" }).click();

await page.getByLabel("Username").fill("Alex");

await page.getByLabel("Password").fill("password");

await page.getByRole("button", { name: "Submit" }).click();
```

---

## 4.5 Pourquoi Codegen est intéressant ?

Codegen est particulièrement intéressant lorsque tu débutes avec Playwright.

Il permet d'apprendre :

* les locators ;
* les actions ;
* les assertions ;
* la syntaxe Playwright ;
* les interactions avec les éléments.

---

## 4.6 ⚠️ Attention

Il ne faut pas considérer le code généré comme du code final.

Codegen doit plutôt être considéré comme un **point de départ**.

Tu dois ensuite :

* relire le code ;
* supprimer les actions inutiles ;
* améliorer les locators ;
* ajouter des assertions ;
* organiser le test ;
* rendre le test plus maintenable.

---

# 5. HTML Report

## 5.1 Qu'est-ce que le HTML Report ?

Playwright peut générer un rapport HTML permettant de visualiser les résultats des tests.

Dans la configuration :

```javascript
reporter: 'html'
```

---

## 5.2 Exemple

Dans `playwright.config.js` :

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
    reporter: 'html',
});
```

---

## 5.3 Pourquoi utiliser un rapport ?

Le rapport permet notamment de :

* voir les tests réussis ;
* voir les tests échoués ;
* identifier rapidement un test problématique ;
* consulter les informations de l'exécution ;
* accéder aux éléments de diagnostic disponibles.

---

## 5.4 Relation entre Report et Trace

Il est important de comprendre la différence :

```text
Test
 ↓
HTML Report
 ↓
Test échoué
 ↓
Trace disponible
 ↓
Trace Viewer
 ↓
Analyse détaillée
```

Le **HTML Report** donne une vue globale.

La **Trace** permet une analyse plus approfondie d'une exécution.

---

# 6. Trace Viewer

## 6.1 Qu'est-ce qu'une Trace ?

Une **trace Playwright** permet de conserver des informations sur l'exécution d'un test afin de pouvoir l'analyser ultérieurement.

Elle est particulièrement utile pour le debugging.

---

## 6.2 Pourquoi utiliser une trace ?

Une trace permet notamment de :

* revenir sur une exécution passée ;
* comprendre ce qui s'est produit ;
* analyser les étapes du test ;
* consulter les screenshots disponibles ;
* comprendre pourquoi un test a échoué.

---

# 6.3 Trace Viewer

Le cours présente l'utilisation de :

```text
trace.playwright.dev
```

Le principe est :

```text
Test
 ↓
Trace générée
 ↓
Fichier de trace
 ↓
Trace Viewer
 ↓
Analyse
```

---

## 6.4 Pourquoi la trace est importante ?

Imaginons que ton test fonctionne sur ton ordinateur mais échoue sur une autre machine.

Tu ne peux pas forcément regarder le navigateur au moment où le problème se produit.

Une trace permet alors de récupérer les informations nécessaires après l'exécution.

---

# 7. Screenshots et traces

## 7.1 Configuration de base

Le cours présente notamment :

```javascript
use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'on',
}
```

---

# 7.2 `headless`

```javascript
headless: false
```

Cela signifie que le navigateur est visible pendant l'exécution.

### Navigateur visible

```javascript
headless: false
```

### Navigateur sans interface

```javascript
headless: true
```

---

## 7.3 Pourquoi utiliser `headless: false` ?

Pendant l'apprentissage, c'est très pratique.

Tu peux voir :

```text
Test
 ↓
Navigateur
 ↓
Action
 ↓
Résultat
```

Tu comprends donc beaucoup plus facilement ce que fait ton script.

---

# 7.4 `screenshot`

```javascript
screenshot: 'on'
```

Cette option active les screenshots pendant l'exécution.

Les screenshots permettent d'avoir une représentation visuelle de l'état de la page.

---

## 7.5 Pourquoi les screenshots sont utiles ?

Imaginons :

```javascript
await page.getByRole("button", { name: "Login" }).click();
```

Le test échoue.

Une capture peut aider à comprendre :

* si le bouton était visible ;
* si une popup était présente ;
* si la page était chargée ;
* si un élément recouvrait le bouton ;
* dans quel état se trouvait la page.

---

# 7.6 `trace: 'on'`

```javascript
trace: 'on'
```

Cette configuration active la collecte des traces.

Elle est particulièrement intéressante pendant l'apprentissage et le debugging.

---

# 7.7 `trace: 'retain-on-failure'`

Une autre configuration présentée dans le cours est :

```javascript
trace: 'retain-on-failure'
```

L'idée est de conserver les traces lorsqu'un test échoue.

Cela permet d'éviter de conserver systématiquement toutes les traces.

---

# 8. `playwright.config.js`

Le fichier `playwright.config.js` est très important.

Il permet de centraliser la configuration de tes tests Playwright.

---

# 8.1 `testDir`

```javascript
testDir: './tests'
```

Cela indique que les tests se trouvent dans :

```text
./tests
```

Par exemple :

```text
project/
│
├── playwright.config.js
│
└── tests/
    ├── login.spec.js
    ├── cart.spec.js
    └── checkout.spec.js
```

---

# 8.2 `timeout`

```javascript
timeout: 30 * 1000
```

Cela correspond à :

```text
30 secondes
```

car :

```text
30 × 1000 = 30000 ms
```

Ce timeout concerne la durée maximale d'un test.

---

# 8.3 `expect.timeout`

```javascript
expect: {
    timeout: 5000,
}
```

Cela correspond à :

```text
5000 ms = 5 secondes
```

Ce timeout concerne les assertions.

Exemple :

```javascript
await expect(page.locator("#message"))
    .toContainText("Success");
```

Playwright attendra selon le timeout configuré pour `expect`.

---

# 8.4 Différence entre `timeout` et `expect.timeout`

C'est une distinction importante.

| Configuration    | Concerne                                 |
| ---------------- | ---------------------------------------- |
| `timeout`        | Durée maximale du test                   |
| `expect.timeout` | Durée maximale d'attente d'une assertion |

---

# 8.5 `reporter`

```javascript
reporter: 'html'
```

Cela indique que Playwright doit utiliser le reporter HTML.

---

# 8.6 `browserName`

```javascript
browserName: 'chromium'
```

Cela configure Chromium comme navigateur.

---

# 8.7 `headless`

```javascript
headless: false
```

Le navigateur est visible.

---

# 8.8 `screenshot`

```javascript
screenshot: 'on'
```

Active la capture des screenshots.

---

# 8.9 `trace`

```javascript
trace: 'on'
```

Active les traces.

Ou :

```javascript
trace: 'retain-on-failure'
```

pour conserver les traces en cas d'échec.

---

# 9. Configuration complète

## 9.1 Configuration avec traces activées

Voici une configuration complète et commentée :

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({

    // Directory containing the tests
    testDir: './tests',

    // Maximum time allowed for each test
    timeout: 30 * 1000,

    // Maximum time allowed for assertions
    expect: {
        timeout: 5000,
    },

    // Generate an HTML report
    reporter: 'html',

    use: {

        // Use Chromium browser
        browserName: 'chromium',

        // Show the browser during execution
        headless: false,

        // Capture screenshots
        screenshot: 'on',

        // Collect traces
        trace: 'on',
    },
});
```

---

# 9.2 Configuration recommandée avec `retain-on-failure`

Une autre configuration intéressante :

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({

    // Directory containing the tests
    testDir: './tests',

    // Maximum time allowed for each test
    timeout: 30 * 1000,

    // Maximum time allowed for assertions
    expect: {
        timeout: 5000,
    },

    // HTML report
    reporter: 'html',

    use: {

        // Browser
        browserName: 'chromium',

        // Show browser
        headless: false,

        // Capture screenshots
        screenshot: 'on',

        // Keep traces for failed tests
        trace: 'retain-on-failure',
    },
});
```

---

# 10. Stratégie de debugging

Voici une méthode que tu peux utiliser dans ton projet.

---

## Étape 1 — Exécuter normalement

Commence toujours par :

```bash
npx playwright test
```

Observe l'erreur.

---

## Étape 2 — Lire le message d'erreur

Par exemple :

```text
Error: expect(locator).toContainText(expected) failed
```

Cherche :

* le locator ;
* l'action ;
* l'assertion ;
* le timeout ;
* l'état réel de la page.

---

## Étape 3 — Utiliser Inspector

Lance :

```bash
npx playwright test --debug
```

Tu peux alors observer l'exécution.

---

## Étape 4 — Utiliser Codegen

Si ton problème concerne les locators ou les interactions :

```bash
npx playwright codegen https://example.com
```

Utilise Codegen pour explorer la page et voir les locators générés.

---

## Étape 5 — Consulter le HTML Report

Après l'exécution, consulte le rapport HTML.

Il permet d'avoir une vue globale des résultats.

---

## Étape 6 — Consulter la trace

Si une trace est disponible :

```text
trace.playwright.dev
```

utilise-la pour analyser l'exécution.

---

## Étape 7 — Corriger

Corrige :

* le locator ;
* l'attente ;
* l'action ;
* l'assertion ;
* la configuration.

---

## Étape 8 — Rejouer

Relance :

```bash
npx playwright test
```

et vérifie que le problème est résolu.

---

# 11. Différences entre les outils

| Outil            | Question principale                                         |
| ---------------- | ----------------------------------------------------------- |
| **Inspector**    | Que se passe-t-il pendant l'exécution ?                     |
| **Codegen**      | Comment générer rapidement une première version du script ? |
| **HTML Report**  | Quels tests ont réussi ou échoué ?                          |
| **Trace Viewer** | Que s'est-il passé pendant cette exécution ?                |
| **Screenshot**   | À quoi ressemblait la page ?                                |
| **UI Runner**    | Comment observer et piloter les tests dans une interface ?  |

---

# 11.1 Exemple concret

### Problème

Ton test échoue sur :

```javascript
await page.getByRole("button", { name: "Login" }).click();
```

### Tu peux utiliser :

```text
Inspector
```

pour observer l'action.

---

### Tu ne sais pas quel locator utiliser ?

Utilise :

```bash
npx playwright codegen https://example.com
```

---

### Ton test a échoué sur CI ?

Consulte :

```text
HTML Report
```

puis :

```text
Trace Viewer
```

---

### Tu veux savoir à quoi ressemblait la page ?

Regarde le :

```text
Screenshot
```

---

# 12. Bonnes pratiques

## 12.1 Codegen n'est pas le code final

Évite de copier aveuglément tout ce que Codegen produit.

Utilise-le comme aide.

---

## 12.2 Relire les locators

Après Codegen, demande-toi :

> Est-ce que ce locator est stable ?

Par exemple :

```javascript
page.locator("div:nth-child(4) > button")
```

peut être moins lisible et potentiellement moins stable qu'un locator basé sur le rôle ou le texte.

---

## 12.3 Ajouter des assertions

Un test ne doit pas seulement effectuer des actions.

Il doit également vérifier le résultat.

Exemple :

```javascript
await page.getByRole("button", { name: "Login" }).click();

await expect(page).toHaveTitle("Dashboard");
```

---

## 12.4 Utiliser Inspector pour comprendre

Lorsque tu ne comprends pas pourquoi une action échoue :

```bash
npx playwright test --debug
```

---

## 12.5 Utiliser les traces pour les échecs difficiles

Pour des problèmes difficiles à reproduire :

```javascript
trace: 'retain-on-failure'
```

est particulièrement intéressant.

---

## 12.6 Utiliser `headless: false` pendant l'apprentissage

Pendant que tu apprends :

```javascript
headless: false
```

peut rendre les tests beaucoup plus faciles à comprendre.

Tu vois réellement le navigateur effectuer les actions.

---

# 13. Exercices

## Exercice 1 — Inspector

Lance :

```bash
npx playwright test --debug
```

### Objectif

Comprendre comment le test s'exécute en mode debug.

---

## Exercice 2 — Codegen

Lance :

```bash
npx playwright codegen https://example.com
```

### Fais :

1. Clique sur plusieurs éléments.
2. Remplis un formulaire si disponible.
3. Observe le code généré.
4. Recopie une partie du code dans un test.

---

## Exercice 3 — HTML Report

Configure :

```javascript
reporter: 'html'
```

Puis lance :

```bash
npx playwright test
```

### Objectif

Observer le rapport généré par Playwright.

---

## Exercice 4 — Screenshots

Configure :

```javascript
screenshot: 'on'
```

Lance un test et observe les captures disponibles.

---

## Exercice 5 — Trace

Configure :

```javascript
trace: 'on'
```

Lance un test.

Puis analyse la trace avec :

```text
trace.playwright.dev
```

---

## Exercice 6 — Trace uniquement en cas d'échec

Remplace :

```javascript
trace: 'on'
```

par :

```javascript
trace: 'retain-on-failure'
```

Provoque volontairement une erreur :

```javascript
await expect(page).toHaveTitle("Wrong title");
```

### Objectif

Comprendre pourquoi conserver les traces uniquement en cas d'échec peut être pratique.

---

## Exercice 7 — `headless`

Teste :

```javascript
headless: false
```

puis :

```javascript
headless: true
```

Observe la différence.

---

## Exercice 8 — Timeouts

Teste :

```javascript
timeout: 30 * 1000
```

et :

```javascript
expect: {
    timeout: 5000,
}
```

Essaie de comprendre la différence entre :

```text
timeout
```

et :

```text
expect.timeout
```

---

# 14. Fiche mémo

## Commandes

### Exécuter les tests

```bash
npx playwright test
```

### Debug Inspector

```bash
npx playwright test --debug
```

### Codegen

```bash
npx playwright codegen <url>
```

Exemple :

```bash
npx playwright codegen https://example.com
```

---

## Configuration

### Dossier des tests

```javascript
testDir: './tests'
```

### Timeout d'un test

```javascript
timeout: 30 * 1000
```

### Timeout d'une assertion

```javascript
expect: {
    timeout: 5000,
}
```

### Reporter HTML

```javascript
reporter: 'html'
```

### Chromium

```javascript
browserName: 'chromium'
```

### Navigateur visible

```javascript
headless: false
```

### Screenshots

```javascript
screenshot: 'on'
```

### Traces

```javascript
trace: 'on'
```

### Traces uniquement pour les échecs

```javascript
trace: 'retain-on-failure'
```

---

# 15. Checklist

Avant de considérer le chapitre comme maîtrisé, vérifie :

* [ ] Je sais ce qu'est le Playwright Inspector.
* [ ] Je sais lancer `npx playwright test --debug`.
* [ ] Je comprends le rôle de Codegen.
* [ ] Je sais lancer `npx playwright codegen <url>`.
* [ ] Je comprends que le code généré doit être relu.
* [ ] Je sais à quoi sert `reporter: 'html'`.
* [ ] Je comprends le rôle du HTML Report.
* [ ] Je comprends ce qu'est une trace.
* [ ] Je sais utiliser le Trace Viewer.
* [ ] Je connais `trace.playwright.dev`.
* [ ] Je comprends `screenshot: 'on'`.
* [ ] Je comprends `trace: 'on'`.
* [ ] Je comprends `trace: 'retain-on-failure'`.
* [ ] Je comprends `headless: false`.
* [ ] Je comprends la différence entre `timeout` et `expect.timeout`.
* [ ] Je sais choisir entre Inspector, Codegen, Report et Trace Viewer.
* [ ] Je sais utiliser les outils de debugging lorsqu'un test échoue.

---

# 16. Conclusion

Le chapitre 6 introduit les outils qui permettent de passer de :

> **« J'écris un test »**

à :

> **« J'écris, j'observe, je débogue et j'analyse mon test. »**

Les quatre éléments les plus importants à retenir sont :

### 1. Inspector

```bash
npx playwright test --debug
```

Permet de **déboguer l'exécution**.

---

### 2. Codegen

```bash
npx playwright codegen <url>
```

Permet de **générer rapidement une première base de code**.

---

### 3. HTML Report

```javascript
reporter: 'html'
```

Permet de **visualiser les résultats des tests**.

---

### 4. Trace

```javascript
trace: 'retain-on-failure'
```

Permet de **conserver les informations nécessaires au diagnostic des tests qui échouent**.

---

## 🧠 Schéma global à retenir

```text
                    PLAYWRIGHT
                        │
            ┌───────────┴───────────┐
            │                       │
          ÉCRIRE                 DÉBOGUER
            │                       │
         Codegen                 Inspector
            │                       │
            └───────────┬───────────┘
                        │
                      TEST
                        │
                 ┌──────┴──────┐
                 │             │
              SUCCESS        FAILURE
                 │             │
                 │        HTML Report
                 │             │
                 │           Trace
                 │             │
                 │      Trace Viewer
                 │             │
                 └──────┬──────┘
                        │
                     ANALYSER
                        │
                      CORRIGER
                        │
                     REJOUER
```

> **Méthode à retenir :**
>
> **Codegen → écrire → Test → Inspector → Report → Trace → Corriger → Rejouer**.