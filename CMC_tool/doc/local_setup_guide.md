# Astro CMS & SNS自動投稿ツール - ローカルセットアップガイド

## 📋 必要な環境

- **Node.js**: v18.0.0 以上
- **npm**: v8.0.0 以上 (または yarn)
- **Git**: 最新版
- **ブラウザ**: Chrome, Firefox, Safari, Edge (最新2バージョン)

## 🚀 クイックスタート

### 1. プロジェクトフォルダを作成

```bash
mkdir astro-cms-sns-tool
cd astro-cms-sns-tool
```

### 2. 必要なファイルを配置

以下のファイルを適切な場所に配置してください：

```
astro-cms-sns-tool/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .env.example
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    └── components/
        └── CMS_SNS_Tool.tsx
```

### 3. 依存関係をインストール

```bash
npm install
```

### 4. 環境変数を設定

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

# その他のSNS API設定（オプション）
VITE_TWITTER_API_KEY=your_twitter_api_key
# ...
```

### 5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## 📁 プロジェクト構造

```
src/
├── main.tsx              # エントリーポイント
├── App.tsx               # メインアプリコンポーネント
├── App.css               # アプリケーション固有のスタイル
├── index.css             # グローバルスタイル（Tailwind CSS）
└── components/
    └── CMS_SNS_Tool.tsx  # メインのCMSコンポーネント
```

## 🛠 利用可能なスクリプト

```bash
# 開発サーバーを起動（ホットリロード有効）
npm run dev

# プロダクション用にビルド
npm run build

# ビルドしたアプリケーションをプレビュー
npm run preview

# TypeScriptの型チェック
npm run type-check

# ESLintでコードをチェック
npm run lint

# ESLintで自動修正
npm run lint:fix

# 依存関係をクリーンインストール
npm run setup:clean
```

## 🎨 機能概要

### 実装済み機能

✅ **ダッシュボード**
- システム状態の可視化
- データ永続化ステータス
- 最近の活動表示

✅ **コンテンツ管理**
- ファイルツリー表示
- リアルタイムエディタ
- 変更差分表示
- プレビューモード

✅ **レスポンシブデザイン**
- デスクトップ、タブレット、モバイル対応

### 今後実装予定

🔄 **テンプレート管理**（実装中）
🔄 **SNS投稿機能**（実装中）
🔄 **プレビュー機能**（実装中）
🔄 **解析・分析機能**（実装中）

## 🔧 カスタマイズ

### テーマの変更

`tailwind.config.js` でカラーテーマをカスタマイズできます：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
    },
  },
}
```

### コンポーネントの追加

`src/components/` フォルダに新しいコンポーネントを追加し、`CMS_SNS_Tool.tsx` でインポートしてください。

## 📝 開発ガイドライン

### コーディング規約

- **TypeScript**: 厳格な型チェックを有効にしています
- **ESLint**: コード品質を保つためのルールを設定
- **Prettier**: コードフォーマットを統一（推奨）

### Git コミット規約

```bash
# 機能追加
git commit -m "feat: add template management feature"

# バグ修正
git commit -m "fix: resolve file tree rendering issue"

# ドキュメント更新
git commit -m "docs: update setup instructions"

# スタイル修正
git commit -m "style: improve button hover states"
```

## 🐛 トラブルシューティング

### よくある問題

**問題**: `npm install` でエラーが発生する
```bash
# 解決方法: Node.js のバージョンを確認
node --version  # v18.0.0 以上であることを確認

# キャッシュをクリア
npm cache clean --force
npm install
```

**問題**: Tailwind CSS のスタイルが適用されない
```bash
# 解決方法: PostCSS の設定を確認
npm run build  # ビルドしてエラーを確認
```

**問題**: TypeScript エラーが発生する
```bash
# 解決方法: 型チェックを実行
npm run type-check
```

### ログの確認

開発時のログは以下で確認できます：

- **ブラウザコンソール**: F12 を押してConsole タブを確認
- **Vite ログ**: ターミナルでVite の出力を確認

## 🚀 デプロイ

### Vercel でのデプロイ

```bash
# Vercel CLI をインストール
npm install -g vercel

# プロジェクトをデプロイ
vercel

# プロダクション用にビルド
npm run build
```

### Netlify でのデプロイ

```bash
# ビルドコマンド: npm run build
# 公開ディレクトリ: dist
```

## 📞 サポート

### ドキュメント

- [Vite ドキュメント](https://vitejs.dev/)
- [React ドキュメント](https://react.dev/)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/)

### 問題報告

バグや改善要望がある場合は、以下の情報を含めて報告してください：

- OS とブラウザの情報
- Node.js のバージョン
- エラーメッセージ
- 再現手順

---

**Happy Coding! 🎉**