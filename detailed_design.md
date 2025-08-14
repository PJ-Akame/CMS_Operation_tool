# Astro CMS & SNS自動投稿ツール 詳細設計書

## 1. コンポーネント詳細設計

### 1.1 メインアプリケーションコンポーネント

#### 1.1.1 CMS_SNS_Tool コンポーネント

**概要**: アプリケーションのルートコンポーネント

**状態管理**:
```typescript
interface AppState {
  activeTab: TabType;
  selectedFile: string | null;
  previewMode: boolean;
  fileContent: string;
  originalContent: string;
  expandedFolders: Set<string>;
  hasChanges: boolean;
  storageStatus: 'connected' | 'saved' | 'error';
  autoSave: boolean;
  lastSaved: string;
  templates: TemplateCollection;
  showTemplateModal: boolean;
  templateCategory: string;
}

type TabType = 'dashboard' | 'content' | 'templates' | 'preview' | 'sns' | 'analytics' | 'settings';

interface TemplateCollection {
  news: Template[];
  sns: Template[];
  pages: Template[];
}
```

**主要メソッド**:
```typescript
// ファイル操作
const selectFile = (path: string): void => {
  // ファイル選択処理
  // リポジトリ構造からファイル取得
  // エディタにコンテンツ設定
};

const updateFileContent = (newContent: string): void => {
  // ファイル内容更新
  // 変更フラグ更新
  // 自動保存トリガー
};

const saveFile = (): void => {
  // ファイル保存処理
  // GitHub API連携
  // 状態更新
};

// テンプレート操作
const saveAsTemplate = (): void => {
  // 現在のコンテンツをテンプレート化
  // カテゴリ自動判定
  // データ永続化
};

const applyTemplate = (template: Template): void => {
  // テンプレート適用
  // エディタに内容設定
  // 変更フラグ設定
};

// データ永続化
const saveToStorage = (data: any): void => {
  // ストレージ保存シミュレーション
  // 実際の実装ではlocalStorage/API使用
  // 状態更新
};
```

### 1.2 ファイル管理コンポーネント

#### 1.2.1 FileTree コンポーネント

**概要**: GitHubリポジトリのファイル構造表示

**Props型定義**:
```typescript
interface FileTreeProps {
  structure: RepoStructure;
  onFileSelect: (path: string) => void;
  selectedFile?: string;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}

interface RepoStructure {
  [key: string]: FileNode;
}

interface FileNode {
  type: 'file' | 'folder';
  content?: string;
  children?: RepoStructure;
}
```

**レンダリングロジック**:
```typescript
const renderFileTree = (
  structure: RepoStructure, 
  currentPath = ''
): JSX.Element[] => {
  return Object.entries(structure).map(([name, item]) => {
    const fullPath = currentPath ? `${currentPath}/${name` : name;
    
    if (item.type === 'folder') {
      return renderFolderNode(name, fullPath, item);
    } else {
      return renderFileNode(name, fullPath, item);
    }
  });
};

const renderFolderNode = (
  name: string, 
  path: string, 
  item: FileNode
): JSX.Element => {
  const isExpanded = expandedFolders.has(path);
  
  return (
    <div key={path}>
      <div 
        className="folder-header"
        onClick={() => onToggleFolder(path)}
      >
        {isExpanded ? <ChevronDown /> : <ChevronRight />}
        <Folder className="icon" />
        <span>{name}</span>
      </div>
      {isExpanded && item.children && (
        <div className="folder-children">
          {renderFileTree(item.children, path)}
        </div>
      )}
    </div>
  );
};
```

#### 1.2.2 CodeEditor コンポーネント

**概要**: ファイル編集用エディタ

**Props型定義**:
```typescript
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  theme?: 'light' | 'dark';
  onSave?: () => void;
}
```

**エディタ機能実装**:
```typescript
const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  readOnly = false,
  theme = 'light',
  onSave
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // キーボードショートカット
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          onSave?.();
          break;
        case 'z':
          e.preventDefault();
          // Undo機能
          break;
        case 'y':
          e.preventDefault();
          // Redo機能
          break;
      }
    }
  };
  
  // 自動インデント
  const handleTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // カーソル位置を調整
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };
  
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        handleKeyDown(e.nativeEvent);
        handleTab(e.nativeEvent);
      }}
      className={`editor ${theme} ${language}`}
      readOnly={readOnly}
      spellCheck={false}
    />
  );
};
```

### 1.3 テンプレート管理コンポーネント

#### 1.3.1 TemplateManager コンポーネント

**概要**: テンプレートの作成・編集・削除管理

**状態管理**:
```typescript
interface TemplateManagerState {
  templates: Template[];
  filteredTemplates: Template[];
  searchQuery: string;
  categoryFilter: string;
  sortBy: 'name' | 'date' | 'category';
  sortOrder: 'asc' | 'desc';
  selectedTemplate: Template | null;
  isEditing: boolean;
}

interface Template {
  id: string;
  name: string;
  category: 'news' | 'sns' | 'pages';
  content: string;
  tags: string[];
  platforms?: string[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
}
```

**フィルタリング・ソート機能**:
```typescript
const filterAndSortTemplates = useMemo(() => {
  let filtered = templates;
  
  // カテゴリフィルター
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(t => t.category === categoryFilter);
  }
  
  // 検索フィルター
  if (searchQuery) {
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // ソート
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return filtered;
}, [templates, categoryFilter, searchQuery, sortBy, sortOrder]);
```

#### 1.3.2 TemplateCard コンポーネント

**概要**: 個別テンプレートの表示・操作

**Props型定義**:
```typescript
interface TemplateCardProps {
  template: Template;
  onApply: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onPreview: (template: Template) => void;
  isSelected?: boolean;
}
```

**アクション実装**:
```typescript
const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onApply,
  onEdit,
  onDelete,
  onPreview,
  isSelected = false
}) => {
  const handleDelete = () => {
    if (window.confirm('このテンプレートを削除しますか？')) {
      onDelete(template.id);
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'sns': return 'bg-green-100 text-green-800';
      case 'pages': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };
  
  return (
    <div className={`template-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-header">
        <h3>{template.name}</h3>
        <span className={`category-badge ${getCategoryColor(template.category)}`}>
          {template.category}
        </span>
      </div>
      
      <div className="card-content">
        <div className="content-preview">
          {template.content.substring(0, 200)}
          {template.content.length > 200 && '...'}
        </div>
        
        {template.tags.length > 0 && (
          <div className="tags">
            {template.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="metadata">
          <span className="date">作成日: {formatDate(template.createdAt)}</span>
          {template.platforms && (
            <div className="platforms">
              {template.platforms.map((platform, index) => (
                <span key={index} className="platform">{platform}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="card-actions">
        <button onClick={() => onApply(template)} className="btn-primary">
          適用
        </button>
        <button onClick={() => onPreview(template)} className="btn-secondary">
          プレビュー
        </button>
        <button onClick={() => onEdit(template)} className="btn-secondary">
          編集
        </button>
        <button onClick={handleDelete} className="btn-danger">
          削除
        </button>
      </div>
    </div>
  );
};
```

### 1.4 SNS投稿管理コンポーネント

#### 1.4.1 PostScheduler コンポーネント

**概要**: SNS投稿のスケジュール管理

**状態管理**:
```typescript
interface PostSchedulerState {
  posts: ScheduledPost[];
  selectedPlatforms: string[];
  postContent: string;
  scheduledDateTime: string;
  attachments: File[];
  isScheduling: boolean;
}

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: 'pending' | 'scheduled' | 'publishing' | 'published' | 'failed';
  attachments: string[];
  createdAt: string;
  publishedAt?: string;
  errorMessage?: string;
}
```

**投稿スケジュール処理**:
```typescript
const schedulePost = async (postData: CreatePostData): Promise<void> => {
  setIsScheduling(true);
  
  try {
    // バリデーション
    validatePostData(postData);
    
    // ファイルアップロード処理
    const uploadedAttachments = await uploadAttachments(postData.attachments);
    
    // スケジュール登録
    const post: ScheduledPost = {
      id: generateId(),
      content: postData.content,
      platforms: postData.platforms,
      scheduledAt: postData.scheduledDateTime,
      status: 'scheduled',
      attachments: uploadedAttachments,
      createdAt: new Date().toISOString()
    };
    
    // バックエンドAPI呼び出し
    await api.post('/posts', post);
    
    // 状態更新
    setPosts(prev => [...prev, post]);
    
    // フォームリセット
    resetForm();
    
    showNotification('投稿をスケジュールしました', 'success');
  } catch (error) {
    showNotification('投稿のスケジュールに失敗しました', 'error');
    console.error('Schedule post error:', error);
  } finally {
    setIsScheduling(false);
  }
};

const validatePostData = (data: CreatePostData): void => {
  if (!data.content.trim()) {
    throw new Error('投稿内容は必須です');
  }
  
  if (data.platforms.length === 0) {
    throw new Error('投稿先プラットフォームを選択してください');
  }
  
  if (new Date(data.scheduledDateTime) <= new Date()) {
    throw new Error('投稿日時は未来の時間を指定してください');
  }
  
  // プラットフォーム別文字数制限チェック
  data.platforms.forEach(platform => {
    const limit = getPlatformCharacterLimit(platform);
    if (data.content.length > limit) {
      throw new Error(`${platform}の文字数制限(${limit}文字)を超えています`);
    }
  });
};
```

#### 1.4.2 ClaudeIntegration コンポーネント

**概要**: Claude AI機能との連携

**Claude API連携**:
```typescript
interface ClaudeService {
  generateText(prompt: string, options?: GenerateOptions): Promise<string>;
  generateHashtags(content: string, platform: string): Promise<string[]>;
  analyzeTrends(topic: string): Promise<TrendAnalysis>;
  generateTemplate(type: string, requirements: string): Promise<Template>;
}

interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  platform?: string;
  tone?: 'formal' | 'casual' | 'professional' | 'friendly';
}

interface TrendAnalysis {
  keywords: string[];
  recommendedHashtags: string[];
  popularTopics: string[];
  engagementPrediction: number;
}

class ClaudeApiService implements ClaudeService {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.anthropic.com/v1';
  }
  
  async generateText(prompt: string, options: GenerateOptions = {}): Promise<string> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: options.maxTokens || 1000,
        messages: [
          {
            role: 'user',
            content: this.buildPrompt(prompt, options)
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
  }
  
  private buildPrompt(basePrompt: string, options: GenerateOptions): string {
    let prompt = basePrompt;
    
    if (options.platform) {
      prompt += `\n\nプラットフォーム: ${options.platform}`;
    }
    
    if (options.tone) {
      prompt += `\nトーン: ${options.tone}`;
    }
    
    return prompt;
  }
  
  async generateHashtags(content: string, platform: string): Promise<string[]> {
    const prompt = `
      以下の投稿内容に適したハッシュタグを5-10個提案してください。
      プラットフォーム: ${platform}
      投稿内容: ${content}
      
      ハッシュタグのみを配列形式で返してください。
    `;
    
    const response = await this.generateText(prompt);
    
    // レスポンスからハッシュタグを抽出
    const hashtags = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('#'))
      .slice(0, 10);
    
    return hashtags;
  }
}
```

### 1.5 プレビュー機能コンポーネント

#### 1.5.1 AstroPreview コンポーネント

**概要**: Astroサイトのリアルタイムプレビュー

**プレビュー実装**:
```typescript
interface AstroPreviewProps {
  content: string;
  filePath: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  isRealtime?: boolean;
}

const AstroPreview: React.FC<AstroPreviewProps> = ({
  content,
  filePath,
  deviceType,
  isRealtime = true
}) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedContent = useDebounce(content, 500);
  
  useEffect(() => {
    if (isRealtime) {
      generatePreview(debouncedContent);
    }
  }, [debouncedContent, isRealtime]);
  
  const generatePreview = async (content: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let preview = '';
      
      if (filePath.endsWith('.md')) {
        preview = await renderMarkdown(content);
      } else if (filePath.endsWith('.astro')) {
        preview = await renderAstroComponent(content);
      } else {
        preview = `<pre>${escapeHtml(content)}</pre>`;
      }
      
      setPreviewHtml(preview);
    } catch (err) {
      setError('プレビューの生成に失敗しました');
      console.error('Preview generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderMarkdown = async (markdown: string): Promise<string> => {
    // Markdownパーサーを使用してHTMLに変換
    const { marked } = await import('marked');
    
    // フロントマターの処理
    const { frontMatter, content: bodyContent } = parseFrontMatter(markdown);
    
    // マークダウンをHTMLに変換
    const htmlContent = marked(bodyContent);
    
    // テンプレートに埋め込み
    return `
      <div class="markdown-preview">
        <article class="prose max-w-none">
          ${htmlContent}
        </article>
      </div>
    `;
  };
  
  const renderAstroComponent = async (astroContent: string): Promise<string> => {
    // Astroコンポーネントの簡易プレビュー
    // 実際の実装では、Astroのビルドプロセスを実行
    
    // フロントマターとコンテンツを分離
    const { frontMatter, content } = parseFrontMatter(astroContent);
    
    // 簡易的なAstroコンポーネントレンダリング
    let rendered = content;
    
    // 変数置換
    Object.entries(frontMatter).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    });
    
    return rendered;
  };
  
  const getDeviceStyles = (): React.CSSProperties => {
    switch (deviceType) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' };
      case 'desktop':
      default:
        return { width: '100%' };
    }
  };
  
  if (isLoading) {
    return (
      <div className="preview-loading">
        <div className="loading-spinner"></div>
        <p>プレビューを生成中...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="preview-error">
        <p>{error}</p>
        <button onClick={() => generatePreview(content)}>
          再試行
        </button>
      </div>
    );
  }
  
  return (
    <div className="astro-preview" style={getDeviceStyles()}>
      <div 
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </div>
  );
};
```

### 1.6 データ永続化機能

#### 1.6.1 StorageService クラス

**概要**: データの保存・読み込み処理

```typescript
interface StorageOptions {
  encryption?: boolean;
  compression?: boolean;
  ttl?: number; // Time to live in seconds
}

interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

class StorageService {
  private prefix: string;
  private fallbackStorage: Map<string, any>;
  
  constructor(prefix = 'cms_') {
    this.prefix = prefix;
    this.fallbackStorage = new Map();
  }
  
  async save<T>(key: string, data: T, options: StorageOptions = {}): Promise<StorageResult<T>> {
    try {
      const storageKey = this.prefix + key;
      const timestamp = new Date().toISOString();
      
      let processedData = data;
      
      // 圧縮処理
      if (options.compression) {
        processedData = await this.compress(data);
      }
      
      // 暗号化処理
      if (options.encryption) {
        processedData = await this.encrypt(processedData);
      }
      
      const storageItem = {
        data: processedData,
        timestamp,
        ttl: options.ttl,
        metadata: {
          compressed: options.compression,
          encrypted: options.encryption
        }
      };
      
      // ストレージ保存試行
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(storageKey, JSON.stringify(storageItem));
      } else {
        // フォールバック: メモリストレージ
        this.fallbackStorage.set(storageKey, storageItem);
      }
      
      return {
        success: true,
        data,
        timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: `保存エラー: ${error.message}`
      };
    }
  }
  
  async load<T>(key: string): Promise<StorageResult<T>> {
    try {
      const storageKey = this.prefix + key;
      let storageItem: any;
      
      // データ取得
      if (this.isLocalStorageAvailable()) {
        const stored = localStorage.getItem(storageKey);
        if (!stored) {
          return { success: false, error: 'データが見つかりません' };
        }
        storageItem = JSON.parse(stored);
      } else {
        storageItem = this.fallbackStorage.get(storageKey);
        if (!storageItem) {
          return { success: false, error: 'データが見つかりません' };
        }
      }
      
      // TTLチェック
      if (storageItem.ttl) {
        const createdAt = new Date(storageItem.timestamp);
        const expiredAt = new Date(createdAt.getTime() + storageItem.ttl * 1000);
        if (new Date() > expiredAt) {
          await this.remove(key);
          return { success: false, error: 'データの有効期限が切れています' };
        }
      }
      
      let data = storageItem.data;
      
      // 復号化処理
      if (storageItem.metadata.encrypted) {
        data = await this.decrypt(data);
      }
      
      // 展開処理
      if (storageItem.metadata.compressed) {
        data = await this.decompress(data);
      }
      
      return {
        success: true,
        data,
        timestamp: storageItem.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: `読み込みエラー: ${error.message}`
      };
    }
  }
  
  async remove(key: string): Promise<boolean> {
    try {
      const storageKey = this.prefix + key;
      
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(storageKey);
      } else {
        this.fallbackStorage.delete(storageKey);
      }
      
      return true;
    } catch (error) {
      console.error('Remove error:', error);
      return false;
    }
  }
  
  async clear(): Promise<boolean> {
    try {
      if (this.isLocalStorageAvailable()) {
        // プレフィックス付きのキーのみ削除
        Object.keys(localStorage)
          .filter(key => key.startsWith(this.prefix))
          .forEach(key => localStorage.removeItem(key));
      } else {
        this.fallbackStorage.clear();
      }
      
      return true;
    } catch (error) {
      console.error('Clear error:', error);
      return false;
    }
  }
  
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
  
  private async compress<T>(data: T): Promise<string> {
    // 簡易圧縮実装（実際にはライブラリを使用）
    return JSON.stringify(data);
  }
  
  private async decompress<T>(data: string): Promise<T> {
    // 簡易展開実装
    return JSON.parse(data);
  }
  
  private async encrypt<T>(data: T): Promise<string> {
    // 簡易暗号化実装（実際にはWeb Crypto APIを使用）
    return btoa(JSON.stringify(data));
  }
  
  private async decrypt<T>(data: string): Promise<T> {
    // 簡易復号化実装
    return JSON.parse(atob(data));
  }
}
```

## 2. API設計詳細

### 2.1 GitHub API連携詳細

#### 2.1.1 GitHubService クラス

```typescript
interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  baseUrl?: string;
}

interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
  encoding?: 'base64' | 'utf-8';
}

interface CommitInfo {
  message: string;
  author?: {
    name: string;
    email: string;
  };
  branch?: string;
}

class GitHubService {
  private config: GitHubConfig;
  private baseUrl: string;
  
  constructor(config: GitHubConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.github.com';
  }
  
  async getFileTree(path = ''): Promise<GitHubTreeNode[]> {
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;
    
    const response = await this.makeRequest(url);
    
    if (Array.isArray(response)) {
      return response.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type,
        sha: item.sha,
        size: item.size
      }));
    } else {
      throw new Error('ディレクトリの取得に失敗しました');
    }
  }
  
  async getFileContent(path: string): Promise<GitHubFile> {
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;
    
    const response = await this.makeRequest(url);
    
    if (response.type !== 'file') {
      throw new Error('指定されたパスはファイルではありません');
    }
    
    const content = response.encoding === 'base64' 
      ? atob(response.content.replace(/\n/g, ''))
      : response.content;
    
    return {
      path: response.path,
      content,
      sha: response.sha,
      encoding: response.encoding
    };
  }
  
  async updateFile(file: GitHubFile, commitInfo: CommitInfo): Promise<boolean> {
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${file.path}`;
    
    const requestBody = {
      message: commitInfo.message,
      content: btoa(file.content), // Base64エンコード
      sha: file.sha,
      branch: commitInfo.branch || 'main',
      author: commitInfo.author
    };
    
    try {
      await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      });
      
      return true;
    } catch (error) {
      console.error('File update error:', error);
      return false;
    }
  }
  
  async createFile(file: GitHubFile, commitInfo: CommitInfo): Promise<boolean> {
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${file.path}`;
    
    const requestBody = {
      message: commitInfo.message,
      content: btoa(file.content),
      branch: commitInfo.branch || 'main',
      author: commitInfo.author
    };
    
    try {
      await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      });
      
      return true;
    } catch (error) {
      console.error('File creation error:', error);
      return false;
    }
  }
  
  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    const defaultOptions: RequestInit = {
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API Error: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  }
}
```

### 2.2 差分管理機能詳細

#### 2.2.1 DiffCalculator クラス

```typescript
interface DiffLine {
  type: 'added' | 'deleted' | 'modified' | 'unchanged';
  lineNumber: number;
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
  oldContent?: string;
}

interface DiffResult {
  lines: DiffLine[];
  stats: {
    additions: number;
    deletions: number;
    modifications: number;
  };
}

class DiffCalculator {
  static calculate(oldContent: string, newContent: string): DiffResult {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    const lcs = this.longestCommonSubsequence(oldLines, newLines);
    const diff = this.generateDiff(oldLines, newLines, lcs);
    
    return {
      lines: diff,
      stats: this.calculateStats(diff)
    };
  }
  
  private static longestCommonSubsequence(oldLines: string[], newLines: string[]): number[][] {
    const m = oldLines.length;
    const n = newLines.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    return dp;
  }
  
  private static generateDiff(oldLines: string[], newLines: string[], lcs: number[][]): DiffLine[] {
    const result: DiffLine[] = [];
    let i = oldLines.length;
    let j = newLines.length;
    let oldLineNum = oldLines.length;
    let newLineNum = newLines.length;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        result.unshift({
          type: 'unchanged',
          lineNumber: i,
          oldLineNumber: i,
          newLineNumber: j,
          content: oldLines[i - 1]
        });
        i--;
        j--;
        oldLineNum--;
        newLineNum--;
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        result.unshift({
          type: 'added',
          lineNumber: j,
          newLineNumber: j,
          content: newLines[j - 1]
        });
        j--;
        newLineNum--;
      } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
        result.unshift({
          type: 'deleted',
          lineNumber: i,
          oldLineNumber: i,
          content: oldLines[i - 1]
        });
        i--;
        oldLineNum--;
      }
    }
    
    return result;
  }
  
  private static calculateStats(diff: DiffLine[]): DiffResult['stats'] {
    return diff.reduce(
      (stats, line) => {
        switch (line.type) {
          case 'added':
            stats.additions++;
            break;
          case 'deleted':
            stats.deletions++;
            break;
          case 'modified':
            stats.modifications++;
            break;
        }
        return stats;
      },
      { additions: 0, deletions: 0, modifications: 0 }
    );
  }
}
```

## 3. ユーティリティ関数詳細

### 3.1 バリデーション関数

```typescript
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class Validator {
  static validateTemplate(template: Partial<Template>): ValidationResult {
    const errors: string[] = [];
    
    // 名前の検証
    if (!template.name || template.name.trim().length === 0) {
      errors.push('テンプレート名は必須です');
    } else if (template.name.length > 100) {
      errors.push('テンプレート名は100文字以内で入力してください');
    }
    
    // カテゴリの検証
    const validCategories = ['news', 'sns', 'pages'];
    if (!template.category || !validCategories.includes(template.category)) {
      errors.push('有効なカテゴリを選択してください');
    }
    
    // コンテンツの検証
    if (!template.content || template.content.trim().length === 0) {
      errors.push('テンプレートの内容は必須です');
    } else if (template.content.length > 10000) {
      errors.push('テンプレートの内容は10,000文字以内で入力してください');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validatePost(post: Partial<ScheduledPost>): ValidationResult {
    const errors: string[] = [];
    
    // コンテンツの検証
    if (!post.content || post.content.trim().length === 0) {
      errors.push('投稿内容は必須です');
    }
    
    // プラットフォームの検証
    if (!post.platforms || post.platforms.length === 0) {
      errors.push('投稿先プラットフォームを選択してください');
    }
    
    // プラットフォーム別文字数制限
    if (post.content && post.platforms) {
      post.platforms.forEach(platform => {
        const limit = this.getPlatformCharacterLimit(platform);
        if (post.content!.length > limit) {
          errors.push(`${platform}の文字数制限(${limit}文字)を超えています`);
        }
      });
    }
    
    // スケジュール日時の検証
    if (post.scheduledAt) {
      const scheduledDate = new Date(post.scheduledAt);
      if (scheduledDate <= new Date()) {
        errors.push('投稿日時は未来の時間を指定してください');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  private static getPlatformCharacterLimit(platform: string): number {
    const limits = {
      twitter: 280,
      youtube: 5000,
      discord: 2000,
      tiktok: 150
    };
    
    return limits[platform.toLowerCase()] || 1000;
  }
}
```

### 3.2 フォーマッティング関数

```typescript
class Formatter {
  static formatDate(date: string | Date, format = 'ja-JP'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString(format, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  static formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  static truncateText(text: string, maxLength: number, suffix = '...'): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }
  
  static formatHashtags(tags: string[]): string {
    return tags
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
      .join(' ');
  }
  
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }
}
```

## 4. エラーハンドリング

### 4.1 エラー分類

```typescript
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  SNS_API_ERROR = 'SNS_API_ERROR',
  CLAUDE_API_ERROR = 'CLAUDE_API_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

class ErrorHandler {
  static handle(error: Error | AppError, context?: string): void {
    const appError = this.normalizeError(error);
    
    // ログ出力
    console.error(`[${context || 'Unknown'}] ${appError.type}:`, appError);
    
    // ユーザー通知
    this.notifyUser(appError);
    
    // エラー報告（本番環境）
    if (process.env.NODE_ENV === 'production') {
      this.reportError(appError, context);
    }
  }
  
  private static normalizeError(error: Error | AppError): AppError {
    if (this.isAppError(error)) {
      return error;
    }
    
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message || 'An unknown error occurred',
      timestamp: new Date().toISOString()
    };
  }
  
  private static isAppError(error: any): error is AppError {
    return error && typeof error.type === 'string' && error.timestamp;
  }
  
  private static notifyUser(error: AppError): void {
    const userMessage = this.getUserFriendlyMessage(error);
    
    // 通知システム（Toast等）
    if (window.showNotification) {
      window.showNotification(userMessage, 'error');
    }
  }
  
  private static getUserFriendlyMessage(error: AppError): string {
    const messages = {
      [ErrorType.VALIDATION_ERROR]: '入力内容に誤りがあります',
      [ErrorType.NETWORK_ERROR]: 'ネットワークエラーが発生しました',
      [ErrorType.AUTH_ERROR]: '認証エラーが発生しました',
      [ErrorType.STORAGE_ERROR]: 'データの保存に失敗しました',
      [ErrorType.GITHUB_API_ERROR]: 'GitHubとの連携でエラーが発生しました',
      [ErrorType.SNS_API_ERROR]: 'SNS投稿でエラーが発生しました',
      [ErrorType.CLAUDE_API_ERROR]: 'AI機能でエラーが発生しました',
      [ErrorType.UNKNOWN_ERROR]: '予期しないエラーが発生しました'
    };
    
    return messages[error.type] || error.message;
  }
  
  private static reportError(error: AppError, context?: string): void {
    // エラー監視サービス（Sentry等）への報告
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error, context, userAgent: navigator.userAgent })
    }).catch(console.error);
  }
}
```

## 5. パフォーマンス最適化

### 5.1 React最適化

```typescript
// メモ化によるレンダリング最適化
const TemplateCard = React.memo<TemplateCardProps>(({
  template,
  onApply,
  onEdit,
  onDelete
}) => {
  // コンポーネント実装
}, (prevProps, nextProps) => {
  // カスタム比較関数
  return (
    prevProps.template.id === nextProps.template.id &&
    prevProps.template.updatedAt === nextProps.template.updatedAt
  );
});

// useMemoによる重い計算の最適化
const filteredTemplates = useMemo(() => {
  return templates
    .filter(template => {
      if (categoryFilter !== 'all' && template.category !== categoryFilter) {
        return false;
      }
      if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
}, [templates, categoryFilter, searchQuery, sortBy]);

// useCallbackによるコールバック最適化
const handleTemplateApply = useCallback((template: Template) => {
  setFileContent(template.content);
  setHasChanges(true);
  setShowTemplateModal(false);
}, []);
```

### 5.2 非同期処理最適化

```typescript
// デバウンス処理
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 並列処理による高速化
class BatchProcessor {
  static async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize = 5
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      );
      results.push(...batchResults);
    }
    
    return results;
  }
}

// キャッシュ機能
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set<T>(key: string, data: T, ttl = 300000): void { // デフォルト5分
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
}
```