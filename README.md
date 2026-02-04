# Cofoe Analysis PC

[![Electron](https://img.shields.io/badge/Electron-Latest-blue?logo=electron)](https://www.electronjs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.x-green?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

一个基于 Electron + Vue 3 + TypeScript 的现代化桌面应用程序项目。本项目采用 [Electron Vite](https://electron-vite.org/) 构建，并集成了 Shadcn UI (基于 Radix Vue) 提供现代化的界面设计。

## ✨ 特性

- **现代化技术栈**: 采用 Vue 3, TypeScript, Tailwind CSS v4 等最新技术。
- **高性能构建**: 使用 Electron Vite 进行极速开发和构建。
- **精美 UI**: 集成 Shadcn Vue 组件库，提供美观、可访问性强的 UI 组件。
- **图标系统**: 使用 Lucide Vue Next 提供丰富的图标支持。
- **应用架构**: 清晰的 Main/Preload/Renderer 进程分离架构。
- **布局系统**: 响应式的侧边栏布局，支持折叠和多级菜单。

## 🛠️ 技术栈

- **Core**: [Electron](https://www.electronjs.org/)
- **Framework**: [Vue 3](https://vuejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Electron Vite](https://electron-vite.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn Vue](https://www.shadcn-vue.com/) (Radix Vue + Tailwind)
- **Icons**: [Lucide Vue](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📂 项目结构

```
d:\PROJECT\Cofoe-analysis-pc
├── src/
│   ├── main/          # Electron 主进程代码
│   ├── preload/       # Electron 预加载脚本
│   └── renderer/      # Vue 渲染进程代码 (UI)
│       ├── src/
│       │   ├── components/ui/  # Shadcn UI 组件
│       │   ├── layouts/        # 页面布局组件
│       │   └── ...
├── resources/         # 静态资源
├── electron.vite.config.ts  # 构建配置
└── package.json       # 项目依赖与脚本
```

## 🚀 快速开始

### 前置要求

- Node.js (推荐 LTS 版本)
- pnpm (推荐使用 pnpm 管理依赖)

### 安装依赖

```bash
$ pnpm install
```

### 开发模式运行

启动开发服务器，支持热重载：

```bash
$ pnpm dev
```

### 构建生产版本

构建用于生产环境的应用包：

```bash
# 构建 Windows 版本
$ pnpm build:win

# 构建 macOS 版本
$ pnpm build:mac

# 构建 Linux 版本
$ pnpm build:linux
```

## 📝 开发指南

### 推荐 IDE 设置

- [VSCode](https://code.visualstudio.com/)
- 插件:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### 代码规范

项目配置了 ESLint 和 Prettier 确保代码质量和风格统一。

```bash
# 检查代码
$ pnpm lint

# 格式化代码
$ pnpm format

# 类型检查
$ pnpm typecheck
```
