import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const languages: Language[] = [
  { code: 'fr', name: 'Français', direction: 'ltr' },
  { code: 'ar', name: 'العربية', direction: 'rtl' }
];

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.identification': 'À propos de nous',
    'nav.members': 'Membres',
    'nav.activities': 'Activités',
    'nav.membership': 'Adhésion',
    'nav.program': 'Programme annuel',
    'nav.contact': 'Contact',
    'nav.shop': 'Boutique',
    'nav.articles': 'Articles',

    // Home page
    'home.hero.title': 'Association El Bouchra pour le développement durable -HAY ADIL-',
    'home.hero.subtitle': 'Vous Souhaite Le Bienvenue',
    'home.mission.title': 'Notre Mission',
    'home.mission.text': 'Promouvoir le développement durable et protéger notre environnement pour les générations futures.',
    'home.activities.title': 'Nos Activités',
    'home.activities.env.title': 'Protection Environnementale',
    'home.activities.env.text': 'Actions concrètes pour préserver la nature et sensibiliser aux enjeux écologiques.',
    'home.activities.education.title': 'Éducation Environnementale',
    'home.activities.education.text': 'Programmes éducatifs pour sensibiliser toutes les générations.',
    'home.activities.community.title': 'Actions Communautaires',
    'home.activities.community.text': 'Projets locaux impliquant les citoyens dans le développement durable.',

    // T-shirt page
    'tshirt.title': 'Boutique - T-shirts',
    'tshirt.subtitle': 'Soutenez notre association avec nos t-shirts éco-responsables',
    'tshirt.eco.name': 'T-shirt Éco Bleu',
    'tshirt.eco.description': 'T-shirt en coton bio avec logo de l\'association',
    'tshirt.classic.name': 'T-shirt Classique',
    'tshirt.classic.description': 'T-shirt premium avec design exclusif',
    'tshirt.price': ' MAD',
    'tshirt.buy': 'Acheter via WhatsApp',

    // Membership page
    'membership.title': 'Adhésion',
    'membership.subtitle': 'Rejoignez notre mission pour le développement durable',
    'membership.intro': 'Devenez membre de l\'association EL BOUCHRA et participez activement à nos actions pour un avenir plus vert.',
    'membership.benefits.title': 'Avantages de l\'adhésion',
    'membership.benefit1': 'Participation aux activités et événements',
    'membership.benefit2': 'Accès aux formations environnementales',
    'membership.benefit3': 'Newsletter mensuelle',
    'membership.benefit4': 'Réductions sur nos produits',
    'membership.download': 'Télécharger le formulaire d\'adhésion',

    // Membership requirements
    'membership.requirements.title': 'Conditions d\'adhésion',
    'membership.requirements.intro.fr': 'Afin de développer et de promouvoir les activités de l\'association et conformément aux recommandations du bureau national, l\'Association EL BOUCHRA pour le Développement Durable -HAY ADIL- a été décidé d\'ouvrir l\'adhésion et le renouvellement de l\'adhésion aux publics.',
    'membership.requirements.subtitle': 'Les personnes souhaitant adhérer doivent :',
    'membership.fee.amount': '200 dirhams',

    // Program page
    'program.title': 'Programme Annuel',
    'program.subtitle': 'Nos événements et activités prévus pour l\'année',

    // Contact page
    'contact.title': 'Nous Contacter',
    'contact.subtitle': 'Restons en contact pour un avenir plus vert',
    'contact.form.name': 'Nom complet',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Envoyer le message',
    'contact.info.title': 'Informations de Contact',
    'contact.info.address': 'Adresse',
    'contact.info.email': 'Email',
    'contact.info.whatsapp': 'WhatsApp',

    // Common
    'common.learn-more': 'En savoir plus',
    'common.read-more': 'Lire la suite',
    'common.read-less': 'Lire moins',

    // Footer
    'footer.quick-links': 'Liens rapides',
    'footer.contact': 'Contact',
    'footer.privacy': 'Politique de confidentialité',
    'footer.legal': 'Mentions légales',
    'footer.rights': 'Tous droits réservés',

    // Identification page
    'identification.title': 'À propos de nous',
    'identification.subtitle': 'Découvrez qui nous sommes et nos valeurs',
    'identification.vision.title': 'Notre Vision',
    'identification.vision.text': 'Créer un monde où le développement économique et social respecte l\'environnement et assure un avenir durable pour tous. Nous envisageons des communautés prospères qui vivent en harmonie avec la nature.',
    'identification.mission.title': 'Notre Mission',
    'identification.mission.text': 'Promouvoir le développement durable à travers l\'éducation environnementale, les actions communautaires et la sensibilisation. Nous œuvrons pour protéger notre planète tout en améliorant la qualité de vie des populations locales.',
    'identification.values.title': 'Nos Valeurs',
    'identification.values.environment.title': 'Respect de l\'environnement',
    'identification.values.environment.text': 'Protection et préservation de notre écosystème',
    'identification.values.solidarity.title': 'Solidarité',
    'identification.values.solidarity.text': 'Entraide et coopération communautaire',
    'identification.values.innovation.title': 'Innovation',
    'identification.values.innovation.text': 'Solutions créatives pour un avenir durable',
    'identification.values.transparency.title': 'Transparence',
    'identification.values.transparency.text': 'Communication ouverte et responsable',

    // Members page
    'members.title': 'Nos Membres',
    'members.subtitle': 'L\'équipe dévouée qui rend tout possible',
    'members.executive.title': 'Bureau Exécutif',
    'members.join.title': 'Rejoignez-nous !',
    'members.join.text': 'Vous partagez nos valeurs ? Vous souhaitez contribuer au développement durable ? Rejoignez notre communauté de bénévoles passionnés.',
    'members.join.button': 'Devenir bénévole',

    // Activities page
    'activities.title': 'Nos Activités',
    'activities.subtitle': 'Découvrez nos actions pour le développement durable',
    'activities.impact.title': 'Notre Impact',
    'activities.impact.trees': 'Arbres plantés',
    'activities.impact.people': 'Personnes sensibilisées',
    'activities.impact.projects': 'Projets communautaires',

    // Home page additional
    'home.team.title': 'Notre Équipe',
    'home.team.button': 'Voir tous les membres',
    'home.events.title': 'Événements à Venir',
    'home.events.button': 'Voir le programme complet',
    'home.impact.title': 'Notre Impact',
    'home.impact.subtitle': 'Des chiffres qui témoignent de notre engagement',

    // President message
    'home.president.title': 'Mot du Président',
'home.president.message': `
Au nom de Dieu, le Tout Miséricordieux, le Très Miséricordieux

Que la paix et les bénédictions soient sur le plus honorable des prophètes et des messagers, ainsi que sur sa famille et ses compagnons.

Monsieur le Directeur du Centre de Jeunesse, Hay Adel
Monsieur le Président du Bureau National de l'Association El Bouchra pour le Développement Durable
Mesdames et Messieurs,

L'Association El Bouchra pour le Développement Durable - HAY ADIL -, est heureuse de vous accueillir en cette soirée du Ramadan. Je vous souhaite la bienvenue en mon nom personnel et au nom de tous mes collègues du Bureau Exécutif, de tous les membres et des bénévoles.
À cette occasion, je tiens à exprimer mes plus sincères remerciements et ma gratitude à tous ceux qui ont contribué au succès des activités et des projets de l'Association et à la réalisation de ses nobles objectifs. Je tiens tout particulièrement à remercier les membres du Bureau Exécutif et les membres. Je voudrais également profiter de cette occasion pour remercier M. Abdellatif Marjani, directeur de l'Institut spécialisé de technologie appliquée de Polo, et M. Marzak, directeur du Complexe de formation professionnelle, pour leur aide et leur contribution au succès de cette soirée.

Comme chacun le sait, HAY MOHAMMADI, avec ses spécificités culturelles, ses particularités géographiques et son patrimoine civilisationnel, a un besoin urgent d'une action communautaire solide et efficace visant à promouvoir son développement, à préserver ses atouts, à remédier à toutes les formes de fragilité sociale et d'appauvrissement environnemental, et à protéger le patrimoine écologique de la région, tout en s'efforçant d'étudier, de promouvoir et de mettre en valeur son authenticité, suscitant ainsi soutien et fierté.

L'Association El Bouchra pour le Développement Durable - HAY ADIL -, fait partie des associations qui se sont engagées à accélérer le processus de développement, avec tous leurs efforts continus, leur profonde réflexion et leur grand enthousiasme, dans cette région imprégnée d'histoire et d'authenticité, mais ouverte aux valeurs de la modernité et de la contemporanéité.

Ainsi, l'association met tout en œuvre pour mettre en œuvre ses programmes de développement, ses projets sociaux et environnementaux, ainsi que ses activités culturelles. Nous espérons bénéficier du soutien solide de nos partenaires financiers et d'un engagement actif auprès de la communauté afin que l'association puisse pleinement remplir sa mission.

En conclusion, nous demandons à Dieu de nous aider à répondre aux attentes de chacun au service de la communauté.
Que la paix, la miséricorde et les bénédictions de Dieu soient sur vous.`
,
    'home.president.name': 'El FOUNDY Zakaria',
    'home.president.position': 'Président de l\'Association',

    // Footer additional
    'footer.description': 'Association pour le Développement Durable',

    // Admin Dashboard
    'admin.dashboard.title': 'Tableau de bord',
    'admin.dashboard.statistics': 'Statistiques',
    'admin.dashboard.management': 'Gestion',
    'admin.dashboard.total-activities': 'Total Activités',
    'admin.dashboard.total-articles': 'Total Articles',
    'admin.dashboard.total-members': 'Total Membres',
    'admin.dashboard.pdf-downloads': 'PDF Téléchargés',
    'admin.dashboard.site-visitors': 'Visiteurs du Site',
    'admin.dashboard.new-article': 'Nouvel Article',
    'admin.dashboard.create-article': 'Créer un article',
    'admin.dashboard.user-management': 'Gestion des Utilisateurs',
    'admin.dashboard.member-management': 'Gestion des Membres',
    'admin.dashboard.activity-management': 'Gestion des Activités',
    'admin.dashboard.program-management': 'Programmes Annuels',
    'admin.dashboard.tshirt-management': 'Gestion des T-shirts',
    'admin.dashboard.coming-soon': 'Bientôt disponible',
    'admin.header.administration': 'Administration',
    'admin.header.connected-as': 'Connecté en tant que',
    'admin.header.logout': 'Déconnexion',
    'admin.nav.dashboard': 'Tableau de bord',
    'admin.nav.articles': 'Articles',

    // Admin Articles
    'admin.articles.title': 'Articles',
    'admin.articles.new-article': 'Nouvel Article',
    'admin.articles.count': 'article',
    'admin.articles.count-plural': 'articles',
    'admin.articles.page-of': 'Page {current} sur {total}',
    'admin.articles.no-articles': 'Aucun article trouvé',
    'admin.articles.create-first': 'Commencez par créer votre premier article.',
    'admin.articles.edit': 'Modifier',
    'admin.articles.delete': 'Supprimer',
    'admin.articles.no-image': 'Pas d\'image',
    'admin.articles.undefined-title': 'Titre non défini',
    'admin.articles.created-by': 'Association EL BOUCHRA HAY ADIL',
    'admin.articles.confirm-delete': 'Êtes-vous sûr de vouloir supprimer cet article ?',
    'admin.articles.delete-error': 'Erreur lors de la suppression de l\'article.',
    'admin.articles.showing': 'Affichage de {start}-{end} sur {total} articles',
    'admin.articles.previous': 'Précédent',
    'admin.articles.next': 'Suivant',

    // Admin Article Editor
    'admin.editor.edit-article': 'Modifier l\'article',
    'admin.editor.new-article': 'Créer un nouvel article',
    'admin.editor.preview': 'Aperçu',
    'admin.editor.cancel': 'Annuler',
    'admin.editor.publish': 'Publier',
    'admin.editor.saving': 'Sauvegarde...',
    'admin.editor.close-preview': 'Fermer l\'aperçu',
    'admin.editor.article-preview': 'Aperçu de l\'article',
    'admin.editor.title-label': 'Titre de l\'article *',
    'admin.editor.title-placeholder': 'Saisissez un titre accrocheur...',
    'admin.editor.title-chars': '{count}/100 caractères recommandés',
    'admin.editor.excerpt-label': 'Résumé de l\'article',
    'admin.editor.excerpt-placeholder': 'Résumé qui apparaîtra dans la liste des articles (optionnel - généré automatiquement si vide)',
    'admin.editor.excerpt-chars': '{count}/200 caractères recommandés',
    'admin.editor.content-label': 'Contenu de l\'article *',
    'admin.editor.content-placeholder': 'Rédigez le contenu de votre article... Utilisez la barre d\'outils pour formater le texte, ajouter des liens, des images, etc.',
    'admin.editor.content-help': 'Utilisez la barre d\'outils pour formater votre texte',
    'admin.editor.featured-image': 'Image à la une',
    'admin.editor.add-image': 'Ajoutez une image à la une pour votre article',
    'admin.editor.disabled': 'Désactivé',
    'admin.editor.remove-image': 'Supprimer l\'image',
    'admin.editor.image-url': 'Ou ajoutez une URL d\'image :',
    'admin.editor.image-url-placeholder': 'https://exemple.com/image.jpg',
    'admin.editor.information': 'Informations',
    'admin.editor.status': 'Statut',
    'admin.editor.draft': 'Brouillon',
    'admin.editor.author': 'Auteur',
    'admin.editor.date': 'Date',
    'admin.editor.writing-tips': '💡 Conseils de rédaction',
    'admin.editor.tip1': '• Utilisez un titre accrocheur et descriptif',
    'admin.editor.tip2': '• Ajoutez une image à la une attractive',
    'admin.editor.tip3': '• Structurez votre contenu avec des sous-titres',
    'admin.editor.tip4': '• Utilisez des listes à puces pour la lisibilité',
    'admin.editor.tip5': '• Relisez avant de publier',
    'admin.editor.title-required': 'Veuillez saisir un titre pour l\'article.',
    'admin.editor.content-required': 'Veuillez saisir le contenu de l\'article.',
    'admin.editor.save-error': 'Erreur lors de la sauvegarde de l\'article: {error}',

    // Admin Login
    'admin.login.title': 'Administration',
    'admin.login.subtitle': 'Connectez-vous pour accéder au panneau d\'administration',
    'admin.login.email': 'Email',
    'admin.login.password': 'Mot de passe',
    'admin.login.show-password': 'Afficher le mot de passe',
    'admin.login.hide-password': 'Masquer le mot de passe',
    'admin.login.login': 'Se connecter',
    'admin.login.logging-in': 'Connexion...',
    'admin.login.error': 'Échec de la connexion. Vérifiez vos identifiants.',
    'admin.login.restricted': 'Accès réservé aux administrateurs de l\'association',
    'admin.login.email-placeholder': 'admin@elbouchra.org',
    'admin.login.password-placeholder': '••••••••',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.identification': 'من نحن',
    'nav.members': 'الأعضاء',
    'nav.activities': 'الأنشطة',
    'nav.membership': 'العضوية',
    'nav.program': 'البرنامج السنوي',
    'nav.contact': 'اتصل بنا',
    'nav.shop': 'المتجر',
    'nav.articles': 'المقالات',

    // Home page
    'home.hero.title': 'جمعية البشرى للتنمية المستدامة -فرع حي عادل-',
    'home.hero.subtitle': 'نرحب بكم',
    'home.mission.title': 'مهمتنا',
    'home.mission.text': 'تعزيز التنمية المستدامة وحماية بيئتنا للأجيال القادمة.',
    'home.activities.title': 'أنشطتنا',
    'home.activities.env.title': 'حماية البيئة',
    'home.activities.env.text': 'إجراءات ملموسة للحفاظ على الطبيعة والتوعية بالقضايا البيئية.',
    'home.activities.education.title': 'التعليم البيئي',
    'home.activities.education.text': 'برامج تعليمية لتوعية جميع الأجيال.',
    'home.activities.community.title': 'الأعمال المجتمعية',
    'home.activities.community.text': 'مشاريع محلية تشرك المواطنين في التنمية المستدامة.',

    // T-shirt page
    'tshirt.title': 'المتجر - القمصان',
    'tshirt.subtitle': 'ادعم جمعيتنا بقمصاننا الصديقة للبيئة',
    'tshirt.eco.name': 'قميص إيكو أزرق',
    'tshirt.eco.description': 'قميص من القطن العضوي مع شعار الجمعية',
    'tshirt.classic.name': 'قميص كلاسيكي',
    'tshirt.classic.description': 'قميص مميز بتصميم حصري',
    'tshirt.price': ' درهم',
    'tshirt.buy': 'اشتر عبر واتساب',

    // Membership page
    'membership.title': 'العضوية',
    'membership.subtitle': 'انضم إلى مهمتنا للتنمية المستدامة',
    'membership.intro': 'كن عضواً في جمعية البشرى وشارك بفعالية في أعمالنا من أجل مستقبل أكثر خضرة.',
    'membership.benefits.title': 'فوائد العضوية',
    'membership.benefit1': 'المشاركة في الأنشطة والأحداث',
    'membership.benefit2': 'الوصول إلى التدريبات البيئية',
    'membership.benefit3': 'النشرة الإخبارية الشهرية',
    'membership.benefit4': 'خصومات على منتجاتنا',
    'membership.download': 'تحميل نموذج العضوية',

    // Membership requirements
    'membership.requirements.title': 'شروط العضوية',
    'membership.requirements.intro.ar': 'من أجل تنمية وتطوير أنشطة الجمعية وتنفيدا لتوصيات المكتب الوطني للجمعية قرر فتح باب الانخراط وتجديد الانخراط في وجه العموم',
    'membership.requirements.subtitle': 'للراغبين في الانخراط:',
    'membership.fee.amount': '200 درهم',

    // Program page
    'program.title': 'البرنامج السنوي',
    'program.subtitle': 'فعالياتنا وأنشطتنا المخطط لها للعام',

    // Contact page
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'لنبقى على تواصل من أجل مستقبل أكثر خضرة',
    'contact.form.name': 'الاسم الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.message': 'الرسالة',
    'contact.form.send': 'إرسال الرسالة',
    'contact.info.title': 'معلومات الاتصال',
    'contact.info.address': 'العنوان',
    'contact.info.email': 'البريد الإلكتروني',
    'contact.info.whatsapp': 'واتساب',

    // Common
    'common.learn-more': 'اعرف المزيد',
    'common.read-more': 'اقرأ المزيد',
    'common.read-less': 'اقرأ أقل',

    // Footer
    'footer.quick-links': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.legal': 'الإشعارات القانونية',
    'footer.rights': 'جميع الحقوق محفوظة',

    // Identification page
    'identification.title': 'من نحن',
    'identification.subtitle': 'اكتشف من نحن وقيمنا',
    'identification.vision.title': 'رؤيتنا',
    'identification.vision.text': 'خلق عالم حيث التنمية الاقتصادية والاجتماعية تحترم البيئة وتضمن مستقبلاً مستداماً للجميع. نتصور مجتمعات مزدهرة تعيش في انسجام مع الطبيعة.',
    'identification.mission.title': 'مهمتنا',
    'identification.mission.text': 'تعزيز التنمية المستدامة من خلال التعليم البيئي والأعمال المجتمعية والتوعية. نعمل على حماية كوكبنا مع تحسين نوعية حياة السكان المحليين.',
    'identification.values.title': 'قيمنا',
    'identification.values.environment.title': 'احترام البيئة',
    'identification.values.environment.text': 'حماية والحفاظ على النظام البيئي',
    'identification.values.solidarity.title': 'التضامن',
    'identification.values.solidarity.text': 'التعاون والمساعدة المجتمعية',
    'identification.values.innovation.title': 'الابتكار',
    'identification.values.innovation.text': 'حلول إبداعية لمستقبل مستدام',
    'identification.values.transparency.title': 'الشفافية',
    'identification.values.transparency.text': 'تواصل مفتوح ومسؤول',

    // Members page
    'members.title': 'أعضاؤنا',
    'members.subtitle': 'الفريق المتفاني الذي يجعل كل شيء ممكناً',
    'members.executive.title': 'المكتب التنفيذي',
    'members.join.title': 'انضم إلينا!',
    'members.join.text': 'هل تشارك قيمنا؟ هل تريد المساهمة في التنمية المستدامة؟ انضم إلى مجتمع المتطوعين المتحمسين لدينا.',
    'members.join.button': 'كن متطوعاً',

    // Activities page
    'activities.title': 'أنشطتنا',
    'activities.subtitle': 'اكتشف أعمالنا للتنمية المستدامة',
    'activities.impact.title': 'تأثيرنا',
    'activities.impact.trees': 'شجرة مزروعة',
    'activities.impact.people': 'شخص تم توعيته',
    'activities.impact.projects': 'مشروع مجتمعي',

    // Home page additional
    'home.team.title': 'فريقنا',
    'home.team.button': 'عرض جميع الأعضاء',
    'home.events.title': 'الأحداث القادمة',
    'home.events.button': 'عرض البرنامج الكامل',
    'home.impact.title': 'تأثيرنا',
    'home.impact.subtitle': 'أرقام تشهد على التزامنا',

    // President message
    'home.president.title': 'كلمة الرئيس',
'home.president.message': `
بســم الله الرحمــــن الرحيـــم

والصلاة والسلام على أشرف الأنبياء والمرسلين وعلى آله وصحبه أجمعين وبعد.
السيد مدير دار الشباب حي عادل
السيد رئيس المكتب الوطني لجمعية البشرى للتنمية المستدامة
السيدات والسادة الحضور الكرام

يطيب لنا في جمعية البشرى للتنمية المستدامة- فرع حي عادل -أن نرحب بكم في هاته الأمسية الرمضانية. أرحب بشخصكم الكـريـم باسمي وباسم كافة الأخوة بالمكـتب المسير وكافة الأعضاء المنخرطين والمتطوعين.
وبهذه المناسبة أود ان أتقدم بفائق شكري وعظيم امتناني إلى كل من ساهـم في انجاح أنشطة ومشاريع الجمعية، وترجمة أهدافها النبيــلة على أرض الواقع، وأخص بالذكر في هذا المجال أعضاء المكتب المسير والمنخرطين.
كما لا تفوتني الفرصة لشكر السيد عبد اللطيف مرجاني مدير المعهد المتخصص للتكنولوجية التطبيقية بولو والسيد مرزاق مدير مركب التكوين المهني على مدهما يد المساعدة لنا ومساهمتهما في إنجاح هاته الأمسية.

وكما لا يخفى فإن الحي المحمدي بما يتوفر عليه من خصوصيات ثقافية وسمات جغرافية وطوابع حضارية في أمس الحاجة إلى عمل جمعوي رصين وفعال يسعى إلى النهوض بتنميتها والمحافظة على مقوماتها، ومواجهة كل ما يطالها من أشكال الهشاشة الاجتماعية والاستنزاف البيئي، وحماية التراث الإيكولوجي للمنطقة والسعي إلى دراسته والتعريف به وإبراز أصالته، مما يولد الالتفاف حوله والاعتزاز به.

وجمعية البشرى للتنمية المستدامة- فرع حي عادل -إلا واحدة من الجمعيات التي حملت على عاتقها هـم الانخراط في مسلسل الرفع من إيقاع التنمية بكل ما أوتيت من جهد متواصل وتفكيـر عميـق وحمـاس كبيـر، بهذه الجهة العريقة في التاريخ والأصالة المنفتحة على قيم الحداثة والمعـاصـــرة.

وتبعا لذلك فإن الجمعية تبذل قصارى جهدها في تنفيذ برامجها التنموية ومشاريعها الاجتمـاعيــة والبيئية وأنشطتها الثقافية آملين أن نجد دعما قويا من طرف الشركاء الممولين، وتواصلا حـيا مــن طرف السكان حتى تستطيع الجمعية أداء رسالتها على أحسن وجـه وأكمــله.

وفي الختام نسأل الله أن نكون عند حسن ظن الجميع لخدمة المجتمع.
والسلام عليكـم ورحمـة الله وبركاتـه.`,

    'home.president.name': 'الفندي زكرياء',
    'home.president.position': 'رئيسى',

    // Footer additional
    'footer.description': 'جمعية للتنمية المستدامة',

    // Admin Dashboard
    'admin.dashboard.title': 'لوحة التحكم',
    'admin.dashboard.statistics': 'الإحصائيات',
    'admin.dashboard.management': 'الإدارة',
    'admin.dashboard.total-activities': 'إجمالي الأنشطة',
    'admin.dashboard.total-articles': 'إجمالي المقالات',
    'admin.dashboard.total-members': 'إجمالي الأعضاء',
    'admin.dashboard.pdf-downloads': 'تحميلات PDF',
    'admin.dashboard.site-visitors': 'زوار الموقع',
    'admin.dashboard.new-article': 'مقال جديد',
    'admin.dashboard.create-article': 'إنشاء مقال',
    'admin.dashboard.user-management': 'إدارة المستخدمين',
    'admin.dashboard.member-management': 'إدارة الأعضاء',
    'admin.dashboard.activity-management': 'إدارة الأنشطة',
    'admin.dashboard.program-management': 'البرامج السنوية',
    'admin.dashboard.tshirt-management': 'إدارة القمصان',
    'admin.dashboard.coming-soon': 'قريباً',
    'admin.header.administration': 'الإدارة',
    'admin.header.connected-as': 'متصل باسم',
    'admin.header.logout': 'تسجيل الخروج',
    'admin.nav.dashboard': 'لوحة التحكم',
    'admin.nav.articles': 'المقالات',

    // Admin Articles
    'admin.articles.title': 'المقالات',
    'admin.articles.new-article': 'مقال جديد',
    'admin.articles.count': 'مقال',
    'admin.articles.count-plural': 'مقالات',
    'admin.articles.page-of': 'صفحة {current} من {total}',
    'admin.articles.no-articles': 'لم يتم العثور على مقالات',
    'admin.articles.create-first': 'ابدأ بإنشاء مقالك الأول.',
    'admin.articles.edit': 'تعديل',
    'admin.articles.delete': 'حذف',
    'admin.articles.no-image': 'لا توجد صورة',
    'admin.articles.undefined-title': 'عنوان غير محدد',
    'admin.articles.created-by': 'جمعية البشرى حي عادل',
    'admin.articles.confirm-delete': 'هل أنت متأكد من حذف هذا المقال؟',
    'admin.articles.delete-error': 'خطأ في حذف المقال.',
    'admin.articles.showing': 'عرض {start}-{end} من {total} مقالات',
    'admin.articles.previous': 'السابق',
    'admin.articles.next': 'التالي',

    // Admin Article Editor
    'admin.editor.edit-article': 'تعديل المقال',
    'admin.editor.new-article': 'إنشاء مقال جديد',
    'admin.editor.preview': 'معاينة',
    'admin.editor.cancel': 'إلغاء',
    'admin.editor.publish': 'نشر',
    'admin.editor.saving': 'جاري الحفظ...',
    'admin.editor.close-preview': 'إغلاق المعاينة',
    'admin.editor.article-preview': 'معاينة المقال',
    'admin.editor.title-label': 'عنوان المقال *',
    'admin.editor.title-placeholder': 'أدخل عنواناً جذاباً...',
    'admin.editor.title-chars': '{count}/100 حرف موصى به',
    'admin.editor.excerpt-label': 'ملخص المقال',
    'admin.editor.excerpt-placeholder': 'ملخص سيظهر في قائمة المقالات (اختياري - يتم إنشاؤه تلقائياً إذا كان فارغاً)',
    'admin.editor.excerpt-chars': '{count}/200 حرف موصى به',
    'admin.editor.content-label': 'محتوى المقال *',
    'admin.editor.content-placeholder': 'اكتب محتوى مقالك... استخدم شريط الأدوات لتنسيق النص وإضافة الروابط والصور وغيرها.',
    'admin.editor.content-help': 'استخدم شريط الأدوات لتنسيق النص',
    'admin.editor.featured-image': 'الصورة المميزة',
    'admin.editor.add-image': 'أضف صورة مميزة لمقالك',
    'admin.editor.disabled': 'معطل',
    'admin.editor.remove-image': 'حذف الصورة',
    'admin.editor.image-url': 'أو أضف رابط صورة:',
    'admin.editor.image-url-placeholder': 'https://exemple.com/image.jpg',
    'admin.editor.information': 'المعلومات',
    'admin.editor.status': 'الحالة',
    'admin.editor.draft': 'مسودة',
    'admin.editor.author': 'المؤلف',
    'admin.editor.date': 'التاريخ',
    'admin.editor.writing-tips': '💡 نصائح الكتابة',
    'admin.editor.tip1': '• استخدم عنواناً جذاباً ووصفياً',
    'admin.editor.tip2': '• أضف صورة مميزة جذابة',
    'admin.editor.tip3': '• نظم محتواك بعناوين فرعية',
    'admin.editor.tip4': '• استخدم القوائم النقطية للوضوح',
    'admin.editor.tip5': '• راجع قبل النشر',
    'admin.editor.title-required': 'يرجى إدخال عنوان للمقال.',
    'admin.editor.content-required': 'يرجى إدخال محتوى المقال.',
    'admin.editor.save-error': 'خطأ في حفظ المقال: {error}',

    // Admin Login
    'admin.login.title': 'الإدارة',
    'admin.login.subtitle': 'سجل الدخول للوصول إلى لوحة الإدارة',
    'admin.login.email': 'البريد الإلكتروني',
    'admin.login.password': 'كلمة المرور',
    'admin.login.show-password': 'إظهار كلمة المرور',
    'admin.login.hide-password': 'إخفاء كلمة المرور',
    'admin.login.login': 'تسجيل الدخول',
    'admin.login.logging-in': 'جاري تسجيل الدخول...',
    'admin.login.error': 'فشل في تسجيل الدخول. تحقق من بياناتك.',
    'admin.login.restricted': 'الوصول مقصور على مديري الجمعية',
    'admin.login.email-placeholder': 'admin@elbouchra.org',
    'admin.login.password-placeholder': '••••••••',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    document.documentElement.dir = language.direction;
    document.documentElement.lang = language.code;
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code][key] || key;
  };

  useEffect(() => {
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { languages };