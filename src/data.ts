import { DoctorMember, Course, NewsItem, AuditLogEntry } from './types';

/**
 * Official accredited doctors registry.
 * First enrolled Doctor: Dr. Al-Samoual Awad
 */
export const DOCTOR_REGISTRY: DoctorMember[] = [
  {
    id: 'SDI-0010',
    name: 'Dr. Al-Samoual Awad',
    nameAr: 'د. السموأل عوض',
    title: '',
    titleAr: '',
    roleCategory: '',
    roleCategoryAr: '',
    specialty: '',
    specialtyAr: '',
    hospital: '',
    hospitalAr: '',
    imcNumber: '419820',
    standing: 'Active',
    standingAr: 'عضو نشط معتمد',
    cpdUnits: 36,
    joinedYear: 2018,
    division: 'Specialist Division',
    photoUrl: '/dr-al-samoual-awad.jpg',
    whatsapp: '+353 89 251 5586',
    email: 'example@gmail.com',
    bio: '',
    bioAr: '',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '14:22:08',
    type: 'KEYSTORE_INIT',
    badgeClass: 'bg-slate-100 text-slate-900 border border-slate-200',
    message: 'Cryptographic keystore initialized with 4,000 precreated unissued membership credentials (SDI-0001 to SDI-4000).'
  },
  {
    id: 'log-2',
    timestamp: '13:58:12',
    type: 'ACCESS_POLICY',
    badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    message: 'Access policy enforced: Newly created accounts are restricted exclusively to the News & Public Bulletin until executive administrative activation.'
  },
  {
    id: 'log-3',
    timestamp: '12:30:45',
    type: 'SYSTEM_STATUS',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
    message: 'Real-time telemetry and clinical dashboard online. Dublin node TLS 1.3 encrypted.'
  }
];

export const COURSES: Course[] = [
  {
    id: 'mrcpi-prep',
    cpdUnits: 14,
    accessType: 'members',
    title: 'MRCPI Clinical Examination Prep',
    titleAr: 'دورة التحضير للامتحان السريري MRCPI',
    description: 'Rigorous mock bedside examination simulation, long and short station timing, and feedback aligned with Royal College of Physicians of Ireland standards.',
    descriptionAr: 'محاكاة سريرية شاملة للامتحان السريري بجانب سرير المريض، تدريب على توقيت المحطات القصيرة والطويلة مع تقييم متوافق مع معايير الكلية الملكية للأطباء بأيرلندا.',
    leadFaculty: 'Specialist Clinical Examiners Panel',
    leadFacultyAr: 'نخبة من الاستشاريين والممتحنين السريريين',
    format: 'In-Person & Video Review',
    formatAr: 'حضوري + مراجعة بالفيديو المسجل',
    cohort: 'Spring 2026 Cohort',
    cohortAr: 'دفعة ربيع 2026',
    syllabus: [
      'Station 1: Cardiovascular & Respiratory Master Systems Clinical Assessment',
      'Station 2: Central Nervous System & Cranial Nerve Complex Examination',
      'Station 3: Abdominal, Renal & Hepatobiliary Physical Signs Mastery',
      'Station 4: Communication, Ethics, Breaking Bad News & Irish Medicolegal Context',
      'Mock Stations Simulation under timed exam pressure with structured feedback'
    ],
    syllabusAr: [
      'المحطة الأولى: الفحص السريري المتقدم للجهاز القلبي والوعائي والجهاز التنفسي',
      'المحطة الثانية: فحص الجهاز العصبي المركزي والأعصاب القحفية المعقدة',
      'المحطة الثالثة: العلامات السريرية للجهاز الهضمي والكبد والكلى',
      'المحطة الرابعة: مهارات التواصل، الأخلاقيات الطبية وإيصال الأخبار الصعبة في السياق الإيرلندي',
      'محاكاة عملية شاملة ومختبرة للمحطات تحت ضغط الوقت مع تقرير ملاحظات مكتوب'
    ],
    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lessonUrl: 'https://zoom.us/j/sdi-mrcpi-live-station',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'MRCPI-Clinical-Stations-Handout-2026.pdf'
  },
  {
    id: 'nchd-induction',
    cpdUnits: 8,
    accessType: 'open',
    title: 'Induction for New NCHDs in Ireland',
    titleAr: 'برنامج التعريف للأطباء غير الاستشاريين الجدد في إيرلندا',
    description: 'Crucial orientation covering HSE clinical documentation standards, Irish medicolegal guidelines, on-call paging etiquette, and cross-cultural navigation.',
    descriptionAr: 'دليل توجيهي حيوي يغطي معايير التوثيق السريري في HSE، اللوائح الطبية القانونية الإيرلندية، بروتوكولات النداء الآلي، والتكيف المهني الثقافي.',
    leadFaculty: 'Directorate of Medical Training',
    leadFacultyAr: 'إدارة التدريب والتطوير الطبي',
    format: 'Recorded Masterclass',
    formatAr: 'محاضرات مسجلة حسب الطلب',
    cohort: 'On-Demand Library',
    cohortAr: 'مكتبة رقمية مفتوحة على مدار الساعة',
    syllabus: [
      'HSE Hospital Workflow & Charting: Patient safety incident reporting & NIMIS PACS',
      'Irish Prescription Laws: GMS protocols, high-tech drugs, and antimicrobial stewardship',
      'Mastering the Bleep: Paging escalation, SBAR clinical handover protocol',
      'Medico-legal essentials under the Medical Practitioners Act and Coronial Reports',
      'Navigating career training schemes (BST & HST) with RCPI, RCSI, and ICGP'
    ],
    syllabusAr: [
      'سير العمل والتوثيق في مستشفيات HSE: نظام الإبلاغ عن الحوادث ونظام تصوير NIMIS',
      'قوانين الوصفات الطبية الإيرلندية: معايير GMS، الأدوية التخصصية وترشيد المضادات الحيوية',
      'إدارة النداءات العاجلة (البيجر): تسليم المرضى ببروتوكول SBAR والتصعيد السريري',
      'الأسس الطبية القانونية بموجب قانون الممارسين الطبيين وتقارير المحقق الشرعي',
      'خارطة مسارات التدريب التخصصي الأساسي والعالي (BST & HST) مع الكليات الملكية'
    ],
    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lessonUrl: 'https://meet.google.com/sdi-nchd-induction',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'HSE-NCHDs-Clinical-Orientation-Manual.pdf'
  },
  {
    id: 'annual-cpd-2026',
    cpdUnits: 24,
    accessType: 'members',
    title: 'Annual Clinical CPD Series 2026',
    titleAr: 'سلسلة التطوير المهني السريري السنوية 2026',
    description: 'Monthly accredited seminars encompassing Acute Medicine, Trauma triage, Advanced POCUS ultrasound, and National Healthcare Policy updates.',
    descriptionAr: 'ندوات شهرية معتمدة تشمل طب الطوارئ، فرز حالات الإصابات، الموجات فوق الصوتية بجانب السرير (POCUS)، وتحديثات السياسة الصحية الوطنية.',
    leadFaculty: 'Royal College Aligned Faculty',
    leadFacultyAr: 'هيئة تدريس معتمدة ومتوافقة مع الكليات الملكية',
    format: 'Direct HSE Points Sync',
    formatAr: 'مزامنة فورية لنقاط التدريب مع HSE',
    cohort: 'Full Year Pass',
    cohortAr: 'اشتراك سنوي شامل',
    syllabus: [
      'Module 1: Acute Coronary Syndromes & Cardiac Cath Lab Triage in Ireland',
      'Module 2: Point-of-Care Ultrasound (POCUS) in the Emergency Department & ICU',
      'Module 3: Sepsis 3.0 Clinical Algorithms & National HSE Guideline Rollout',
      'Module 4: Diabetes & Endocrinology Acute Crises Management',
      'Module 5: Oncology Emergencies, Neutropenic Fever, and Palliative Co-management'
    ],
    syllabusAr: [
      'الوحدة 1: متلازمات الشرايين التاجية الحادة وفرز حالات قسطرة القلب في إيرلندا',
      'الوحدة 2: الموجات فوق الصوتية الموجهة (POCUS) في أقسام الطوارئ والعناية المركزة',
      'الوحدة 3: خوارزميات الإنتان السريري المحدثة وتطبيق البروتوكول الوطني لـ HSE',
      'الوحدة 4: إدارة الحالات الطارئة للغدد الصماء والسكري',
      'الوحدة 5: طوارئ الأورام، حمى نقص العدلات، والرعاية التلطيفية المشتركة'
    ],
    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lessonUrl: 'https://zoom.us/j/sdi-annual-cpd-seminar',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'Annual-CPD-Clinical-Curriculum-2026.pdf'
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'agm-2026',
    date: 'November 2026',
    dateAr: 'نوفمبر 2026',
    location: 'Dublin, Ireland',
    locationAr: 'دبلن، إيرلندا',
    category: 'Convention Centre',
    categoryAr: 'مركز المؤتمرات',
    title: 'Annual General Meeting — Dublin',
    titleAr: 'الاجتماع العام السنوي — دبلن',
    summary: 'The SDI Executive Committee convenes members at the Convention Centre Dublin for institutional reviews, constitutional amendments, and election of the new secretariat.',
    summaryAr: 'تدعو اللجنة التنفيذية لرابطة الأطباء السودانيين في إيرلندا أعضاءها للانعقاد في مركز المؤتمرات بدبلن لمراجعة التقرير الإداري، تعديل اللائحة، وانتخاب السكرتارية الجديدة.',
    details: 'The 2026 Annual General Meeting marks a historic expansion of the Sudanese Doctors in Ireland. Key agenda items include the ratification of our revised constitution, presentation of the audited financial statements, expansion of the welfare emergency fund, and strategic planning for cross-border medical missions in Sudan.',
    detailsAr: 'يمثل الاجتماع السنوي لعام 2026 محطة محورية في مسيرة الرابطة. تشمل أجندة الأعمال إقرار الدستور المعدل، عرض القوائم المالية المدققة، توسعة صندوق دعم الطوارئ، والتخطيط الاستراتيجي للقوافل الطبية الإنسانية والاستشارات التخصصية للسودان.',
    actionText: 'Read Brief',
    actionTextAr: 'قراءة البيان'
  },
  {
    id: 'mentorship-2026',
    date: 'Cohort IV',
    dateAr: 'الدفعة الرابعة',
    location: 'National Initiative',
    locationAr: 'مبادرة وطنية شاملة',
    category: 'Applications Active',
    categoryAr: 'باب التقديم مفتوح',
    title: 'New Mentorship Programme Opens',
    titleAr: 'افتتاح برنامج الإرشاد والتوجيه المهني',
    summary: 'Pairing junior trainees and recently relocated Sudanese doctors with experienced HSE medical consultants for IMC specialist registration and career progression counseling.',
    summaryAr: 'ربط الأطباء المتدربين والوافدين حديثاً باستشاريين ذوي خبرة واسعة في المنظومة الصحية الإيرلندية لدعم التسجيل التخصصي والترقي المهني.',
    details: 'This flagship initiative has successfully guided over 320 Sudanese physicians into specialized training schemes (BST/HST) across Ireland. Mentees receive tailored CV guidance, mock interview preparation, publication mentorship, and direct navigation through Irish Medical Council compliance.',
    detailsAr: 'أثبت البرنامج نجاحه في مساعدة أكثر من 320 طبيباً في الالتحاق بالبرامج التدريبية المعتمدة (BST/HST) في إيرلندا. يحصل المستفيد على جلسات مراجعة السيرة الذاتية، مقابلات تجريبية، إرشاد في النشر العلمي، وتيسير متطلبات المجلس الطبي الإيرلندي.',
    actionText: 'Apply as Mentee',
    actionTextAr: 'التقديم كمتدرب'
  },
  {
    id: 'cpd-vault-2026',
    date: 'Regulatory Notice',
    dateAr: 'إشعار تنظيمي رسمي',
    location: 'IMC HSE',
    locationAr: 'المجلس الطبي ومؤسسة HSE',
    category: 'Instant Export',
    categoryAr: 'تصدير فوري معتمد',
    title: 'CPD Points Update & Digital Vault',
    titleAr: 'تحديث سجل نقاط التطوير المهني والشهادات الرقمية',
    summary: 'SDI members can now automatically export cryptographically signed CPD attendance transcripts directly formatted for annual Irish Medical Council professional competence audits.',
    summaryAr: 'يمكن لأعضاء الرابطة الآن تصدير كشوفات حضور دورات التطوير المهني الموقعة رقمياً والمعتمدة مباشرة لتدقيق الكفاءة المهنية السنوي لدى المجلس الطبي الإيرلندي.',
    details: 'Through our integration with professional competence tracking guidelines, all courses, peer review discussions, and clinical audits attended through SDI generate tamper-proof cryptographic certificates with verifiable hash keys matching IMC audit schemas.',
    detailsAr: 'عبر منصتنا الرقمية، تسجل كافة الساعات المعتمدة وحلقات النقاش السريري بنظام تشفيري موثوق، مما يتيح إصدار شهادات قابلة للتحقق الفوري تتوافق تماماً مع متطلبات تدقيق الكفاءة المهنية الإلزامية للمجلس الطبي.',
    actionText: 'Access Vault',
    actionTextAr: 'دخول السجل'
  }
];
