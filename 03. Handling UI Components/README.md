# 🎭 Playwright — Chapitre 3

## Manipuler les composants UI avec Playwright

### Thèmes du chapitre

1. Listes déroulantes statiques
2. Boutons radio
3. Cases à cocher
4. Assertions avec `expect`
5. `async / await` dans les assertions
6. Validation des attributs HTML
7. `textContent()` vs `inputValue()`
8. Fenêtres et onglets enfants
9. `Promise.all()`
10. `context.waitForEvent("page")`

---

# 1. Objectifs du chapitre

À la fin de ce chapitre, vous serez capable de :

* Sélectionner une option dans un `<select>`.
* Manipuler des boutons radio.
* Manipuler des cases à cocher.
* Vérifier l’état d’un élément.
* Utiliser `isChecked()`.
* Utiliser `toBeChecked()`.
* Comprendre `toBeTruthy()` et `toBeFalsy()`.
* Vérifier un attribut HTML avec `toHaveAttribute()`.
* Comprendre pourquoi `await` apparaît dans certaines assertions.
* Récupérer la valeur d’un champ avec `inputValue()`.
* Différencier `textContent()` et `inputValue()`.
* Gérer une nouvelle fenêtre ou un nouvel onglet.
* Attendre l’ouverture d’une nouvelle `Page`.
* Utiliser `Promise.all()` pour synchroniser plusieurs opérations.
* Réutiliser une information récupérée dans une nouvelle page sur la page d’origine.

---

# 2. Éléments HTML manipulés

Ce chapitre utilise principalement quatre types de composants d’interface.

### Liste déroulante

```html
<select>
    <option>Student</option>
    <option>Consult</option>
</select>
```

### Bouton radio

```html
<input type="radio">
```

### Case à cocher

```html
<input type="checkbox">
```

### Champ de saisie

```html
<input type="text">
```

Playwright ne manipule pas uniquement des boutons : il peut interagir avec de nombreux éléments HTML et vérifier leur état ou leurs attributs.

---

# 3. Listes déroulantes statiques

## 3.1 Définition

En HTML, une liste déroulante statique est généralement un élément `<select>` contenant plusieurs éléments `<option>`.

```html
<select class="form-control">
    <option value="student">Student</option>
    <option value="consult">Consult</option>
</select>
```

Playwright fournit une méthode dédiée à ce type de composant :

```typescript
selectOption()
```

---

## 3.2 Sélectionner une option

```typescript
const dropdown = page.locator("select.form-control");

await dropdown.selectOption("consult");
```

Le sélecteur :

```typescript
select.form-control
```

signifie :

> Trouver un élément `<select>` possédant la classe CSS `form-control`.

La méthode :

```typescript
await dropdown.selectOption("consult");
```

sélectionne l'option dont l'attribut `value` vaut `consult`.

```html
<option value="consult">Consult</option>
```

### À retenir

```typescript
selectOption("consult")
```

sélectionne généralement l'option à partir de son attribut `value`.

---

## 3.3 Exemple complet

```typescript
import { test } from '@playwright/test';

test("Static Dropdown", async ({ page }) => {

    // Ouvrir l'application.
    await page.goto(
        "https://rahulshettyacademy.com/loginpagePractise/"
    );

    // Localiser la liste déroulante.
    const dropdown = page.locator("select.form-control");

    // Sélectionner l'option Consult.
    await dropdown.selectOption("consult");
});
```

> `selectOption()` doit être utilisé avec de vrais éléments HTML `<select>`.
>
> Les dropdowns personnalisés peuvent nécessiter un clic puis la sélection manuelle d’une option.

---

# 4. Boutons radio

Un bouton radio permet généralement de sélectionner une seule option au sein d’un groupe.

```html
<input type="radio">
```

Dans l’exemple du cours, les boutons radio sont localisés avec :

```typescript
page.locator(".radiotextsty")
```

Comme ce sélecteur peut correspondre à plusieurs éléments, Playwright propose notamment `last()` et `nth()`.

---

## 4.1 `last()` et `nth()`

### `last()`

```typescript
locator.last()
```

Sélectionne le dernier élément correspondant au locator.

### `nth()`

```typescript
locator.nth(1)
```

Sélectionne l'élément situé à l'index `1`.

Les index commencent à `0` :

|    Index | Élément           |
| -------: | ----------------- |
| `nth(0)` | Premier élément   |
| `nth(1)` | Deuxième élément  |
| `nth(2)` | Troisième élément |

> ⚠️ `nth()` est **zero-based**.

---

## 4.2 Cliquer sur un bouton radio

```typescript
await page.locator(".radiotextsty").last().click();
```

Le raisonnement est :

```text
Locator
   ↓
last()
   ↓
click()
```

Playwright :

1. trouve tous les éléments `.radiotextsty`,
2. sélectionne le dernier,
3. clique dessus.

---

## 4.3 Vérifier son état

```typescript
await expect(
    page.locator(".radiotextsty").last()
).toBeChecked();
```

Cette assertion signifie :

> Le dernier bouton radio doit être sélectionné.

Si ce n’est pas le cas, le test échoue.

---

# 5. `isChecked()` et `toBeChecked()`

Ces deux méthodes concernent l’état des boutons radio et des cases à cocher, mais elles n’ont pas le même objectif.

| Méthode         | Objectif                         | Résultat          |
| --------------- | -------------------------------- | ----------------- |
| `isChecked()`   | Récupérer l’état actuel          | `true` ou `false` |
| `toBeChecked()` | Vérifier qu’un élément est coché | Assertion         |

### Lire l’état

```typescript
const radio = page.locator(".radiotextsty").last();

console.log(await radio.isChecked());
```

### Vérifier l’état

```typescript
await expect(radio).toBeChecked();
```

### Différence fondamentale

```text
isChecked()
    ↓
lit une information
    ↓
true / false
```

alors que :

```text
toBeChecked()
    ↓
vérifie une condition attendue
    ↓
assertion
```

---

# 6. Assertions avec `expect`

Un test automatisé ne doit pas seulement réaliser des actions.

Il doit également vérifier le résultat de ces actions.

### Action seule

```typescript
await radio.click();
```

Ce code demande uniquement de cliquer sur le bouton radio.

### Action + validation

```typescript
await radio.click();

await expect(radio).toBeChecked();
```

Cette fois, le test vérifie que le bouton radio est réellement sélectionné après l’action.

> **C’est l’assertion qui transforme une simple automatisation en véritable test.**

---

# 7. Cases à cocher

Une case à cocher peut être sélectionnée ou désélectionnée.

```text
☐ Non sélectionnée

☑ Sélectionnée
```

Exemple :

```typescript
await page.locator("#terms").click();

await expect(
    page.locator("#terms")
).toBeChecked();
```

---

## 7.1 Cocher et décocher explicitement

Playwright propose des méthodes plus explicites que `click()` :

```typescript
await page.locator("#terms").check();

await page.locator("#terms").uncheck();
```

### Exemple complet

```typescript
const terms = page.locator("#terms");

await terms.check();

await expect(terms).toBeChecked();

await terms.uncheck();

expect(await terms.isChecked()).toBeFalsy();
```

### À retenir

| Méthode         | Action                   |
| --------------- | ------------------------ |
| `check()`       | Cocher                   |
| `uncheck()`     | Décocher                 |
| `isChecked()`   | Lire l'état              |
| `toBeChecked()` | Vérifier que c'est coché |

---

# 8. `toBeTruthy()` et `toBeFalsy()`

Ces assertions sont utilisées avec des valeurs booléennes ou des valeurs interprétées comme vraies ou fausses en JavaScript.

### Exemple

```typescript
expect(true).toBeTruthy();

expect(false).toBeFalsy();
```

Dans le cas d’une checkbox :

```typescript
expect(
    await checkbox.isChecked()
).toBeFalsy();
```

Cela signifie :

1. récupérer l’état de la checkbox ;
2. obtenir `false` ;
3. vérifier que cette valeur est falsy.

---

# 9. Comprendre `await` dans les assertions

Deux syntaxes proches correspondent à deux mécanismes différents.

---

## 9.1 Assertion Playwright sur un locator

```typescript
await expect(locator).toBeChecked();
```

Ici, Playwright attend automatiquement que la condition soit satisfaite, jusqu'à expiration du délai prévu.

Le `await` attend donc la fin de l'assertion.

---

## 9.2 Assertion JavaScript sur une valeur récupérée

```typescript
expect(
    await locator.isChecked()
).toBeFalsy();
```

Ici :

```typescript
locator.isChecked()
```

est une opération asynchrone.

Il faut donc attendre sa réponse avant de transmettre le booléen à `expect`.

Le déroulement est :

```text
await locator.isChecked()
        ↓
      false
        ↓
expect(false).toBeFalsy()
```

---

## Les deux modèles à retenir

### Assertion Playwright sur un élément

```typescript
await expect(locator).toBeChecked();
```

### Assertion JavaScript sur une valeur récupérée

```typescript
expect(
    await locator.isChecked()
).toBeFalsy();
```

### Résumé

| Situation                            | Syntaxe                                         |
| ------------------------------------ | ----------------------------------------------- |
| Vérifier directement un locator      | `await expect(locator).toBeChecked()`           |
| Récupérer une valeur puis l'asserter | `expect(await locator.isChecked()).toBeFalsy()` |

---

# 10. Vérifier un attribut HTML

Playwright permet de valider les attributs d’un élément grâce à `toHaveAttribute()`.

```typescript
const documentLink = page.locator(
    "[href*='documents-request']"
);

await expect(documentLink)
    .toHaveAttribute("class", "blinkingText");
```

Cette assertion vérifie que l’élément possède :

```html
class="blinkingText"
```

---

## 10.1 Le sélecteur `[href*='documents-request']`

```typescript
[href*='documents-request']
```

Le symbole `*=` signifie :

> **contient**

Le locator recherche donc un élément dont l'attribut `href` contient :

```text
documents-request
```

Par exemple :

```html
<a href="/documents-request">
```

ou :

```html
<a href="/something/documents-request">
```

---

# 11. `textContent()` et `inputValue()`

Il est important de distinguer ces deux méthodes.

---

## 11.1 `textContent()`

`textContent()` récupère le contenu textuel présent entre les balises d’un élément.

Par exemple :

```html
<div>
    Hello World
</div>
```

On peut utiliser :

```typescript
const text = await page
    .locator("div")
    .textContent();
```

Résultat :

```text
Hello World
```

---

## 11.2 Pourquoi ne pas utiliser `textContent()` sur un `<input>` ?

Considérons :

```html
<input id="username" value="Alex">
```

Le texte `Alex` n’est pas placé entre une balise ouvrante et une balise fermante.

Il se trouve dans l'attribut :

```html
value="Alex"
```

Pour récupérer cette valeur, utilisez :

```typescript
const value = await page
    .locator("#username")
    .inputValue();
```

Résultat :

```text
Alex
```

---

## 11.3 Différence

| Méthode         | Utilisation                                            |
| --------------- | ------------------------------------------------------ |
| `textContent()` | Texte contenu dans un élément                          |
| `inputValue()`  | Valeur d'un `<input>`, `<textarea>` ou champ similaire |

### Exemple

```typescript
const text = await page
    .locator(".message")
    .textContent();
```

Pour un champ :

```typescript
const username = await page
    .locator("#username")
    .inputValue();
```

### Règle simple

```text
Texte entre les balises
        ↓
textContent()
```

```text
Valeur d'un champ
        ↓
inputValue()
```

---

# 12. Fenêtres et onglets enfants

Une application peut ouvrir une nouvelle fenêtre ou un nouvel onglet.

Pour Playwright, cette nouvelle interface est représentée par une nouvelle instance de `Page`.

```text
Page principale
      ↓
Nouvelle fenêtre / nouvel onglet
      ↓
Nouvelle Page Playwright
```

---

# 12.1 Browser, Context et Page

On peut créer un contexte puis une page :

```typescript
const context = await browser.newContext();

const page = await context.newPage();
```

La structure est :

```text
Browser
   ↓
Context
   ↓
Page principale
```

Le **Browser Context** regroupe les pages liées à une même session de navigation.

---

# 13. Attendre une nouvelle page

Supposons qu’un lien ouvre une nouvelle page :

```typescript
const documentLink = page.locator(
    "[href*='documents-request']"
);
```

Le clic déclenche l’ouverture :

```typescript
await documentLink.click();
```

Pour attendre l’apparition de la nouvelle page, on utilise :

```typescript
context.waitForEvent("page")
```

Cette instruction signifie :

> Attendre la création d’une nouvelle `Page` dans ce Browser Context.

---

# 14. Utiliser `Promise.all()`

La méthode recommandée consiste à préparer l’écoute de l’événement **avant** de déclencher le clic.

```typescript
const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click()
]);
```

Les deux opérations sont lancées ensemble :

1. Playwright attend l’ouverture d’une page.
2. Le clic sur le lien déclenche cette ouverture.

---

## 14.1 Pourquoi éviter cette approche ?

Évitez :

```typescript
await documentLink.click();

const newPage = await context.waitForEvent("page");
```

Cette écriture peut produire un problème de synchronisation.

La page peut être créée avant que Playwright ne commence à attendre l’événement.

---

## 14.2 Pourquoi `Promise.all()` est fiable

Avec :

```typescript
const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click()
]);
```

l’écouteur est installé immédiatement et le clic est lancé dans le même temps.

On synchronise donc :

```text
Attendre l'événement
        +
Déclencher l'événement
```

---

## 14.3 Comprendre le destructuring

`Promise.all()` retourne un tableau de résultats.

Conceptuellement :

```typescript
[
    nouvellePage,
    resultatDuClick
]
```

L’écriture :

```typescript
const [newPage] = await Promise.all([
    ...
]);
```

récupère directement le premier résultat.

Ainsi :

```typescript
newPage
```

contient la nouvelle page ouverte.

---

# 15. Exploiter une nouvelle page

Une fois récupérée, `newPage` s’utilise comme n’importe quel objet `page`.

Par exemple :

```typescript
const text = await newPage
    .locator(".red")
    .textContent();
```

Si le texte récupéré est :

```text
Please email us at support@example.com for help
```

on peut extraire le domaine :

```typescript
const domain = text
    .split("@")[1]
    .split(" ")[0];
```

Résultat :

```text
example.com
```

---

## Réutiliser l'information sur la page principale

On peut ensuite revenir sur la page d’origine :

```typescript
const username = page.locator("#username");

await username.fill(domain);
```

On peut également vérifier la valeur :

```typescript
console.log(
    await username.inputValue()
);
```

Le scénario global devient :

```text
Page principale
      ↓
Clic sur un lien
      ↓
Nouvelle page
      ↓
Récupération d'une information
      ↓
Retour sur la page principale
      ↓
Réutilisation de l'information
```

---

# 16. Exemple complet : composants UI

```typescript
import { expect, test } from '@playwright/test';

test("UI Controls", async ({ page }) => {

    // Ouvrir la page de connexion.
    await page.goto(
        "https://rahulshettyacademy.com/loginpagePractise/"
    );

    // Localiser la liste déroulante.
    const dropdown = page.locator("select.form-control");

    // Sélectionner l'option Consult.
    await dropdown.selectOption("consult");

    // Localiser le dernier bouton radio.
    const radioButton = page.locator(".radiotextsty").last();

    // Sélectionner le bouton radio.
    await radioButton.click();

    // Accepter la fenêtre pop-up.
    await page.locator("#okayBtn").click();

    // Lire l'état du bouton radio.
    console.log(await radioButton.isChecked());

    // Vérifier qu'il est sélectionné.
    await expect(radioButton).toBeChecked();

    // Localiser la checkbox des conditions.
    const terms = page.locator("#terms");

    // Cocher la checkbox.
    await terms.check();

    // Vérifier qu'elle est cochée.
    await expect(terms).toBeChecked();

    // Décocher la checkbox.
    await terms.uncheck();

    // Vérifier qu'elle est décochée.
    expect(await terms.isChecked()).toBeFalsy();

    // Localiser le lien vers les documents.
    const documentLink = page.locator(
        "[href*='documents-request']"
    );

    // Vérifier l'attribut class du lien.
    await expect(documentLink)
        .toHaveAttribute("class", "blinkingText");
});
```

---

# 17. Exemple complet : nouvelle fenêtre / nouvel onglet

```typescript
import { test } from '@playwright/test';

test("Child Windows Handling", async ({ browser }) => {

    // Créer un contexte de navigation.
    const context = await browser.newContext();

    // Créer la page principale.
    const page = await context.newPage();

    // Ouvrir l'application.
    await page.goto(
        "https://rahulshettyacademy.com/loginpagePractise/"
    );

    // Localiser le lien qui ouvre une nouvelle page.
    const documentLink = page.locator(
        "[href*='documents-request']"
    );

    // Attendre l'ouverture de la nouvelle page
    // pendant le clic.
    const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        documentLink.click()
    ]);

    // Récupérer le texte présent dans la nouvelle page.
    const text = await newPage
        .locator(".red")
        .textContent();

    // Extraire le domaine de l'adresse e-mail.
    const domain = text
        .split("@")[1]
        .split(" ")[0];

    // Afficher le domaine.
    console.log(domain);

    // Revenir sur la page principale.
    const username = page.locator("#username");

    // Saisir le domaine dans le champ username.
    await username.fill(domain);

    // Vérifier la valeur saisie.
    console.log(await username.inputValue());
});
```

---

# 18. Concepts essentiels à retenir

| Concept                | Exemple                                    | Objectif                                           |
| ---------------------- | ------------------------------------------ | -------------------------------------------------- |
| Liste déroulante       | `dropdown.selectOption("consult")`         | Sélectionner une option dans un `<select>`         |
| Bouton radio           | `await radio.click()`                      | Sélectionner une option                            |
| Assertion de sélection | `await expect(radio).toBeChecked()`        | Vérifier l'état sélectionné                        |
| Checkbox               | `await checkbox.check()`                   | Cocher explicitement                               |
| Décocher               | `await checkbox.uncheck()`                 | Décocher explicitement                             |
| Lire un état           | `await checkbox.isChecked()`               | Retourner `true` ou `false`                        |
| Attribut HTML          | `toHaveAttribute("class", "blinkingText")` | Vérifier un attribut                               |
| Texte                  | `await locator.textContent()`              | Lire le contenu textuel                            |
| Champ de saisie        | `await username.inputValue()`              | Lire la valeur d'un input                          |
| Nouvelle page          | `context.waitForEvent("page")`             | Attendre un nouvel onglet ou une fenêtre           |
| Synchronisation        | `await Promise.all([...])`                 | Attendre un événement et l'action qui le déclenche |

---

# 19. Schéma mental

```text
                         PLAYWRIGHT
                              │
                              ▼
                       Composants UI
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
       Dropdown          Radio button          Checkbox
          │                   │                   │
          │                   │                   ├── check()
          │                   │                   ├── uncheck()
          │                   │                   └── isChecked()
          │                   │
          │                   ├── click()
          │                   └── toBeChecked()
          │
          └── selectOption()

                              │
                              ▼
                         Multi-pages
                              │
                              ▼
                       Browser Context
                              │
                              ▼
                  waitForEvent("page")
                              │
                              ▼
                        Promise.all()
                              │
                              ▼
                           newPage
```

---

# 20. Checklist du chapitre

* [ ] Je sais ce qu’est un élément `<select>`.
* [ ] Je sais utiliser `selectOption()`.
* [ ] Je sais utiliser `last()`.
* [ ] Je sais utiliser `nth()`.
* [ ] Je sais cliquer sur un bouton radio.
* [ ] Je sais utiliser `isChecked()`.
* [ ] Je sais utiliser `toBeChecked()`.
* [ ] Je sais cocher une checkbox avec `check()`.
* [ ] Je sais décocher une checkbox avec `uncheck()`.
* [ ] Je comprends `toBeTruthy()`.
* [ ] Je comprends `toBeFalsy()`.
* [ ] Je comprends l’utilisation de `await` dans les opérations asynchrones.
* [ ] Je sais utiliser `toHaveAttribute()`.
* [ ] Je comprends le sélecteur `[attribute*='value']`.
* [ ] Je sais différencier `textContent()` et `inputValue()`.
* [ ] Je sais pourquoi `inputValue()` est utilisé pour un `<input>`.
* [ ] Je comprends ce qu’est une Child Window.
* [ ] Je comprends qu’un nouvel onglet est une nouvelle `Page`.
* [ ] Je sais utiliser `context.waitForEvent("page")`.
* [ ] Je comprends pourquoi l’événement doit être écouté avant le clic.
* [ ] Je comprends l’intérêt de `Promise.all()`.
* [ ] Je comprends le destructuring `const [newPage]`.
* [ ] Je sais récupérer une donnée depuis une deuxième page.
* [ ] Je sais réutiliser cette donnée sur la première page.

---

# 21. Les cinq notions prioritaires

## 1. Chaque composant HTML possède des méthodes Playwright adaptées

```typescript
selectOption()
check()
uncheck()
click()
```

Exemples :

```typescript
await dropdown.selectOption("consult");

await checkbox.check();

await checkbox.uncheck();

await radio.click();
```

---

## 2. Distinguer lecture d’une valeur et assertion

### Lire l'état

```typescript
await locator.isChecked();
```

Résultat :

```typescript
true
```

ou :

```typescript
false
```

### Vérifier l'état

```typescript
await expect(locator).toBeChecked();
```

> `isChecked()` **lit** l'état.
>
> `toBeChecked()` **vérifie** l'état.

---

## 3. `inputValue()` est la bonne méthode pour la valeur d’un champ

```typescript
await page
    .locator("#username")
    .inputValue();
```

À retenir :

```text
<div>Hello</div>
        ↓
textContent()
```

```text
<input value="Alex">
        ↓
inputValue()
```

---

## 4. Une nouvelle fenêtre ou un nouvel onglet est une nouvelle `Page`

```typescript
context.waitForEvent("page");
```

Une application peut donc avoir :

```text
Browser
   ↓
Context
   ├── Page principale
   └── Nouvelle Page
```

---

## 5. `Promise.all()` synchronise l’écoute d’un événement avec le clic qui le déclenche

Le pattern essentiel est :

```typescript
const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click()
]);
```

Le raisonnement :

```text
Écouter l'événement
        +
Cliquer
        ↓
Nouvelle Page
```

C’est le pattern à retenir pour gérer proprement l’ouverture d’un nouvel onglet ou d’une nouvelle fenêtre.

---

# Conclusion

Le chapitre 3 introduit la manipulation de composants UI courants avec Playwright et montre comment **agir puis vérifier** le résultat.

Les compétences principales sont :

```text
<select>
   ↓
selectOption()

Radio
   ↓
click()
isChecked()
toBeChecked()

Checkbox
   ↓
check()
uncheck()
isChecked()

Attribut HTML
   ↓
toHaveAttribute()

Texte
   ↓
textContent()

Valeur d'un champ
   ↓
inputValue()

Nouvelle fenêtre / nouvel onglet
   ↓
waitForEvent("page")
   ↓
Promise.all()
   ↓
newPage
```

### 🧠 Les 5 notions à absolument maîtriser

1. **`selectOption()`** → sélectionner une option dans un `<select>`.
2. **`isChecked()` vs `toBeChecked()`** → lire un état vs vérifier un état.
3. **`check()` / `uncheck()`** → manipuler explicitement une checkbox.
4. **`textContent()` vs `inputValue()`** → texte d’un élément vs valeur d’un champ.
5. **`Promise.all()` + `waitForEvent("page")`** → gérer correctement une nouvelle page.