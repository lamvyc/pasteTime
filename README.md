# PasteTime 剪贴板历史管理工具

## 项目简介
PasteTime 是一款跨平台（Windows/macOS）的 Electron 应用，支持实时监控剪贴板内容（文本/图片），历史记录管理，暗色模式，系统托盘集成，数据本地 SQLite 存储，支持 JSON 导出。

## 主要功能
- 实时监听剪贴板内容（文本/图片）
- 剪贴板历史记录（最多 100 条，先进先出）
- 支持内容搜索、删除、复制、JSON 导出
- 图片缩略图预览，双击放大
- 暗色模式
- 系统托盘集成
- 跨平台支持 Windows 10+/macOS 10.15+

## 技术栈
- Electron
- React + Ant Design + TypeScript
- SQLite（sqlite3）

## 目录结构
```
.
├── pasteTime-app/      # Electron 主进程
│   └── src/
│       ├── main/       # 主进程业务（clipboard、db、tray、permission）
│       ├── preload.ts  # 预加载脚本
│       └── index.ts    # 主进程入口
├── renderer/           # React 前端
│   └── src/
│       ├── components/ # 组件
│       ├── pages/      # 页面
│       ├── styles/     # 样式
│       └── utils/      # 工具
```

## 安装依赖
```bash
cd pasteTime-app && npm install
cd ../renderer && npm install
```

## 启动开发环境
### 1. 启动前端（renderer）
```bash
cd renderer
npm start
```
### 2. 启动 Electron 主进程
```bash
cd ../pasteTime-app
npm start
```

## 打包发布
```bash
cd pasteTime-app
npm run make
```

## 其他说明
- macOS 16+ 首次启动需授权剪贴板访问
- 数据库存储在 pasteTime-app/clipboard.db
- 详细开发文档见各模块 README 