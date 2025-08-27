# 🌱 Association EL BOUCHRA - Site Web Officiel

Site web officiel de l'Association EL BOUCHRA pour le Développement Durable, basée à Hay Adil, Salé, Maroc.

## 📋 À propos

L'Association EL BOUCHRA est une organisation dédiée au développement durable et à la protection de l'environnement. Notre mission est de promouvoir des pratiques écologiques et d'éduquer les communautés locales sur l'importance de la préservation environnementale.

## ✨ Fonctionnalités

### 🌐 Multilingue
- **Français** et **Arabe** avec support RTL complet
- Interface adaptative selon la langue sélectionnée
- Traductions complètes de tous les contenus

### 📱 Design Responsive
- Interface moderne et élégante
- Compatible mobile, tablette et desktop
- Animations et micro-interactions fluides
- Design "Apple-level" avec attention aux détails

### 🏠 Pages Principales
- **Accueil** - Présentation de l'association avec slider d'images
- **Identification** - Vision, mission, valeurs et histoire
- **Membres** - Équipe dirigeante et statistiques
- **Activités** - Nos actions pour le développement durable
- **Adhésion** - Formulaire et conditions d'adhésion
- **Programme** - Événements et activités planifiés
- **Contact** - Formulaire de contact et informations
- **Boutique** - T-shirts de soutien avec achat via WhatsApp

### 🎨 Éléments Visuels
- Slider d'images automatique avec navigation
- Cartes avec effets de vague subtils
- Statistiques animées et icônes Lucide React
- Background personnalisé avec overlay
- Palette de couleurs cohérente (bleus et verts)

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework JavaScript moderne
- **TypeScript** - Typage statique pour plus de robustesse
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes et cohérentes

### Outils de Développement
- **Vite** - Build tool rapide et moderne
- **ESLint** - Linting du code
- **PostCSS** - Traitement CSS avancé
- **Autoprefixer** - Compatibilité navigateurs

### Déploiement
- **Bolt Hosting** - Hébergement optimisé
- **Build automatisé** - Déploiement continu

## 🚀 Installation et Développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd association-el-bouchra

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu du build
npm run lint     # Vérification du code
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx      # Navigation principale
│   ├── Footer.tsx      # Pied de page
│   ├── Card.tsx        # Composant carte
│   └── ImageSlider.tsx # Slider d'images
├── pages/              # Pages de l'application
│   ├── HomePage.tsx    # Page d'accueil
│   ├── IdentificationPage.tsx
│   ├── MembersPage.tsx
│   ├── ActivitiesPage.tsx
│   ├── MembershipPage.tsx
│   ├── ProgramPage.tsx
│   ├── ContactPage.tsx
│   └── ShopPage.tsx
├── contexts/           # Contextes React
│   └── LanguageContext.tsx # Gestion multilingue
├── data/              # Données JSON
│   ├── slides.json    # Images du slider
│   ├── events.json    # Événements
│   ├── teamMembers.json
│   ├── activities.json
│   └── ...
├── types/             # Types TypeScript
└── App.tsx           # Composant principal
```

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans `tailwind.config.js` :
- **Primaire** : Bleus (#3B82F6 à #1E3A8A)
- **Secondaire** : Bleus clairs (#0EA5E9 à #0C4A6E)
- **Accents** : Verts pour l'environnement

### Images
- **Logo** : `/assets/logo-ass.png`
- **Background** : `/assets/bg-ass.jpg`
- **Slider** : `/assets/slide-1.jpg` à `/assets/slide-5.jpg`

### Traductions
Les traductions sont gérées dans `src/contexts/LanguageContext.tsx` avec support complet français/arabe.

## 📞 Contact

**Association EL BOUCHRA pour le Développement Durable**
- 📍 Hay Adil, Salé, Maroc
- 📧 elbouchra.hayadil@gmail.com
- 📱 +212 6 61 23 45 67
- 🌐 [Site Web](https://site-web-de-l-associ-nq4t.bolt.host)

### Réseaux Sociaux
- [Facebook](https://web.facebook.com/profile.php?id=100086379114341)
- [Instagram](https://www.instagram.com/ass.elbouchrahm)

## 📄 Licence

© 2025 Association EL BOUCHRA. Tous droits réservés.

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 🌟 Fonctionnalités Futures

- [ ] Système de newsletter
- [ ] Galerie photos des événements
- [ ] Blog/actualités
- [ ] Espace membre sécurisé
- [ ] Paiement en ligne pour les adhésions
- [ ] Calendrier interactif des événements

---

**Développé avec ❤️ pour un avenir plus vert** 🌱