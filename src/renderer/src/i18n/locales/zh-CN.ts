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
  login: {
    title: '登录'
  },
  register: {
    title: '注册'
  },
  auth: {
    brand: '面向桌面应用的安全登录',
    subtitle: '账号存于 SQLite，偏好设置存于 electron-conf。',
    loginTab: '登录',
    registerTab: '注册',
    username: '账号',
    email: '邮箱（可选）',
    password: '密码',
    confirmPassword: '确认密码',
    login: '登录',
    register: '注册',
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
    account: '账号',
    billing: '计费',
    uploads: '上传',
    saved: '已保存',
    projects: '项目',
    language: '语言',
    languageBilingual: '语言/Language',
    languageOptionZh: '中文/Chinese',
    languageOptionEn: '英文/English',
    sync: '同步数据',
    about: '关于',
    logout: '退出登录'
  }
}
