/**
 * Legal page content
 */

export const legalContent: Record<
  string,
  Record<"ar" | "en" | "fr", { title: string; content: string }>
> = {
  disclaimer: {
    ar: {
      title: "إخلاء المسؤولية",
      content: `دليل مبادرة مدنية مستقلة وغير مسجّلة. وهو ليس مؤسسة إعلامية ولا حزبًا سياسيًا ولا سلطة انتخابية ولا جهة حكومية.

يوفّر دليل معلومات متاحة للعامة لأغراض تعليمية وتثقيفية فقط، وذلك في ما يتعلّق بالانتخابات النيابية اللبنانية (الانتخابات النيابية).

لا يؤيّد دليل ولا يعارض ولا يروّج ولا يثني عن أي حزب سياسي أو لائحة انتخابية أو مرشح.

لا يشكّل المحتوى المنشور على دليل أي نوع من الاستشارة السياسية أو القانونية أو الانتخابية أو المهنية. ويتحمّل المستخدمون وحدهم مسؤولية كيفية تفسيرهم واستخدامهم للمعلومات المعروضة.

لا يضمن دليل أن تكون المعلومات المقدمة كاملة أو شاملة، لا سيما خلال الفترات التي تكون فيها الترشيحات واللوائح الانتخابية قيد التشكيل.`,
    },
    en: {
      title: "Disclaimer",
      content: `Daleel is an independent, non-registered civic initiative. It is not a media organization, political party, electoral authority, or governmental body.

Daleel provides publicly available information for educational and informational purposes only in relation to the Lebanese parliamentary elections (الانتخابات النيابية).

Daleel does not endorse, oppose, promote, or discourage any political party, electoral list, or candidate.

The content published on Daleel does not constitute political, legal, electoral, or professional advice. Users are solely responsible for how they interpret and use the information presented.

Daleel makes no representation that the information provided is complete or exhaustive, particularly during periods when candidacies and electoral lists are still being formed.`,
    },
    fr: {
      title: "Avertissement",
      content: `Daleel est une initiative civique indépendante et non enregistrée. Elle ne constitue ni un média, ni un parti politique, ni une autorité électorale, ni un organisme gouvernemental.

Daleel fournit des informations accessibles au public à des fins exclusivement éducatives et informatives concernant les élections législatives libanaises (الانتخابات النيابية).

Daleel ne soutient, ne s'oppose, ne promeut ni ne décourage aucun parti politique, liste électorale ou candidat.

Le contenu publié sur Daleel ne constitue pas un conseil politique, juridique, électoral ou professionnel. Les utilisateurs sont seuls responsables de l'interprétation et de l'utilisation des informations présentées.

Daleel ne garantit pas que les informations fournies soient complètes ou exhaustives, en particulier durant les périodes où les candidatures et les listes électorales sont encore en cours de formation.`,
    },
  },
  neutrality: {
    ar: {
      title: "الحياد",
      content: `دليل ملتزم التزامًا صارمًا بالحياد.

لا يعبّر دليل عن أي آراء أو أحكام أو تقييمات أو توصيات تتعلّق بالمرشحين أو اللوائح الانتخابية أو الأحزاب السياسية أو المواقف السياسية.

لا يقوم دليل بترتيب أو تقييم أو مقارنة أو تصنيف المرشحين أو اللوائح على أنها أفضل أو أسوأ.

يتم عرض جميع المرشحين باستخدام نفس الهيكلية والمنهجية. ويعكس الاختلاف في طول أو تفصيل الملفات الشخصية اختلاف كمية المعلومات المتاحة للعامة، وليس أي تفضيل أو انحياز تحريري.

لا يدعو دليل إلى أي سلوك انتخابي ولا يسعى إلى التأثير على خيارات الناخبين.`,
    },
    en: {
      title: "Neutrality & Non-Endorsement",
      content: `Daleel is strictly neutral.

Daleel does not express opinions, judgments, evaluations, or recommendations regarding candidates, electoral lists, political parties, or political positions.

Daleel does not rank, score, compare, or label candidates or lists as better or worse.

All candidates are presented using the same structure and methodology. Differences in profile length or detail reflect differences in publicly available information, not editorial preference or bias.

Daleel does not advocate voter behavior and does not influence electoral choices.`,
    },
    fr: {
      title: "Neutralité",
      content: `Daleel est strictement neutre.

Daleel n'exprime pas d'opinions, de jugements, d'évaluations ou de recommandations concernant les candidats, les listes électorales, les partis politiques ou les positions politiques.

Daleel ne classe pas, n'évalue pas, ne compare pas ni ne qualifie les candidats ou les listes comme meilleurs ou pires.

Tous les candidats sont présentés en utilisant la même structure et la même méthodologie. Les différences de longueur ou de détail des profils reflètent des différences dans les informations publiques disponibles, et non une préférence ou un biais éditorial.

Daleel ne préconise aucun comportement électoral et n'influence pas les choix électoraux.`,
    },
  },
  methodology: {
    ar: {
      title: "المنهجية",
      content: `يجمع دليل ويعرض المعلومات حصراً من مصادر متاحة للعامة، بما في ذلك على سبيل المثال لا الحصر:

التصريحات العلنية للمرشحين

الوثائق الرسمية

السجلات البرلمانية

المقابلات الإعلامية

الحسابات العامة على وسائل التواصل الاجتماعي

لا ينشر دليل:

المراسلات الخاصة

المواد المسربة

الاتهامات المجهولة المصدر

الشائعات أو الادعاءات غير الموثقة

قد تُستخدم أدوات الذكاء الاصطناعي للمساعدة في تفريغ المحتوى، وتنظيمه، وتلخيص المواد المتاحة للعامة. ويتم مراجعة جميع المحتويات المنشورة والموافقة عليها من قبل محررين بشريين.

يقدّم دليل المعلومات بطريقة محايدة وواقعية، وتكون الملخصات دائمًا مرفقة بالمصادر الأصلية لتمكين المستخدمين من مراجعة المواد الخام بأنفسهم.`,
    },
    en: {
      title: "Methodology & Editorial Policy",
      content: `Daleel collects and presents information exclusively from publicly accessible sources, including but not limited to:

Public statements by candidates

Official documents

Parliamentary records

Media interviews

Public social media accounts

Daleel does not publish:

Private communications

Leaked materials

Anonymous allegations

Rumors or unverified claims

Artificial intelligence tools may be used to assist with transcription, organization, and summarization of publicly available material. All published content is reviewed and approved by human editors.

Daleel summarizes information in a neutral and factual manner. Summaries are always accompanied by original sources to allow users to review the raw material themselves.`,
    },
    fr: {
      title: "Méthodologie",
      content: `Daleel collecte et présente des informations exclusivement à partir de sources accessibles au public, notamment mais sans s'y limiter :

Déclarations publiques des candidats

Documents officiels

Archives parlementaires

Interviews médiatiques

Comptes publics sur les réseaux sociaux

Daleel ne publie pas :

Des communications privées

Des documents divulgués ou fuités

Des accusations anonymes

Des rumeurs ou des informations non vérifiées

Des outils d'intelligence artificielle peuvent être utilisés pour aider à la transcription, à l'organisation et à la synthèse de contenus publics. Tout contenu publié est examiné et validé par des éditeurs humains.

Daleel résume les informations de manière neutre et factuelle. Chaque résumé est accompagné de ses sources originales afin de permettre aux utilisateurs de consulter le contenu brut par eux-mêmes.`,
    },
  },
  archiving: {
    ar: {
      title: "الأرشفة",
      content: `يحافظ دليل على أرشيف دائم لجميع المحتويات المنشورة، وذلك حفاظًا على السجل السياسي العام والدقة التاريخية.

لا يتم حذف المحتوى المنشور على دليل. وعند الحاجة إلى تحديث المعلومات، تتم إضافة معلومات جديدة مع الاحتفاظ بالإصدارات السابقة مرفقة بالطوابع الزمنية.

يتم أرشفة جميع المصادر في وقت النشر لضمان الوصول إليها على المدى الطويل، حتى في حال تعديل المصادر الأصلية أو إزالتها لاحقًا.

يعكس المحتوى المؤرشف السياق والزمن الذي نُشر فيه، ولا يدل بالضرورة على المواقف أو الانتماءات الحالية ما لم يُذكر ذلك صراحة.`,
    },
    en: {
      title: "Archiving & Record Preservation",
      content: `Daleel maintains a permanent archive of all published content in order to preserve public political record and historical accuracy.

Content published on Daleel is not deleted. When updates are required, new information is added and previous versions are preserved with timestamps.

All sources are archived at the time of publication to ensure long-term accessibility, even if original sources are later modified or removed.

Archived content reflects the context and time in which it was originally published and does not imply current positions or affiliations unless explicitly stated.`,
    },
    fr: {
      title: "Archivage",
      content: `Daleel maintient une archive permanente de tout le contenu publié afin de préserver les archives politiques publiques et l'exactitude historique.

Le contenu publié sur Daleel n'est pas supprimé. Lorsque des mises à jour sont nécessaires, de nouvelles informations sont ajoutées et les versions précédentes sont conservées avec des horodatages.

Toutes les sources sont archivées au moment de la publication pour assurer l'accessibilité à long terme, même si les sources originales sont modifiées ou supprimées par la suite.

Le contenu archivé reflète le contexte et l'époque dans lesquels il a été publié à l'origine et n'implique pas les positions ou affiliations actuelles sauf indication contraire.`,
    },
  },
  corrections: {
    ar: {
      title: "التصحيحات",
      content: `يلتزم دليل بالدقة والشفافية.

يجب أن تكون طلبات التصحيح مدعومة بمصادر عامة قابلة للتحقق. ولا يُعدّ الاختلاف في الرأي حول معلومات موثقة سببًا لحذفها.

يمكن للمرشحين أو الجهات المعنية طلب:

تصحيح واقعي

توضيح

حق الرد

يعالج دليل الأخطاء من خلال التصحيحات أو الإيضاحات السياقية، وليس عبر حذف المواد المؤرشفة.`,
    },
    en: {
      title: "Corrections & Right of Reply",
      content: `Daleel is committed to accuracy and transparency.

Requests for corrections must be supported by verifiable public sources. Disagreement with sourced information does not constitute grounds for removal.

Candidates and concerned parties may request:

A factual correction

A clarification

A right of reply

Daleel addresses inaccuracies through corrections or contextual notes rather than deletion of archived material.`,
    },
    fr: {
      title: "Corrections",
      content: `Daleel s'engage en faveur de l'exactitude et de la transparence.

Les demandes de corrections doivent être étayées par des sources publiques vérifiables. Le désaccord avec des informations sourcées ne constitue pas une raison de suppression.

Les candidats et les parties concernées peuvent demander :

Une correction factuelle

Une clarification

Un droit de réponse

Daleel traite les inexactitudes par des corrections ou des notes contextuelles plutôt que par la suppression de matériel archivé.`,
    },
  },
  "candidate-content": {
    ar: {
      title: "محتوى المرشح",
      content: `قد تتضمن بعض أقسام ملفات المرشحين محتوى مقدّمًا مباشرة من قبل المرشح.

يتم تمييز هذا المحتوى بوضوح على أنه يعكس آراء وتصريحات المرشح نفسه. ولا يتحقق دليل من الآراء أو الوعود أو الالتزامات المستقبلية الواردة في هذا النوع من المحتوى.

يحتفظ دليل بحق رفض أي محتوى يخالف معايير النشر، بما في ذلك الهجمات الشخصية أو اللغة التشهيرية أو الشعارات الدعائية.`,
    },
    en: {
      title: "Candidate-Submitted Content",
      content: `Certain sections of candidate profiles may include content submitted directly by the candidate.

Such content is clearly labeled and reflects the candidate's own views and statements. Daleel does not verify opinions, promises, or future commitments contained in candidate-submitted material.

Daleel reserves the right to reject submissions that violate content guidelines, including personal attacks, defamatory language, or promotional slogans.`,
    },
    fr: {
      title: "Contenu du candidat",
      content: `Certaines sections des profils de candidats peuvent inclure du contenu soumis directement par le candidat.

Ce contenu est clairement étiqueté et reflète les opinions et déclarations du candidat lui-même. Daleel ne vérifie pas les opinions, promesses ou engagements futurs contenus dans le matériel soumis par les candidats.

Daleel se réserve le droit de rejeter les soumissions qui violent les directives de contenu, y compris les attaques personnelles, le langage diffamatoire ou les slogans promotionnels.`,
    },
  },
  "ai-usage": {
    ar: {
      title: "استخدام الذكاء الاصطناعي",
      content: `يستخدم دليل أدوات الذكاء الاصطناعي حصراً كوسيلة مساعدة في:

تفريغ المحتوى الصوتي أو المرئي العام

تنظيم كميات كبيرة من المعلومات العامة

إعداد مسودات ملخصات محايدة لمراجعة بشرية

لا تتخذ أنظمة الذكاء الاصطناعي أي قرارات تحريرية أو أحكام أو تقييمات. ويتم مراجعة جميع المحتويات المنشورة من قبل محررين بشريين.

ورغم السعي الدائم إلى الدقة، قد تحتوي الأدوات الآلية على أخطاء. ويعمل دليل باستمرار على مراجعة وتحسين آلياته وإجراءاته.`,
    },
    en: {
      title: "AI Usage & Limitations",
      content: `Daleel uses artificial intelligence tools solely as an assistive mechanism for:

Transcribing public audio or video

Organizing large volumes of public information

Drafting neutral summaries for human review

AI systems do not make editorial decisions, judgments, or evaluations. All published content is reviewed by human editors.

While efforts are made to ensure accuracy, automated tools may contain errors. Daleel continuously reviews and improves its processes.`,
    },
    fr: {
      title: "Utilisation de l'IA",
      content: `Daleel utilise des outils d'intelligence artificielle uniquement comme mécanisme d'assistance pour :

La transcription de contenu audio ou vidéo public

L'organisation de grands volumes d'informations publiques

La rédaction de résumés neutres pour examen humain

Les systèmes d'IA ne prennent pas de décisions éditoriales, de jugements ou d'évaluations. Tout le contenu publié est examiné par des éditeurs humains.

Bien que des efforts soient faits pour garantir l'exactitude, les outils automatisés peuvent contenir des erreurs. Daleel examine et améliore continuellement ses processus.`,
    },
  },
  liability: {
    ar: {
      title: "المسؤولية",
      content: `يوفّر دليل المعلومات كما هي ("as-is") دون أي ضمانات تتعلق بالكمال أو الدقة أو حداثة المحتوى.

لا يتحمّل دليل أي مسؤولية عن القرارات أو الأفعال أو النتائج المترتبة على استخدام المعلومات المنشورة على المنصة.

كما لا يتحمّل دليل مسؤولية محتوى المواقع أو المصادر الخارجية التي تتم الإشارة إليها أو أرشفتها.`,
    },
    en: {
      title: "Limitation of Liability",
      content: `Daleel provides information on an "as-is" basis without warranties of completeness, accuracy, or timeliness.

Daleel shall not be held liable for decisions, actions, or consequences arising from the use of information published on the platform.

Daleel is not responsible for the content of external websites or sources referenced or archived.`,
    },
    fr: {
      title: "Responsabilité",
      content: `Daleel fournit des informations "telles quelles" sans garanties d'exhaustivité, d'exactitude ou d'actualité.

Daleel ne peut être tenue responsable des décisions, actions ou conséquences résultant de l'utilisation d'informations publiées sur la plateforme.

Daleel n'est pas responsable du contenu des sites Web externes ou des sources référencées ou archivées.`,
    },
  },
  "data-use": {
    ar: {
      title: "استخدام البيانات",
      content: `ينشر دليل ويؤرشف المعلومات المتاحة للعامة وفق مبادئ الاستخدام العادل والمصلحة العامة.

لا يجوز إعادة استخدام المحتوى المنشور على دليل بطريقة مضللة أو تلاعبية. ويُشترط ذكر المصدر بشكل واضح عند الإشارة إلى مواد دليل.

لا يدّعي دليل ملكية المحتوى الأصلي التابع لجهات خارجية والذي تتم الإشارة إليه على المنصة.`,
    },
    en: {
      title: "Data Use & Copyright",
      content: `Daleel publishes and archives publicly available information under principles of fair use and public interest.

Content published on Daleel may not be reused in a misleading or manipulative manner. Proper attribution is required when referencing Daleel materials.

Daleel does not claim ownership over original third-party content referenced on the platform.`,
    },
    fr: {
      title: "Utilisation des données",
      content: `Daleel publie et archive des informations accessibles au public selon les principes d'utilisation équitable et d'intérêt public.

Le contenu publié sur Daleel ne peut pas être réutilisé de manière trompeuse ou manipulatrice. Une attribution appropriée est requise lors de la référence aux matériaux de Daleel.

Daleel ne revendique pas la propriété du contenu original de tiers référencé sur la plateforme.`,
    },
  },
};

