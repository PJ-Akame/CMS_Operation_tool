# Astro CMS & SNS自動投稿ツール - Windows環境セットアップ手順書

## 📋 目次
1. [前提条件の確認](#前提条件の確認)
2. [必要なソフトウェアのインストール](#必要なソフトウェアのインストール)
3. [プロジェクトのセットアップ](#プロジェクトのセットアップ)
4. [アプリケーションの起動](#アプリケーションの起動)
5. [初期設定](#初期設定)
6. [トラブルシューティング](#トラブルシューティング)

---

## 🔧 前提条件の確認

### システム要件
- **OS**: Windows 10 / 11
- **メモリ**: 4GB RAM以上推奨
- **ディスク容量**: 2GB以上の空き容量
- **ネットワーク**: インターネット接続

---

## 📥 必要なソフトウェアのインストール

### 1. Node.js のインストール

**Step 1-1: Node.js公式サイトにアクセス**
1. ブラウザで https://nodejs.org/ にアクセス
2. 「LTS」版（推奨版）をダウンロード
   - ※ 18.x以上のバージョンが必要

**Step 1-2: インストール実行**
1. ダウンロードした `.msi` ファイルを実行
2. インストールウィザードに従って進める
3. 「Automatically install the necessary tools」にチェックを入れる
4. インストール完了後、コンピューターを再起動

**Step 1-3: インストール確認**
1. `Windows キー + R` を押して「ファイル名を指定して実行」を開く
2. `cmd` と入力してEnterキーを押す
3. コマンドプロンプトで以下を実行：

```cmd
node --version
npm --version
```

表示例：
```
v20.10.0
10.2.3
```

### 2. Git のインストール

**Step 2-1: Git for Windows をダウンロード**
1. https://git-scm.com/download/win にアクセス
2. 「64-bit Git for Windows Setup」をダウンロード

**Step 2-2: インストール実行**
1. ダウンロードした `.exe` ファイルを実行
2. インストールオプションはデフォルトのままでOK
3. 「Git Bash Here」「Git GUI Here」にチェックが入っていることを確認

**Step 2-3: インストール確認**
```cmd
git --version
```

表示例：
```
git version 2.42.0.windows.2
```

### 3. Visual Studio Code のインストール（推奨）

**Step 3-1: VS Code をダウンロード**
1. https://code.visualstudio.com/ にアクセス
2. 「Download for Windows」をクリック

**Step 3-2: インストール実行**
1. ダウンロードした `.exe` ファイルを実行
2. 「PATHへの追加」にチェックを入れる
3. 「コンテキストメニューに追加」にチェックを入れる

---

## 🚀 プロジェクトのセットアップ

### 1. プロジェクトフォルダの作成

**Step 1-1: 作業フォルダを作成**
1. エクスプローラーを開く
2. `C:\Users\[ユーザー名]\Documents` に移動
3. 新しいフォルダ「astro-cms-tool」を作成

**Step 1-2: コマンドプロンプトで移動**
```cmd
cd C:\Users\%USERNAME%\Documents\astro-cms-tool
```

### 2. プロジェクトファイルの準備

**Step 2-1: React アプリケーションの作成**
```cmd
npx create-react-app . --template typescript
```

実行時間: 約3-5分

**Step 2-2: 必要な依存関係のインストール**
```cmd
npm install lucide-react @types/react @types/react-dom
```

**Step 2-3: Tailwind CSS のセットアップ**
```cmd
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. 設定ファイルの編集

**Step 3-1: tailwind.config.js の編集**

VS Codeでプロジェクトフォルダを開く：
```cmd
code .
```

`tailwind.config.js` を以下の内容に変更：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 3-2: src/index.css の編集**

`src/index.css` の先頭に以下を追加：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 3-3: メインコンポーネントの配置**

1. `src/App.js` を削除
2. `src/App.tsx` を作成
3. 作成したCMS_SNS_Toolコンポーネントのコードをコピー&ペースト

**Step 3-4: src/App.tsx の内容**

```typescript
import React from 'react';
import CMS_SNS_Tool from './components/CMS_SNS_Tool';

function App() {
  return (
    <div className="App">
      <CMS_SNS_Tool />
    </div>
  );
}

export default App;
```

**Step 3-5: コンポーネントフォルダの作成**

```cmd
mkdir src\components
```

`src/components/CMS_SNS_Tool.tsx` を作成し、修正版のコンポーネントコードを配置

### 4. 環境変数の設定

**Step 4-1: .env ファイルの作成**

プロジェクトルートに `.env` ファイルを作成：

```env
# アプリケーション設定
REACT_APP_NAME=Astro CMS & SNS Tool
REACT_APP_VERSION=1.0.0

# GitHub設定（オプション）
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_GITHUB_CLIENT_SECRET=your_github_client_secret

# SNS API設定（オプション）
REACT_APP_TWITTER_API_KEY=your_twitter_api_key
REACT_APP_YOUTUBE_CLIENT_ID=your_youtube_client_id
REACT_APP_DISCORD_BOT_TOKEN=your_discord_bot_token

# Claude AI設定（オプション）
REACT_APP_CLAUDE_API_KEY=your_claude_api_key
```

---

## ▶️ アプリケーションの起動

### 1. 開発サーバーの起動

**Step 1-1: 依存関係の最終確認**
```cmd
npm install
```

**Step 1-2: 開発サーバー起動**
```cmd
npm start
```

**Step 1-3: 自動でブラウザが開く**
- URL: http://localhost:3000
- 自動で既定のブラウザが開きます
- 開かない場合は手動でURLにアクセス

### 2. 起動確認

**正常起動時の表示:**
- ブラウザにCMS & SNS Toolのダッシュボードが表示
- サイドバーに各メニューが表示
- エラーなくUIが表示される

**コンソール表示例:**
```
Local:            http://localhost:3000
On Your Network:  http://192.168.1.100:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

---

## ⚙️ 初期設定

### 1. 基本機能の確認

**Step 1-1: ダッシュボードの確認**
1. ブラウザで http://localhost:3000 にアクセス
2. ダッシュボードが表示されることを確認
3. 統計カードが正しく表示されることを確認

**Step 1-2: コンテンツ管理の確認**
1. サイドバーの「コンテンツ管理」をクリック
2. ファイルツリーが表示されることを確認
3. サンプルファイルをクリックしてエディタが動作することを確認

**Step 1-3: テンプレート機能の確認**
1. 「テンプレート」タブをクリック
2. サンプルテンプレートが表示されることを確認
3. テンプレートの適用機能が動作することを確認

### 2. API連携設定（オプション）

**GitHub連携設定:**
1. GitHub Developer Settings にアクセス
2. OAuth App を作成
3. `.env` ファイルにクライアントIDとシークレットを設定

**SNS API設定:**
- Twitter API、YouTube API、Discord APIの設定
- 各プラットフォームの開発者向けページで設定

---

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### ❌ 問題 1: Node.js のバージョンエラー
**エラーメッセージ:**
```
error Your project requires Node.js 18.x or higher
```

**解決方法:**
1. Node.js を最新のLTS版に更新
2. コマンドプロンプトを再起動
3. `node --version` で確認

#### ❌ 問題 2: npm install で権限エラー
**エラーメッセージ:**
```
EACCES: permission denied
```

**解決方法:**
1. コマンドプロンプトを「管理者として実行」
2. または以下のコマンドを実行：
```cmd
npm config set prefix "C:\Users\%USERNAME%\AppData\Roaming\npm"
```

#### ❌ 問題 3: ポート 3000 が使用中
**エラーメッセージ:**
```
Something is already running on port 3000
```

**解決方法:**
1. 他のポートを使用：
```cmd
set PORT=3001 && npm start
```
2. または使用中のプロセスを終了

#### ❌ 問題 4: Tailwind CSS が適用されない
**症状:** スタイルが正しく表示されない

**解決方法:**
1. `src/index.css` の先頭にTailwindディレクティブが追加されているか確認
2. 開発サーバーを再起動
```cmd
Ctrl + C （サーバー停止）
npm start （再起動）
```

#### ❌ 問題 5: TypeScript エラー
**エラーメッセージ:**
```
Module not found: Can't resolve 'lucide-react'
```

**解決方法:**
1. 依存関係を再インストール：
```cmd
npm install lucide-react @types/react @types/react-dom
```
2. 開発サーバーを再起動

### パフォーマンスの最適化

#### メモリ使用量が多い場合
```cmd
# Node.js のメモリ制限を増加
set NODE_OPTIONS=--max-old-space-size=4096
npm start
```

#### ビルド時間が長い場合
```cmd
# 並列処理数を制限
set UV_THREADPOOL_SIZE=4
npm start
```

---

## 📁 プロジェクト構造

セットアップ完了後のフォルダ構造：

```
astro-cms-tool/
├── public/
├── src/
│   ├── components/
│   │   └── CMS_SNS_Tool.tsx
│   ├── App.tsx
│   ├── index.css
│   └── index.tsx
├── .env
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🎯 次のステップ

### 1. 機能の拡張
- GitHub APIとの実際の連携
- SNS APIの実装
- Claude AIとの連携

### 2. プロダクションビルド
```cmd
npm run build
```

### 3. デプロイ
- Vercel、Netlify等へのデプロイ
- カスタムドメインの設定

---

## 📞 サポート

### ヘルプが必要な場合
1. プロジェクトのREADME.mdを確認
2. GitHub Issuesで問題を報告
3. 開発者コミュニティで質問

### ログの確認方法
**ブラウザの開発者ツール:**
1. F12キーを押す
2. Consoleタブでエラーログを確認

**コマンドプロンプトのログ:**
- 開発サーバー実行中のターミナルでエラーを確認

---

## ✅ チェックリスト

セットアップ完了時の確認項目：

- [ ] Node.js 18.x以上がインストール済み
- [ ] Git がインストール済み
- [ ] プロジェクトフォルダが作成済み
- [ ] 依存関係がインストール済み
- [ ] Tailwind CSSが設定済み
- [ ] .envファイルが作成済み
- [ ] 開発サーバーが正常起動
- [ ] ブラウザでアプリケーションが表示
- [ ] 基本機能が動作確認済み

---

**🎉 セットアップ完了！**

これでAstro CMS & SNS自動投稿ツールがローカル環境で動作します。
何か問題が発生した場合は、トラブルシューティングセクションを参照してください。