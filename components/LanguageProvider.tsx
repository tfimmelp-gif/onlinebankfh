"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Globe2 } from "lucide-react";

export type AppLocale = "en" | "es" | "fr" | "de" | "pt" | "ar" | "zh";
type LanguagePreference = "auto" | AppLocale;

const localeNames: Record<AppLocale, string> = {
  en: "English", es: "Español", fr: "Français", de: "Deutsch",
  pt: "Português", ar: "العربية", zh: "中文",
};

const localeTags: Record<AppLocale, string> = {
  en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE",
  pt: "pt-BR", ar: "ar", zh: "zh-CN",
};

const translations: Partial<Record<AppLocale, Record<string, string>>> = {
  es: {
    "BANKING FOR EVERY CHAPTER": "BANCA PARA CADA ETAPA", "Build today. Plan for what comes next.": "Construya hoy. Planifique lo que viene.", "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.": "Cuentas diarias, ahorros flexibles y herramientas de crédito en una experiencia digital clara.", "BUILT FOR BUSINESS OWNERS": "CREADO PARA EMPRESARIOS", "Your ambition deserves a bank that keeps pace.": "Su ambición merece un banco que siga su ritmo.", "Separate business finances, move funds, and stay close to cash flow from one dependable workspace.": "Separe las finanzas de su empresa, mueva fondos y controle el flujo de caja desde un solo espacio.", "BORROW WITH CLARITY": "FINANCIACIÓN CON CLARIDAD", "Turn the next milestone into a clear plan.": "Convierta su próximo objetivo en un plan claro.", "Compare loan terms, understand monthly payments, and follow every step from application to payoff.": "Compare condiciones, comprenda las cuotas mensuales y siga cada etapa del préstamo.",
    "Automatic": "Automático", "Language": "Idioma", "Personal": "Personal", "Banking": "Banca", "Borrow": "Préstamos", "Business": "Empresas", "Security": "Seguridad", "Help center": "Centro de ayuda", "Sign in": "Iniciar sesión", "Open an account": "Abrir una cuenta", "Customer sign in": "Acceso de clientes", "Personal banking": "Banca personal", "Business banking": "Banca empresarial", "Borrowing": "Financiación",
    "Overview": "Resumen", "Profile & KYC": "Perfil e identidad", "Accounts": "Cuentas", "Deposit funds": "Depositar fondos", "Virtual cards": "Tarjetas virtuales", "Transfers": "Transferencias", "Bill pay": "Pago de facturas", "Beneficiaries": "Beneficiarios", "Loans": "Préstamos", "Statements": "Extractos", "Support": "Soporte", "Operations": "Operaciones", "Customers": "Clientes", "KYC queue": "Cola de verificación", "KYC documents": "Documentos de identidad", "Customer activity": "Actividad de clientes", "Card approvals": "Aprobaciones de tarjetas", "Transactions": "Transacciones", "Deposits": "Depósitos", "Withdrawals": "Retiros", "Ledger": "Libro mayor", "Stop codes": "Códigos de bloqueo", "Audit log": "Registro de auditoría", "Website management": "Gestión del sitio", "Processing fees": "Comisiones", "System": "Sistema", "Log out": "Cerrar sesión", "Profile & identity": "Perfil e identidad", "Security center": "Centro de seguridad",
    "Welcome back": "Bienvenido de nuevo", "Staff sign in": "Acceso del personal", "DIGITAL BANKING": "BANCA DIGITAL", "Secure access": "Acceso seguro", "Account controls": "Controles de cuenta", "Audited activity": "Actividad auditada", "EMAIL ADDRESS": "CORREO ELECTRÓNICO", "PASSWORD": "CONTRASEÑA", "Remember me for 30 days": "Recordarme durante 30 días", "Forgot password?": "¿Olvidó su contraseña?", "Sign in securely": "Iniciar sesión de forma segura", "STAFF EMAIL": "CORREO DEL PERSONAL", "6-DIGIT MFA CODE": "CÓDIGO MFA DE 6 DÍGITOS", "Enter operations console": "Entrar a la consola de operaciones",
    "Checking": "Cuenta corriente", "Savings": "Ahorros", "Home lending": "Préstamos hipotecarios", "What can we help you with?": "¿En qué podemos ayudarle?", "Explore products": "Explorar productos", "Email support": "Soporte por correo", "Message support": "Enviar mensaje", "Sign in help": "Ayuda de acceso", "Get started": "Comenzar", "Online banking": "Banca en línea", "Compliance disclosure": "Información de cumplimiento", "All rights reserved.": "Todos los derechos reservados.",
  },
  fr: {
    "BANKING FOR EVERY CHAPTER": "LA BANQUE À CHAQUE ÉTAPE", "Build today. Plan for what comes next.": "Construisez aujourd’hui. Préparez la suite.", "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.": "Comptes courants, épargne flexible et outils de crédit réunis dans une expérience numérique claire.", "BUILT FOR BUSINESS OWNERS": "PENSÉ POUR LES ENTREPRENEURS", "Your ambition deserves a bank that keeps pace.": "Votre ambition mérite une banque qui suit votre rythme.", "Separate business finances, move funds, and stay close to cash flow from one dependable workspace.": "Séparez les finances de l’entreprise, transférez des fonds et suivez la trésorerie depuis un seul espace.", "BORROW WITH CLARITY": "EMPRUNTEZ EN TOUTE CLARTÉ", "Turn the next milestone into a clear plan.": "Transformez votre prochain projet en plan clair.", "Compare loan terms, understand monthly payments, and follow every step from application to payoff.": "Comparez les conditions, comprenez les mensualités et suivez chaque étape du prêt.",
    "Automatic": "Automatique", "Language": "Langue", "Personal": "Particuliers", "Banking": "Banque", "Borrow": "Emprunter", "Business": "Entreprises", "Security": "Sécurité", "Help center": "Centre d’aide", "Sign in": "Se connecter", "Open an account": "Ouvrir un compte", "Customer sign in": "Connexion client", "Personal banking": "Banque des particuliers", "Business banking": "Banque d’entreprise", "Borrowing": "Crédit",
    "Overview": "Vue d’ensemble", "Profile & KYC": "Profil et identité", "Accounts": "Comptes", "Deposit funds": "Déposer des fonds", "Virtual cards": "Cartes virtuelles", "Transfers": "Virements", "Bill pay": "Paiement de factures", "Beneficiaries": "Bénéficiaires", "Loans": "Prêts", "Statements": "Relevés", "Support": "Assistance", "Operations": "Opérations", "Customers": "Clients", "KYC queue": "File de vérification", "KYC documents": "Documents d’identité", "Customer activity": "Activité client", "Card approvals": "Approbations de cartes", "Transactions": "Transactions", "Deposits": "Dépôts", "Withdrawals": "Retraits", "Ledger": "Grand livre", "Stop codes": "Codes de blocage", "Audit log": "Journal d’audit", "Website management": "Gestion du site", "Processing fees": "Frais de traitement", "System": "Système", "Log out": "Se déconnecter", "Profile & identity": "Profil et identité", "Security center": "Centre de sécurité",
    "Welcome back": "Bon retour", "Staff sign in": "Connexion du personnel", "DIGITAL BANKING": "BANQUE NUMÉRIQUE", "Secure access": "Accès sécurisé", "Account controls": "Contrôles du compte", "Audited activity": "Activité auditée", "EMAIL ADDRESS": "ADRESSE E-MAIL", "PASSWORD": "MOT DE PASSE", "Remember me for 30 days": "Se souvenir de moi pendant 30 jours", "Forgot password?": "Mot de passe oublié ?", "Sign in securely": "Se connecter en toute sécurité", "STAFF EMAIL": "E-MAIL DU PERSONNEL", "6-DIGIT MFA CODE": "CODE MFA À 6 CHIFFRES", "Enter operations console": "Accéder à la console des opérations",
    "Checking": "Compte courant", "Savings": "Épargne", "Home lending": "Prêt immobilier", "What can we help you with?": "Comment pouvons-nous vous aider ?", "Explore products": "Découvrir les produits", "Email support": "Assistance par e-mail", "Message support": "Contacter l’assistance", "Sign in help": "Aide à la connexion", "Get started": "Commencer", "Online banking": "Banque en ligne", "Compliance disclosure": "Informations de conformité", "All rights reserved.": "Tous droits réservés.",
  },
  de: {
    "BANKING FOR EVERY CHAPTER": "BANKING FÜR JEDE LEBENSPHASE", "Build today. Plan for what comes next.": "Heute aufbauen. Die Zukunft planen.", "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.": "Alltagskonten, flexibles Sparen und Kredite in einer übersichtlichen digitalen Anwendung.", "Your ambition deserves a bank that keeps pace.": "Ihre Ziele verdienen eine Bank, die Schritt hält.", "Turn the next milestone into a clear plan.": "Machen Sie den nächsten Meilenstein zu einem klaren Plan.",
    "Automatic": "Automatisch", "Language": "Sprache", "Personal": "Privatkunden", "Banking": "Banking", "Borrow": "Finanzierung", "Business": "Geschäftskunden", "Security": "Sicherheit", "Help center": "Hilfe-Center", "Sign in": "Anmelden", "Open an account": "Konto eröffnen", "Customer sign in": "Kundenanmeldung", "Personal banking": "Privatkundengeschäft", "Business banking": "Firmenkundengeschäft", "Borrowing": "Kredite",
    "Overview": "Übersicht", "Profile & KYC": "Profil und Identität", "Accounts": "Konten", "Deposit funds": "Geld einzahlen", "Virtual cards": "Virtuelle Karten", "Transfers": "Überweisungen", "Bill pay": "Rechnungen bezahlen", "Beneficiaries": "Empfänger", "Loans": "Kredite", "Statements": "Kontoauszüge", "Support": "Support", "Operations": "Betrieb", "Customers": "Kunden", "Transactions": "Transaktionen", "Deposits": "Einzahlungen", "Withdrawals": "Auszahlungen", "Ledger": "Hauptbuch", "Audit log": "Prüfprotokoll", "Website management": "Website-Verwaltung", "Processing fees": "Bearbeitungsgebühren", "System": "System", "Log out": "Abmelden", "Welcome back": "Willkommen zurück", "Staff sign in": "Mitarbeiteranmeldung", "EMAIL ADDRESS": "E-MAIL-ADRESSE", "PASSWORD": "PASSWORT", "Remember me for 30 days": "30 Tage angemeldet bleiben", "Forgot password?": "Passwort vergessen?", "Sign in securely": "Sicher anmelden", "Checking": "Girokonto", "Savings": "Sparkonto", "Get started": "Jetzt starten", "Online banking": "Online-Banking", "Compliance disclosure": "Compliance-Hinweis",
  },
  pt: {
    "BANKING FOR EVERY CHAPTER": "BANCO PARA CADA FASE", "Build today. Plan for what comes next.": "Construa hoje. Planeje o que vem depois.", "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.": "Contas do dia a dia, poupança flexível e crédito em uma experiência digital clara.", "Your ambition deserves a bank that keeps pace.": "Sua ambição merece um banco que acompanhe seu ritmo.", "Turn the next milestone into a clear plan.": "Transforme o próximo objetivo em um plano claro.",
    "Automatic": "Automático", "Language": "Idioma", "Personal": "Pessoal", "Banking": "Banco", "Borrow": "Crédito", "Business": "Empresas", "Security": "Segurança", "Help center": "Central de ajuda", "Sign in": "Entrar", "Open an account": "Abrir uma conta", "Customer sign in": "Acesso do cliente", "Personal banking": "Banco pessoal", "Business banking": "Banco empresarial", "Borrowing": "Empréstimos",
    "Overview": "Visão geral", "Profile & KYC": "Perfil e identidade", "Accounts": "Contas", "Deposit funds": "Depositar fundos", "Virtual cards": "Cartões virtuais", "Transfers": "Transferências", "Bill pay": "Pagar contas", "Beneficiaries": "Beneficiários", "Loans": "Empréstimos", "Statements": "Extratos", "Support": "Suporte", "Operations": "Operações", "Customers": "Clientes", "Transactions": "Transações", "Deposits": "Depósitos", "Withdrawals": "Saques", "Ledger": "Livro razão", "Audit log": "Registro de auditoria", "Website management": "Gerenciamento do site", "Processing fees": "Taxas de processamento", "System": "Sistema", "Log out": "Sair", "Welcome back": "Bem-vindo de volta", "Staff sign in": "Acesso da equipe", "EMAIL ADDRESS": "E-MAIL", "PASSWORD": "SENHA", "Remember me for 30 days": "Lembrar por 30 dias", "Forgot password?": "Esqueceu a senha?", "Sign in securely": "Entrar com segurança", "Checking": "Conta corrente", "Savings": "Poupança", "Get started": "Começar", "Online banking": "Banco online", "Compliance disclosure": "Aviso de conformidade",
  },
  ar: {
    "BANKING FOR EVERY CHAPTER": "خدمات مصرفية لكل مرحلة", "Build today. Plan for what comes next.": "ابنِ اليوم وخطط لما هو قادم.", "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.": "حسابات يومية وادخار مرن وأدوات تمويل في تجربة رقمية واضحة.", "Your ambition deserves a bank that keeps pace.": "طموحك يستحق بنكًا يواكبك.", "Turn the next milestone into a clear plan.": "حوّل هدفك القادم إلى خطة واضحة.",
    "Automatic": "تلقائي", "Language": "اللغة", "Personal": "الأفراد", "Banking": "الخدمات المصرفية", "Borrow": "التمويل", "Business": "الأعمال", "Security": "الأمان", "Help center": "مركز المساعدة", "Sign in": "تسجيل الدخول", "Open an account": "فتح حساب", "Customer sign in": "دخول العميل", "Personal banking": "الخدمات المصرفية للأفراد", "Business banking": "الخدمات المصرفية للأعمال", "Borrowing": "القروض",
    "Overview": "نظرة عامة", "Profile & KYC": "الملف والهوية", "Accounts": "الحسابات", "Deposit funds": "إيداع الأموال", "Virtual cards": "البطاقات الافتراضية", "Transfers": "التحويلات", "Bill pay": "دفع الفواتير", "Beneficiaries": "المستفيدون", "Loans": "القروض", "Statements": "كشوف الحساب", "Support": "الدعم", "Operations": "العمليات", "Customers": "العملاء", "Transactions": "المعاملات", "Deposits": "الإيداعات", "Withdrawals": "السحوبات", "Ledger": "دفتر الأستاذ", "Audit log": "سجل التدقيق", "Website management": "إدارة الموقع", "Processing fees": "رسوم المعالجة", "System": "النظام", "Log out": "تسجيل الخروج", "Welcome back": "مرحبًا بعودتك", "Staff sign in": "دخول الموظفين", "EMAIL ADDRESS": "البريد الإلكتروني", "PASSWORD": "كلمة المرور", "Remember me for 30 days": "تذكرني لمدة 30 يومًا", "Forgot password?": "نسيت كلمة المرور؟", "Sign in securely": "تسجيل الدخول بأمان", "Checking": "الحساب الجاري", "Savings": "التوفير", "Get started": "ابدأ", "Online banking": "الخدمات المصرفية عبر الإنترنت", "Compliance disclosure": "إفصاح الامتثال",
  },
  zh: {
    "BANKING FOR EVERY CHAPTER": "服务人生每个阶段", "Build today. Plan for what comes next.": "立足当下，规划未来。", "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.": "日常账户、灵活储蓄和信贷工具，尽在清晰的数字银行体验中。", "Your ambition deserves a bank that keeps pace.": "您的雄心值得一家与您同步的银行。", "Turn the next milestone into a clear plan.": "将下一个里程碑化为清晰计划。",
    "Automatic": "自动", "Language": "语言", "Personal": "个人", "Banking": "银行服务", "Borrow": "借贷", "Business": "企业", "Security": "安全", "Help center": "帮助中心", "Sign in": "登录", "Open an account": "开立账户", "Customer sign in": "客户登录", "Personal banking": "个人银行", "Business banking": "企业银行", "Borrowing": "贷款",
    "Overview": "概览", "Profile & KYC": "资料与身份", "Accounts": "账户", "Deposit funds": "存入资金", "Virtual cards": "虚拟卡", "Transfers": "转账", "Bill pay": "账单支付", "Beneficiaries": "收款人", "Loans": "贷款", "Statements": "对账单", "Support": "支持", "Operations": "运营", "Customers": "客户", "Transactions": "交易", "Deposits": "存款", "Withdrawals": "取款", "Ledger": "总账", "Audit log": "审计日志", "Website management": "网站管理", "Processing fees": "手续费", "System": "系统", "Log out": "退出", "Welcome back": "欢迎回来", "Staff sign in": "员工登录", "EMAIL ADDRESS": "电子邮箱", "PASSWORD": "密码", "Remember me for 30 days": "记住我30天", "Forgot password?": "忘记密码？", "Sign in securely": "安全登录", "Checking": "支票账户", "Savings": "储蓄账户", "Get started": "开始使用", "Online banking": "网上银行", "Compliance disclosure": "合规披露",
  },
};

function detectLocale(): AppLocale {
  if (typeof navigator === "undefined") return "en";
  for (const language of navigator.languages.length ? navigator.languages : [navigator.language]) {
    const candidate = language.toLowerCase().split("-")[0] as AppLocale;
    if (candidate in localeNames) return candidate;
  }
  return "en";
}

type LanguageContextValue = {
  locale: AppLocale;
  localeTag: string;
  preference: LanguagePreference;
  setPreference: (preference: LanguagePreference) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en", localeTag: "en-US", preference: "auto", setPreference: () => undefined, t: (text) => text,
});

export function useLanguage() { return useContext(LanguageContext); }

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<LanguagePreference>("auto");
  const [detectedLocale, setDetectedLocale] = useState<AppLocale>("en");
  const locale = preference === "auto" ? detectedLocale : preference;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDetectedLocale(detectLocale());
      const saved = window.localStorage.getItem("northstar-language") as LanguagePreference | null;
      if (saved === "auto" || saved && saved in localeNames) setPreferenceState(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = localeTags[locale];
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  function setPreference(next: LanguagePreference) {
    setPreferenceState(next);
    window.localStorage.setItem("northstar-language", next);
    document.cookie = `northstar_language=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    localeTag: localeTags[locale],
    preference,
    setPreference,
    t: (text) => translations[locale]?.[text] ?? text,
  }), [locale, preference]);

  return <LanguageContext.Provider value={value}>
    {children}
    <div className="language-switcher" title="Language">
      <Globe2 size={16} aria-hidden="true"/>
      <label htmlFor="site-language" className="sr-only">Language</label>
      <select id="site-language" value={preference} onChange={(event) => setPreference(event.target.value as LanguagePreference)} aria-label="Language">
        <option value="auto">{translations[locale]?.Automatic ?? "Automatic"} · {localeNames[detectedLocale]}</option>
        {(Object.keys(localeNames) as AppLocale[]).map((code) => <option key={code} value={code}>{localeNames[code]}</option>)}
      </select>
    </div>
  </LanguageContext.Provider>;
}
