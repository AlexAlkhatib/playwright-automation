# 🎭 Playwright — Chapitre 10

## Perform Visual Testing with Playwright

---

## 📖 À propos de ce chapitre

Ce chapitre introduit les **tests visuels avec Playwright**.

L'objectif est de comprendre comment :

* capturer une screenshot de la page entière ;
* capturer une screenshot d'un élément spécifique ;
* utiliser les screenshots pour effectuer une **comparaison visuelle** ;
* créer et utiliser des snapshots avec `toMatchSnapshot()` ;
* identifier les pages qui sont de bons ou de mauvais candidats pour le visual testing.

Le chapitre montre également une limitation importante : une page dont le contenu change dynamiquement, par exemple avec un **timestamp**, peut provoquer des différences lors de la comparaison visuelle.

---

## 📚 Sommaire

1. Objectifs
2. Screenshots avec Playwright
3. Screenshot d'un élément
4. Screenshot de la page entière
5. Exemple complet de capture
6. Qu'est-ce que le Visual Testing ?
7. `toMatchSnapshot()`
8. Création du premier snapshot
9. Comparaison avec un snapshot existant
10. Limites du Visual Testing
11. Exemple complet de Visual Testing
12. Pièges et bonnes pratiques
13. Exercices
14. Fiche mémo
15. Checklist
16. Conclusion

---

# 1. 🎯 Objectifs

À la fin de ce chapitre, je dois être capable de :

* comprendre le principe d'une screenshot avec Playwright ;
* capturer une page entière ;
* capturer uniquement un élément ;
* utiliser `locator.screenshot()` ;
* utiliser `page.screenshot()` ;
* comprendre le principe du **Visual Testing** ;
* créer un snapshot avec `toMatchSnapshot()` ;
* comparer une screenshot avec un snapshot existant ;
* identifier les problèmes liés au contenu dynamique ;
* comprendre pourquoi certaines pages ne sont pas adaptées au Visual Testing.

---

# 2. 📸 Screenshots avec Playwright

Playwright permet de capturer des screenshots directement depuis un test.

Il est possible de prendre une screenshot :

* de la **page entière** ;
* d'un **élément spécifique**.

Les deux méthodes principales utilisées dans ce chapitre sont :

```javascript
await page.screenshot();
```

et :

```javascript
await page.locator("selector").screenshot();
```

---

# 3. 🎯 Screenshot d'un élément

Pour capturer uniquement un élément spécifique, on utilise :

```javascript
await page.locator("#displayed-text").screenshot({
    path: "partialScreenshot.png"
});
```

Dans cet exemple :

```javascript
page.locator("#displayed-text")
```

identifie l'élément à capturer.

La screenshot est ensuite enregistrée avec :

```text
partialScreenshot.png
```

### Syntaxe générale

```javascript
await locator.screenshot({
    path: "filename.png"
});
```

### À retenir

`locator.screenshot()` permet donc de capturer **uniquement la zone correspondant au locator**.

---

# 4. 🖥️ Screenshot de la page entière

Pour capturer la page, on utilise :

```javascript
await page.screenshot({
    path: "screenshot.png"
});
```

La screenshot correspond alors à la page affichée par Playwright.

### Syntaxe générale

```javascript
await page.screenshot({
    path: "filename.png"
});
```

---

# 5. 🧪 Exemple complet : screenshots

Voici le scénario présenté dans le cours.

```javascript
import { expect, test } from '@playwright/test';

test("Screenshot & Visual Comparision", async ({ page }) => {

    // Go to the website
    await page.goto(
        "https://rahulshettyacademy.com/AutomationPractice/"
    );

    // Assert that the text field is visible
    await expect(
        page.locator("#displayed-text")
    ).toBeVisible();

    // Take a screenshot of the element
    await page.locator("#displayed-text").screenshot({
        path: "partialScreenshot.png"
    });

    // Click the Hide button
    await page
        .getByRole("button", { name: "Hide" })
        .click();

    // Take a screenshot of the whole page
    await page.screenshot({
        path: "screenshot.png"
    });

    // Assert that the text field is hidden
    await expect(
        page.locator("#displayed-text")
    ).toBeHidden();

});
```

---

## 🔎 Déroulement du scénario

```text
Ouvrir la page
      ↓
Vérifier que le champ est visible
      ↓
Capturer le champ
      ↓
Cliquer sur "Hide"
      ↓
Capturer la page entière
      ↓
Vérifier que le champ est caché
```

---

# 6. 👁️ Qu'est-ce que le Visual Testing ?

Le **Visual Testing** consiste à comparer l'apparence actuelle d'une page avec une image de référence appelée **snapshot**.

L'objectif est de détecter des changements visuels inattendus.

Le principe présenté dans le cours est :

```text
Test
 ↓
Capture de la page
 ↓
Snapshot de référence
 ↓
Comparaison
 ↓
Pass
ou
Fail
```

Playwright permet notamment d'effectuer cette comparaison avec :

```javascript
toMatchSnapshot()
```

---

# 7. 🧩 `toMatchSnapshot()`

`toMatchSnapshot()` permet de comparer une screenshot actuelle avec un snapshot existant.

Exemple :

```javascript
expect(
    await page.screenshot()
).toMatchSnapshot("landing.png");
```

Dans cet exemple :

```javascript
await page.screenshot()
```

capture l'état actuel de la page.

Puis :

```javascript
toMatchSnapshot("landing.png")
```

compare cette screenshot avec le snapshot :

```text
landing.png
```

---

# 8. 🆕 Création du premier snapshot

Lors de la première exécution du test, aucun snapshot de référence n'existe encore.

Le cours indique que :

> la première exécution du test échoue.

Playwright crée alors automatiquement une screenshot et la place dans le projet.

Cette screenshot devient ensuite la référence utilisée pour les prochaines comparaisons.

### Première exécution

```text
Test
 ↓
Aucun snapshot existant
 ↓
Playwright crée le snapshot
 ↓
Le test échoue
```

---

# 9. 🔄 Comparaison avec un snapshot existant

Lors d'une exécution suivante, Playwright dispose maintenant d'un snapshot de référence.

Le test compare donc :

```text
Screenshot actuelle
        ↓
        VS
        ↓
Snapshot existant
```

Si les deux images correspondent :

```text
PASS ✅
```

Si elles sont différentes :

```text
FAIL ❌
```

Le Visual Testing permet donc de détecter automatiquement des changements visuels.

---

# 10. ⚠️ Limites du Visual Testing

Le cours montre une limitation importante.

Une page peut contenir des éléments **dynamiques**.

Par exemple :

```text
Timestamp
Date
Heure
Contenu dynamique
```

Si une valeur change entre deux exécutions, la screenshot peut également changer.

Dans l'exemple présenté dans le cours, un **timestamp affiché en haut de la page** provoque une différence.

Même si la page est visuellement correcte, Playwright peut détecter :

```text
Snapshot précédent
        ≠
Screenshot actuelle
```

Le test échoue alors.

---

## 🚨 Exemple de problème

Supposons qu'une première screenshot contienne :

```text
10:15:32
```

et qu'une seconde exécution affiche :

```text
10:15:47
```

Pour Playwright, les deux screenshots sont différentes.

```text
10:15:32
    ↓
Snapshot

10:15:47
    ↓
Screenshot actuelle

       ≠

FAIL ❌
```

### Conclusion

Une page contenant beaucoup de contenu dynamique peut être un **mauvais candidat pour le Visual Testing**.

---

# 11. 🧪 Exemple complet de Visual Testing

Le cours utilise le site :

```text
https://www.rediff.com/
```

Le test est le suivant :

```javascript
import { expect, test } from '@playwright/test';

test("Visual Testing", async ({ page }) => {

    // Go to the website
    await page.goto(
        "https://www.rediff.com/"
    );

    // Expect the current screenshot
    // to match the existing screenshot
    expect(
        await page.screenshot()
    ).toMatchSnapshot("landing.png");

});
```

---

## 🔎 Décomposition

### 1. Ouvrir la page

```javascript
await page.goto(
    "https://www.rediff.com/"
);
```

---

### 2. Capturer la page

```javascript
await page.screenshot()
```

La screenshot est créée directement en mémoire.

---

### 3. Comparer avec le snapshot

```javascript
.toMatchSnapshot("landing.png")
```

Playwright compare alors la screenshot actuelle avec :

```text
landing.png
```

---

## 🔄 Cycle complet

```text
        Première exécution
                ↓
        Capture de la page
                ↓
      Création du snapshot
                ↓
             Échec
                ↓
       Snapshot disponible
                ↓
        Exécution suivante
                ↓
     Capture de la page actuelle
                ↓
       Comparaison visuelle
          ↙           ↘
       Identique     Différente
          ↓              ↓
       PASS ✅         FAIL ❌
```

---

# 12. ⚠️ Pièges et bonnes pratiques

## `page.screenshot()`

Utiliser :

```javascript
await page.screenshot({
    path: "screenshot.png"
});
```

lorsqu'on souhaite enregistrer une screenshot de la page.

---

## `locator.screenshot()`

Utiliser :

```javascript
await page
    .locator("#displayed-text")
    .screenshot({
        path: "partialScreenshot.png"
    });
```

lorsqu'on souhaite capturer uniquement un élément.

---

## `toMatchSnapshot()`

Utiliser :

```javascript
expect(
    await page.screenshot()
).toMatchSnapshot("landing.png");
```

pour comparer une screenshot avec un snapshot.

---

## Contenu dynamique

Faire attention aux éléments qui changent entre deux exécutions.

Exemples présentés dans le cours :

```text
Timestamp
```

Une page contenant ce type d'informations peut provoquer des différences visuelles et donc des échecs de test.

---

## Choisir correctement les pages

Avant d'utiliser le Visual Testing, vérifier que la page possède un contenu suffisamment stable.

```text
Page stable
    ↓
Bon candidat ✅

Page avec contenu dynamique
    ↓
Risque de différences ❌
```

---

# 13. 🏋️ Exercices d'entraînement

### Exercice 1 — Screenshot d'un élément

Créer un test qui :

1. ouvre une page ;
2. localise un élément ;
3. vérifie qu'il est visible ;
4. capture uniquement cet élément.

---

### Exercice 2 — Screenshot de la page

Créer une screenshot de la page entière avec :

```javascript
page.screenshot()
```

---

### Exercice 3 — Screenshot après une action

Créer un test qui :

1. ouvre une page ;
2. effectue une action ;
3. capture la page après cette action.

---

### Exercice 4 — Visual Testing

Créer un test utilisant :

```javascript
toMatchSnapshot()
```

---

### Exercice 5 — Snapshot

Exécuter le test une première fois et observer la création du snapshot.

Puis exécuter le test une seconde fois et observer la comparaison.

---

### Exercice 6 — Contenu dynamique

Identifier un élément dynamique sur une page et expliquer pourquoi il peut provoquer un échec du Visual Testing.

---

### Exercice 7 — Comparaison

Modifier volontairement l'état visuel de la page et observer si :

```javascript
toMatchSnapshot()
```

détecte la différence.

---

# 14. 📋 Fiche mémo

| Besoin                       | Syntaxe                                             |
| ---------------------------- | --------------------------------------------------- |
| Screenshot page              | `await page.screenshot()`                           |
| Screenshot avec fichier      | `await page.screenshot({ path: "screenshot.png" })` |
| Screenshot élément           | `await locator.screenshot()`                        |
| Screenshot élément + fichier | `await locator.screenshot({ path: "element.png" })` |
| Visual Testing               | `toMatchSnapshot()`                                 |
| Snapshot nommé               | `toMatchSnapshot("landing.png")`                    |
| Vérifier visibilité          | `await expect(locator).toBeVisible()`               |
| Vérifier élément caché       | `await expect(locator).toBeHidden()`                |

---

# 15. ✅ Checklist de validation

* [ ] Je comprends ce qu'est une screenshot.
* [ ] Je sais utiliser `page.screenshot()`.
* [ ] Je sais enregistrer une screenshot avec `path`.
* [ ] Je sais utiliser `locator.screenshot()`.
* [ ] Je comprends la différence entre screenshot de page et screenshot d'élément.
* [ ] Je comprends le principe du Visual Testing.
* [ ] Je sais utiliser `toMatchSnapshot()`.
* [ ] Je comprends le rôle du snapshot de référence.
* [ ] Je comprends pourquoi la première exécution peut échouer.
* [ ] Je sais qu'un contenu dynamique peut provoquer un échec.
* [ ] Je sais identifier une page qui n'est pas forcément adaptée au Visual Testing.
* [ ] Je comprends le cycle `Screenshot → Snapshot → Comparaison`.

---

# 🏁 Conclusion

Le chapitre 10 introduit le **Visual Testing avec Playwright**.

La première partie montre comment capturer des screenshots :

```javascript
page.screenshot()
```

pour une page entière, et :

```javascript
locator.screenshot()
```

pour un élément spécifique.

La seconde partie introduit la comparaison visuelle avec :

```javascript
toMatchSnapshot()
```

Le principe est simple :

```text
Screenshot actuelle
        ↓
Comparaison
        ↓
Snapshot de référence
        ↓
PASS / FAIL
```

Cependant, le Visual Testing nécessite de choisir des pages suffisamment **stables**.

Un contenu dynamique comme un timestamp peut modifier la screenshot entre deux exécutions et provoquer un échec, même si le comportement fonctionnel de la page est correct.

---

## ⭐ Les 5 notions essentielles

1. **`page.screenshot()`** pour capturer la page entière.

2. **`locator.screenshot()`** pour capturer uniquement un élément.

3. **`toMatchSnapshot()`** pour effectuer une comparaison visuelle.

4. **Le snapshot** sert de référence pour les prochaines exécutions.

5. **Le contenu dynamique** peut rendre une page inadaptée au Visual Testing.