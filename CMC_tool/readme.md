# Astro CMS & SNS自動投稿ツール

<div align="center">

![Astro CMS Banner](https://via.placeholder.com/800x200/2563eb/ffffff?text=Astro+CMS+%26+SNS+Tool)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF.svg)](https://vitejs.dev/)

**Astroフレームワークで構築されたコーポレートサイトのコンテンツ管理と、複数SNSプラットフォームへの自動投稿を統合管理するWebアプリケーション**

[🚀 クイックスタート](#-クイックスタート) | [📖 ドキュメント](#-ドキュメント) | [🎯 機能](#-主要機能) | [🤝 貢献](#-貢献)

</div>

## 📋 目次

- [概要](#概要)
- [主要機能](#-主要機能)
- [技術スタック](#-技術スタック)
- [クイックスタート](#-クイックスタート)
- [詳細セットアップ](#-詳細セットアップ)
- [使用方法](#-使用方法)
- [プロジェクト構造](#-プロジェクト構造)
- [開発](#-開発)
- [デプロイ](#-デプロイ)
- [貢献](#-貢献)
- [ライセンス](#-ライセンス)

## 🚀 概要

Astro CMS & SNS自動投稿ツールは、現代のコーポレートサイト運営を効率化するためのオールインワンソリューションです。GitHubとの直接連携によるコンテンツ管理から、複数SNSプラットフォームへの自動投稿まで、デジタルマーケティングに必要な機能を統合しています。

### 🎯 対象ユーザー

- **コーポレートサイト運営者**: 効率的なコンテンツ更新とサイト管理
- **マーケティング担当者**: 統合されたSNS投稿管理とスケジューリング
- **コンテンツ編集者**: 直感的なエディタとテンプレート機能
- **開発者**: GitHubとの直接連携による開発フロー統合

## ✨ 主要機能

### 📝 コンテンツ管理システム
- **GitHubリポジトリ連携**: リアルタイムでのソースコード編集・同期
- **統合エディタ**: シンタックスハイライト対応のWebベースエディタ
- **差分管理**: 視覚的な変更確認と履歴追跡
- **リアルタイムプレビュー**: Astroサイトの即座プレビュー

### 📋 テンプレート管理
- **カテゴリ別管理**: ニュース、SNS投稿、ページテンプレートの分類管理
- **プレースホルダー対応**: 動的コンテンツ生成のための変数機能
- **ワンクリック適用**: 既存テンプレートの即座適用
- **バージョン管理**: テンプレートの履歴管理と復元

### 📱 SNS統合投稿
- **マルチプラットフォーム対応**: 
  - 🐦 Twitter
  - 📺 YouTube
  - 💬 Discord
  - 🎵 TikTok (予定)
- **スケジュール投稿**: 日時指定での自動投稿
- **一括投稿**: 複数プラットフォームへの同時投稿
- **投稿履歴管理**: 成功・失敗ステータスの追跡

### 🤖 Claude AI連携 (予定)
- **コンテンツ生成**: AIによる投稿文の自動生成
- **ハッシュタグ提案**: プラットフォーム別の最適なハッシュタグ提案
- **トレンド分析**: リアルタイムでのトピック分析
- **テンプレート自動生成**: 要件に基づくテンプレート作成

### 🔧 システム機能
- **データ永続化**: 自動保存とマニュアル保存の両対応
- **リアルタイム同期**: 複数タブ間でのデータ同期
- **エラーハンドリング**: 包括的なエラー処理とリトライ機能
- **パフォーマンス監視**: システム状態の可視化

## 🛠 技術スタック

### フロントエンド
- **React 18.x** + **TypeScript 5.x**
- **Vite 4.x** (高速ビルドツール)
- **Tailwind CSS 3.x** (ユーティリティファーストCSS)
- **Lucide React** (モダンアイコンセット)

### 開発ツール
- **ESLint** + **TypeScript ESLint** (コード品質)
- **Prettier** (コードフォーマット)
- **Git Hooks** (コミット前チェック)

### 将来的な拡張
- **Node.js** + **Express.js** (バックエンドAPI)
- **PostgreSQL** または **MongoDB** (データベース)
- **Redis** (キャッシュ・セッション)
- **Docker** (コンテナ化)

## 🚀 クイックスタート

### 前提条件

- **Node.js 18.0.0** 以上
- **npm 8.0.0** 以上
- **Git** (推奨)

### 1分でスタート

```bash
# 1. プロジェクトフォルダを作成
mkdir astro-cms-sns-tool && cd astro-cms-sns-tool

# 2. 必要なファイルを配置 (下記のプロジェクト構造を参照)

# 3. 自動セットアップを実行
# Windows (PowerShell)
.\setup.ps1

# Windows (Command Prompt)
setup.bat

# macOS/Linux
chmod +x setup.sh && ./setup.sh

# または手動でセットアップ
npm install
cp .env.example .env
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください！

## 📦 詳細セットアップ

### 手動セットアップ

1. **依存関係のインストール**

```bash
# package-lock.json がある場合
npm ci

# 初回インストールの場合
npm install
```

2. **環境変数の設定**

```bash
cp .env.example .env
```

`.env` ファイルを編集して、必要なAPI キーを設定：

```env
# GitHub API設定（オプション）
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_client_secret

# Claude AI設定（オプション）
VITE_CLAUDE_API_KEY=your_claude_api_key

# SNS API設定（オプション）
VITE_TWITTER_API_KEY=your_twitter_api_key
VITE_YOUTUBE_CLIENT_ID=your_youtube_client_id
VITE_DISCORD_BOT_TOKEN=your_discord_bot_token
```

3. **開発サーバーの起動**

```bash
npm run dev
```

### 利用可能なスクリプト

```bash
# 開発
npm run dev              # 開発サーバー起動（ホットリロード）
npm run build            # プロダクションビルド
npm run preview          # ビルド結果のプレビュー

# コード品質
npm run lint             # ESLintでコードチェック
npm run lint:fix         # ESLint自動修正
npm run type-check       # TypeScript型チェック

# セットアップ
npm run setup:clean      # 依存関係のクリーンインストール
```

## 🎮 使用方法

### 基本的な使い方

1. **ダッシュボード**: システム全体の状況を確認
2. **コンテンツ管理**: ファイルの編集とGitHub連携
3. **テンプレート**: 再利用可能なコンテンツテンプレート
4. **プレビュー**: リアルタイムでサイトプレビュー
5. **SNS投稿**: 複数プラットフォームへの投稿管理

### ファイル編集フロー

1. 左側のファイルツリーからファイルを選択
2. エディタでコンテンツを編集
3. プレビューで変更を確認
4. 保存・コミットでGitHubに反映

### テンプレート活用

1. テンプレートタブから既存テンプレートを選択
2. プレースホルダーに具体的な値を入力
3. 適用ボタンでエディタに反映
4. 必要に応じて微調整

## 📁 プロジェクト構造

```
astro-cms-sns-tool/
├── 📁 public/                 # 静的ファイル
│   ├── vite.svg              # ファビコン
│   └── ...
├── 📁 src/                    # ソースコード
│   ├── 📄 main.tsx           # エントリーポイント
│   ├── 📄 App.tsx            # メインアプリコンポーネント
│   ├── 📄 App.css            # アプリケーション固有スタイル
│   ├── 📄 index.css          # グローバルスタイル（Tailwind）
│   └── 📁 components/
│       └── 📄 CMS_SNS_Tool.tsx # メインCMSコンポーネント
├── 📄 package.json           # プロジェクト設定
├── 📄 vite.config.ts         # Vite設定
├── 📄 tsconfig.json          # TypeScript設定
├── 📄 tailwind.config.js     # Tailwind CSS設定
├── 📄 .eslintrc.cjs          # ESLint設定
├── 📄 .env.example           # 環境変数テンプレート
├── 📄 setup.sh               # Unix/Linux セットアップ
├── 📄 setup.bat              # Windows セットアップ
├── 📄 setup.ps1              # PowerShell セットアップ
└── 📄 README.md              # このファイル
```

## 🛠 開発

### 開発環境の準備

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 別のターミナルで型チェック（オプション）
npm run type-check --watch
```

### コーディング規約

- **TypeScript**: 厳格な型チェックを有効
- **ESLint**: コード品質のチェック
- **Prettier**: 統一されたコードフォーマット
- **Conventional Commits**: 意味のあるコミットメッセージ

### Git ワークフロー

```bash
# 機能開発フロー
git checkout -b feature/your-feature-name
# 開発・テスト
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
# プルリクエスト作成
```

### デバッグ

- **ブラウザ開発者ツール**: F12でコンソールとネットワークタブを確認
- **React Developer Tools**: ブラウザ拡張でReactコンポーネントを検査
- **TypeScript エラー**: `npm run type-check` で型エラーを確認

## 🚀 デプロイ

### Vercel でのデプロイ

```bash
# Vercel CLI のインストール
npm install -g vercel

# デプロイ
vercel

# プロダクション設定
vercel --prod
```

### Netlify でのデプロイ

1. GitHubリポジトリをNetlifyに接続
2. ビルド設定:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node.js version**: `18`

### GitHub Pages でのデプロイ

```bash
# gh-pages パッケージをインストール
npm install --save-dev gh-pages

# package.json にスクリプトを追加
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# デプロイ実行
npm run deploy
```

### Docker でのデプロイ

```dockerfile
# Dockerfile例
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 貢献

プロジェクトへの貢献を歓迎します！

### 貢献の流れ

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイドライン

- **コードスタイル**: ESLint設定に従う
- **テスト**: 新機能には適切なテストを追加
- **ドキュメント**: API変更時はドキュメントも更新
- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) 形式

### バグレポート

バグを発見した場合は、以下の情報を含めてIssueを作成してください：

- **環境情報** (OS, Node.js version, ブラウザ等)
- **再現手順** (ステップバイステップ)
- **期待される動作** vs **実際の動作**
- **スクリーンショット** (可能であれば)

## 📄 ライセンス

このプロジェクトは [MIT License](./LICENSE) の下で公開されています。

```
MIT License

Copyright (c) 2024 Astro CMS Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 サポート

### ドキュメント

- [ローカルセットアップガイド](./ローカルセットアップガイド.md)
- [API仕様書](./docs/api.md)
- [開発者ガイド](./docs/development.md)

### コミュニティ

- **GitHub Issues**: バグレポートや機能要求
- **GitHub Discussions**: 質問や議論
- **Discord**: リアルタイムサポート（準備中）

### 商用サポート

エンタープライズサポートやカスタマイズについては、issue でお問い合わせください。

## 🙏 謝辞

このプロジェクトは以下のオープンソースプロジェクトの恩恵を受けています：

- **[React](https://reactjs.org/)** - UI ライブラリ
- **[Vite](https://vitejs.dev/)** - 高速ビルドツール
- **[TypeScript](https://www.typescriptlang.org/)** - 型安全なJavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - ユーティリティファーストCSS
- **[Lucide](https://lucide.dev/)** - モダンアイコンライブラリ

## 🗺 ロードマップ

### v1.0.0 (現在) - 基本機能
- ✅ React + TypeScript + Vite セットアップ
- ✅ Tailwind CSS スタイリング
- ✅ 基本的なCMSインターフェース
- ✅ ファイル管理とエディタ機能
- ✅ レスポンシブデザイン

### v1.1.0 - コア機能実装
- 🔄 GitHub API連携
- 🔄 テンプレート管理システム
- 🔄 プレビュー機能
- 🔄 基本的なSNS投稿機能

### v1.2.0 - 高度な機能
- 📅 Claude AI連携
- 📅 スケジュール投稿
- 📅 アナリティクス機能
- 📅 プラグインシステム

### v2.0.0 - 企業向け機能
- 📅 マルチテナント対応
- 📅 高度なワークフロー
- 📅 API拡張
- 📅 モバイルアプリ

---

<div align="center">

**[⬆ トップに戻る](#astro-cms--sns自動投稿ツール)**

Made with ❤️ by Astro CMS Team

</div>