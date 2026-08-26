# 🎭 Playwright — Chapitre 7

## Handling Web Dialogs, Frames & Event Listeners

> Documentation construite à partir des notes du cours.
>
> Elle reprend les concepts, exemples et explications du chapitre, puis les organise sous forme de documentation pédagogique afin de faciliter l'apprentissage et la réutilisation dans un projet Playwright.

---

# Sommaire

1. [Objectifs du chapitre](#1-objectifs-du-chapitre)
2. [Vue d'ensemble](#2-vue-densemble)
3. [Valider la visibilité d'un élément](#3-valider-la-visibilité-dun-élément)
4. [Assertions `toBeVisible()` et `toBeHidden()`](#4-assertions-tobevisible-et-tobehidden)
5. [Les dialogues JavaScript](#5-les-dialogues-javascript)
6. [Écouter les événements avec `page.on()`](#6-écouter-les-événements-avec-pageon)
7. [Accepter un dialogue avec `dialog.accept()`](#7-accepter-un-dialogue-avec-dialogaccept)
8. [Refuser un dialogue avec `dialog.dismiss()`](#8-refuser-un-dialogue-avec-dialogdismiss)
9. [Pourquoi utiliser un event listener pour les dialogues ?](#9-pourquoi-utiliser-un-event-listener-pour-les-dialogues)
10. [Les frames et les iframes](#10-les-frames-et-les-iframes)
11. [`frameLocator()`](#11-framelocator)
12. [Interagir avec un élément dans un iframe](#12-interagir-avec-un-élément-dans-un-iframe)
13. [Récupérer du contenu dans un iframe](#13-récupérer-du-contenu-dans-un-iframe)
14. [Hover avec Playwright](#14-hover-avec-playwright)
15. [`page.pause()` pour le débogage](#15-pagepause-pour-le-débogage)
16. [Navigation avec `goBack()` et `goForward()`](#16-navigation-avec-goback-et-goforward)
17. [Exemple complet du chapitre](#17-exemple-complet-du-chapitre)
18. [Comprendre le cycle d'un scénario](#18-comprendre-le-cycle-dun-scénario)
19. [Erreurs et points d'attention](#19-erreurs-et-points-dattention)
20. [Mémo des concepts](#20-mémo-des-concepts)
21. [Checklist d'apprentissage](#21-checklist-dapprentissage)
22. [Exercices conseillés](#22-exercices-conseillés)
23. [Résumé final](#23-résumé-final)
24. [Modèle mental du chapitre](#24-modèle-mental-du-chapitre)

---

# 1. Objectifs du chapitre

À la fin de ce chapitre, vous devez être capable de :

* Vérifier qu'un élément est visible.
* Vérifier qu'un élément est caché.
* Utiliser `expect()` pour valider l'état d'un élément.
* Comprendre les dialogues JavaScript.
* Réagir à un dialogue avec `page.on("dialog", ...)`.
* Accepter un dialogue avec `dialog.accept()`.
* Refuser un dialogue avec `dialog.dismiss()`.
* Comprendre le rôle des event listeners.
* Comprendre ce qu'est un `iframe`.
* Accéder au contenu d'un `iframe`.
* Utiliser `frameLocator()`.
* Cliquer sur un élément situé dans un iframe.
* Récupérer le contenu texte d'un élément situé dans un iframe.
* Utiliser `hover()`.
* Utiliser `page.pause()` pour mettre en pause l'exécution pendant le débogage.
* Comprendre la différence entre la page principale et une frame.

---

# 2. Vue d'ensemble

Ce chapitre introduit plusieurs problèmes fréquents rencontrés lors de l'automatisation d'une application web.

Une page web peut contenir :

```text
Page principale
     │
     ├── Éléments HTML
     │
     ├── Boutons
     │
     ├── Champs
     │
     ├── Dialogues JavaScript
     │
     └── iframe
            │
            ├── Éléments HTML
            ├── Boutons
            └── Contenu
```

Playwright permet de gérer ces différents éléments avec des API adaptées.

Le chapitre se concentre principalement sur :

```text
Assertions
    ↓
Visibilité

Events
    ↓
Dialogues JavaScript

Frames
    ↓
iframe
    ↓
frameLocator()

Débogage
    ↓
page.pause()
```

---

# 3. Valider la visibilité d'un élément

Une opération très courante dans un test end-to-end consiste à vérifier qu'un élément est visible ou caché.

Par exemple, une application peut avoir un champ texte qui peut être affiché ou masqué.

On peut vérifier son état avec :

```typescript
await expect(page.locator("#displayed-text")).toBeVisible();
```

Cette assertion signifie :

> Je m'attends à ce que l'élément soit visible.

---

## 3.1 Exemple

```typescript
import { expect, test } from '@playwright/test';

test("Popup validations", async ({ page }) => {

    await page.goto(
        "https://rahulshettyacademy.com/AutomationPractice/"
    );

    await expect(
        page.locator("#displayed-text")
    ).toBeVisible();

});
```

Le test :

1. ouvre la page ;
2. localise `#displayed-text` ;
3. vérifie que l'élément est visible.

---

# 4. Assertions `toBeVisible()` et `toBeHidden()`

Deux assertions importantes de ce chapitre sont :

```typescript
toBeVisible()
```

et :

```typescript
toBeHidden()
```

---

## 4.1 `toBeVisible()`

Utilisation :

```typescript
await expect(
    page.locator("#displayed-text")
).toBeVisible();
```

Cela permet de vérifier que l'élément est affiché.

Modèle mental :

```text
Locator
   ↓
expect()
   ↓
toBeVisible()
   ↓
Élément visible ?
   ↓
PASS / FAIL
```

---

## 4.2 `toBeHidden()`

Après avoir masqué l'élément :

```typescript
await page.getByRole("button", { name: "Hide" }).click();
```

On peut vérifier qu'il est maintenant caché :

```typescript
await expect(
    page.locator("#displayed-text")
).toBeHidden();
```

---

## 4.3 Exemple complet

```typescript
import { expect, test } from '@playwright/test';

test("Visibility validation", async ({ page }) => {

    await page.goto(
        "https://rahulshettyacademy.com/AutomationPractice/"
    );

    // Vérifier que le champ est visible
    await expect(
        page.locator("#displayed-text")
    ).toBeVisible();

    // Cliquer sur Hide
    await page.getByRole("button", {
        name: "Hide"
    }).click();

    // Vérifier que le champ est maintenant caché
    await expect(
        page.locator("#displayed-text")
    ).toBeHidden();

});
```

---

## 4.4 Séquence mentale

```text
Page
 ↓
Localiser l'élément
 ↓
Vérifier visible
 ↓
Effectuer une action
 ↓
Vérifier hidden
```

---

# 5. Les dialogues JavaScript

Les applications web peuvent afficher des dialogues JavaScript.

Exemples :

```text
Alert
Confirm
Prompt
```

Ces dialogues ne sont pas des éléments HTML classiques de la page.

C'est une différence importante.

Un bouton HTML classique peut généralement être identifié avec un locator :

```typescript
page.getByRole("button")
```

Un dialogue JavaScript est géré différemment.

Le chapitre montre donc l'utilisation des événements Playwright.

---

# 6. Écouter les événements avec `page.on()`

Playwright permet d'écouter certains événements grâce à :

```typescript
page.on()
```

Le principe général est :

```text
page
 ↓
on()
 ↓
écouter un événement
 ↓
exécuter une action
```

Par exemple :

```typescript
page.on("dialog", dialog => {
    // action
});
```

Ici, Playwright attend qu'un événement `dialog` soit déclenché.

---

## 6.1 Le concept d'event listener

Un event listener signifie :

> Lorsque cet événement se produit, exécute cette fonction.

Exemple conceptuel :

```typescript
page.on("dialog", dialog => {

    console.log("Un dialogue est apparu");

});
```

Le fonctionnement est :

```text
Application
     ↓
Dialogue déclenché
     ↓
Playwright détecte l'événement
     ↓
Callback exécuté
```

---

# 7. Accepter un dialogue avec `dialog.accept()`

Lorsqu'un dialogue doit être accepté, Playwright fournit :

```typescript
dialog.accept()
```

Exemple :

```typescript
page.on("dialog", dialog => {
    dialog.accept();
});
```

Cela signifie :

> Lorsqu'un dialogue apparaît, accepte-le.

---

## 7.1 Exemple complet

```typescript
import { expect, test } from '@playwright/test';

test("JavaScript dialog", async ({ page }) => {

    await page.goto(
        "https://rahulshettyacademy.com/AutomationPractice/"
    );

    page.on("dialog", dialog => {
        dialog.accept();
    });

    await page.locator("#confirmbtn").click();

});
```

La séquence est :

```text
page.goto()
    ↓
Installer le listener
    ↓
Cliquer sur Confirm
    ↓
Dialogue JavaScript
    ↓
dialog event
    ↓
dialog.accept()
```

---

## 7.2 Pourquoi installer le listener avant le clic ?

Le listener doit être installé avant l'action susceptible de déclencher le dialogue.

Bonne organisation :

```typescript
page.on("dialog", dialog => {
    dialog.accept();
});

await page.locator("#confirmbtn").click();
```

Le scénario est donc préparé avant de provoquer l'événement.

---

# 8. Refuser un dialogue avec `dialog.dismiss()`

Pour annuler ou refuser un dialogue, on utilise :

```typescript
dialog.dismiss()
```

Exemple :

```typescript
page.on("dialog", dialog => {
    dialog.dismiss();
});
```

Le principe est :

```text
Dialogue
   ↓
dismiss()
   ↓
Annulation
```

---

## 8.1 Comparaison

| Méthode            | Rôle                 |
| ------------------ | -------------------- |
| `dialog.accept()`  | Accepter / confirmer |
| `dialog.dismiss()` | Refuser / annuler    |

---

# 9. Pourquoi utiliser un event listener pour les dialogues ?

Les dialogues JavaScript ne sont pas manipulés comme de simples éléments HTML.

Le cours insiste donc sur :

```typescript
page.on("dialog", ...)
```

Le principe est :

```text
Pas de locator HTML classique
          ↓
Événement "dialog"
          ↓
Callback
          ↓
accept() / dismiss()
```

C'est un modèle important à retenir.

---

# 10. Les frames et les iframes

Une autre notion importante du chapitre est la gestion des frames.

Un `iframe` permet d'intégrer une autre page ou un autre document HTML à l'intérieur d'une page.

Modèle mental :

```text
Page principale
│
├── contenu principal
│
└── iframe
      │
      └── autre contenu HTML
```

On peut donc considérer un iframe comme une page HTML intégrée dans une autre page.

---

## 10.1 Pourquoi est-ce différent ?

Lorsque l'élément que l'on souhaite manipuler se trouve dans une frame, il faut cibler cette frame.

On ne travaille plus simplement avec le contexte visuel de la page principale.

Le cours introduit donc :

```typescript
page.frameLocator()
```

---

# 11. `frameLocator()`

Pour accéder à une frame, on peut utiliser :

```typescript
const framePage = page.frameLocator("#courses-iframe");
```

Ici :

```text
page
 ↓
frameLocator()
 ↓
#courses-iframe
 ↓
framePage
```

La variable `framePage` permet ensuite de rechercher les éléments présents dans cette frame.

---

## 11.1 Exemple

```typescript
const framePage =
    page.frameLocator("#courses-iframe");
```

Puis :

```typescript
await framePage
    .locator("li a[href*='lifetime-access']:visible")
    .click();
```

L'élément est donc recherché dans l'iframe.

---

# 12. Interagir avec un élément dans un iframe

Une fois le `frameLocator` créé, on peut utiliser des locators comme sur la page principale.

Exemple :

```typescript
const framePage =
    page.frameLocator("#courses-iframe");

await framePage
    .locator("li a[href*='lifetime-access']:visible")
    .click();
```

La différence essentielle est la présence de :

```typescript
framePage
```

au lieu de :

```typescript
page
```

---

## 12.1 Comparaison

### Page principale

```typescript
await page.locator("#button").click();
```

### Dans un iframe

```typescript
await framePage.locator("#button").click();
```

Modèle mental :

```text
Page principale
      ↓
page.locator()

Iframe
      ↓
frameLocator()
      ↓
framePage.locator()
```

---

# 13. Récupérer du contenu dans un iframe

Le chapitre montre également comment récupérer le texte d'un élément présent dans l'iframe.

Exemple :

```typescript
const text = await framePage
    .locator(".text h2 span")
    .textContent();
```

Puis :

```typescript
console.log(text + " subscribers");
```

Le résultat peut par exemple être :

```text
13,522 subscribers
```

---

## 13.1 Décomposition

```typescript
framePage
```

représente le contexte de la frame.

Puis :

```typescript
.locator(".text h2 span")
```

recherche l'élément.

Puis :

```typescript
.textContent()
```

récupère son contenu textuel.

Séquence :

```text
iframe
 ↓
framePage
 ↓
locator()
 ↓
textContent()
 ↓
texte
```

---

# 14. Hover avec Playwright

Le chapitre montre également l'utilisation de :

```typescript
hover()
```

Exemple :

```typescript
await page
    .locator("#mousehover")
    .hover();
```

Cette méthode simule le déplacement de la souris au-dessus d'un élément.

Modèle mental :

```text
Locator
   ↓
hover()
   ↓
Souris placée au-dessus
   ↓
Éventuel menu / comportement déclenché
```

---

## 14.1 Exemple

```typescript
await page.locator("#mousehover").hover();
```

Cette opération peut être utile lorsque l'application affiche un menu ou un contenu supplémentaire lorsque la souris passe au-dessus d'un élément.

---

# 15. `page.pause()` pour le débogage

Le chapitre utilise :

```typescript
await page.pause();
```

Cette méthode permet de mettre en pause l'exécution du test.

Exemple :

```typescript
await page.locator("#mousehover").hover();

await page.pause();
```

Cela permet d'inspecter l'état de la page pendant le développement.

---

## 15.1 Mode debug

Les notes indiquent également l'utilisation de :

```bash
./node_modules/@playwright/test/cli.js test --headed --debug
```

Le navigateur est alors visible et le test peut être inspecté pendant son exécution.

---

## 15.2 Pourquoi utiliser `page.pause()` ?

C'est particulièrement utile pour comprendre :

```text
Où se trouve mon élément ?
       ↓
Quel est son état ?
       ↓
Est-ce que mon locator fonctionne ?
       ↓
Que se passe-t-il après mon action ?
```

---

# 16. Navigation avec `goBack()` et `goForward()`

Les notes montrent également les méthodes de navigation :

```typescript
page.goBack()
```

et :

```typescript
page.goForward()
```

---

## 16.1 Retour arrière

```typescript
await page.goBack();
```

Permet de revenir à la page précédente dans l'historique du navigateur.

---

## 16.2 Avancer

```typescript
await page.goForward();
```

Permet d'avancer vers la page suivante dans l'historique.

---

## 16.3 Exemple conceptuel

```typescript
await page.goto("https://google.com");

await page.goto(
    "https://rahulshettyacademy.com/AutomationPractice/"
);

await page.goBack();

await page.goForward();
```

Modèle mental :

```text
Google
  ↓
Automation Practice
  ↓
goBack()
  ↓
Google
  ↓
goForward()
  ↓
Automation Practice
```

---

# 17. Exemple complet du chapitre

Voici un exemple regroupant les principales notions étudiées.

```typescript
import { expect, test } from '@playwright/test';

test("Dialogs and Frames", async ({ page }) => {

    // Ouvrir le site
    await page.goto(
        "https://rahulshettyacademy.com/AutomationPractice/"
    );

    // Vérifier que le champ est visible
    await expect(
        page.locator("#displayed-text")
    ).toBeVisible();

    // Masquer le champ
    await page.getByRole("button", {
        name: "Hide"
    }).click();

    // Vérifier que le champ est caché
    await expect(
        page.locator("#displayed-text")
    ).toBeHidden();

    // Écouter les dialogues JavaScript
    page.on("dialog", dialog => {
        dialog.accept();
    });

    // Déclencher le dialogue
    await page.locator("#confirmbtn").click();

    // Hover
    await page.locator("#mousehover").hover();

    // Accéder à l'iframe
    const framePage =
        page.frameLocator("#courses-iframe");

    // Cliquer dans l'iframe
    await framePage
        .locator(
            "li a[href*='lifetime-access']:visible"
        )
        .click();

    // Récupérer du contenu dans l'iframe
    const text = await framePage
        .locator(".text h2 span")
        .textContent();

    console.log(text + " subscribers");

    // Pause pour le débogage
    await page.pause();
});
```

---

# 18. Comprendre le cycle d'un scénario

Un scénario utilisant les notions de ce chapitre peut être représenté ainsi :

```text
1. Ouvrir la page
        ↓
2. Vérifier la visibilité
        ↓
3. Effectuer une action
        ↓
4. Vérifier le nouvel état
        ↓
5. Installer un event listener
        ↓
6. Déclencher le dialogue
        ↓
7. Accepter / refuser le dialogue
        ↓
8. Effectuer un hover
        ↓
9. Identifier l'iframe
        ↓
10. Utiliser frameLocator()
        ↓
11. Interagir avec l'iframe
        ↓
12. Récupérer du contenu
        ↓
13. Déboguer avec page.pause()
```

---

# 19. Erreurs et points d'attention

## 19.1 Confondre visibilité et existence

Un élément peut être présent dans le DOM tout en étant caché.

Le test :

```typescript
await expect(locator).toBeVisible();
```

permet précisément de vérifier son état de visibilité.

Pour vérifier qu'il est caché :

```typescript
await expect(locator).toBeHidden();
```

---

## 19.2 Oublier le listener du dialogue

Un dialogue JavaScript nécessite une gestion adaptée.

Exemple :

```typescript
page.on("dialog", dialog => {
    dialog.accept();
});
```

Il est important de préparer le listener avant l'action qui déclenche le dialogue.

---

## 19.3 Chercher directement un élément dans un iframe

Si l'élément se trouve dans :

```html
<iframe>
```

il faut tenir compte du contexte de la frame.

Le chapitre utilise :

```typescript
const framePage =
    page.frameLocator("#courses-iframe");
```

Puis :

```typescript
framePage.locator(...)
```

---

## 19.4 Utiliser `page.locator()` au lieu du locator de la frame

Si un élément appartient à l'iframe :

```typescript
page.locator(...)
```

n'est pas le modèle utilisé dans les notes.

On utilise :

```typescript
framePage.locator(...)
```

---

## 19.5 Oublier `await`

Les opérations Playwright du scénario utilisent fréquemment :

```typescript
await
```

Exemples :

```typescript
await page.goto(...);

await page.locator(...).click();

await expect(...).toBeVisible();

await framePage.locator(...).click();
```

---

# 20. Mémo des concepts

| Concept               | À retenir                                |
| --------------------- | ---------------------------------------- |
| `toBeVisible()`       | Vérifie qu'un élément est visible        |
| `toBeHidden()`        | Vérifie qu'un élément est caché          |
| `page.on()`           | Écoute un événement                      |
| `"dialog"`            | Événement correspondant à un dialogue    |
| `dialog.accept()`     | Accepte un dialogue                      |
| `dialog.dismiss()`    | Refuse / annule un dialogue              |
| `iframe`              | Contenu HTML intégré dans une autre page |
| `frameLocator()`      | Permet de cibler une frame               |
| `framePage.locator()` | Recherche un élément dans la frame       |
| `textContent()`       | Récupère le contenu textuel              |
| `hover()`             | Place la souris au-dessus d'un élément   |
| `page.pause()`        | Met le test en pause pour le débogage    |
| `goBack()`            | Revient à la page précédente             |
| `goForward()`         | Avance dans l'historique                 |

---

# 21. Checklist d'apprentissage

* [ ] Je sais vérifier qu'un élément est visible avec `toBeVisible()`.
* [ ] Je sais vérifier qu'un élément est caché avec `toBeHidden()`.
* [ ] Je comprends ce qu'est un dialogue JavaScript.
* [ ] Je comprends pourquoi un dialogue n'est pas manipulé comme un simple élément HTML.
* [ ] Je sais utiliser `page.on("dialog", ...)`.
* [ ] Je sais accepter un dialogue avec `dialog.accept()`.
* [ ] Je sais refuser un dialogue avec `dialog.dismiss()`.
* [ ] Je comprends le principe d'un event listener.
* [ ] Je comprends ce qu'est un iframe.
* [ ] Je sais utiliser `frameLocator()`.
* [ ] Je sais cliquer sur un élément situé dans un iframe.
* [ ] Je sais récupérer du texte dans un iframe.
* [ ] Je sais utiliser `hover()`.
* [ ] Je sais utiliser `page.pause()`.
* [ ] Je comprends `goBack()` et `goForward()`.
* [ ] Je sais distinguer la page principale du contenu d'une frame.

---

# 22. Exercices conseillés

## Exercice 1 — Vérifier la visibilité

Créer un test qui :

1. ouvre la page Automation Practice ;
2. vérifie que `#displayed-text` est visible.

```typescript
await expect(
    page.locator("#displayed-text")
).toBeVisible();
```

---

## Exercice 2 — Masquer puis vérifier

Cliquer sur le bouton `Hide`.

Puis vérifier :

```typescript
await expect(
    page.locator("#displayed-text")
).toBeHidden();
```

---

## Exercice 3 — Accepter un dialogue

Installer un listener :

```typescript
page.on("dialog", dialog => {
    dialog.accept();
});
```

Puis déclencher le bouton :

```typescript
await page.locator("#confirmbtn").click();
```

Observer le comportement.

---

## Exercice 4 — Refuser un dialogue

Remplacer :

```typescript
dialog.accept();
```

par :

```typescript
dialog.dismiss();
```

Observer la différence.

---

## Exercice 5 — Utiliser `hover()`

Identifier l'élément :

```typescript
#mousehover
```

Puis :

```typescript
await page.locator("#mousehover").hover();
```

Observer le comportement de la page.

---

## Exercice 6 — Accéder à un iframe

Créer :

```typescript
const framePage =
    page.frameLocator("#courses-iframe");
```

Puis essayer de localiser un élément à l'intérieur.

---

## Exercice 7 — Cliquer dans l'iframe

Utiliser :

```typescript
await framePage
    .locator("li a[href*='lifetime-access']:visible")
    .click();
```

Observer l'action.

---

## Exercice 8 — Récupérer un texte

Utiliser :

```typescript
const text = await framePage
    .locator(".text h2 span")
    .textContent();

console.log(text);
```

Observer la valeur récupérée.

---

## Exercice 9 — Déboguer avec `page.pause()`

Ajouter :

```typescript
await page.pause();
```

à la fin du scénario.

Lancer le test en mode headed/debug et observer l'état du navigateur.

---

## Exercice 10 — Navigation

Tester :

```typescript
await page.goBack();
```

puis :

```typescript
await page.goForward();
```

Observer l'historique de navigation.

---

# 23. Résumé final

Le chapitre introduit trois grandes familles de concepts.

## 1. Assertions de visibilité

Pour vérifier l'état d'un élément :

```typescript
await expect(locator).toBeVisible();

await expect(locator).toBeHidden();
```

---

## 2. Événements et dialogues

Pour réagir à un dialogue JavaScript :

```typescript
page.on("dialog", dialog => {
    dialog.accept();
});
```

ou :

```typescript
page.on("dialog", dialog => {
    dialog.dismiss();
});
```

---

## 3. Frames

Pour interagir avec un iframe :

```typescript
const framePage =
    page.frameLocator("#courses-iframe");
```

Puis :

```typescript
await framePage.locator(...).click();
```

ou :

```typescript
const text = await framePage
    .locator(...)
    .textContent();
```

---

# 24. Modèle mental du chapitre

Le modèle mental à retenir est :

```text
                       PLAYWRIGHT
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
         ASSERTIONS      EVENTS        FRAMES
             │             │             │
             ▼             ▼             ▼
       toBeVisible()    page.on()    frameLocator()
       toBeHidden()         │             │
                            ▼             ▼
                         dialog        iframe
                            │             │
                  ┌─────────┴──────┐      │
                  ▼                ▼      ▼
               accept()        dismiss() locator()
                                            │
                                            ▼
                                       textContent()
```

---

# 🎯 Les 5 notions prioritaires

| # | Notion               | À retenir                                                                    |
| - | -------------------- | ---------------------------------------------------------------------------- |
| 1 | **Visibilité**       | `toBeVisible()` et `toBeHidden()` permettent de vérifier l'état d'un élément |
| 2 | **Dialogues**        | Les dialogues JavaScript sont gérés avec `page.on("dialog", ...)`            |
| 3 | **Events**           | `page.on()` permet d'écouter un événement et de déclencher une action        |
| 4 | **Frames**           | Un iframe possède son propre contexte de contenu                             |
| 5 | **`frameLocator()`** | Permet de localiser et manipuler les éléments présents dans un iframe        |

---

# 🚀 Séquence à mémoriser

```text
1. Ouvrir la page
        ↓
2. Localiser un élément
        ↓
3. Vérifier sa visibilité
        ↓
4. Effectuer une action
        ↓
5. Vérifier le nouvel état
        ↓
6. Écouter un événement
        ↓
7. Gérer le dialogue
        ↓
8. Identifier une iframe
        ↓
9. Utiliser frameLocator()
        ↓
10. Interagir avec son contenu
        ↓
11. Récupérer des données
        ↓
12. Déboguer avec page.pause()
```

---

# 🧠 Idée centrale du chapitre

Une page web automatisée n'est pas toujours composée uniquement d'éléments HTML directement accessibles.

Playwright permet également de gérer :

```text
État des éléments
      ↓
Visibilité

Événements navigateur
      ↓
Dialogues

Contenu embarqué
      ↓
Frames / iframes
```

Les notions essentielles à retenir sont donc :

```typescript
expect(locator).toBeVisible();

expect(locator).toBeHidden();

page.on("dialog", ...);

dialog.accept();

dialog.dismiss();

page.frameLocator(...);

framePage.locator(...);

textContent();

hover();

page.pause();
```

Ces mécanismes permettent de passer d'une automatisation simple d'éléments HTML à une automatisation capable de gérer des comportements plus complexes d'une application web.

---

## 🎓 Transition vers le chapitre suivant

Après avoir appris à gérer :

```text
Visibilité
    ↓
Dialogues
    ↓
Events
    ↓
Frames
    ↓
iframes
```

la suite de l'apprentissage pourra approfondir les interactions avec les pages web, les éléments dynamiques, les différentes stratégies de sélection et la synchronisation des actions.

Le modèle général reste :

```text
PAGE
  ↓
LOCATOR
  ↓
ACTION
  ↓
ÉVÉNEMENT / ÉTAT
  ↓
ASSERTION
  ↓
PASS / FAIL
```

C'est cette logique qui permet progressivement de construire des tests Playwright robustes et compréhensibles.