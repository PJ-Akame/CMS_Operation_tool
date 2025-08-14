import React, { useState, useCallback, useEffect } from 'react';
import { 
  Home, 
  FileEdit, 
  Eye, 
  Share2, 
  BarChart3, 
  Settings, 
  Github, 
  Twitter, 
  Youtube, 
  MessageSquare,
  Calendar,
  Hash,
  TrendingUp,
  Sparkles,
  Save,
  Play,
  Clock,
  Plus,
  Edit3,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  GitBranch,
  GitCommit,
  Diff,
  Check,
  X,
  RefreshCw,
  Download,
  Upload,
  Scan,
  Wand2,
  Code,
  Layout,
  Database
} from 'lucide-react';

// 動的コンテンツフォームコンポーネント
const DynamicContentForm = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={index} className={field.suggested ? 'border-2 border-dashed border-yellow-300 p-3 rounded-lg' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.suggested && <span className="text-yellow-600 ml-1">(提案)</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">選択してください</option>
                {field.options?.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'date' ? (
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
              />
            ) : (
              <input
                type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
              />
            )}
            
            {field.reason && (
              <p className="mt-1 text-xs text-yellow-600">{field.reason}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          生成
        </button>
        <button
          type="button"
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          onClick={() => setFormData({})}
        >
          <X className="w-4 h-4 mr-2" />
          リセット
        </button>
      </div>
    </form>
  );
};

// スキーマ設定モーダルコンポーネント
const SchemaConfigModal = ({ schema, framework, onSave, onCancel }) => {
  const [editedSchema, setEditedSchema] = useState(schema);

  const handleSave = () => {
    onSave(editedSchema);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          {framework} フレームワーク用スキーマ設定
        </h4>
        <p className="text-sm text-blue-700">
          検出されたフィールドと提案フィールドを確認し、必要に応じて調整してください。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">検出されたフィールド</h4>
          <div className="space-y-2 max-h-60 overflow-auto">
            {editedSchema.detectedFields.map((field, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{field}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {editedSchema.fieldTypes[field]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">提案フィールド</h4>
          <div className="space-y-2 max-h-60 overflow-auto">
            {editedSchema.suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{suggestion.field}</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {suggestion.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{suggestion.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Check className="w-4 h-4 mr-2" />
          保存してフォーム生成
        </button>
        <button
          onClick={onCancel}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          キャンセル
        </button>
      </div>
    </div>
  );
};

const CMS_SNS_Tool = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src', 'src/content', 'src/pages']));
  const [hasChanges, setHasChanges] = useState(false);
  
  // データ永続化用の状態
  const [storageStatus, setStorageStatus] = useState('connected');
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(new Date().toLocaleString());
  
  // テンプレート管理の状態
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateCategory, setTemplateCategory] = useState('all');

  // 新機能: オブジェクト解析・GUI自動生成
  const [detectedFramework, setDetectedFramework] = useState('astro');
  const [contentSchema, setContentSchema] = useState(null);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [schemaPreview, setSchemaPreview] = useState(null);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [generatedForm, setGeneratedForm] = useState(null);

  // フレームワーク検出設定
  const supportedFrameworks = {
    astro: {
      name: 'Astro',
      icon: '🚀',
      configFiles: ['astro.config.mjs', 'astro.config.js', 'astro.config.ts'],
      contentPatterns: ['/src/content/', '/src/pages/'],
      frontMatterStyle: 'yaml',
      previewComponent: 'AstroPreview'
    },
    nextjs: {
      name: 'Next.js',
      icon: '⚡',
      configFiles: ['next.config.js', 'next.config.mjs', 'next.config.ts'],
      contentPatterns: ['/content/', '/posts/', '/blog/', '/pages/'],
      frontMatterStyle: 'yaml',
      previewComponent: 'NextPreview'
    },
    nuxt: {
      name: 'Nuxt.js',
      icon: '💚',
      configFiles: ['nuxt.config.js', 'nuxt.config.ts'],
      contentPatterns: ['/content/', '/assets/content/'],
      frontMatterStyle: 'yaml',
      previewComponent: 'NuxtPreview'
    },
    svelte: {
      name: 'SvelteKit',
      icon: '🧡',
      configFiles: ['svelte.config.js', 'vite.config.js'],
      contentPatterns: ['/src/content/', '/src/posts/'],
      frontMatterStyle: 'yaml',
      previewComponent: 'SveltePreview'
    },
    gatsby: {
      name: 'Gatsby',
      icon: '🟣',
      configFiles: ['gatsby-config.js', 'gatsby-config.ts'],
      contentPatterns: ['/content/', '/src/content/', '/blog/'],
      frontMatterStyle: 'yaml',
      previewComponent: 'GatsbyPreview'
    },
    remix: {
      name: 'Remix',
      icon: '🎵',
      configFiles: ['remix.config.js'],
      contentPatterns: ['/app/content/', '/content/'],
      frontMatterStyle: 'yaml',
      previewComponent: 'RemixPreview'
    },
    hugo: {
      name: 'Hugo',
      icon: '⚡',
      configFiles: ['config.yaml', 'config.toml', 'hugo.yaml'],
      contentPatterns: ['/content/', '/posts/'],
      frontMatterStyle: 'toml',
      previewComponent: 'HugoPreview'
    },
    jekyll: {
      name: 'Jekyll',
      icon: '💎',
      configFiles: ['_config.yml'],
      contentPatterns: ['/_posts/', '/content/'],
      frontMatterStyle: 'yaml',
      previewComponent: 'JekyllPreview'
    }
  };

  // 永続化されたテンプレートデータ
  const [templates, setTemplates] = useState({
    news: [
      {
        id: 1,
        name: "新製品リリーステンプレート",
        category: "news",
        content: "---\ntitle: \"[製品名]リリースのお知らせ\"\ndate: \"[日付]\"\nauthor: \"広報部\"\n---\n\n# [製品名]リリースのお知らせ\n\n[日付]、弊社の新製品「[製品名]」をリリースいたします。\n\n## 主な特徴\n- [特徴1]\n- [特徴2]\n- [特徴3]\n\n## 価格・提供開始日\n- 価格: [価格]\n- 提供開始: [開始日]\n\nお客様にはより良いサービスを提供してまいります。",
        tags: ["#新製品", "#リリース", "#お知らせ"],
        createdAt: "2024-08-10"
      },
      {
        id: 2,
        name: "イベント告知テンプレート",
        category: "news",
        content: "---\ntitle: \"[イベント名]開催のお知らせ\"\ndate: \"[日付]\"\nauthor: \"イベント企画部\"\n---\n\n# [イベント名]開催のお知らせ\n\n[イベント概要]\n\n## 開催概要\n- 日時: [日時]\n- 場所: [場所]\n- 定員: [定員]名\n- 参加費: [参加費]\n\n## お申し込み\n[申し込み方法]\n\n皆様のご参加をお待ちしております。",
        tags: ["#イベント", "#開催", "#参加募集"],
        createdAt: "2024-08-09"
      }
    ],
    sns: [
      {
        id: 3,
        name: "新製品SNS投稿テンプレート",
        category: "sns",
        content: "🎉 新製品「[製品名]」をリリースしました！\n\n✨ 主な特徴：\n🔹 [特徴1]\n🔹 [特徴2]\n🔹 [特徴3]\n\n詳細はプロフィールのリンクをチェック👆\n\n#新製品 #リリース #[製品カテゴリ]",
        tags: ["#新製品", "#リリース", "#お知らせ"],
        platforms: ["Twitter", "Discord"],
        createdAt: "2024-08-10"
      },
      {
        id: 4,
        name: "イベント告知SNSテンプレート",
        category: "sns",
        content: "📅 [イベント名]開催決定！\n\n🗓️ 日時：[日時]\n📍 場所：[場所]\n👥 定員：[定員]名\n\n[イベントの魅力的な説明]\n\nお申し込みはプロフィールリンクから💫\n\n#イベント #参加募集 #[関連タグ]",
        tags: ["#イベント", "#開催", "#参加募集"],
        platforms: ["Twitter", "Discord", "YouTube"],
        createdAt: "2024-08-09"
      }
    ],
    pages: [
      {
        id: 5,
        name: "会社概要ページテンプレート",
        category: "pages",
        content: "---\ntitle: \"会社概要\"\nlayout: \"../layouts/PageLayout.astro\"\n---\n\n<section class=\"company-overview\">\n  <h1>会社概要</h1>\n  \n  <div class=\"company-info\">\n    <h2>基本情報</h2>\n    <dl>\n      <dt>会社名</dt>\n      <dd>[会社名]</dd>\n      <dt>設立</dt>\n      <dd>[設立年月日]</dd>\n      <dt>資本金</dt>\n      <dd>[資本金]</dd>\n      <dt>代表者</dt>\n      <dd>[代表者名]</dd>\n      <dt>所在地</dt>\n      <dd>[住所]</dd>\n    </dl>\n  </div>\n  \n  <div class=\"business-content\">\n    <h2>事業内容</h2>\n    <ul>\n      <li>[事業内容1]</li>\n      <li>[事業内容2]</li>\n      <li>[事業内容3]</li>\n    </ul>\n  </div>\n</section>",
        tags: ["#会社概要", "#企業情報"],
        createdAt: "2024-08-08"
      }
    ]
  });

  const navigation = [
    { id: 'dashboard', name: 'ダッシュボード', icon: Home },
    { id: 'content', name: 'コンテンツ管理', icon: FileEdit },
    { id: 'schema', name: 'スキーマ解析', icon: Scan },
    { id: 'templates', name: 'テンプレート', icon: File },
    { id: 'preview', name: 'プレビュー', icon: Eye },
    { id: 'sns', name: 'SNS投稿', icon: Share2 },
    { id: 'analytics', name: '解析・分析', icon: BarChart3 },
    { id: 'settings', name: '設定', icon: Settings },
  ];

  // サンプルリポジトリ構造
  const repoStructure = {
    'README.md': { type: 'file', content: '# 会社コーポレートサイト\n\nAstroで構築されたコーポレートサイトです。' },
    'package.json': { type: 'file', content: '{\n  "name": "corporate-site",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "astro dev",\n    "build": "astro build"\n  },\n  "dependencies": {\n    "astro": "^4.0.0"\n  }\n}' },
    'astro.config.mjs': { type: 'file', content: 'import { defineConfig } from \'astro/config\';\n\nexport default defineConfig({});' },
    'src': {
      type: 'folder',
      children: {
        'pages': {
          type: 'folder',
          children: {
            'index.astro': { type: 'file', content: '---\ntitle: "ホーム"\n---\n\n<html>\n<head>\n  <title>{title}</title>\n</head>\n<body>\n  <h1>会社ホームページ</h1>\n  <p>私たちの会社について</p>\n</body>\n</html>' },
            'about.astro': { type: 'file', content: '---\ntitle: "会社概要"\n---\n\n<html>\n<head>\n  <title>{title}</title>\n</head>\n<body>\n  <h1>会社概要</h1>\n  <p>設立: 2020年</p>\n  <p>従業員数: 50名</p>\n</body>\n</html>' },
            'contact.astro': { type: 'file', content: '---\ntitle: "お問い合わせ"\n---\n\n<html>\n<head>\n  <title>{title}</title>\n</head>\n<body>\n  <h1>お問い合わせ</h1>\n  <p>TEL: 03-1234-5678</p>\n  <p>Email: info@company.com</p>\n</body>\n</html>' }
          }
        },
        'content': {
          type: 'folder',
          children: {
            'news': {
              type: 'folder',
              children: {
                'news-2024-08-01.md': { type: 'file', content: '---\ntitle: "新製品リリースのお知らせ"\ndate: "2024-08-01"\nauthor: "広報部"\ntags: ["新製品", "リリース"]\ncategory: "ニュース"\n---\n\n# 新製品リリースのお知らせ\n\n2024年8月1日、弊社の新製品をリリースいたします。\n\n## 主な特徴\n- 高性能\n- 省エネ\n- コスト効率\n\nお客様にはより良いサービスを提供してまいります。' },
                'news-2024-07-15.md': { type: 'file', content: '---\ntitle: "夏季休業のお知らせ"\ndate: "2024-07-15"\nauthor: "総務部"\ntags: ["お知らせ"]\ncategory: "ニュース"\n---\n\n# 夏季休業のお知らせ\n\n平素は格別のご高配を賜り、厚く御礼申し上げます。\n\n弊社では下記の期間を夏季休業とさせていただきます。\n\n**休業期間：2024年8月10日（土）～ 8月18日（日）**\n\nご不便をおかけいたしますが、何卒ご了承ください。' }
              }
            },
            'pages': {
              type: 'folder',
              children: {
                'company-info.md': { type: 'file', content: '---\ntitle: "会社情報"\ndescription: "株式会社サンプルの会社情報"\npublishedAt: "2024-01-01"\nauthor: "管理者"\n---\n\n# 会社情報\n\n## 基本情報\n- 会社名: 株式会社サンプル\n- 設立: 2020年4月1日\n- 資本金: 1,000万円\n- 代表者: 山田太郎\n\n## 事業内容\n- ソフトウェア開発\n- Webサイト制作\n- ITコンサルティング' }
              }
            }
          }
        },
        'components': {
          type: 'folder',
          children: {
            'Header.astro': { type: 'file', content: '---\n---\n\n<header class="header">\n  <nav>\n    <a href="/">ホーム</a>\n    <a href="/about">会社概要</a>\n    <a href="/contact">お問い合わせ</a>\n  </nav>\n</header>\n\n<style>\n.header {\n  background: #f8f9fa;\n  padding: 1rem;\n}\n</style>' },
            'Footer.astro': { type: 'file', content: '---\n---\n\n<footer class="footer">\n  <p>&copy; 2024 株式会社サンプル. All rights reserved.</p>\n</footer>\n\n<style>\n.footer {\n  background: #343a40;\n  color: white;\n  text-align: center;\n  padding: 2rem;\n}\n</style>' }
          }
        }
      }
    },
    'public': {
      type: 'folder',
      children: {
        'favicon.ico': { type: 'file', content: 'Binary file' },
        'logo.png': { type: 'file', content: 'Binary file' }
      }
    }
  };

  const recentFiles = [
    { name: 'news-2024-08.md', path: 'src/content/news/', modified: '2時間前', status: 'draft' },
    { name: 'about.astro', path: 'src/pages/', modified: '1日前', status: 'published' },
    { name: 'company-info.md', path: 'src/content/pages/', modified: '3日前', status: 'published' }
  ];

  const scheduledPosts = [
    { platform: 'Twitter', content: '新製品リリースのお知らせ...', scheduledFor: '今日 14:00', status: 'pending' },
    { platform: 'YouTube', content: '会社説明動画の投稿', scheduledFor: '明日 10:00', status: 'pending' },
    { platform: 'Discord', content: 'コミュニティへのお知らせ', scheduledFor: '今日 18:00', status: 'scheduled' }
  ];

  // フレームワーク検出機能
  const detectFramework = useCallback(() => {
    setIsAnalyzing(true);
    
    try {
      // リポジトリ構造からフレームワークを検出
      const detectedConfigs = [];
      
      Object.entries(supportedFrameworks).forEach(([key, framework]) => {
        framework.configFiles.forEach(configFile => {
          if (repoStructure[configFile]) {
            detectedConfigs.push({ framework: key, confidence: 0.9, configFile });
          }
        });
      });
      
      // package.json の dependencies から検出
      if (repoStructure['package.json']) {
        const packageContent = repoStructure['package.json'].content;
        try {
          const pkg = JSON.parse(packageContent);
          const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
          
          if (dependencies.astro) {
            detectedConfigs.push({ framework: 'astro', confidence: 0.95, source: 'package.json' });
          }
          if (dependencies.next) {
            detectedConfigs.push({ framework: 'nextjs', confidence: 0.95, source: 'package.json' });
          }
          if (dependencies.nuxt) {
            detectedConfigs.push({ framework: 'nuxt', confidence: 0.95, source: 'package.json' });
          }
          if (dependencies['@sveltejs/kit']) {
            detectedConfigs.push({ framework: 'svelte', confidence: 0.95, source: 'package.json' });
          }
          if (dependencies.gatsby) {
            detectedConfigs.push({ framework: 'gatsby', confidence: 0.95, source: 'package.json' });
          }
          if (dependencies['@remix-run/node']) {
            detectedConfigs.push({ framework: 'remix', confidence: 0.95, source: 'package.json' });
          }
        } catch (e) {
          console.warn('package.json の解析に失敗:', e);
        }
      }
      
      // 最も信頼度の高いフレームワークを選択
      if (detectedConfigs.length > 0) {
        const bestMatch = detectedConfigs.reduce((best, current) => 
          current.confidence > best.confidence ? current : best
        );
        setDetectedFramework(bestMatch.framework);
      }
    } catch (error) {
      console.error('フレームワーク検出エラー:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [repoStructure]);

  // コンテンツスキーマ解析
  const analyzeContentSchema = useCallback((contentPath) => {
    setIsAnalyzing(true);
    
    try {
      const schema = {
        detectedFields: [],
        sampleContent: {},
        fieldTypes: {},
        suggestions: []
      };
      
      // 指定パスのファイルを解析
      const analyzeFileStructure = (structure, currentPath = '') => {
        Object.entries(structure).forEach(([name, item]) => {
          const fullPath = currentPath ? `${currentPath}/${name}` : name;
          
          if (item.type === 'file' && (name.endsWith('.md') || name.endsWith('.mdx'))) {
            const content = item.content;
            const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            
            if (frontMatterMatch) {
              try {
                const frontMatter = parseFrontMatter(frontMatterMatch[1]);
                
                Object.entries(frontMatter).forEach(([field, value]) => {
                  if (!schema.detectedFields.includes(field)) {
                    schema.detectedFields.push(field);
                    schema.fieldTypes[field] = detectFieldType(value);
                    schema.sampleContent[field] = value;
                  }
                });
              } catch (e) {
                console.warn('フロントマター解析エラー:', e);
              }
            }
            
            // 本文からメタデータ抽出
            const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
            const bodyAnalysis = analyzeBodyContent(bodyContent);
            
            Object.entries(bodyAnalysis).forEach(([field, data]) => {
              if (!schema.detectedFields.includes(field)) {
                schema.detectedFields.push(field);
                schema.fieldTypes[field] = data.type;
                schema.sampleContent[field] = data.sample;
              }
            });
          } else if (item.type === 'folder') {
            analyzeFileStructure(item.children, fullPath);
          }
        });
      };
      
      // 分析実行
      analyzeFileStructure(repoStructure);
      
      // 追加提案
      addSchemaSuggestions(schema);
      
      setContentSchema(schema);
      generateDynamicForm(schema);
      
    } catch (error) {
      console.error('スキーマ解析エラー:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [repoStructure]);

  // フロントマター解析
  const parseFrontMatter = (yamlString) => {
    const result = {};
    const lines = yamlString.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
          const key = trimmed.substring(0, colonIndex).trim();
          let value = trimmed.substring(colonIndex + 1).trim();
          
          // クォート除去
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          // 配列形式の処理
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              value = JSON.parse(value);
            } catch {
              value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
            }
          }
          
          // 日付の処理
          if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
            value = new Date(value);
          }
          
          result[key] = value;
        }
      }
    });
    
    return result;
  };

  // フィールドタイプ検出
  const detectFieldType = (value) => {
    if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
      return 'date';
    }
    if (Array.isArray(value)) {
      return 'array';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    if (typeof value === 'number') {
      return 'number';
    }
    if (typeof value === 'string') {
      if (value.length > 100) {
        return 'textarea';
      }
      if (value.includes('http://') || value.includes('https://')) {
        return 'url';
      }
      if (value.includes('@')) {
        return 'email';
      }
      return 'text';
    }
    return 'text';
  };

  // 本文コンテンツ解析
  const analyzeBodyContent = (content) => {
    const analysis = {};
    
    // 画像リンク抽出
    const imageMatches = content.match(/!\[.*?\]\((.*?)\)/g);
    if (imageMatches && imageMatches.length > 0) {
      analysis.images = {
        type: 'array',
        sample: imageMatches.map(match => {
          const urlMatch = match.match(/\((.*?)\)/);
          return urlMatch ? urlMatch[1] : '';
        })
      };
    }
    
    // リンク抽出
    const linkMatches = content.match(/\[.*?\]\((.*?)\)/g);
    if (linkMatches && linkMatches.length > 0) {
      analysis.links = {
        type: 'array',
        sample: linkMatches.map(match => {
          const urlMatch = match.match(/\((.*?)\)/);
          return urlMatch ? urlMatch[1] : '';
        })
      };
    }
    
    // 見出し抽出
    const headingMatches = content.match(/^#+\s+(.+)$/gm);
    if (headingMatches && headingMatches.length > 0) {
      analysis.headings = {
        type: 'array',
        sample: headingMatches.map(h => h.replace(/^#+\s+/, ''))
      };
    }
    
    // 文字数カウント
    const wordCount = content.replace(/[^\w\s]/g, '').split(/\s+/).length;
    analysis.wordCount = {
      type: 'number',
      sample: wordCount
    };
    
    // 読了時間推定
    const readingTime = Math.ceil(wordCount / 200); // 1分200語と仮定
    analysis.readingTime = {
      type: 'number',
      sample: readingTime
    };
    
    return analysis;
  };

  // スキーマ提案追加
  const addSchemaSuggestions = (schema) => {
    const commonFields = ['title', 'description', 'publishedAt', 'author', 'tags', 'category'];
    
    commonFields.forEach(field => {
      if (!schema.detectedFields.includes(field)) {
        schema.suggestions.push({
          field,
          type: getRecommendedFieldType(field),
          reason: `一般的な${field}フィールドです`
        });
      }
    });
    
    // SEO関連フィールド提案
    const seoFields = ['metaTitle', 'metaDescription', 'ogImage', 'canonicalUrl'];
    seoFields.forEach(field => {
      if (!schema.detectedFields.includes(field)) {
        schema.suggestions.push({
          field,
          type: getRecommendedFieldType(field),
          reason: `SEO最適化のための${field}フィールドです`
        });
      }
    });
  };

  // 推奨フィールドタイプ取得
  const getRecommendedFieldType = (fieldName) => {
    const typeMap = {
      title: 'text',
      description: 'textarea',
      publishedAt: 'date',
      author: 'text',
      tags: 'array',
      category: 'select',
      metaTitle: 'text',
      metaDescription: 'textarea',
      ogImage: 'url',
      canonicalUrl: 'url'
    };
    
    return typeMap[fieldName] || 'text';
  };

  // 動的フォーム生成
  const generateDynamicForm = (schema) => {
    const form = {
      fields: [],
      validation: {},
      layout: 'grid'
    };
    
    schema.detectedFields.forEach(fieldName => {
      const fieldType = schema.fieldTypes[fieldName];
      const sampleValue = schema.sampleContent[fieldName];
      
      const field = {
        name: fieldName,
        label: formatFieldLabel(fieldName),
        type: fieldType,
        defaultValue: sampleValue,
        required: isRequiredField(fieldName),
        placeholder: generatePlaceholder(fieldName, fieldType),
        validation: generateValidation(fieldName, fieldType)
      };
      
      // 特殊フィールドの設定
      if (fieldType === 'select' || fieldType === 'array') {
        field.options = generateFieldOptions(fieldName, sampleValue);
      }
      
      form.fields.push(field);
    });
    
    // 提案フィールド追加
    schema.suggestions.forEach(suggestion => {
      form.fields.push({
        name: suggestion.field,
        label: formatFieldLabel(suggestion.field),
        type: suggestion.type,
        required: false,
        suggested: true,
        reason: suggestion.reason,
        placeholder: generatePlaceholder(suggestion.field, suggestion.type)
      });
    });
    
    setGeneratedForm(form);
    setDynamicFields(form.fields);
  };

  // フィールドラベル整形
  const formatFieldLabel = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/At$/, ' Date')
      .replace(/Url$/, ' URL');
  };

  // 必須フィールド判定
  const isRequiredField = (fieldName) => {
    const requiredFields = ['title', 'content', 'publishedAt'];
    return requiredFields.includes(fieldName);
  };

  // プレースホルダー生成
  const generatePlaceholder = (fieldName, fieldType) => {
    const placeholders = {
      title: 'タイトルを入力してください',
      description: '説明文を入力してください',
      author: '著者名を入力してください',
      tags: 'タグをカンマ区切りで入力',
      category: 'カテゴリを選択してください',
      publishedAt: '公開日を選択してください',
      metaTitle: 'SEOタイトルを入力してください',
      metaDescription: 'SEO説明文を入力してください',
      ogImage: '画像URLを入力してください',
      canonicalUrl: '正規URLを入力してください'
    };
    
    return placeholders[fieldName] || `${formatFieldLabel(fieldName)}を入力してください`;
  };

  // バリデーション生成
  const generateValidation = (fieldName, fieldType) => {
    const validation = {};
    
    if (isRequiredField(fieldName)) {
      validation.required = true;
    }
    
    switch (fieldType) {
      case 'email':
        validation.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        break;
      case 'url':
        validation.pattern = /^https?:\/\/.+/;
        break;
      case 'text':
        if (fieldName === 'title') {
          validation.maxLength = 100;
        }
        break;
      case 'textarea':
        validation.maxLength = 1000;
        break;
    }
    
    return validation;
  };

  // フィールドオプション生成
  const generateFieldOptions = (fieldName, sampleValue) => {
    if (fieldName === 'category') {
      return ['ニュース', 'ブログ', 'イベント', 'プレスリリース'];
    }
    
    if (Array.isArray(sampleValue)) {
      return sampleValue;
    }
    
    return [];
  };

  // データ永続化関数
  const saveToStorage = (data) => {
    try {
      setStorageStatus('saved');
      setLastSaved(new Date().toLocaleString());
      setTimeout(() => setStorageStatus('connected'), 2000);
    } catch (error) {
      setStorageStatus('error');
      console.error('データ保存エラー:', error);
    }
  };

  // テンプレート更新時の自動保存
  const updateTemplates = (newTemplates) => {
    setTemplates(newTemplates);
    if (autoSave) {
      setTimeout(() => saveToStorage(newTemplates), 500);
    }
  };

  // ファイルパスを取得する関数
  const getFilePath = (path) => {
    const parts = path.split('/');
    let current = repoStructure;
    for (const part of parts) {
      if (current[part] && current[part].children) {
        current = current[part].children;
      } else if (current[part]) {
        return current[part];
      }
    }
    return current;
  };

  // ファイルを選択する関数
  const selectFile = (path) => {
    const fileObj = getFilePath(path);
    if (fileObj && fileObj.type === 'file' && fileObj.content) {
      setSelectedFile(path);
      setFileContent(fileObj.content);
      setOriginalContent(fileObj.content);
      setHasChanges(false);
    }
  };

  // ファイル内容を更新する関数
  const updateFileContent = (newContent) => {
    setFileContent(newContent);
    setHasChanges(newContent !== originalContent);
  };

  // フォルダの展開/折りたたみ
  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  // テンプレートを適用する関数
  const applyTemplate = (template) => {
    setFileContent(template.content);
    setHasChanges(true);
    setShowTemplateModal(false);
  };

  // テンプレートを保存する関数
  const saveAsTemplate = () => {
    if (!fileContent.trim()) return;
    
    const newTemplate = {
      id: Date.now(),
      name: `新規テンプレート_${new Date().toLocaleDateString()}`,
      category: selectedFile?.endsWith('.md') ? 'news' : selectedFile?.endsWith('.astro') ? 'pages' : 'sns',
      content: fileContent,
      tags: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const category = newTemplate.category;
    const updatedTemplates = {
      ...templates,
      [category]: [...(templates[category] || []), newTemplate]
    };
    
    updateTemplates(updatedTemplates);
  };

  // テンプレート削除機能
  const deleteTemplate = (templateId) => {
    const updatedTemplates = { ...templates };
    Object.keys(updatedTemplates).forEach(category => {
      updatedTemplates[category] = updatedTemplates[category].filter(t => t.id !== templateId);
    });
    updateTemplates(updatedTemplates);
  };

  // 全テンプレートを取得する関数
  const getAllTemplates = () => {
    const allTemplates = [];
    Object.values(templates).forEach(categoryTemplates => {
      allTemplates.push(...categoryTemplates);
    });
    return allTemplates;
  };

  // カテゴリ別テンプレートを取得する関数
  const getFilteredTemplates = () => {
    if (templateCategory === 'all') {
      return getAllTemplates();
    }
    return templates[templateCategory] || [];
  };

  // 変更差分を計算する関数
  const getDiff = () => {
    if (!originalContent || !fileContent) return [];
    
    const originalLines = originalContent.split('\n');
    const currentLines = fileContent.split('\n');
    const diff = [];
    
    const maxLines = Math.max(originalLines.length, currentLines.length);
    for (let i = 0; i < maxLines; i++) {
      const original = originalLines[i] || '';
      const current = currentLines[i] || '';
      
      if (original !== current) {
        if (original && current) {
          diff.push({ type: 'modified', lineNum: i + 1, original, current });
        } else if (original) {
          diff.push({ type: 'deleted', lineNum: i + 1, original, current: null });
        } else {
          diff.push({ type: 'added', lineNum: i + 1, original: null, current });
        }
      }
    }
    
    return diff;
  };

  // ファイルツリーをレンダリングする関数
  const renderFileTree = (structure, currentPath = '') => {
    return Object.entries(structure).map(([name, item]) => {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;
      
      if (item.type === 'folder') {
        const isExpanded = expandedFolders.has(fullPath);
        return (
          <div key={fullPath} className="select-none">
            <div 
              className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? 
                <ChevronDown className="w-4 h-4 text-gray-500 mr-1" /> : 
                <ChevronRight className="w-4 h-4 text-gray-500 mr-1" />
              }
              <Folder className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-700">{name}</span>
            </div>
            {isExpanded && (
              <div className="ml-4 border-l border-gray-200 pl-2">
                {renderFileTree(item.children, fullPath)}
              </div>
            )}
          </div>
        );
      } else {
        const isSelected = selectedFile === fullPath;
        return (
          <div key={fullPath} className="select-none">
            <div 
              className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded ${
                isSelected ? 'bg-blue-50 text-blue-700' : ''
              }`}
              onClick={() => selectFile(fullPath)}
            >
              <File className="w-4 h-4 text-gray-400 mr-2 ml-5" />
              <span className="text-sm">{name}</span>
              {hasChanges && isSelected && (
                <div className="w-2 h-2 bg-orange-400 rounded-full ml-auto"></div>
              )}
            </div>
          </div>
        );
      }
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* ステータスカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総ページ数</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <FileEdit className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">予約投稿</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月の投稿</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
            <Share2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">テンプレート数</p>
              <p className="text-2xl font-bold text-gray-900">{getAllTemplates().length}</p>
            </div>
            <File className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">データ状態</p>
              <p className={`text-2xl font-bold ${
                storageStatus === 'saved' ? 'text-green-600' :
                storageStatus === 'error' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {storageStatus === 'saved' ? '保存済み' :
                 storageStatus === 'error' ? 'エラー' : '同期中'}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              storageStatus === 'saved' ? 'bg-green-100' :
              storageStatus === 'error' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                storageStatus === 'saved' ? 'bg-green-500' :
                storageStatus === 'error' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'
              }`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* データ永続化状態 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              storageStatus === 'saved' ? 'bg-green-400' :
              storageStatus === 'error' ? 'bg-red-400' : 'bg-blue-400 animate-pulse'
            }`}></div>
            <div>
              <p className="font-medium text-gray-900">
                データ永続化: {autoSave ? '自動保存有効' : '手動保存'}
              </p>
              <p className="text-sm text-gray-600">最終保存: {lastSaved}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">自動保存</span>
            </label>
            <button 
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              onClick={() => saveToStorage(templates)}
            >
              手動保存
            </button>
          </div>
        </div>
      </div>

      {/* 最近の活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近編集したファイル</h3>
          <div className="space-y-3">
            {recentFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">{file.path}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{file.modified}</p>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    file.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {file.status === 'published' ? '公開済み' : '下書き'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">予約投稿</h3>
          <div className="space-y-3">
            {scheduledPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {post.platform === 'Twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                  {post.platform === 'YouTube' && <Youtube className="w-5 h-5 text-red-500" />}
                  {post.platform === 'Discord' && <MessageSquare className="w-5 h-5 text-indigo-500" />}
                  <div>
                    <p className="font-medium text-gray-900">{post.platform}</p>
                    <p className="text-sm text-gray-600">{post.content}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{post.scheduledFor}</p>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {post.status === 'scheduled' ? '予約済み' : '待機中'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="flex h-full">
      {/* ファイルツリー */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">リポジトリ</h3>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <GitBranch className="w-4 h-4 mr-2" />
            <span>main</span>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">最新</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {renderFileTree(repoStructure)}
        </div>
      </div>

      {/* エディタ部分 */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            {/* ファイルヘッダー */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <File className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">{selectedFile}</span>
                  {hasChanges && (
                    <span className="ml-2 text-sm text-orange-600">• 未保存の変更</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => setShowTemplateModal(true)}
                  >
                    <File className="w-4 h-4 mr-2" />
                    テンプレート
                  </button>
                  <button 
                    className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      if (hasChanges) {
                        const diff = getDiff();
                        console.log('変更差分:', diff);
                      }
                    }}
                  >
                    <Diff className="w-4 h-4 mr-2" />
                    差分表示
                  </button>
                  <button 
                    className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setOriginalContent(fileContent);
                      setHasChanges(false);
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <GitCommit className="w-4 h-4 mr-2" />
                    コミット
                  </button>
                </div>
              </div>
            </div>

            {/* エディタとプレビューのタブ */}
            <div className="bg-white border-b border-gray-200">
              <div className="flex">
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    !previewMode 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setPreviewMode(false)}
                >
                  編集
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    previewMode 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setPreviewMode(true)}
                >
                  プレビュー
                </button>
              </div>
            </div>

            {/* エディタまたはプレビュー */}
            <div className="flex-1 bg-gray-50">
              {!previewMode ? (
                <textarea
                  value={fileContent}
                  onChange={(e) => updateFileContent(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm border-none resize-none focus:outline-none"
                  placeholder="ファイル内容を編集..."
                />
              ) : (
                <div className="h-full p-4 bg-white">
                  {selectedFile.endsWith('.md') ? (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {fileContent}
                      </pre>
                    </div>
                  ) : selectedFile.endsWith('.astro') ? (
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                      <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Astroプレビュー</h3>
                      <p className="text-gray-600">Astroコンポーネントのプレビューが表示されます</p>
                    </div>
                  ) : (
                    <pre className="font-mono text-sm whitespace-pre-wrap">{fileContent}</pre>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <FileEdit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">ファイルを選択してください</h3>
              <p className="text-gray-600">左側のファイルツリーからファイルを選択して編集を開始</p>
            </div>
          </div>
        )}
      </div>

      {/* 変更差分サイドパネル */}
      {hasChanges && (
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Diff className="w-5 h-5 mr-2" />
              変更差分
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {getDiff().map((change, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-xs text-gray-500">行 {change.lineNum}</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    change.type === 'added' ? 'bg-green-100 text-green-800' :
                    change.type === 'deleted' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {change.type === 'added' ? '追加' :
                     change.type === 'deleted' ? '削除' : '変更'}
                  </span>
                </div>
                {change.original && (
                  <div className="text-xs bg-red-50 p-2 rounded mb-1">
                    <span className="text-red-600">- </span>
                    {change.original}
                  </div>
                )}
                {change.current && (
                  <div className="text-xs bg-green-50 p-2 rounded">
                    <span className="text-green-600">+ </span>
                    {change.current}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">テンプレート管理</h2>
        <div className="flex space-x-3">
          <button 
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={saveAsTemplate}
            disabled={!fileContent.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            現在の内容を保存
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            新規作成
          </button>
        </div>
      </div>

      {/* カテゴリフィルター */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">カテゴリ:</span>
          <div className="flex space-x-2">
            {[
              { id: 'all', name: 'すべて', count: getAllTemplates().length },
              { id: 'news', name: 'ニュース', count: templates.news?.length || 0 },
              { id: 'sns', name: 'SNS投稿', count: templates.sns?.length || 0 },
              { id: 'pages', name: 'ページ', count: templates.pages?.length || 0 }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setTemplateCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  templateCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* テンプレート一覧 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {getFilteredTemplates().map(template => (
          <div key={template.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.category === 'news' ? 'bg-blue-100 text-blue-800' :
                    template.category === 'sns' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {template.category === 'news' ? 'ニュース' :
                     template.category === 'sns' ? 'SNS投稿' : 'ページ'}
                  </span>
                  <span className="text-xs text-gray-500">{template.createdAt}</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* プレビュー */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-hidden">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                {template.content.substring(0, 200)}
                {template.content.length > 200 && '...'}
              </pre>
            </div>

            {/* タグ */}
            {template.tags && template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* SNSプラットフォーム */}
            {template.platforms && template.platforms.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs text-gray-500">対応プラットフォーム:</span>
                <div className="flex space-x-1">
                  {template.platforms.map((platform, index) => (
                    <span key={index} className="text-xs text-gray-600">
                      {platform === 'Twitter' && '🐦'}
                      {platform === 'YouTube' && '📺'}
                      {platform === 'Discord' && '💬'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="flex space-x-2">
              <button 
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={() => applyTemplate(template)}
              >
                <Check className="w-4 h-4 mr-1" />
                適用
              </button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                <Eye className="w-4 h-4" />
              </button>
              <button 
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                onClick={() => {
                  if (window.confirm('このテンプレートを削除しますか？')) {
                    deleteTemplate(template.id);
                  }
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchemaAnalysis = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">スキーマ解析・GUI自動生成</h2>
        <div className="flex space-x-3">
          <button 
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={detectFramework}
            disabled={isAnalyzing}
          >
            <Scan className="w-4 h-4 mr-2" />
            {isAnalyzing ? '解析中...' : 'フレームワーク検出'}
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => analyzeContentSchema('/content')}
            disabled={isAnalyzing}
          >
            <Database className="w-4 h-4 mr-2" />
            コンテンツ解析
          </button>
        </div>
      </div>

      {/* フレームワーク検出結果 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          検出されたフレームワーク
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(supportedFrameworks).map(([key, framework]) => (
            <div 
              key={key}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                detectedFramework === key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setDetectedFramework(key)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{framework.icon}</div>
                <h4 className="font-medium text-gray-900">{framework.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {framework.configFiles[0]}
                </p>
                {detectedFramework === key && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      選択中
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* コンテンツスキーマ表示 */}
      {contentSchema && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            解析されたコンテンツスキーマ
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 検出されたフィールド */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">検出されたフィールド ({contentSchema.detectedFields.length})</h4>
              <div className="space-y-2 max-h-60 overflow-auto">
                {contentSchema.detectedFields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{formatFieldLabel(field)}</span>
                      <span className="text-sm text-gray-500 ml-2">({field})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        contentSchema.fieldTypes[field] === 'text' ? 'bg-blue-100 text-blue-800' :
                        contentSchema.fieldTypes[field] === 'date' ? 'bg-green-100 text-green-800' :
                        contentSchema.fieldTypes[field] === 'array' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contentSchema.fieldTypes[field]}
                      </span>
                      {isRequiredField(field) && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          必須
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 提案フィールド */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">提案フィールド ({contentSchema.suggestions.length})</h4>
              <div className="space-y-2 max-h-60 overflow-auto">
                {contentSchema.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{formatFieldLabel(suggestion.field)}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        {suggestion.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{suggestion.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GUI生成ボタン */}
          <div className="mt-6 flex space-x-3">
            <button 
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setShowSchemaModal(true)}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              GUI フォーム生成
            </button>
            <button 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                const schemaJson = JSON.stringify(contentSchema, null, 2);
                navigator.clipboard.writeText(schemaJson);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              スキーマエクスポート
            </button>
          </div>
        </div>
      )}

      {/* 動的生成されたフォーム */}
      {generatedForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            自動生成されたコンテンツフォーム
          </h3>
          
          <DynamicContentForm 
            fields={dynamicFields}
            onSubmit={(data) => {
              console.log('Generated content:', data);
              // ここで生成されたコンテンツを処理
            }}
          />
        </div>
      )}

      {/* スキーマ詳細モーダル */}
      {showSchemaModal && contentSchema && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">スキーマ詳細・フォーム設定</h3>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowSchemaModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SchemaConfigModal 
              schema={contentSchema}
              framework={detectedFramework}
              onSave={(updatedSchema) => {
                setContentSchema(updatedSchema);
                generateDynamicForm(updatedSchema);
                setShowSchemaModal(false);
              }}
              onCancel={() => setShowSchemaModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderSNS = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">SNS投稿管理</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          新規投稿作成
        </button>
      </div>

      {/* SNSプラットフォーム接続状況 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: 'Twitter', icon: Twitter, connected: true, color: 'blue' },
          { name: 'TikTok', icon: Share2, connected: false, color: 'pink' },
          { name: 'YouTube', icon: Youtube, connected: true, color: 'red' },
          { name: 'Discord', icon: MessageSquare, connected: true, color: 'indigo' }
        ].map((platform, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <platform.icon className={`w-6 h-6 text-${platform.color}-500`} />
              <span className={`w-3 h-3 rounded-full ${
                platform.connected ? 'bg-green-400' : 'bg-red-400'
              }`}></span>
            </div>
            <p className="font-medium text-gray-900">{platform.name}</p>
            <p className="text-sm text-gray-600">
              {platform.connected ? '接続済み' : '未接続'}
            </p>
          </div>
        ))}
      </div>

      {/* Claude連携機能 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Claude AI 連携</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Edit3 className="w-5 h-5 text-blue-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">テキスト生成</p>
              <p className="text-sm text-gray-600">AIで投稿文を作成</p>
            </div>
          </button>
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Hash className="w-5 h-5 text-green-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">ハッシュタグ提案</p>
              <p className="text-sm text-gray-600">最適なタグを生成</p>
            </div>
          </button>
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <TrendingUp className="w-5 h-5 text-orange-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">トレンド分析</p>
              <p className="text-sm text-gray-600">人気の話題を調査</p>
            </div>
          </button>
        </div>
      </div>

      {/* 投稿作成フォーム */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">新規投稿作成</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">投稿プラットフォーム</label>
            <div className="flex space-x-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <Twitter className="w-4 h-4 text-blue-400 mr-1" />
                Twitter
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <Youtube className="w-4 h-4 text-red-500 mr-1" />
                YouTube
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <MessageSquare className="w-4 h-4 text-indigo-500 mr-1" />
                Discord
              </label>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">投稿内容</label>
              <button 
                className="flex items-center px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                onClick={() => setShowTemplateModal(true)}
              >
                <File className="w-4 h-4 mr-1" />
                テンプレート
              </button>
            </div>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
              placeholder="投稿内容を入力してください..."
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">投稿日時</label>
              <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">添付ファイル</label>
              <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="flex space-x-3">
            <button className