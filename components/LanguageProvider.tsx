"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
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

const interfaceTranslations: Partial<Record<AppLocale, Record<string,string>>> = {
  es: {
    "Operations center":"Centro de operaciones","Open admin navigation":"Abrir navegación administrativa","Close admin navigation":"Cerrar navegación administrativa","Admin navigation":"Navegación administrativa","Operations admin":"Administrador de operaciones","Sign out":"Cerrar sesión","Search":"Buscar","Notifications":"Notificaciones","Multi-branding":"Gestión de marcas","E-currency methods":"Métodos de moneda electrónica","Transfer errors":"Errores de transferencias","Statement onboarding":"Carga de extractos","External transfer approvals":"Aprobaciones de transferencias externas","Customer":"Cliente","Transfer mode":"Modo de transferencia","Preferred stop code":"Código de bloqueo preferido","Save transfer mode":"Guardar modo","Generate code to send":"Generar código para enviar","Regenerate code":"Regenerar código","Required operation note":"Nota operativa obligatoria","Customer conversations":"Conversaciones de clientes","customers":"clientes","waiting":"en espera","No messages yet":"Aún no hay mensajes","New":"Nuevo","Needs reply":"Requiere respuesta","Closed":"Cerrado","Open":"Abierto","Select a customer":"Seleccione un cliente","Choose a customer conversation from the inbox":"Elija una conversación de la bandeja","Select a customer to open their conversation":"Seleccione un cliente para abrir la conversación","Reply to customer…":"Responder al cliente…","Select a customer first":"Seleccione primero un cliente","Live support":"Asistencia en vivo","Online":"En línea","Sending":"Enviando","Send":"Enviar","Live chat message":"Mensaje de chat","Multi-brand management":"Gestión de múltiples marcas","New brand":"Nueva marca","Save brand profile":"Guardar perfil de marca","Brand profiles":"Perfiles de marca","Edit":"Editar","Activate":"Activar","ACTIVE":"ACTIVO","INACTIVE":"INACTIVO","Create profile":"Crear perfil","Refresh":"Actualizar"
  },
  fr: {
    "Operations center":"Centre des opérations","Open admin navigation":"Ouvrir la navigation d’administration","Close admin navigation":"Fermer la navigation d’administration","Admin navigation":"Navigation d’administration","Operations admin":"Administrateur des opérations","Sign out":"Déconnexion","Search":"Rechercher","Notifications":"Notifications","Multi-branding":"Gestion multimarque","External transfer approvals":"Approbations des virements externes","Customer":"Client","Transfer mode":"Mode de virement","Preferred stop code":"Code de blocage préféré","Save transfer mode":"Enregistrer le mode","Generate code to send":"Générer le code à envoyer","Regenerate code":"Régénérer le code","Required operation note":"Note opérationnelle obligatoire","Customer conversations":"Conversations clients","customers":"clients","waiting":"en attente","No messages yet":"Aucun message","New":"Nouveau","Needs reply":"Réponse requise","Closed":"Fermé","Open":"Ouvert","Select a customer":"Sélectionnez un client","Choose a customer conversation from the inbox":"Choisissez une conversation dans la boîte de réception","Select a customer to open their conversation":"Sélectionnez un client pour ouvrir la conversation","Reply to customer…":"Répondre au client…","Select a customer first":"Sélectionnez d’abord un client","Live support":"Assistance en direct","Online":"En ligne","Sending":"Envoi","Send":"Envoyer","Live chat message":"Message du chat","Multi-brand management":"Gestion multimarque","New brand":"Nouvelle marque","Save brand profile":"Enregistrer le profil de marque","Brand profiles":"Profils de marque","Edit":"Modifier","Activate":"Activer","ACTIVE":"ACTIF","INACTIVE":"INACTIF","Create profile":"Créer un profil","Refresh":"Actualiser"
  },
  de: {
    "Operations center":"Betriebszentrale","Open admin navigation":"Admin-Navigation öffnen","Close admin navigation":"Admin-Navigation schließen","Admin navigation":"Admin-Navigation","Operations admin":"Betriebsadministrator","Sign out":"Abmelden","Search":"Suchen","Notifications":"Benachrichtigungen","Multi-branding":"Mehrmarkenverwaltung","External transfer approvals":"Freigaben externer Überweisungen","Customer":"Kunde","Transfer mode":"Überweisungsmodus","Preferred stop code":"Bevorzugter Sperrcode","Save transfer mode":"Modus speichern","Generate code to send":"Code zum Senden erzeugen","Regenerate code":"Code neu erzeugen","Required operation note":"Erforderliche Betriebsnotiz","Customer conversations":"Kundengespräche","customers":"Kunden","waiting":"wartend","No messages yet":"Noch keine Nachrichten","New":"Neu","Needs reply":"Antwort erforderlich","Closed":"Geschlossen","Open":"Offen","Select a customer":"Kunden auswählen","Reply to customer…":"Dem Kunden antworten…","Select a customer first":"Zuerst Kunden auswählen","Live support":"Live-Support","Online":"Online","Sending":"Wird gesendet","Send":"Senden","Live chat message":"Live-Chat-Nachricht","Multi-brand management":"Mehrmarkenverwaltung","New brand":"Neue Marke","Save brand profile":"Markenprofil speichern","Brand profiles":"Markenprofile","Edit":"Bearbeiten","Activate":"Aktivieren","ACTIVE":"AKTIV","INACTIVE":"INAKTIV","Create profile":"Profil erstellen","Refresh":"Aktualisieren"
  },
  pt: {
    "Operations center":"Central de operações","Open admin navigation":"Abrir navegação administrativa","Close admin navigation":"Fechar navegação administrativa","Admin navigation":"Navegação administrativa","Operations admin":"Administrador de operações","Sign out":"Sair","Search":"Pesquisar","Notifications":"Notificações","Multi-branding":"Gestão de marcas","External transfer approvals":"Aprovações de transferências externas","Customer":"Cliente","Transfer mode":"Modo de transferência","Preferred stop code":"Código de bloqueio preferido","Save transfer mode":"Salvar modo","Generate code to send":"Gerar código para enviar","Regenerate code":"Gerar novo código","Required operation note":"Nota operacional obrigatória","Customer conversations":"Conversas de clientes","customers":"clientes","waiting":"aguardando","No messages yet":"Ainda não há mensagens","New":"Novo","Needs reply":"Precisa de resposta","Closed":"Fechado","Open":"Aberto","Select a customer":"Selecione um cliente","Reply to customer…":"Responder ao cliente…","Select a customer first":"Selecione um cliente primeiro","Live support":"Suporte ao vivo","Online":"Online","Sending":"Enviando","Send":"Enviar","Live chat message":"Mensagem de chat","Multi-brand management":"Gestão de múltiplas marcas","New brand":"Nova marca","Save brand profile":"Salvar perfil da marca","Brand profiles":"Perfis de marca","Edit":"Editar","Activate":"Ativar","ACTIVE":"ATIVO","INACTIVE":"INATIVO","Create profile":"Criar perfil","Refresh":"Atualizar"
  },
  ar: {
    "Operations center":"مركز العمليات","Open admin navigation":"فتح قائمة الإدارة","Close admin navigation":"إغلاق قائمة الإدارة","Admin navigation":"قائمة الإدارة","Operations admin":"مسؤول العمليات","Sign out":"تسجيل الخروج","Search":"بحث","Notifications":"الإشعارات","Multi-branding":"إدارة العلامات التجارية","External transfer approvals":"موافقات التحويلات الخارجية","Customer":"العميل","Transfer mode":"وضع التحويل","Preferred stop code":"رمز الإيقاف المفضل","Save transfer mode":"حفظ الوضع","Generate code to send":"إنشاء رمز للإرسال","Regenerate code":"إعادة إنشاء الرمز","Required operation note":"ملاحظة تشغيلية مطلوبة","Customer conversations":"محادثات العملاء","customers":"عملاء","waiting":"بانتظار الرد","No messages yet":"لا توجد رسائل بعد","New":"جديد","Needs reply":"يحتاج إلى رد","Closed":"مغلق","Open":"مفتوح","Select a customer":"اختر عميلاً","Reply to customer…":"الرد على العميل…","Select a customer first":"اختر عميلاً أولاً","Live support":"الدعم المباشر","Online":"متصل","Sending":"جارٍ الإرسال","Send":"إرسال","Live chat message":"رسالة الدردشة","Multi-brand management":"إدارة العلامات المتعددة","New brand":"علامة جديدة","Save brand profile":"حفظ ملف العلامة","Brand profiles":"ملفات العلامات","Edit":"تعديل","Activate":"تفعيل","ACTIVE":"نشط","INACTIVE":"غير نشط","Create profile":"إنشاء ملف","Refresh":"تحديث"
  },
  zh: {
    "Operations center":"运营中心","Open admin navigation":"打开管理导航","Close admin navigation":"关闭管理导航","Admin navigation":"管理导航","Operations admin":"运营管理员","Sign out":"退出登录","Search":"搜索","Notifications":"通知","Multi-branding":"多品牌管理","External transfer approvals":"外部转账审批","Customer":"客户","Transfer mode":"转账模式","Preferred stop code":"首选暂停代码","Save transfer mode":"保存模式","Generate code to send":"生成发送代码","Regenerate code":"重新生成代码","Required operation note":"必填操作说明","Customer conversations":"客户会话","customers":"位客户","waiting":"等待回复","No messages yet":"暂无消息","New":"新会话","Needs reply":"需要回复","Closed":"已关闭","Open":"已开启","Select a customer":"选择客户","Reply to customer…":"回复客户…","Select a customer first":"请先选择客户","Live support":"在线客服","Online":"在线","Sending":"正在发送","Send":"发送","Live chat message":"在线聊天消息","Multi-brand management":"多品牌管理","New brand":"新品牌","Save brand profile":"保存品牌资料","Brand profiles":"品牌资料","Edit":"编辑","Activate":"启用","ACTIVE":"启用","INACTIVE":"停用","Create profile":"创建资料","Refresh":"刷新"
  }
};

for (const code of Object.keys(interfaceTranslations) as AppLocale[]) {
  translations[code] = {...translations[code],...interfaceTranslations[code]};
}

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
  const textSources=useRef(new WeakMap<Text,{source:string;rendered:string}>());
  const attributeSources=useRef(new WeakMap<Element,Map<string,{source:string;rendered:string}>>());
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

  useEffect(()=>{
    const dictionary=translations[locale]??{};
    const skipped=(element:Element|null)=>Boolean(element?.closest(".language-switcher,script,style,code,pre,[data-no-translate]"));
    const translateText=(node:Text)=>{
      if(skipped(node.parentElement))return;
      const current=node.nodeValue??"";
      let record=textSources.current.get(node);
      if(!record||current!==record.rendered){record={source:current,rendered:current};textSources.current.set(node,record);}
      const trimmed=record.source.trim();
      const translated=locale==="en"?trimmed:dictionary[trimmed];
      const next=translated?record.source.replace(trimmed,translated):record.source;
      record.rendered=next;
      if(current!==next)node.nodeValue=next;
    };
    const translateAttributes=(element:Element)=>{
      if(skipped(element))return;
      let records=attributeSources.current.get(element);
      if(!records){records=new Map();attributeSources.current.set(element,records);}
      for(const attribute of ["placeholder","title","aria-label"]){
        const current=element.getAttribute(attribute);
        if(!current)continue;
        let record=records.get(attribute);
        if(!record||current!==record.rendered){record={source:current,rendered:current};records.set(attribute,record);}
        const translated=locale==="en"?record.source:dictionary[record.source]??record.source;
        record.rendered=translated;
        if(current!==translated)element.setAttribute(attribute,translated);
      }
    };
    const applyTranslations=(root:Node)=>{
      if(root.nodeType===Node.TEXT_NODE)translateText(root as Text);
      if(root.nodeType===Node.ELEMENT_NODE)translateAttributes(root as Element);
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
      let node=walker.nextNode();
      while(node){if(node.nodeType===Node.TEXT_NODE)translateText(node as Text);else translateAttributes(node as Element);node=walker.nextNode();}
    };
    applyTranslations(document.body);
    let frame=0;
    const observer=new MutationObserver((mutations)=>{
      window.cancelAnimationFrame(frame);
      frame=window.requestAnimationFrame(()=>mutations.forEach((mutation)=>applyTranslations(mutation.target)));
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["placeholder","title","aria-label"]});
    return()=>{observer.disconnect();window.cancelAnimationFrame(frame);};
  },[locale]);

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
    t: (text) => {
      const trimmed=text.trim();
      const translated=translations[locale]?.[trimmed];
      return translated?text.replace(trimmed,translated):text;
    },
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
