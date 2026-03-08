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
  reportManagement: {
    title: '报告管理'
  },
  patientManagement: {
    title: '患者管理'
  },
  menuLab: {
    title: '菜单层级测试'
  },
  menuLabReports: {
    title: '报告中心'
  },
  menuLabPatients: {
    title: '患者中心'
  },
  menuLabAdvanced: {
    title: '高级分组'
  },
  menuLabAdvancedDaily: {
    title: '日报'
  },
  menuLabAdvancedMonthly: {
    title: '月报'
  },
  login: {
    title: '登录'
  },
  register: {
    title: '注册'
  },
  themeSettings: {
    open: '打开主题设置',
    title: '主题设置',
    description: '调整显示模式、主题色、字体和字号大小。',
    modeTitle: '显示模式',
    mode: {
      light: '浅色',
      dark: '深色',
      system: '跟随系统'
    },
    colorTitle: '主题色',
    colors: {
      zinc: '锌灰',
      red: '红色',
      blue: '蓝色',
      green: '绿色',
      orange: '橙色',
      yellow: '黄色',
      violet: '紫色'
    },
    fontTitle: '字体',
    fonts: {
      system: {
        label: '系统默认',
        preview: '界面清晰，适合日常使用'
      },
      yahei: {
        label: '微软雅黑',
        preview: '中文显示更圆润'
      },
      dengxian: {
        label: '等线',
        preview: '现代简洁，字形利落'
      },
      songti: {
        label: '宋体',
        preview: '传统衬线，适合阅读'
      },
      kaiti: {
        label: '楷体',
        preview: '书卷风格，更有辨识度'
      }
    },
    sizeTitle: '字号大小',
    size: {
      currentDefault: '当前：默认字号',
      currentOffset: '当前：{offset}px',
      hint: '所有固定字号会在原有基础上同步偏移',
      decrease: '减小字号',
      reset: '重置',
      increase: '增大字号',
      preview: '预览',
      sampleText: '文本'
    }
  },
  auth: {
    welcomeBack: '欢迎回来',
    createAccount: '创建你的本地账户',
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
    registerLocalAccount: '注册本地账户',
    backToLogin: '返回登录',
    forgotPassword: '忘记密码？',
    rememberDevice: '记住这台设备',
    support: '支持',
    privacy: '隐私',
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
    languageBilingual: '语言',
    languageOptionZh: '中文',
    languageOptionEn: '英文',
    versionUpdate: '版本更新',
    aboutUs: '关于我们',
    logout: '退出登录'
  }
}
