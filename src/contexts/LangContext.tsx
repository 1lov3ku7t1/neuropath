import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "ru";

const translations = {
  en: {
    // Landing
    neuropath: "neurotrack",
    menu: "Menu",
    heroLine1: "Advancing the",
    heroLine2: "spirit",
    heroLine3: "of neural AI",
    startJourney: "Start Your Journey",
    symptomTracking: "Symptom Tracking",
    aiAdvisor: "AI Advisor",
    treatmentGuide: "Treatment Guide",
    ourMission: "OUR MISSION",
    missionQuote: "We",
    missionImagined: "imagined",
    missionMiddle: "a world where no patient faces this",
    missionAlone: "alone.",
    drName: "DR. SARAH CHEN",
    joinEcosystem: "Join our ecosystem",
    joinDesc: "Connecting patients, caregivers and neurologists in one unified platform.",
    aiProcessing: "AI Processing",
    aiProcessingDesc: "Real-time neural analysis powered by advanced machine learning models.",
    careArchive: "Care Archive",
    careArchiveDesc: "Comprehensive treatment history and care documentation at your fingertips.",
    neuralMonitoring: "Advanced Neural Monitoring",
    neuralMonitoringDesc: "Tracking tremors and gait patterns with clinical-grade precision.",

    // Auth
    welcomeBack: "Welcome back",
    createAccount: "Create account",
    signInDesc: "Sign in to your NeuroPath account",
    signUpDesc: "Start your neural health journey",
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signUp: "Sign up",
    createAccountBtn: "Create Account",
    pleaseWait: "Please wait...",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    continueGuest: "Continue as Guest",
    or: "or",

    // Dashboard
    assessmentHub: "Assessment",
    hub: "Hub",
    welcomeBackUser: "Welcome back,",
    guestMessage: "You're browsing as a guest — results won't be saved",
    takeTest: "Take a Test",
    recentResults: "Recent Results",
    noResults: "No test results yet. Take your first test above!",
    signOut: "Sign Out",
    exit: "Exit",
    signUpToSave: "Sign up to save results",
    risk: "risk",
    startTest: "Start test",

    // Tests
    spiralDrawing: "Spiral Drawing",
    spiralDesc: "Draw a spiral to assess tremor",
    voiceAnalysis: "Voice Analysis",
    voiceDesc: "Record your voice for analysis",
    symptoms: "Symptoms",
    symptomsDesc: "Answer screening questions",
    fingerTapping: "Finger Tapping",
    tappingDesc: "Tap to measure motor speed",
    back: "Back",
    clear: "Clear",
    analyzeDrawing: "Analyze Drawing",
    analyzing: "Analyzing...",
    drawMore: "Draw more",
    drawMoreDesc: "Please draw a more complete spiral",
    aiAnalysis: "AI Analysis",
    recommendations: "Recommendations",
    disclaimer: "⚠ This is a screening tool only. Please consult a neurologist for diagnosis.",

    // Spiral
    spiralTitle: "Spiral",
    spiralSubtitle: "Drawing",
    spiralTestLabel: "Test",
    spiralInstructions: "Draw a spiral starting from the center. The AI will analyze your motor control patterns.",

    // Voice
    voiceTitle: "Voice",
    voiceSubtitle: "Analysis",
    voiceInstructions: "Record yourself speaking for at least 10 seconds. Read aloud or describe your day.",
    tapToRecord: "Tap to start recording",
    recording: "Recording...",
    recorded: "Recorded",
    analyzeVoice: "Analyze Voice",
    micDenied: "Microphone access denied",
    micDeniedDesc: "Please allow microphone access to use this test.",

    // Symptoms
    symptomTitle: "Symptom",
    symptomSubtitle: "Questionnaire",
    symptomInstructions: "Answer each question based on your experience over the past month.",
    analyzeResponses: "Analyze Responses",
    never: "Never",
    rarely: "Rarely",
    sometimes: "Sometimes",
    often: "Often",
    always: "Always",

    // Symptom questions
    q_tremor: "Do you experience trembling or shaking in your hands, arms, legs, jaw, or head while at rest?",
    q_slowness: "Have you noticed slowness in your everyday movements (e.g., buttoning a shirt, eating)?",
    q_stiffness: "Do you experience stiffness or rigidity in your limbs or trunk?",
    q_balance: "Do you have difficulty with balance or have you had unexplained falls?",
    q_handwriting: "Has your handwriting become smaller or more cramped over time?",
    q_smell: "Have you noticed a reduced sense of smell?",
    q_sleep: "Do you act out dreams during sleep (kicking, punching, or falling out of bed)?",
    q_constipation: "Do you experience frequent constipation not explained by diet or medication?",
    q_voice: "Have others told you your voice has become softer or more monotone?",
    q_facial: "Have people commented that you look serious, depressed, or have a 'masked' face even when not in a bad mood?",
    q_dizziness: "Do you feel dizzy or faint when standing up from sitting or lying down?",
    q_posture: "Do you notice yourself stooping, leaning, or slouching when you stand?",

    // Tapping
    tappingTitle: "Finger",
    tappingSubtitle: "Tapping",
    tappingTestLabel: "Test",
    tappingInstructions: "Tap the button as fast and steadily as you can for 15 seconds.",
    taps: "taps",
    tapsIn: "taps in",
    seconds: "seconds",
    tapsSec: "taps/sec",
    tryAgain: "Try Again",
    analyze: "Analyze",
    notEnoughTaps: "Not enough taps",
    notEnoughTapsDesc: "Please tap more during the test",

    // Menu
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    darkGlass: "Dark Glass",
    whitePurple: "White & Purple",
    oceanBlue: "Ocean Blue",
    roseGold: "Rose Gold",
    forestGreen: "Forest Green",
    english: "English",
    russian: "Русский",
    close: "Close",
  },
  ru: {
    neuropath: "нейропуть",
    menu: "Меню",
    heroLine1: "Продвигая",
    heroLine2: "дух",
    heroLine3: "нейронного ИИ",
    startJourney: "Начать путь",
    symptomTracking: "Отслеживание",
    aiAdvisor: "ИИ-Консультант",
    treatmentGuide: "Руководство",
    ourMission: "НАША МИССИЯ",
    missionQuote: "Мы",
    missionImagined: "представили",
    missionMiddle: "мир, где ни один пациент не сталкивается с этим",
    missionAlone: "в одиночку.",
    drName: "Д-Р САРА ЧЕН",
    joinEcosystem: "Присоединяйтесь",
    joinDesc: "Объединяем пациентов, опекунов и неврологов на единой платформе.",
    aiProcessing: "ИИ-Обработка",
    aiProcessingDesc: "Нейронный анализ в реальном времени на основе машинного обучения.",
    careArchive: "Архив лечения",
    careArchiveDesc: "Полная история лечения и документация под рукой.",
    neuralMonitoring: "Нейромониторинг",
    neuralMonitoringDesc: "Отслеживание тремора и походки с клинической точностью.",

    welcomeBack: "С возвращением",
    createAccount: "Создать аккаунт",
    signInDesc: "Войдите в ваш аккаунт NeuroPath",
    signUpDesc: "Начните путь к здоровью",
    fullName: "Полное имя",
    email: "Эл. почта",
    password: "Пароль",
    signIn: "Войти",
    signUp: "Регистрация",
    createAccountBtn: "Создать аккаунт",
    pleaseWait: "Подождите...",
    noAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    continueGuest: "Продолжить как гость",
    or: "или",

    assessmentHub: "Центр",
    hub: "Оценки",
    welcomeBackUser: "С возвращением,",
    guestMessage: "Вы гость — результаты не сохраняются",
    takeTest: "Пройти тест",
    recentResults: "Последние результаты",
    noResults: "Результатов пока нет. Пройдите первый тест!",
    signOut: "Выйти",
    exit: "Выход",
    signUpToSave: "Зарегистрируйтесь для сохранения",
    risk: "риск",
    startTest: "Начать тест",

    spiralDrawing: "Рисование спирали",
    spiralDesc: "Нарисуйте спираль для оценки тремора",
    voiceAnalysis: "Анализ голоса",
    voiceDesc: "Запишите голос для анализа",
    symptoms: "Симптомы",
    symptomsDesc: "Ответьте на вопросы",
    fingerTapping: "Постукивание",
    tappingDesc: "Постукивайте для оценки моторики",
    back: "Назад",
    clear: "Очистить",
    analyzeDrawing: "Анализировать",
    analyzing: "Анализ...",
    drawMore: "Нарисуйте больше",
    drawMoreDesc: "Нарисуйте более полную спираль",
    aiAnalysis: "Анализ ИИ",
    recommendations: "Рекомендации",
    disclaimer: "⚠ Это инструмент скрининга. Проконсультируйтесь с неврологом.",

    spiralTitle: "Рисование",
    spiralSubtitle: "Спирали",
    spiralTestLabel: "Тест",
    spiralInstructions: "Нарисуйте спираль из центра. ИИ проанализирует ваш моторный контроль.",

    voiceTitle: "Анализ",
    voiceSubtitle: "Голоса",
    voiceInstructions: "Запишите речь минимум 10 секунд. Читайте вслух или расскажите о дне.",
    tapToRecord: "Нажмите для записи",
    recording: "Запись...",
    recorded: "Записано",
    analyzeVoice: "Анализ голоса",
    micDenied: "Доступ к микрофону запрещён",
    micDeniedDesc: "Разрешите доступ к микрофону.",

    symptomTitle: "Опросник",
    symptomSubtitle: "Симптомов",
    symptomInstructions: "Ответьте на вопросы по опыту последнего месяца.",
    analyzeResponses: "Анализировать ответы",
    never: "Никогда",
    rarely: "Редко",
    sometimes: "Иногда",
    often: "Часто",
    always: "Всегда",

    q_tremor: "Вы испытываете дрожь в руках, ногах, челюсти или голове в покое?",
    q_slowness: "Замечаете ли вы замедление повседневных движений (застёгивание, еда)?",
    q_stiffness: "Испытываете ли скованность или ригидность в конечностях?",
    q_balance: "Есть ли трудности с равновесием или необъяснимые падения?",
    q_handwriting: "Стал ли почерк мельче или теснее со временем?",
    q_smell: "Заметили ли снижение обоняния?",
    q_sleep: "Разыгрываете ли сны во сне (пинки, удары, падения с кровати)?",
    q_constipation: "Испытываете ли частые запоры, не связанные с диетой?",
    q_voice: "Говорили ли вам, что голос стал тише или монотоннее?",
    q_facial: "Замечали ли, что выглядите серьёзно или подавленно без причины?",
    q_dizziness: "Кружится ли голова при вставании?",
    q_posture: "Замечаете ли сутулость при стоянии?",

    tappingTitle: "Тест",
    tappingSubtitle: "Постукивания",
    tappingTestLabel: "",
    tappingInstructions: "Постукивайте по кнопке быстро и ритмично 15 секунд.",
    taps: "нажатий",
    tapsIn: "нажатий за",
    seconds: "секунд",
    tapsSec: "нажатий/сек",
    tryAgain: "Ещё раз",
    analyze: "Анализ",
    notEnoughTaps: "Мало нажатий",
    notEnoughTapsDesc: "Постукивайте чаще во время теста",

    settings: "Настройки",
    language: "Язык",
    theme: "Тема",
    darkGlass: "Тёмное стекло",
    whitePurple: "Белая и фиолетовая",
    oceanBlue: "Океанская синева",
    roseGold: "Розовое золото",
    forestGreen: "Лесная зелень",
    english: "English",
    russian: "Русский",
    close: "Закрыть",
  },
};

type Translations = Record<keyof typeof translations.en, string>;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("neuropath-lang");
    return (saved === "ru" ? "ru" : "en") as Lang;
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("neuropath-lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
