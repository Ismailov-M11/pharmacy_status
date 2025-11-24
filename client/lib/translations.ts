export type Language = 'ru' | 'uz';

export const translations = {
  ru: {
    // Common
    save: 'Сохранено',
    error: 'Ошибка',
    logout: 'Выход',
    language: 'Язык',

    // Login Page
    login: 'Вход',
    password: 'Пароль',
    enterLogin: 'Введите логин',
    enterPassword: 'Введите пароль',
    loginButton: 'Войти',
    loginError: 'Ошибка входа. Проверьте логин и пароль.',
    invalidCredentials: 'Неверные учетные данные',

    // Table Headers
    number: '№',
    code: 'Код',
    pharmacyName: 'Название аптеки',
    address: 'Адрес',
    landmark: 'Ориентир',
    pharmacyPhone: 'Телефон аптеки',
    leadPhone: 'Телефон ответственного',
    leadStatus: 'Статус ответственного',
    contactPerson: 'Контактное лицо',
    brandedPacket: 'Фирменный пакет',
    training: 'Обучение',
    status: 'Статус',
    registrationDate: 'Дата регистрации',
    telegramBot: 'Telegram Bot',
    slug: 'Slug',
    stir: 'СТИР',
    additionalPhone: 'Дополнительный телефон',
    juridicalName: 'Юридическое название',
    juridicalAddress: 'Юридический адрес',
    bankName: 'Название банка',
    bankAccount: 'Банковский счет',
    mfo: 'МФО',
    active: 'Активна',
    inactive: 'Неактивна',
    allPharmacies: 'Все аптеки',

    // Status Values
    yes: 'ЕСТЬ',
    no: 'НЕТ',
    available: 'Доступно',
    unavailable: 'Недоступно',

    // Panel Titles
    agentPanel: 'Панель Агента',
    adminPanel: 'Панель Администратора',

    // Actions
    edit: 'Редактировать',
    save_action: 'Сохранить',
    cancel: 'Отменить',
    saved: 'Сохранено успешно',

    // Loading and Empty States
    loading: 'Загрузка...',
    noData: 'Нет данных',
    loadingPharmacies: 'Загрузка аптек...',

    // Filters
    filter: 'Фильтр',

    // Pharmacy Details Modal
    pharmacyDetails: 'Детали аптеки',
    details: 'Детали',
    comment: 'Комментарий',
    enterComment: 'Введите ваш комментарий...',
    commentRequired: 'Комментарий обязателен',
    history: 'История',
    noChanges: 'Нет изменений',
    by: 'От',
  },
  uz: {
    // Common
    save: 'Saqlandi',
    error: 'Xatolik',
    logout: 'Chiqish',
    language: 'Til',

    // Login Page
    login: 'Kirish',
    password: 'Parol',
    enterLogin: 'Loginingizni kiriting',
    enterPassword: 'Parolingizni kiriting',
    loginButton: 'Kirish',
    loginError: 'Kirish xatosi. Login va parolni tekshiring.',
    invalidCredentials: 'Noto\'g\'ri hisob ma\'lumotlari',

    // Table Headers
    number: '№',
    code: 'Kod',
    pharmacyName: 'Dorixona nomi',
    address: 'Manzil',
    landmark: "Mo'ljal",
    pharmacyPhone: 'Dorixona telefoni',
    leadPhone: 'Mas\'ul telefoni',
    leadStatus: 'Mas\'ul holati',
    contactPerson: 'Aloqa o\'rtagi',
    brandedPacket: 'Brendli paket',
    training: 'O\'qitilgan',
    status: 'Holati',
    registrationDate: 'Ro\'yxatga olish sanasi',
    telegramBot: 'Telegram Bot',
    slug: 'Slug',
    stir: 'STIR',
    additionalPhone: 'Qo\'shimcha telefon',
    juridicalName: 'Yuridik nom',
    juridicalAddress: 'Yuridik manzil',
    bankName: 'Bank nomi',
    bankAccount: 'Bank hisob raqami',
    mfo: 'MFO',
    active: 'Faol',
    inactive: 'Nofaol',
    allPharmacies: 'Barcha dorixonalar',

    // Status Values
    yes: 'BOR',
    no: 'YO\'Q',
    available: 'Mavjud',
    unavailable: 'Mavjud emas',

    // Panel Titles
    agentPanel: 'Agent paneli',
    adminPanel: 'Admin paneli',

    // Actions
    edit: 'Tahrirlash',
    save_action: 'Saqlash',
    cancel: 'Bekor qilish',
    saved: 'Muvaffaqiyatli saqlandi',

    // Loading and Empty States
    loading: 'Yuklanmoqda...',
    noData: 'Ma\'lumot yo\'q',
    loadingPharmacies: 'Dorixonalar yuklanmoqda...',

    // Filters
    filter: 'Filtr',
  },
};

export function getTranslation(language: Language): (typeof translations)['ru'] {
  return translations[language];
}
