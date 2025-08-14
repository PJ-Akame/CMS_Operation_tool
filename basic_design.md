# Astro CMS & SNS自動投稿ツール 基本設計書

## 1. システムアーキテクチャ

### 1.1 全体構成図

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   クライアント    │────│   Webサーバー    │────│   外部API群      │
│   (React SPA)   │    │  (Node.js/Express)│    │  (GitHub/SNS)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   データベース   │
                       │ (PostgreSQL/    │
                       │  MongoDB)       │
                       └─────────────────┘
```

### 1.2 システム構成要素

#### 1.2.1 フロントエンド層
- **技術スタック**: React 18.x + TypeScript
- **状態管理**: React Hooks (useState, useEffect, useContext)
- **UI框架**: Tailwind CSS + Lucide React Icons
- **ルーティング**: React Router v6
- **HTTP通信**: Fetch API / Axios

#### 1.2.2 バックエンド層
- **技術スタック**: Node.js + Express.js
- **認証**: JWT + OAuth 2.0
- **API設計**: RESTful API
- **ミドルウェア**: CORS, Helmet, Morgan
- **バリデーション**: Joi / Yup

#### 1.2.3 データ層
- **主DB**: PostgreSQL (リレーショナルデータ)
- **セッション**: Redis (キャッシュ・セッション)
- **ファイル**: AWS S3 / MinIO (ファイルストレージ)

#### 1.2.4 外部連携層
- **GitHub API**: v4 GraphQL / v3 REST
- **SNS API**: Twitter API v2, YouTube Data API v3, Discord API
- **Claude API**: Anthropic Claude API
- **ストレージAPI**: AWS S3 API

## 2. コンポーネント設計

### 2.1 フロントエンドコンポーネント構成

```
src/
├── components/
│   ├── common/                 # 共通コンポーネント
│   │   ├── Layout/
│   │   ├── Navigation/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── content/               # コンテンツ管理
│   │   ├── FileTree/
│   │   ├── Editor/
│   │   ├── Preview/
│   │   └── DiffViewer/
│   ├── templates/             # テンプレート管理
│   │   ├── TemplateList/
│   │   ├── TemplateCard/
│   │   ├── TemplateModal/
│   │   └── TemplateEditor/
│   ├── sns/                   # SNS投稿管理
│   │   ├── PostForm/
│   │   ├── ScheduleList/
│   │   ├── PlatformStatus/
│   │   └── ClaudeIntegration/
│   └── dashboard/             # ダッシュボード
│       ├── StatsCards/
│       ├── RecentActivity/
│       └── QuickActions/
├── hooks/                     # カスタムフック
│   ├── useGitHub.ts
│   ├── useTemplates.ts
│   ├── useSNSPosts.ts
│   └── useLocalStorage.ts
├── services/                  # API通信層
│   ├── api.ts
│   ├── github.ts
│   ├── sns.ts
│   └── claude.ts
├── types/                     # 型定義
│   ├── common.ts
│   ├── github.ts
│   ├── templates.ts
│   └── sns.ts
└── utils/                     # ユーティリティ
    ├── constants.ts
    ├── helpers.ts
    └── validators.ts
```

### 2.2 主要コンポーネント詳細

#### 2.2.1 Layout Component
```typescript
interface LayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
  header?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebar = true, header = true }) => {
  // レイアウト構成の実装
};
```

#### 2.2.2 FileTree Component
```typescript
interface FileTreeProps {
  repository: GitHubRepository;
  onFileSelect: (path: string) => void;
  selectedFile?: string;
}

const FileTree: React.FC<FileTreeProps> = ({ repository, onFileSelect, selectedFile }) => {
  // ファイルツリー表示・操作の実装
};
```

#### 2.2.3 Editor Component
```typescript
interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  language: string;
  readOnly?: boolean;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, language, readOnly = false }) => {
  // エディタ機能の実装
};
```

## 3. データベース設計

### 3.1 ER図

```
Users ||--o{ Templates : creates
Users ||--o{ SNSAccounts : owns
Users ||--o{ Posts : creates
Templates ||--o{ Posts : uses
SNSAccounts ||--o{ Posts : publishes_to

Users {
  id UUID PK
  username VARCHAR(50)
  email VARCHAR(100)
  github_token TEXT
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Templates {
  id UUID PK
  user_id UUID FK
  name VARCHAR(100)
  category VARCHAR(20)
  content TEXT
  tags JSON
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

SNSAccounts {
  id UUID PK
  user_id UUID FK
  platform VARCHAR(20)
  account_id VARCHAR(100)
  access_token TEXT
  refresh_token TEXT
  expires_at TIMESTAMP
  is_active BOOLEAN
}

Posts {
  id UUID PK
  user_id UUID FK
  template_id UUID FK
  content TEXT
  platforms JSON
  scheduled_at TIMESTAMP
  published_at TIMESTAMP
  status VARCHAR(20)
  metadata JSON
}
```

### 3.2 テーブル設計詳細

#### 3.2.1 users テーブル
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    github_token TEXT,
    preferences JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

#### 3.2.2 templates テーブル
```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('news', 'sns', 'pages')),
    content TEXT NOT NULL,
    tags JSON DEFAULT '[]',
    platforms JSON DEFAULT '[]',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_created_at ON templates(created_at);
```

#### 3.2.3 sns_accounts テーブル
```sql
CREATE TABLE sns_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('twitter', 'youtube', 'discord', 'tiktok')),
    account_id VARCHAR(100) NOT NULL,
    account_name VARCHAR(100),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, platform, account_id)
);

CREATE INDEX idx_sns_accounts_user_id ON sns_accounts(user_id);
CREATE INDEX idx_sns_accounts_platform ON sns_accounts(platform);
```

#### 3.2.4 posts テーブル
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
    title VARCHAR(200),
    content TEXT NOT NULL,
    platforms JSON NOT NULL DEFAULT '[]',
    attachments JSON DEFAULT '[]',
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed')),
    metadata JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX idx_posts_created_at ON posts(created_at);
```

## 4. API設計

### 4.1 REST API エンドポイント

#### 4.1.1 認証系API
```
POST   /api/auth/login          # ログイン
POST   /api/auth/logout         # ログアウト
POST   /api/auth/refresh        # トークンリフレッシュ
GET    /api/auth/me             # ユーザー情報取得
```

#### 4.1.2 GitHub連携API
```
GET    /api/github/repos        # リポジトリ一覧
GET    /api/github/repos/:owner/:repo/tree/:path  # ファイルツリー
GET    /api/github/repos/:owner/:repo/contents/:path  # ファイル内容
PUT    /api/github/repos/:owner/:repo/contents/:path  # ファイル更新
POST   /api/github/repos/:owner/:repo/commits        # コミット作成
```

#### 4.1.3 テンプレート管理API
```
GET    /api/templates           # テンプレート一覧
POST   /api/templates           # テンプレート作成
GET    /api/templates/:id       # テンプレート取得
PUT    /api/templates/:id       # テンプレート更新
DELETE /api/templates/:id       # テンプレート削除
GET    /api/templates/categories # カテゴリ一覧
```

#### 4.1.4 SNS投稿API
```
GET    /api/sns/accounts        # SNSアカウント一覧
POST   /api/sns/accounts        # SNSアカウント連携
DELETE /api/sns/accounts/:id    # SNSアカウント削除
GET    /api/posts               # 投稿一覧
POST   /api/posts               # 投稿作成
PUT    /api/posts/:id           # 投稿更新
DELETE /api/posts/:id           # 投稿削除
POST   /api/posts/:id/publish   # 投稿実行
```

#### 4.1.5 Claude連携API
```
POST   /api/claude/generate     # テキスト生成
POST   /api/claude/hashtags     # ハッシュタグ提案
POST   /api/claude/trends       # トレンド分析
POST   /api/claude/templates    # テンプレート生成
```

### 4.2 API レスポンス形式

#### 4.2.1 成功レスポンス
```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "meta": {
    "timestamp": "2024-08-12T10:30:00Z",
    "version": "1.0.0"
  }
}
```

#### 4.2.2 エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データが不正です",
    "details": [
      {
        "field": "title",
        "message": "タイトルは必須です"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-08-12T10:30:00Z",
    "version": "1.0.0"
  }
}
```

### 4.3 API認証・認可

#### 4.3.1 JWT トークン構造
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "iat": 1234567890,
    "exp": 1234567890,
    "roles": ["user"],
    "permissions": ["read", "write"]
  }
}
```

#### 4.3.2 OAuth 2.0 フロー
```
1. フロントエンド → GitHub OAuth認証ページ
2. GitHub → 認証コード返却
3. フロントエンド → バックエンド (認証コード送信)
4. バックエンド → GitHub (アクセストークン取得)
5. バックエンド → フロントエンド (JWT トークン返却)
```

## 5. セキュリティ設計

### 5.1 認証・認可方式

#### 5.1.1 認証フロー
```
1. GitHub OAuth → 初回認証
2. JWT Token → セッション管理
3. Refresh Token → トークン更新
4. RBAC → 権限制御
```

#### 5.1.2 権限レベル
```
- Guest: 閲覧のみ
- User: CRUD操作
- Admin: システム管理
- Owner: 全権限
```

### 5.2 データ保護

#### 5.2.1 暗号化
```
- 保存時暗号化: AES-256-GCM
- 通信時暗号化: TLS 1.3
- トークン暗号化: HS256 (JWT)
- パスワード: bcrypt (rounds=12)
```

#### 5.2.2 入力検証
```
- SQLインジェクション対策: パラメータ化クエリ
- XSS対策: 入力サニタイゼーション
- CSRF対策: CSRFトークン
- ファイルアップロード: ファイル形式・サイズ制限
```

## 6. パフォーマンス設計

### 6.1 キャッシュ戦略

#### 6.1.1 フロントエンドキャッシュ
```
- ブラウザキャッシュ: 静的リソース (24時間)
- Service Worker: アプリケーションキャッシュ
- React Query: API レスポンスキャッシュ (5分)
```

#### 6.1.2 バックエンドキャッシュ
```
- Redis: セッション・一時データ (30分)
- Application Cache: 設定データ (1時間)
- CDN: 静的コンテンツ (7日)
```

### 6.2 データベース最適化

#### 6.2.1 インデックス戦略
```
- Primary Key: UUID (クラスタード)
- Foreign Key: 関連テーブル参照
- Composite Index: 複合条件検索
- Partial Index: 条件付きインデックス
```

#### 6.2.2 クエリ最適化
```
- N+1問題回避: JOIN使用
- ページネーション: LIMIT/OFFSET
- 全文検索: PostgreSQL FTS
- 集計クエリ: Window Functions
```

## 7. 拡張性設計

### 7.1 水平拡張

#### 7.1.1 ロードバランシング
```
- フロントエンド: CDN + Multiple Regions
- バックエンド: ALB + Auto Scaling
- データベース: Read Replica + Connection Pooling
```

#### 7.1.2 マイクロサービス化
```
- Auth Service: 認証・認可
- Content Service: コンテンツ管理
- SNS Service: SNS投稿管理
- Template Service: テンプレート管理
- Notification Service: 通知管理
```

### 7.2 機能拡張

#### 7.2.1 プラグインアーキテクチャ
```javascript
interface Plugin {
  name: string;
  version: string;
  initialize(): void;
  destroy(): void;
  getRoutes(): Route[];
  getComponents(): Component[];
}
```

#### 7.2.2 外部連携拡張
```
- Webhook対応: イベント通知
- API Gateway: 外部サービス連携
- Message Queue: 非同期処理
- Event Sourcing: イベント管理
```

## 8. 監視・運用設計

### 8.1 ログ設計

#### 8.1.1 ログレベル
```
- ERROR: システムエラー
- WARN: 警告・復旧可能エラー
- INFO: 重要な業務イベント
- DEBUG: デバッグ情報
```

#### 8.1.2 ログ形式
```json
{
  "timestamp": "2024-08-12T10:30:00.000Z",
  "level": "INFO",
  "service": "cms-api",
  "traceId": "abc123",
  "userId": "user123",
  "message": "Template created",
  "metadata": {
    "templateId": "template123",
    "category": "news"
  }
}
```

### 8.2 メトリクス設計

#### 8.2.1 アプリケーションメトリクス
```
- Response Time: API応答時間
- Error Rate: エラー発生率
- Throughput: リクエスト処理数
- Active Users: アクティブユーザー数
```

#### 8.2.2 ビジネスメトリクス
```
- Template Usage: テンプレート利用率
- Post Success Rate: 投稿成功率
- User Engagement: ユーザー活動度
- Feature Adoption: 機能採用率
```

## 9. デプロイメント設計

### 9.1 CI/CD パイプライン

```yaml
stages:
  - test:
      - unit tests
      - integration tests
      - security scan
  - build:
      - frontend build
      - backend build
      - docker image
  - deploy:
      - staging deployment
      - production deployment
      - rollback capability
```

### 9.2 インフラ構成

#### 9.2.1 本番環境
```
- Container: Docker + Kubernetes
- Load Balancer: AWS ALB / Nginx
- Database: PostgreSQL (RDS)
- Cache: Redis (ElastiCache)
- Storage: S3 + CloudFront
- Monitoring: Prometheus + Grafana
```

#### 9.2.2 開発環境
```
- Local: Docker Compose
- Staging: Kubernetes (Minikube)
- Database: PostgreSQL (Local)
- Cache: Redis (Local)
- Storage: MinIO (Local S3)
```

## 10. バックアップ・災害復旧

### 10.1 バックアップ戦略

#### 10.1.1 データバックアップ
```
- Database: 日次フルバックアップ + 増分バックアップ
- Files: リアルタイム同期 + 日次スナップショット
- Configuration: Git管理 + 環境変数バックアップ
```

#### 10.1.2 復旧手順
```
1. 障害検知・分析
2. 影響範囲確認
3. バックアップからの復旧
4. データ整合性確認
5. サービス再開
6. 事後分析・改善
```