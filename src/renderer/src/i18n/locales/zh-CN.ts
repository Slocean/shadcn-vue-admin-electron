export default {
  common: {
    appName: '桌面管理台',
    language: '语言',
    chinese: '中文',
    english: '英文',
    logout: '退出登录',
    submit: '提交',
    loading: '加载中...'
  },
  nav: {
    app: '应用',
    workspace: '工作台',
    auth: '认证'
  },
  home: {
    title: '首页',
    welcome: '欢迎回来。桌面核心能力已就绪。',
    authStatus: '认证状态',
    signedInAs: '登录账号',
    sqlite: 'SQLite 已通过主进程连接',
    settings: '本地偏好设置已由 electron-conf 持久化',
    i18n: '多语言由 vue-i18n 管理'
  },
  about: {
    title: '关于'
  },
  accountInfo: {
    title: '账户信息',
    subtitle: '查看当前登录账户的基础资料与安全状态。',
    basicInfo: '基础信息',
    username: '用户名',
    email: '邮箱',
    createdAt: '创建时间',
    security: '账户安全',
    securityHint: '密码修改功能预留中，后续将提供本地密码变更与安全校验。',
    changePassword: '修改密码（即将支持）'
  },
  login: {
    title: '登录'
  },
  register: {
    title: '注册'
  },
  auth: {
    brand: '面向桌面应用的安全登录',
    subtitle: '账号存于 SQLite，偏好设置存于 electron-conf。',
    welcomeBack: '欢迎回来',
    createAccount: '创建你的本地账户',
    loginTab: '登录',
    registerTab: '注册',
    username: '账号',
    usernamePlaceholder: '请输入账号',
    email: '邮箱（可选）',
    emailPlaceholder: '请输入邮箱地址',
    password: '密码',
    passwordPlaceholder: '请输入密码',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '请再次输入密码',
    login: '登录',
    register: '注册',
    forgotPassword: '忘记密码？',
    rememberDevice: '记住这台设备',
    secureAccess: '安全访问',
    securityAes: '256 位 AES',
    securityMfa: '支持多因素认证',
    support: '支持',
    privacy: '隐私',
    noAccount: '还没有账号？',
    hasAccount: '已有账号？',
    switchToLogin: '去登录',
    switchToRegister: '去注册',
    successLogin: '登录成功。',
    successRegister: '注册成功并已登录。',
    passwordMismatch: '两次输入的密码不一致。',
    showPassword: '显示密码',
    hidePassword: '隐藏密码',
    errors: {
      invalidLoginPayload: '登录信息不完整。',
      invalidRegisterPayload: '注册信息不完整。',
      usernameTooShort: '账号至少需要 2 个字符。',
      emailInvalid: '请输入有效的邮箱地址。',
      passwordTooShort: '密码至少需要 6 个字符。',
      userExists: '账号或邮箱已存在。',
      invalidCredentials: '账号或密码错误。',
      unknown: '登录失败，请稍后重试。'
    }
  },
  userMenu: {
    accountInfo: '账户信息',
    dataBackup: '数据备份',
    dataRestore: '数据恢复',
    reportSettings: '报告设置',
    dataDirectory: '数据保存目录',
    language: '语言',
    languageBilingual: '语言/Language',
    languageOptionZh: '中文/Chinese',
    languageOptionEn: '英文/English',
    versionUpdate: '版本更新',
    aboutUs: '关于我们',
    logout: '退出登录'
  }
}
