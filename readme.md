# Astro CMS & SNS自動投稿ツール

<div align="center">

![Astro CMS Banner](https://via.placeholder.com/800x200/2563eb/ffffff?text=Astro+CMS+%26+SNS+Tool)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)

**Astroフレームワークで構築されたコーポレートサイトのコンテンツ管理と、複数SNSプラットフォームへの自動投稿を統合管理するWebアプリケーション**

[デモを見る](https://demo.astro-cms.example.com) | [ドキュメント](./docs/) | [API仕様](./docs/api.md)

</div>

## 📋 目次

- [概要](#概要)
- [主要機能](#主要機能)
- [技術スタック](#技術スタック)
- [インストール](#インストール)
- [使用方法](#使用方法)
- [設定](#設定)
- [API仕様](#api仕様)
- [開発](#開発)
- [テスト](#テスト)
- [デプロイ](#デプロイ)
- [貢献](#貢献)
- [ライセンス](#ライセンス)

## 🚀 概要

Astro CMS & SNS自動投稿ツールは、Astroフレームワークベースのコーポレートサイト運営を効率化するためのオールインワンソリューションです。GitHubとの直接連携によるコンテンツ管理から、複数SNSプラットフォームへの自動投稿まで、現代のデジタルマーケティングに必要な機能を統合しています。

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

### 🤖 Claude AI連携
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
```
React 18.x + TypeScript
Tailwind CSS 3.x
Lucide React (アイコン)
React Hooks (状態管理)
```

### バックエンド
```
Node.js 18.x + Express.js
PostgreSQL (主データベース)
Redis (キャッシュ・セッション)
JWT + OAuth 2.0 (認証)
```

### 外部連携
```
GitHub API v4 (GraphQL) + v3 (REST)
Twitter API v2
YouTube Data API v3
Discord API
Claude API (Anthropic)
```

### インフラ・ツール
```
Docker + Kubernetes
AWS (S3, RDS, ElastiCache, CloudFront)
Prometheus + Grafana (監視)
GitHub Actions (CI/CD)
```

## 📦 インストール

### 前提条件

- Node.js 18.x 以上
- npm または yarn
- Docker (オプション)
- PostgreSQL 13.x 以上 (ローカル開発の場合)

### クローンとセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/your-org/astro-cms-sns-tool.git
cd astro-cms-sns-tool

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envファイルを適切に設定

# データベースのセットアップ
npm run db:migrate
npm run db:seed

# 開発サーバーを起動
npm run dev
```

### Docker を使用したセットアップ

```bash
# Docker Compose で起動
docker-compose up -d

# データベースのセットアップ
docker-compose exec api npm run db:migrate
docker-compose exec api npm run db:seed
```

## 🚦 使用方法

### 1. 初期設定

1. **GitHub認証**: GitHubアカウントでログイン
2. **リポジトリ接続**: 管理対象のAstroリポジトリを接続
3. **SNSアカウント連携**: 投稿先SNSアカウントを連携

### 2. コンテンツ編集

```javascript
// 基本的な編集フロー
1. サイドバーからファイルを選択
2. エディタでコンテンツを編集
3. プレビューで変更確認
4. 保存・コミットでGitHubに反映
```

### 3. テンプレート活用

```javascript
// テンプレートの使用方法
1. テンプレートタブから既存テンプレートを選択
2. プレースホルダーに具体的な値を入力
3. 適用ボタンでエディタに反映
4. 必要に応じて微調整
```

### 4. SNS投稿管理

```javascript
// 投稿スケジュールの設定
1. SNS投稿タブから新規投稿作成
2. 投稿内容とプラットフォームを選択
3. 日時を指定（即時投稿も可能）
4. スケジュール実行で自動投稿
```

## ⚙️ 設定

### 環境変数

```bash
# アプリケーション設定
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# データベース設定
DATABASE_URL=postgresql://user:password@localhost:5432/astro_cms
REDIS_URL=redis://localhost:6379

# GitHub設定
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# SNS API設定
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token

# Claude AI設定
CLAUDE_API_KEY=your_claude_api_key

# セキュリティ設定
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# AWS設定 (プロダクション)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your-s3-bucket
```

### 詳細設定

設定項目の詳細については、[設定ガイド](./docs/configuration.md)を参照してください。

## 📡 API仕様

### 認証

```bash
# JWT認証
Authorization: Bearer <jwt_token>

# APIキー認証（Webhook用）
X-API-Key: <api_key>
```

### 主要エンドポイント

```bash
# 認証
POST   /api/auth/login          # ログイン
POST   /api/auth/logout         # ログアウト
GET    /api/auth/me             # ユーザー情報取得

# GitHub連携
GET    /api/github/repos        # リポジトリ一覧
GET    /api/github/files        # ファイル一覧
PUT    /api/github/files/:path  # ファイル更新

# テンプレート管理
GET    /api/templates           # テンプレート一覧
POST   /api/templates           # テンプレート作成
PUT    /api/templates/:id       # テンプレート更新
DELETE /api/templates/:id       # テンプレート削除

# SNS投稿
GET    /api/posts               # 投稿一覧
POST   /api/posts               # 投稿作成
PUT    /api/posts/:id           # 投稿更新
POST   /api/posts/:id/publish   # 投稿実行

# Claude AI
POST   /api/claude/generate     # テキスト生成
POST   /api/claude/hashtags     # ハッシュタグ提案
POST   /api/claude/trends       # トレンド分析
```

詳細なAPI仕様は[API仕様書](./docs/api.md)を参照してください。

## 🔧 開発

### 開発環境のセットアップ

```bash
# 開発依存関係のインストール
npm install --include=dev

# 開発サーバーの起動
npm run dev

# バックエンドのみ起動
npm run dev:api

# フロントエンドのみ起動
npm run dev:client
```

### 利用可能なスクリプト

```bash
# 開発
npm run dev              # 開発サーバー起動
npm run dev:client       # フロントエンドのみ
npm run dev:api          # バックエンドのみ

# ビルド
npm run build            # プロダクションビルド
npm run build:client     # フロントエンドビルド
npm run build:api        # バックエンドビルド

# テスト
npm run test             # 全テスト実行
npm run test:unit        # 単体テスト
npm run test:integration # 結合テスト
npm run test:e2e         # E2Eテスト

# データベース
npm run db:migrate       # マイグレーション実行
npm run db:seed          # シードデータ投入
npm run db:reset         # データベースリセット

# コード品質
npm run lint             # ESLint実行
npm run lint:fix         # ESLint自動修正
npm run format           # Prettier実行
npm run type-check       # TypeScript型チェック
```

### 開発ガイドライン

#### コーディング規約

```typescript
// ファイル命名: PascalCase (コンポーネント), camelCase (その他)
// 例: UserProfile.tsx, apiService.ts

// コンポーネント定義
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 = 0 }) => {
  // hooks は上部に配置
  const [state, setState] = useState<StateType>(initialState);
  
  // イベントハンドラは handle プレフィックス
  const handleClick = useCallback(() => {
    // 処理
  }, [dependencies]);
  
  return (
    <div className="component-wrapper">
      {/* JSX */}
    </div>
  );
};

export default Component;
```

#### Git ワークフロー

```bash
# 機能開発フロー
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 開発・コミット
git add .
git commit -m "feat: add new feature"

# プッシュ・プルリクエスト
git push origin feature/your-feature-name
# GitHub でプルリクエスト作成
```

## 🧪 テスト

### テスト構成

```
tests/
├── unit/                # 単体テスト
│   ├── components/      # コンポーネントテスト
│   ├── services/        # サービス層テスト
│   └── utils/          # ユーティリティテスト
├── integration/         # 結合テスト
│   ├── api/            # API テスト
│   └── database/       # データベーステスト
└── e2e/                # E2Eテスト
    ├── auth/           # 認証フロー
    ├── content/        # コンテンツ管理
    └── sns/           # SNS投稿
```

### テスト実行

```bash
# 全テスト実行
npm run test

# 監視モードでテスト実行
npm run test:watch

# カバレッジレポート生成
npm run test:coverage

# 特定のテストファイル実行
npm run test -- UserProfile.test.tsx

# E2Eテスト実行
npm run test:e2e

# E2Eテスト（ヘッドレスモード）
npm run test:e2e:headless
```

### テスト例

```typescript
// コンポーネントテスト例
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateCard } from '../TemplateCard';

describe('TemplateCard', () => {
  const mockTemplate = {
    id: '1',
    name: 'Test Template',
    category: 'news' as const,
    content: 'Test content',
    tags: ['#test'],
    createdAt: '2024-01-01T00:00:00Z'
  };

  it('テンプレート情報が正しく表示される', () => {
    render(
      <TemplateCard 
        template={mockTemplate}
        onApply={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    
    expect(screen.getByText('Test Template')).toBeInTheDocument();
    expect(screen.getByText('#test')).toBeInTheDocument();
  });

  it('適用ボタンクリックで onApply が呼ばれる', () => {
    const mockOnApply = jest.fn();
    render(
      <TemplateCard 
        template={mockTemplate}
        onApply={mockOnApply}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    
    fireEvent.click(screen.getByText('適用'));
    expect(mockOnApply).toHaveBeenCalledWith(mockTemplate);
  });
});
```

## 🚀 デプロイ

### プロダクション環境

#### Docker デプロイ

```bash
# プロダクションイメージのビルド
docker build -t astro-cms:latest .

# コンテナの起動
docker run -d \
  --name astro-cms \
  --env-file .env.production \
  -p 3000:3000 \
  astro-cms:latest
```

#### Kubernetes デプロイ

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: astro-cms
spec:
  replicas: 3
  selector:
    matchLabels:
      app: astro-cms
  template:
    metadata:
      labels:
        app: astro-cms
    spec:
      containers:
      - name: astro-cms
        image: astro-cms:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: astro-cms-secrets
              key: database-url
```

```bash
# Kubernetesにデプロイ
kubectl apply -f k8s/
```

#### AWS ECS デプロイ

```bash
# ECR にイメージをプッシュ
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker tag astro-cms:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/astro-cms:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/astro-cms:latest

# ECS サービス更新
aws ecs update-service --cluster astro-cms-cluster --service astro-cms-service --force-new-deployment
```

### CI/CD パイプライン

GitHub Actions を使用した自動デプロイの設定例：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run type-check

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Build and push Docker image
        run: |
          docker build -t astro-cms:$GITHUB_SHA .
          docker tag astro-cms:$GITHUB_SHA $ECR_REGISTRY/astro-cms:latest
          docker push $ECR_REGISTRY/astro-cms:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster astro-cms-cluster --service astro-cms-service --force-new-deployment
```

## 🤝 貢献

プロジェクトへの貢献を歓迎します！

### 貢献の流れ

1. **Issue の確認**: [Issues](https://github.com/your-org/astro-cms-sns-tool/issues) で既存の問題や機能要求を確認
2. **フォーク**: リポジトリをフォーク
3. **ブランチ作成**: 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
4. **変更**: コードの変更と適切なテストの追加
5. **コミット**: 変更をコミット (`git commit -m 'Add amazing feature'`)
6. **プッシュ**: ブランチをプッシュ (`git push origin feature/amazing-feature`)
7. **プルリクエスト**: プルリクエストを作成

### 貢献ガイドライン

- **コードスタイル**: ESLint と Prettier の設定に従う
- **テスト**: 新機能には適切なテストを追加
- **ドキュメント**: API や機能の変更時はドキュメントも更新
- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) 形式を使用

### バグレポート

バグを発見した場合は、以下の情報を含めて [Issue](https://github.com/your-org/astro-cms-sns-tool/issues/new?template=bug_report.md) を作成してください：

- **環境情報** (OS, Node.js version, ブラウザ等)
- **再現手順** (ステップバイステップ)
- **期待される動作** vs **実際の動作**
- **スクリーンショット** (可能であれば)

### 機能リクエスト

新機能の提案は [Feature Request](https://github.com/your-org/astro-cms-sns-tool/issues/new?template=feature_request.md) から行ってください。

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

- [ユーザーガイド](./docs/user-guide.md)
- [API仕様書](./docs/api.md)
- [開発者ガイド](./docs/development.md)
- [デプロイガイド](./docs/deployment.md)
- [トラブルシューティング](./docs/troubleshooting.md)

### コミュニティ

- [Discussions](https://github.com/your-org/astro-cms-sns-tool/discussions) - 質問や議論
- [Discord](https://discord.gg/astro-cms) - リアルタイムサポート
- [Twitter](https://twitter.com/astro_cms) - 最新情報とお知らせ

### 商用サポート

エンタープライズサポートやカスタマイズについては、[support@astro-cms.com](mailto:support@astro-cms.com) までお問い合わせください。

## 🙏 謝辞

このプロジェクトは以下のオープンソースプロジェクトの恩恵を受けています：

- **[React](https://reactjs.org/)** - UI ライブラリ
- **[Astro](https://astro.build/)** - 静的サイトジェネレータ
- **[Tailwind CSS](https://tailwindcss.com/)** - CSSフレームワーク
- **[Lucide](https://lucide.dev/)** - アイコンライブラリ
- **[Express.js](https://expressjs.com/)** - Node.js フレームワーク
- **[PostgreSQL](https://www.postgresql.org/)** - データベース
- **[Claude API](https://www.anthropic.com/)** - AI サービス

## 🗺 ロードマップ

### v1.1.0 (2024年Q4)
- [ ] TikTok API対応
- [ ] 画像・動画エディタ機能
- [ ] Webhook機能の強化
- [ ] パフォーマンス最適化

### v1.2.0 (2025年Q1)
- [ ] マルチテナント対応
- [ ] 詳細なアナリティクス機能
- [ ] API制限の自動調整
- [ ] モバイルアプリ対応

### v2.0.0 (2025年Q2)
- [ ] マイクロサービス化
- [ ] プラグインシステム
- [ ] 高度なワークフロー機能
- [ ] 多言語対応

---

<div align="center">

**[⬆ トップに戻る](#astro-cms--sns自動投稿ツール)**

Made with ❤️ by [Astro CMS Team](https://github.com/your-org)

</div>