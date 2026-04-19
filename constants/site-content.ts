/**
 * Centralized content for the Fluxion platform.
 * Use this file to modify any text on the site (titles, paragraphs, labels, etc.).
 */

export const siteContent = {
  brand: {
    name: "FLUXION",
    tagline:
      "Propulser l'innovation via une identité technologique forte et cohérente.",
    description: "L'expertise FLUXION au service de votre vision.",
    legal: "© 2026 FLUXION. TOUS DROITS RÉSERVÉS.",
  },

  navigation: {
    links: [
      { name: "Accueil", href: "/" },
      { name: "Nos Services", href: "/services" },
      { name: "À propos", href: "/a-propos" },
      { name: "Nos Projets", href: "/nos-projets" },
      { name: "Nos Produits", href: "/nos-produits" },
      { name: "Contact", href: "/contact" },
    ],
    cta: "Nous contacter",
  },

  hero: {
    badge: "Expertise Digitale",
    title: "Suivez le flux.",
    description:
      "Nous créons des expériences numériques de pointe, alliant design de luxe et ingénierie robuste pour propulser votre entreprise dans l'ère technologique.",
    cta: "Rejoignez le flux",
  },

  features: {
    badge: "Nos Piliers",
    title: "L'excellence gravée dans chaque pixel.",
    items: [
      {
        title: "Identité Forte",
        description:
          "Nous forgeons des systèmes de design cohérents qui capturent l'essence unique de votre marque.",
      },
      {
        title: "Innovation Tech",
        description:
          "Utilisation des dernières technologies (Next.js, Tailwind v4) pour une performance foudroyante.",
      },
      {
        title: "Vision Future",
        description:
          "Anticiper les tendances pour créer des expériences numériques qui durent dans le temps.",
      },
    ],
    more: "En savoir plus",
  },

  approach: {
    badge: "Notre Méthode",
    title: "L'approche qui redéfinit les standards.",
    steps: [
      {
        title: "Analyse Stratégique",
        description:
          "Nous ne codons pas à l'aveugle. Nous auditons votre marché pour identifier les opportunités de croissance réelle grâce au Big Data.",
        more: "En savoir plus",
      },
      {
        title: "Design & Expérience",
        description:
          "L'interface est le pont entre vous et vos clients. Nous créons des designs qui captivent, utilisant des systèmes de design atomiques.",
        more: "En savoir plus",
      },
      {
        title: "Ingénierie de pointe",
        description:
          "Utilisation de Next.js 15, TypeScript et des architectures serverless pour une robustesse totale et une vitesse foudroyante.",
        more: "En savoir plus",
      },
    ],
  },

  partners: {
    badge: "Ils propulsent leur vision avec nous",
    names: ["TECH_RDC", "LUMINA", "Z.L.J.", "NEXTGEN", "SILICON_K"],
  },

  whyUs: {
    badge: "Pourquoi Fluxion ?",
    title: "L'excellence technologique au service de votre croissance.",
    stats: [
      {
        value: "99%",
        label: "Performance",
        description: "Des interfaces ultra-rapides optimisées avec Next.js 15.",
      },
      {
        value: "24/7",
        label: "Sécurité",
        description: "Protection de vos données et maintenance proactive.",
      },
      {
        value: "+50",
        label: "Projets",
        description:
          "Une expertise prouvée auprès d'entreprises locales et internationales.",
      },
      {
        value: "100%",
        label: "Local & Cloud",
        description: "Support physique à Kinshasa et déploiement mondial.",
      },
    ],
  },

  process: {
    title: "Notre Processus",
    description: "Une méthodologie rigoureuse pour des résultats d'exception.",
    steps: [
      {
        number: "01",
        title: "Analyse & Vision",
        text: "Nous étudions vos besoins pour définir une stratégie digitale unique.",
      },
      {
        number: "02",
        title: "Design & Prototype",
        text: "Création d'interfaces haute fidélité centrées sur l'expérience utilisateur.",
      },
      {
        number: "03",
        title: "Développement",
        text: "Codage propre et performant avec les dernières technologies.",
      },
      {
        number: "04",
        title: "Lancement & Suivi",
        text: "Mise en ligne et accompagnement continu pour votre succès.",
      },
    ],
  },

  testimonials: {
    title: "Ils nous ont fait confiance",
    reviews: [
      {
        name: "Jean-Paul M.",
        role: "CEO de TechRDC",
        content:
          "L'équipe de Fluxion a transformé notre vision en une réalité numérique. Leur maîtrise de Next.js est impressionnante.",
      },
      {
        name: "Sarah Kahambu",
        role: "Fondatrice de Lumina",
        content:
          "Un design épuré et une performance au top. Le support client est incroyable, surtout pour nous qui sommes basés à Kinshasa.",
      },
      {
        name: "Marc Duval",
        role: "Directeur Technique",
        content:
          "Travailler avec Fluxion, c'est l'assurance d'avoir un code propre et une interface qui marque les esprits dès la première seconde.",
      },
    ],
  },

  faq: {
    title: "Questions fréquentes",
    items: [
      {
        question: "Quels sont vos délais moyens pour un projet Web ?",
        answer:
          "Pour un site vitrine premium, comptez environ 3 à 5 semaines. Pour une application SaaS complexe avec Next.js et base de données, cela varie entre 8 et 12 semaines.",
      },
      {
        question: "Proposez-vous de la maintenance après le lancement ?",
        answer:
          'Absolument. Nous avons des forfaits de maintenance "Fluxion Care" qui incluent les mises à jour de sécurité, les sauvegardes et l\'optimisation des performances.',
      },
      {
        question: "Travaillez-vous avec des clients hors de Kinshasa ?",
        answer:
          "Oui, grâce à notre infrastructure cloud et nos outils de collaboration, nous travaillons avec des clients partout dans le monde, tout en gardant un ancrage fort en RDC.",
      },
    ],
  },

  newsletter: {
    title: "Restez dans le flux.",
    description:
      "Inscrivez-vous pour recevoir nos analyses tech et nos dernières réalisations **FLUXION**.",
    placeholder: "votre@email.com",
    button: "Rejoindre",
    successTitle: "Bienvenue dans le flux !",
    successMessage: "Vérifiez votre boîte mail pour confirmer.",
    spamNote: "Zéro spam. Désinscription en un clic.",
    statusLoading: "Envoi...",
    statusSuccess: "Bienvenue dans le flux !",
  },

  finalCta: {
    title: "Rejoignez le mouvement. Propulsez votre vision.",
    description:
      "Prêt à transformer votre présence digitale avec l'expertise Fluxion ?",
    buttonLink: "#contact",
    buttonText: "Démarrer un projet",
  },

  video: {
    badge: "L'expérience Fluxion",
    title: "L'innovation au service de votre vision stratégique",
    description:
      "Plongez au cœur de notre écosystème technique et découvrez comment nous redéfinissons les standards du développement digital à Kinshasa et ailleurs.",
    ctaProject: "Démarrer un projet",
    ctaWatch: "Regarder la vision",
    ctaPause: "Pause Video",
    statusStream: "Actual Stream : 4K Cinema",
    statusStandby: "Fluxion",
  },

  social: {
    badge: "Suivez l'agence",
    platforms: {
      linkedin: "LinkedIn",
      instagram: "Instagram",
      twitter: "Twitter",
    },
  },

  pages: {
    services: {
      title: "Services",
      description:
        "Découvrez notre expertise technologique pour propulser votre entreprise.",
    },
    about: {
      title: "À Propos",
      description:
        "Apprenez-en plus sur notre vision et notre engagement envers l'innovation.",
    },
    projects: {
      title: "Nos Projets",
      description:
        "Explorez nos réalisations et l'impact que nous créons pour nos clients.",
    },
    contact: {
      title: "Contact",
      description: "Prêt à démarrer ? Parlons de votre prochain grand projet.",
    },
  },

  footer: {
    socialBadge: "Suivez l'agence",
    location: "Kinshasa, RD Congo",
    email: "contact@fluxion.cd",
    privacy: "Privacy",
    terms: "Terms",
  },
};
