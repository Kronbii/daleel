
export const mockNewsItems = [
  {
    id: 1,
    category: "announcement",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    headline: {
      en: "Electoral Centers Map Now Live",
      ar: "خريطة مراكز الاقتراع متاحة الآن",
      fr: "Carte des Centres Électoraux Maintenant Disponible"
    },
    summary: {
      en: "Find your nearest electoral center with our interactive map. Search by location or browse all centers across Lebanon.",
      ar: "ابحث عن أقرب مركز اقتراع لك من خلال خريطتنا التفاعلية. ابحث حسب الموقع أو تصفح جميع المراكز في لبنان.",
      fr: "Trouvez votre centre électoral le plus proche avec notre carte interactive. Recherchez par emplacement ou parcourez tous les centres au Liban."
    },
    link: "/centers"
  },
  {
    id: 2,
    category: "update",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    headline: {
      en: "Candidate Profiles Updated",
      ar: "تحديث ملفات المرشحين",
      fr: "Profils des Candidats Mis à Jour"
    },
    summary: {
      en: "Latest information about candidates has been added. Browse updated profiles with recent statements and affiliations.",
      ar: "تمت إضافة أحدث المعلومات حول المرشحين. تصفح الملفات المحدثة مع أحدث البيانات والانتماءات.",
      fr: "Les dernières informations sur les candidats ont été ajoutées. Parcourez les profils mis à jour avec les déclarations et affiliations récentes."
    },
    link: "/candidates"
  },
  {
    id: 3,
    category: "alert",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    headline: {
      en: "Important: Verify Your Voter Registration",
      ar: "هام: تحقق من تسجيلك الانتخابي",
      fr: "Important: Vérifiez Votre Inscription Électorale"
    },
    summary: {
      en: "Make sure you're registered to vote. Check your electoral center location and registration status before election day.",
      ar: "تأكد من تسجيلك للتصويت. تحقق من موقع مركز الاقتراع الخاص بك وحالة التسجيل قبل يوم الانتخابات.",
      fr: "Assurez-vous que vous êtes inscrit pour voter. Vérifiez l'emplacement de votre centre électoral et votre statut d'inscription avant le jour du scrutin."
    },
    link: "/legal"
  },
  {
    id: 4,
    category: "general",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    headline: {
      en: "Electoral Lists Complete Overview Available",
      ar: "نظرة شاملة على اللوائح الانتخابية متاحة",
      fr: "Aperçu Complet des Listes Électorales Disponible"
    },
    summary: {
      en: "View all electoral lists by district. Compare candidates, review platforms, and make informed decisions.",
      ar: "عرض جميع اللوائح الانتخابية حسب الدائرة. قارن المرشحين، واطلع على البرامج، واتخذ قرارات مستنيرة.",
      fr: "Consultez toutes les listes électorales par circonscription. Comparez les candidats, examinez les programmes et prenez des décisions éclairées."
    },
    link: "/lists"
  },
  {
    id: 5,
    category: "announcement",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    headline: {
      en: "New District Information Pages",
      ar: "صفحات معلومات جديدة عن الدوائر",
      fr: "Nouvelles Pages d'Information sur les Circonscriptions"
    },
    summary: {
      en: "Explore detailed information about each electoral district, including demographics and registered voters.",
      ar: "استكشف معلومات مفصلة عن كل دائرة انتخابية، بما في ذلك التركيبة السكانية والناخبين المسجلين.",
      fr: "Explorez des informations détaillées sur chaque circonscription électorale, y compris les données démographiques et les électeurs inscrits."
    },
    link: "/districts"
  },
  {
    id: 6,
    category: "update",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    headline: {
      en: "Platform Features Enhancement",
      ar: "تحسين ميزات المنصة",
      fr: "Amélioration des Fonctionnalités de la Plateforme"
    },
    summary: {
      en: "We've improved search functionality and added new filters to help you find information faster and more efficiently.",
      ar: "قمنا بتحسين وظيفة البحث وأضفنا مرشحات جديدة لمساعدتك في العثور على المعلومات بشكل أسرع وأكثر كفاءة.",
      fr: "Nous avons amélioré la fonctionnalité de recherche et ajouté de nouveaux filtres pour vous aider à trouver des informations plus rapidement et plus efficacement."
    },
    link: "https://google.com"
  }
];
