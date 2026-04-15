# 🚀 Fluxion | Identité Digital & Innovation

Bienvenue dans le dépôt officiel de **Fluxion**, une plateforme de l'entreprise fluxion

---

## 🛠️ Démarche à suivre (Installation)

Pour mettre en place le projet localement et commencer à contribuer, suivez ces étapes :

1. **Clonage du projet**

   ```bash
   git clone [url-du-repo]
   cd fluxion
   ```

2. **Installation des dépendances**
   Nous recommandons l'utilisation de `npm` (installé par défaut avec Node.js).

   ```bash
   npm install
   ```

3. **Lancement du serveur de développement**

   ```bash
   npm run dev
   ```

   Accédez ensuite à [http://localhost:3000](http://localhost:3000) dans votre navigateur.

4. **Accès au Tableau de Bord Admin**
   Le panneau d'administration est disponible sur la route `/admin`.

---

## 💻 Technologies Utilisées

Ce projet repose sur une stack technologique de pointe pour garantir performance, SEO et maintenabilité :

- **Framework** : [Next.js 16.2](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Style** : [Tailwind CSS v4](https://tailwindcss.com/) (Nouvel engine haute performance)
- **UI Components** : [Shadcn/UI](https://ui.shadcn.com/) (Composants accessibles et personnalisables)
- **Icônes** : [Lucide-React](https://lucide.dev/)
- **Animations** : [tw-animate-css](https://github.com/ecklf/tailwindcss-animatecss) & Transitions Tailwind natives.

---

## 🎨 Rapport de Configuration CSS (`global.css`)

Le fichier `app/globals.css` a été entièrement refondu pour exploiter la puissance de **Tailwind v4** tout en préservant l'identité Fluxion. Voici les points clés à comprendre pour les développeurs :

### 1. Variables de Branding Fluxion

Nous n'utilisons pas de couleurs hexadécimales brutes dans les composants. Tout passe par des variables CSS définies dans `:root` :

- `--fluxion-deep-blue`: Le bleu signature pour les titres et fonds profonds.
- `--fluxion-rose`: La couleur d'accentuation dynamique.
- `--fluxion-cobalt`: Couleur secondaire pour les gradients et actions.
- `.bg-fluxion-gradient`: Un utilitaire personnalisé combinant Cobalt et Rose.

### 2. Mapping Shadcn/UI

Les composants Shadcn sont "mappés" directement sur ces variables de branding.

- La couleur `primary` du projet est liée à `--fluxion-cobalt`.
- La couleur `foreground` est liée à `--fluxion-deep-blue`.
  Cela garantit que n'importe quel nouveau composant Shadcn ajouté sera **automatiquement aux couleurs de Fluxion**.

### 3. Tailwind v4 Engine

Nous utilisons la nouvelle directive `@theme inline`. Cela permet de déclarer nos tokens (couleurs, polices, radius) directement en CSS sans avoir besoin d'un fichier `tailwind.config.js` complexe :

- **Fonts** : `--font-sans` (Schibsted Grotesk) et `--font-heading` (Archivo).
- **Radius** : Centralisé via `--radius` pour un aspect "Luxury Tech" arrondi et moderne.

---

## 📂 Structure du Projet

- `app/(client)` : Tout l'univers public visible par les utilisateurs (Navbar, Hero, Features).
- `app/(admin)` : L'interface de gestion sécurisée (Sidebar, Dashboard).
- `components/ui` : Composants de base issus de Shadcn.
- `components/client` : Composants interactifs métiers (SocialMedia, HeroSection, etc.).

---

© {new Date().getFullYear()} Fluxion. Tous droits réservés.
