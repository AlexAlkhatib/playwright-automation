# 🎭 Playwright — Chapitre 2

## Locators, Actions, Assertions, Collections & Attente dynamique

> Documentation suivant la progression et les exemples du cours, avec des explications pédagogiques supplémentaires clairement signalées lorsqu’elles vont au-delà des notes. 

---

## Sommaire

1. [Objectifs du chapitre](#1-objectifs-du-chapitre)
2. [Locators : le concept central](#2-locators--le-concept-central)
3. [Locator et actions](#3-locator-et-actions)
4. [Premier scénario : connexion avec des identifiants invalides](#4-premier-scénario--connexion-avec-des-identifiants-invalides)
5. [Extraire un message et l’asserter](#5-extraire-un-message-et-lasserter)
6. [Assertions](#6-assertions)
7. [Fixture `page`](#7-fixture-page)
8. [`test.only()`](#8-testonly)
9. [Plusieurs éléments avec un locator](#9-plusieurs-éléments-avec-un-locator)
10. [`nth()` : sélectionner un élément](#10-nth--sélectionner-un-élément)
11. [Exemple complet : connexion puis premier produit](#11-exemple-complet--connexion-puis-premier-produit)
12. [`allTextContents()`](#12-alltextcontents)
13. [`nth()` ou `allTextContents()` ?](#13-nth-ou-alltextcontents)
14. [Attente dynamique](#14-attente-dynamique)
15. [Exemple : application client](#15-exemple--application-client)
16. [Pourquoi attendre ?](#16-pourquoi-attendre-)
17. [Exécuter un fichier de test précis](#17-exécuter-un-fichier-de-test-précis)
18. [`async` / `await` : mémo](#18-async--await--mémo)
19. [Séquence mentale à retenir](#19-séquence-mentale-à-retenir)
20. [Erreurs fréquentes à comprendre](#20-erreurs-fréquentes-à-comprendre)
21. [Mémo des méthodes du chapitre](#21-mémo-des-méthodes-du-chapitre)
22. [Exercices d’apprentissage](#22-exercices-dapprentissage)
23. [Checklist de compréhension](#23-checklist-de-compréhension)
24. [À retenir absolument](#24-à-retenir-absolument)
25. [Conclusion](#25-conclusion)

---

# 1. Objectifs du chapitre

À la fin de ce chapitre, vous serez capable de :

* Identifier des éléments avec les **locators Playwright**.
* Utiliser des sélecteurs **CSS** et **XPath**.
* Remplir des champs et cliquer sur des éléments.
* Extraire du texte depuis une page.
* Écrire des assertions avec `expect()`.
* Utiliser `test.only()` pour isoler un test.
* Travailler avec plusieurs éléments retournés par un locator.
* Utiliser `nth()` pour cibler un élément précis.
* Récupérer tous les textes avec `allTextContents()`.
* Comprendre l’attente dynamique lorsque les éléments sont chargés progressivement.
* Utiliser `waitFor()` et `waitForLoadState()` dans les scénarios présentés.
* Exécuter un fichier de test précis. 

---

# 2. Locators : le concept central

Un **locator** représente une manière de cibler un élément de l’interface web.

Le cours montre notamment des sélecteurs CSS basés sur :

* l'ID ;
* la classe ;
* les attributs HTML. 

## 2.1 Locator avec un ID

```typescript
input#username
```

Cela signifie :

> Cibler l’élément dont l’ID est `username`.

Exemple :

```typescript
page.locator("#username")
```

---

## 2.2 Locator avec une classe

```typescript
input.form-control
```

Cela cible un élément possédant la classe CSS `form-control`.

Exemple :

```typescript
page.locator(".form-control")
```

---

## 2.3 Locator avec un attribut

```typescript
[name='username']
```

Cela cible un élément dont l’attribut `name` vaut `username`.

Exemple :

```typescript
page.locator("[name='username']")
```

---

## 2.4 Les principaux sélecteurs à retenir

| Type     | Syntaxe             | Signification                          |
| -------- | ------------------- | -------------------------------------- |
| ID       | `#username`         | Élément ayant l'ID `username`          |
| Classe   | `.form-control`     | Élément ayant la classe `form-control` |
| Attribut | `[name='username']` | Élément dont `name="username"`         |

---

# 3. Locator et actions

Le cours montre deux styles d’utilisation.

## 3.1 Utiliser directement le locator

```typescript
await page.locator("#username").fill("Alex");

await page.locator("#password").fill("test123");

await page.locator("#signInBtn").click();
```

Ici, chaque locator est créé directement au moment où l’action est réalisée. 

---

## 3.2 Stocker les locators dans des variables

On peut également créer les locators à l’avance :

```typescript
const username = page.locator("#username");
const password = page.locator("#password");
const signInButton = page.locator("#signInBtn");
```

Puis les réutiliser :

```typescript
await username.fill("Alex");

await password.fill("test123");

await signInButton.click();
```

Cette approche est particulièrement pratique lorsqu’un même élément doit être utilisé plusieurs fois. 

### À retenir

```text
locator()
   ↓
cible un élément
   ↓
fill() / click() / textContent()
   ↓
action ou lecture
```

---

# 4. Premier scénario : connexion avec des identifiants invalides

Le premier exercice consiste à :

1. créer un Browser Context ;
2. créer une Page ;
3. ouvrir la page de connexion ;
4. remplir les champs ;
5. cliquer sur le bouton de connexion. 

```typescript
import { test } from "@playwright/test";

test("Browser Context Playwright Test", async ({ browser }) => {

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto(
        "https://rahulshettyacademy.com/loginpagePractise/"
    );

    console.log(await page.title());

    await page.locator("#username").fill("Alex");

    await page.locator("#password").fill("test123");

    await page.locator("#signInBtn").click();
});
```

---

## 4.1 Le rôle de chaque étape

### Créer un contexte

```typescript
const context = await browser.newContext();
```

### Créer une page

```typescript
const page = await context.newPage();
```

### Naviguer

```typescript
await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
```

### Remplir un champ

```typescript
await page.locator("#username").fill("Alex");
```

### Cliquer

```typescript
await page.locator("#signInBtn").click();
```

---

# 5. Extraire un message et l’asserter

Après une tentative de connexion incorrecte, le cours récupère le message d’erreur.

Le locator utilisé est :

```typescript
const errorLocator = page.locator("[style*='block']");
```

Puis le texte est récupéré avec :

```typescript
const errorMessage = await errorLocator.textContent();

console.log(errorMessage);
```

Enfin, le test vérifie le message :

```typescript
await expect(errorLocator)
    .toContainText("Incorrect");
```



---

## 5.1 Décomposer le scénario

```typescript
const errorLocator = page.locator("[style*='block']");
```

On identifie l’élément.

Puis :

```typescript
const errorMessage = await errorLocator.textContent();
```

On récupère son texte.

Puis :

```typescript
console.log(errorMessage);
```

On affiche le texte dans la console.

Enfin :

```typescript
await expect(errorLocator)
    .toContainText("Incorrect");
```

On vérifie que le texte attendu est présent.

---

## 5.2 Comprendre `[style*='block']`

Le symbole `*=` signifie :

> contient

Donc :

```css
[style*='block']
```

signifie :

> sélectionner un élément dont l'attribut `style` contient la valeur `block`.

---

# 6. Assertions

Une **assertion** vérifie que le résultat obtenu correspond à ce qui est attendu.

Le chapitre utilise notamment :

```typescript
toContainText()
```

et :

```typescript
toHaveTitle()
```

### Vérifier un message

```typescript
await expect(errorLocator)
    .toContainText("Incorrect");
```

### Vérifier le titre

```typescript
await expect(page)
    .toHaveTitle("Google");
```



---

## 6.1 `console.log()` vs `expect()`

### `console.log()`

```typescript
console.log(errorMessage);
```

Affiche simplement une information.

### `expect()`

```typescript
await expect(errorLocator)
    .toContainText("Incorrect");
```

Vérifie une condition.

### Différence essentielle

| Méthode         | Rôle                     |
| --------------- | ------------------------ |
| `console.log()` | Afficher une information |
| `expect()`      | Vérifier une condition   |

---

# 7. Fixture `page`

Playwright peut fournir directement une **fixture `page`** au test.

Il n'est donc pas toujours nécessaire de créer manuellement :

```text
Browser
   ↓
Context
   ↓
Page
```

Exemple :

```typescript
import { test, expect } from "@playwright/test";

test("Page Fixture Playwright Test", async ({ page }) => {

    await page.goto("https://www.google.com/");

    console.log(await page.title());

    await expect(page)
        .toHaveTitle("Google");
});
```



---

# 8. `test.only()`

`test.only()` permet d'exécuter **uniquement le test sélectionné**.

Exemple :

```typescript
test.only("Playwright Sample Test", async ({ page }) => {

    // ...

});
```

Les autres tests sont ignorés pendant cette exécution. 

## Quand utiliser `test.only()` ?

Principalement pendant :

* le développement ;
* le débogage ;
* la mise au point d'un scénario.

### Attention

Avant de lancer toute la suite de tests, pensez à retirer :

```typescript
test.only()
```

Sinon les autres tests ne seront pas exécutés.

---

# 9. Plusieurs éléments avec un locator

Un locator peut correspondre à **plusieurs éléments**.

Le cours utilise par exemple :

```typescript
const cardTitles = page.locator(".card-body a");
```

Ce locator peut correspondre à plusieurs liens correspondant aux titres des produits. 

Par exemple :

```text
.card-body a
     ↓
 ┌─────────────┐
 │ iphone X    │
 ├─────────────┤
 │ Samsung     │
 ├─────────────┤
 │ Nokia Edge  │
 ├─────────────┤
 │ Blackberry  │
 └─────────────┘
```

Si une opération attend un seul élément alors que le locator en trouve plusieurs, Playwright peut signaler une **violation d'unicité**.

Dans ce cas, on peut cibler un élément précis avec `nth()`.

---

# 10. `nth()` : sélectionner un élément

`nth(index)` permet de sélectionner un élément à une position donnée.

Exemple :

```typescript
page.locator(".card-body a").nth(0)
```

Cela sélectionne le **premier élément**. 

---

## 10.1 Les index commencent à 0

```text
nth(0) → premier élément
nth(1) → deuxième élément
nth(2) → troisième élément
nth(3) → quatrième élément
```

Exemple :

```typescript
console.log(
    await page
        .locator(".card-body a")
        .nth(0)
        .textContent()
);
```

---

## 10.2 Schéma mental

```text
.card-body a

   ↓

[0] iphone X
[1] Samsung Note 8
[2] Nokia Edge
[3] Blackberry

   ↓

nth(0)

   ↓

iphone X
```

---

# 11. Exemple complet : connexion puis premier produit

Le cours combine plusieurs notions dans un même scénario :

```typescript
const username = page.locator("#username");
const password = page.locator("#password");
const signInButton = page.locator("#signInBtn");

await username.fill("Alex");

await password.fill("test123");

await signInButton.click();

const errorLocator = page.locator("[style*='block']");

const errorMessage = await errorLocator.textContent();

console.log(errorMessage);

await expect(errorLocator)
    .toContainText("Incorrect");
```

Puis une nouvelle tentative de connexion :

```typescript
await username.fill("rahulshettyacademy");

await password.fill("Learning@830$3mK2");

await signInButton.click();
```

Enfin, récupération du premier produit :

```typescript
console.log(
    await page
        .locator(".card-body a")
        .nth(0)
        .textContent()
);
```



---

# 12. `allTextContents()`

Lorsque l'on souhaite récupérer **tous les textes** correspondant à un locator, on peut utiliser :

```typescript
allTextContents()
```

Exemple :

```typescript
const cardTitles = page.locator(".card-body a");

const allTitles = await cardTitles.allTextContents();

console.log(allTitles);
```

Le cours donne une liste semblable à :

```text
[
    "iphone X",
    "Samsung Note 8",
    "Nokia Edge",
    "Blackberry"
]
```



---

## 12.1 Attention au chargement dynamique

Le cours indique un point important :

> `allTextContents()` n'est pas fiable si tous les éléments ne sont pas encore chargés.

La méthode peut alors retourner :

```typescript
[]
```

alors que les produits vont apparaître quelques instants plus tard.



C'est pourquoi la **synchronisation** devient importante.

---

# 13. `nth()` ou `allTextContents()` ?

Les deux méthodes répondent à des besoins différents.

| Besoin                      | Méthode             | Exemple                           |
| --------------------------- | ------------------- | --------------------------------- |
| Récupérer un élément précis | `nth()`             | `cardTitles.nth(0).textContent()` |
| Récupérer tous les textes   | `allTextContents()` | `cardTitles.allTextContents()`    |



### Exemple

Pour récupérer uniquement le premier produit :

```typescript
const firstProduct = await page
    .locator(".card-body a")
    .nth(0)
    .textContent();
```

Pour récupérer tous les produits :

```typescript
const products = await page
    .locator(".card-body a")
    .allTextContents();
```

---

# 14. Attente dynamique

La dernière partie du chapitre traite d'une application client dans laquelle les produits sont chargés **après la navigation**.

Le problème est le suivant :

```text
page.goto()
    ↓
Page affichée
    ↓
Produits en cours de chargement
    ↓
Produits disponibles
```

Si le test tente de lire les produits trop tôt, il peut obtenir une liste vide ou incomplète.

Le cours présente deux approches :

```typescript
await page.waitForLoadState("networkidle");
```

ou :

```typescript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

Dans l'exemple, la seconde approche est utilisée pour attendre qu'un premier élément produit soit disponible. 

---

## 14.1 `waitForLoadState("networkidle")`

```typescript
await page.waitForLoadState("networkidle");
```

Cette approche attend l'état de chargement réseau présenté dans le cours.

---

## 14.2 `first().waitFor()`

```typescript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

La logique est :

```text
.card-body b
     ↓
first()
     ↓
premier produit
     ↓
waitFor()
     ↓
attendre qu'il soit disponible
```

Cette approche est plus directement liée à l'élément nécessaire au scénario.

---

# 15. Exemple : application client

Voici le scénario présenté dans le cours :

```typescript
import { test } from "@playwright/test";

test.only(
    "Browser Context-Validating Error Login",
    async ({ page }) => {

        await page.goto(
            "https://rahulshettyacademy.com/client"
        );

        await page
            .locator("#userEmail")
            .fill("anshika@gmail.com");

        await page
            .locator("#userPassword")
            .fill("Iamking@000");

        await page
            .locator("[value='Login']")
            .click();

        // Alternative présentée dans le cours :
        // await page.waitForLoadState("networkidle");

        await page
            .locator(".card-body b")
            .first()
            .waitFor();

        const titles = await page
            .locator(".card-body b")
            .allTextContents();

        console.log(titles);
    }
);
```



---

# 16. Pourquoi attendre ?

Une application web peut charger progressivement ses données.

Par exemple :

```text
Navigation
    ↓
HTML initial
    ↓
Requête API
    ↓
Réponse serveur
    ↓
Création des produits
    ↓
Produits disponibles
```

Si le test fait :

```typescript
const titles = await page
    .locator(".card-body b")
    .allTextContents();
```

trop tôt, le résultat peut être :

```typescript
[]
```

ou une liste incomplète.

Le chapitre introduit donc les mécanismes d'attente pour synchroniser le test avec l'interface. 

> **Complément pédagogique :** Playwright possède également des mécanismes d'attente automatique associés à de nombreuses actions et assertions. Le point essentiel ici est de comprendre **pourquoi la synchronisation est nécessaire**.

---

# 17. Exécuter un fichier de test précis

Le cours montre comment exécuter directement le fichier :

```text
ClientApp.spec.js
```

Commande :

```bash
npx playwright test tests/ClientApp.spec.js
```

Cela permet de lancer uniquement ce fichier plutôt que toute la suite. 

---

# 18. `async` / `await` : mémo

Playwright utilise de nombreuses opérations asynchrones.

Les principales opérations vues dans ce chapitre sont :

| Opération        | Exemple                              |
| ---------------- | ------------------------------------ |
| Navigation       | `await page.goto(...)`               |
| Remplissage      | `await locator.fill(...)`            |
| Clic             | `await locator.click()`              |
| Lecture du texte | `await locator.textContent()`        |
| Titre            | `await page.title()`                 |
| Assertion        | `await expect(...).toHaveTitle(...)` |



---

## 18.1 Point important : `locator()` n'a généralement pas besoin de `await`

On écrit :

```typescript
const username = page.locator("#username");
```

et non :

```typescript
const username = await page.locator("#username");
```

Le `locator()` sert à **créer le locator**.

L'attente intervient ensuite lors d'opérations comme :

```typescript
await username.fill("Alex");
```

ou :

```typescript
await username.textContent();
```



---

# 19. Séquence mentale à retenir

Pour construire un test Playwright, retenez cette séquence :

```text
1. Obtenir la page
        ↓
2. Naviguer avec page.goto()
        ↓
3. Identifier les éléments
        ↓
4. Effectuer les actions
        ↓
5. Attendre / récupérer les informations
        ↓
6. Vérifier le résultat avec expect()
        ↓
7. Gérer les collections avec nth()
   ou allTextContents()
        ↓
8. Synchroniser les données dynamiques
```

Le chapitre présente cette logique comme la séquence générale de travail. 

---

# 20. Erreurs fréquentes à comprendre

## 20.1 Assertion incorrecte

Le locator peut être correctement trouvé, mais le texte réel peut être différent du texte attendu.

Exemple :

```typescript
await expect(errorLocator)
    .toContainText("Incorrect");
```

Si le message ne contient pas `Incorrect`, le test échoue.

---

## 20.2 Oublier `await`

Une action ou une lecture asynchrone doit être attendue :

```typescript
await locator.click();

await locator.fill("Alex");

await locator.textContent();
```

---

## 20.3 Locator correspondant à plusieurs éléments

Si :

```typescript
const products = page.locator(".card-body a");
```

correspond à plusieurs éléments, certaines opérations nécessitant un élément unique peuvent poser problème.

Dans ce cas :

```typescript
products.nth(0)
```

permet de sélectionner précisément le premier.

---

## 20.4 Lire une liste trop tôt

Évitez de faire immédiatement :

```typescript
const titles = await page
    .locator(".card-body b")
    .allTextContents();
```

si les produits sont encore en train de se charger.

Utilisez d'abord une attente adaptée :

```typescript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

---

## 20.5 Laisser `test.only()`

Pendant le développement :

```typescript
test.only(...)
```

peut être pratique.

Mais avant l'exécution complète de la suite, il faut le retirer.

---

## 20.6 Confondre `locator()` et les actions

`locator()` sert à **cibler**.

```typescript
page.locator("#username")
```

`fill()` et `click()` servent ensuite à **agir** :

```typescript
await username.fill("Alex");

await signInButton.click();
```

Ces points sont repris dans les erreurs fréquentes du chapitre. 

---

# 21. Mémo des méthodes du chapitre

| Méthode              | Rôle                           | Exemple                                            |
| -------------------- | ------------------------------ | -------------------------------------------------- |
| `locator()`          | Créer un locator               | `page.locator("#username")`                        |
| `fill()`             | Remplir un champ               | `await username.fill("Alex")`                      |
| `click()`            | Cliquer                        | `await signInButton.click()`                       |
| `goto()`             | Naviguer                       | `await page.goto(url)`                             |
| `title()`            | Lire le titre                  | `await page.title()`                               |
| `textContent()`      | Lire le texte                  | `await locator.textContent()`                      |
| `toContainText()`    | Vérifier un texte              | `await expect(locator).toContainText("Incorrect")` |
| `toHaveTitle()`      | Vérifier le titre              | `await expect(page).toHaveTitle("Google")`         |
| `nth()`              | Sélectionner par index         | `locator.nth(0)`                                   |
| `first()`            | Sélectionner le premier        | `locator.first()`                                  |
| `allTextContents()`  | Récupérer tous les textes      | `await locator.allTextContents()`                  |
| `waitFor()`          | Attendre un élément            | `await locator.first().waitFor()`                  |
| `waitForLoadState()` | Attendre un état de chargement | `await page.waitForLoadState("networkidle")`       |



---

# 22. Exercices d'apprentissage

### Exercice 1 — Locator username

Créer un locator pour `username` avec son ID.

```typescript
const username = page.locator("#username");
```

### Exercice 2 — Locator password

Créer un locator pour le mot de passe.

```typescript
const password = page.locator("#password");
```

### Exercice 3 — Bouton de connexion

Créer un locator pour le bouton.

```typescript
const signInButton = page.locator("#signInBtn");
```

### Exercice 4 — Remplir et cliquer

```typescript
await username.fill("Alex");

await password.fill("test123");

await signInButton.click();
```

### Exercice 5 — Afficher le titre

```typescript
console.log(await page.title());
```

### Exercice 6 — Récupérer le message d'erreur

```typescript
const errorMessage = await errorLocator.textContent();

console.log(errorMessage);
```

### Exercice 7 — Ajouter une assertion

```typescript
await expect(errorLocator)
    .toContainText("Incorrect");
```

### Exercice 8 — Créer un locator correspondant à plusieurs cartes

```typescript
const cardTitles = page.locator(".card-body a");
```

### Exercice 9 — Afficher le premier titre

```typescript
console.log(
    await cardTitles
        .nth(0)
        .textContent()
);
```

### Exercice 10 — Afficher tous les titres

```typescript
console.log(
    await cardTitles.allTextContents()
);
```

### Exercice 11 — Tester une liste dynamique

Observer le comportement lorsque les produits ne sont pas encore chargés.

### Exercice 12 — Ajouter une attente

```typescript
await page
    .locator(".card-body b")
    .first()
    .waitFor();
```

### Exercice 13 — Exécuter un fichier précis

```bash
npx playwright test tests/ClientApp.spec.js
```

### Exercice 14 — Utiliser `test.only()`

Utiliser :

```typescript
test.only(...)
```

pendant le débogage, puis le retirer. 

---

# 23. Checklist de compréhension

* [ ] Je sais ce qu'est un locator.
* [ ] Je sais utiliser `#id`.
* [ ] Je sais utiliser `.class`.
* [ ] Je sais utiliser `[attribute=value]`.
* [ ] Je sais remplir un champ avec `fill()`.
* [ ] Je sais cliquer avec `click()`.
* [ ] Je sais extraire du texte avec `textContent()`.
* [ ] Je comprends la différence entre `console.log()` et `expect()`.
* [ ] Je sais utiliser `toContainText()`.
* [ ] Je sais utiliser `toHaveTitle()`.
* [ ] Je comprends pourquoi `nth()` peut être nécessaire.
* [ ] Je sais récupérer plusieurs textes avec `allTextContents()`.
* [ ] Je comprends le problème d'une lecture trop précoce d'une liste dynamique.
* [ ] Je sais utiliser `first().waitFor()`.
* [ ] Je sais utiliser `waitForLoadState()`.
* [ ] Je sais exécuter un fichier de test précis.
* [ ] Je sais utiliser `test.only()` pendant le débogage. 

---

# 24. À retenir absolument

Le cœur du chapitre repose sur **deux grandes notions : les locators et la synchronisation**.

Un test Playwright suit généralement cette logique :

```text
LOCATOR
   ↓
ACTION
   ↓
ATTENTE / LECTURE
   ↓
ASSERTION
```

Par exemple :

```typescript
const username = page.locator("#username");

await username.fill("Alex");

const value = await username.inputValue();

await expect(username).toHaveValue("Alex");
```

Dans ce chapitre, l'essentiel est surtout de comprendre que Playwright permet de :

1. **identifier** les éléments ;
2. **agir** dessus ;
3. **récupérer** des informations ;
4. **vérifier** les résultats ;
5. **gérer plusieurs éléments** ;
6. **attendre les éléments dynamiques**.

Lorsque plusieurs éléments correspondent à un locator, il faut choisir explicitement l'élément voulu avec `nth()` ou récupérer la collection avec `allTextContents()`.

Lorsque les données sont chargées dynamiquement, il faut synchroniser le test avec leur disponibilité. 

---

# 25. Conclusion

Le **Chapitre 2** pose les bases fondamentales de l'automatisation avec Playwright.

Les notions à maîtriser sont :

### 🎯 Locators

```typescript
page.locator("#username")
page.locator(".card-body")
page.locator("[name='username']")
```

### 🖊️ Actions

```typescript
await locator.fill("Alex");
await locator.click();
```

### 📖 Lecture

```typescript
await locator.textContent();
await page.title();
```

### ✅ Assertions

```typescript
await expect(locator)
    .toContainText("Incorrect");

await expect(page)
    .toHaveTitle("Google");
```

### 🔢 Collections

```typescript
locator.nth(0);

locator.first();

await locator.allTextContents();
```

### ⏳ Synchronisation

```typescript
await locator.first().waitFor();

await page.waitForLoadState("networkidle");
```

### 🧪 Exécution ciblée

```typescript
test.only(...)
```

et :

```bash
npx playwright test tests/ClientApp.spec.js
```

---

## 🧠 Les 5 notions prioritaires

| # | Notion              | À retenir                                                               |
| - | ------------------- | ----------------------------------------------------------------------- |
| 1 | **Locator**         | Permet d'identifier un élément                                          |
| 2 | **Actions**         | `fill()`, `click()` permettent d'interagir                              |
| 3 | **Assertions**      | `expect()` permet de vérifier le résultat                               |
| 4 | **Collections**     | `nth()` et `allTextContents()` permettent de gérer plusieurs éléments   |
| 5 | **Synchronisation** | `waitFor()` / `waitForLoadState()` évitent de lire les données trop tôt |

### Schéma final

```text
                PLAYWRIGHT
                     │
                     ▼
                 LOCATORS
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
       ACTIONS                LECTURE
          │                     │
    fill() / click()      textContent()
          │                     │
          └──────────┬──────────┘
                     ▼
                ASSERTIONS
                     │
                   expect()
                     │
                     ▼
             TEST VALIDÉ
```

> **Idée centrale du chapitre :** savoir cibler les bons éléments ne suffit pas. Un bon test Playwright doit également savoir **agir, lire, vérifier et attendre le bon moment**.