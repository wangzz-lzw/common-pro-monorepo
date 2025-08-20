# Common Pro

一个功能齐全的通用项目模板，采用 monorepo 架构设计。

## 项目特点

- 📦 基于 pnpm workspace 的 monorepo 架构
- 🚀 TypeScript 支持
- 🎨 模块化的配置系统
- 🔗 统一的依赖管理
- 📱 支持多平台分享功能
- 🛠 完善的工具链集成
- ⚛️ 同时支持 Vue 和 React 框架
- 🔄 统一的构建配置

## 项目结构

```
common-pro/
├── apps/                    # 应用目录
│   ├── app/                # Vue 应用1
│   ├── app2/               # Vue 应用2
│   ├── app3/               # React 应用
│   └── share/              # 共享模块
├── packages/               # 子包目录
│   └── typescript-config/  # TypeScript 配置
│       ├── src/
│       │   ├── app.json        # 应用 TypeScript 配置
│       │   └── app.node.json   # Node.js TypeScript 配置
│       └── tsconfig.json
├── package.json           # 项目根配置
├── pnpm-workspace.yaml    # 工作区配置
├── tsconfig.base.json     # 基础 TypeScript 配置
├── vite.config.ts         # Vue 应用 Vite 配置
├── vite.config.react.ts   # React 应用 Vite 配置
└── README.md             # 项目说明文档
```

## 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 安装

1. 克隆项目

```bash
git clone <repository-url>
cd common-pro
```

2. 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 开发特定应用
pnpm --filter <app-name> dev
# 例如: pnpm --filter app dev

# 构建特定应用
pnpm --filter <app-name> build
# 例如: pnpm --filter app build

# 构建所有应用
pnpm build

# 运行测试
pnpm --filter <app-name> test
```

## 配置说明

### TypeScript 配置

项目使用统一的 TypeScript 配置，位于 `packages/typescript-config` 目录：

- `app.json`: 前端应用的 TypeScript 配置
- `app.node.json`: Node.js 应用的 TypeScript 配置

所有应用的 `tsconfig.json` 都继承自这些基础配置，确保了项目中 TypeScript 配置的一致性。

### Vite 配置

项目提供了两种基础的 Vite 配置：

#### Vue 应用配置 (`vite.config.ts`)

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
```

#### React 应用配置 (`vite.config.react.ts`)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

#### 扩展配置

各应用可以通过以下方式扩展基础配置：

```typescript
// 在应用目录下的 vite.config.ts
import { defineConfig } from "vite";
import baseConfig from "../../vite.config.ts"; // Vue应用
// 或
import baseConfig from "../../vite.config.react.ts"; // React应用

export default defineConfig({
  ...baseConfig,
  // 自定义配置
  server: {
    port: 3000,
  },
  // 其他配置...
});
```

#### 开发命令

```bash
# Vue 应用开发
pnpm --filter app dev    # 默认端口
pnpm --filter app2 dev   # 自动使用不同端口

# React 应用开发
pnpm --filter app3 dev   # 使用 React 配置

# 构建应用
pnpm --filter <app-name> build
```

### 分享模块

`apps/share` 目录包含可在不同应用间共享的功能模块，目前提供：

- 基础数学函数 (如 `add`)
- 更多功能可根据项目需求扩展

### 路径别名

项目配置了以下路径别名，可在代码中使用：

```typescript
// 访问 packages 目录下的模块
import something from "@packages/module-name";

// 访问 apps 目录下的模块
import something from "@apps/module-name";
```

这些别名在 `tsconfig.base.json` 中配置，所有子项目都继承了这些配置。使用路径别名可以：

- 简化导入路径
- 避免复杂的相对路径
- 提高代码可维护性

## 使用示例

### 在 Vue 应用中使用共享模块

```typescript
// app/src/components/Calculator.vue
import { add } from "@common-pro/share";

export default {
  setup() {
    const result = add(1, 2); // 3
    return { result };
  },
};
```

### 在 React 应用中使用共享模块

```typescript
// app3/src/components/Calculator.tsx
import { add } from "@common-pro/share";

export const Calculator = () => {
  const result = add(1, 2); // 3
  return <div>{result}</div>;
};
```

### 启动项目

```bash
# 启动 Vue 应用 (app)
pnpm --filter app dev

# 启动 Vue 应用 (app2)
pnpm --filter app2 dev

# 启动 React 应用 (app3)
pnpm --filter app3 dev
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系我们

- 项目地址：[GitHub](https://github.com/yourusername/common-pro)
- 问题反馈：[Issues](https://github.com/yourusername/common-pro/issues)

## 更新日志

### [1.0.0] - 2024-01-01

- 🚀 初始版本发布
- ⚙️ 完成基础配置模块
- 🎨 完成主题配置
- 🔗 完成分享功能配置
