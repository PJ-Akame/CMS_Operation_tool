import { useState } from 'react';
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
  Clock,
  Save,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  GitBranch,
  GitCommit,
  Diff,
  X,
  RefreshCw,
  Download
} from 'lucide-react';

const CMS_SNS_Tool = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src', 'src/content', 'src/pages']));
  const [hasChanges, setHasChanges] = useState(false);
  
  // データ永続化用の状態
  const [storageStatus, setStorageStatus] = useState<'connected' | 'saved' | 'error'>('connected');
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(new Date().toLocaleString());
  
  // テンプレート管理の状態
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // 型定義
  interface FileNode {
    type: 'file' | 'folder';
    content?: string;
    children?: Record<string, FileNode>;
  }

  interface RecentFile {
    name: string;
    path: string;
    modified: string;
    status: 'draft' | 'published';
  }

  interface ScheduledPost {
    platform: string;
    content: string;
    scheduledFor: string;
    status: 'pending' | 'scheduled';
  }

  const navigation = [
    { id: 'dashboard', name: 'ダッシュボード', icon: Home },
    { id: 'content', name: 'コンテンツ管理', icon: FileEdit },
    { id: 'templates', name: 'テンプレート', icon: File },
    { id: 'preview', name: 'プレビュー', icon: Eye },
    { id: 'sns', name: 'SNS投稿', icon: Share2 },
    { id: 'analytics', name: '解析・分析', icon: BarChart3 },
    { id: 'settings', name: '設定', icon: Settings },
  ];

  // サンプルリポジトリ構造
  const repoStructure: Record<string, FileNode> = {
    'README.md': { type: 'file', content: '# 会社コーポレートサイト\n\nAstroで構築されたコーポレートサイトです。' },
    'package.json': { type: 'file', content: '{\n  "name": "corporate-site",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "astro dev",\n    "build": "astro build"\n  }\n}' },
    'src': {
      type: 'folder',
      children: {
        'pages': {
          type: 'folder',
          children: {
            'index.astro': { type: 'file', content: '---\ntitle: "ホーム"\n---\n\n<html>\n<head>\n  <title>{title}</title>\n</head>\n<body>\n  <h1>会社ホームページ</h1>\n  <p>私たちの会社について</p>\n</body>\n</html>' },
            'about.astro': { type: 'file', content: '---\ntitle: "会社概要"\n---\n\n<html>\n<head>\n  <title>{title}</title>\n</head>\n<body>\n  <h1>会社概要</h1>\n  <p>設立: 2020年</p>\n  <p>従業員数: 50名</p>\n</body>\n</html>' }
          }
        }
      }
    }
  };

  const recentFiles: RecentFile[] = [
    { name: 'news-2024-08.md', path: 'src/content/news/', modified: '2時間前', status: 'draft' },
    { name: 'about.astro', path: 'src/pages/', modified: '1日前', status: 'published' }
  ];

  const scheduledPosts: ScheduledPost[] = [
    { platform: 'Twitter', content: '新製品リリースのお知らせ...', scheduledFor: '今日 14:00', status: 'pending' },
    { platform: 'YouTube', content: '会社説明動画の投稿', scheduledFor: '明日 10:00', status: 'pending' }
  ];

  // データ永続化関数
  const saveToStorage = () => {
    try {
      setStorageStatus('saved');
      setLastSaved(new Date().toLocaleString());
      setTimeout(() => setStorageStatus('connected'), 2000);
    } catch (error) {
      setStorageStatus('error');
      console.error('データ保存エラー:', error);
    }
  };

  // ファイルパスを取得する関数
  const getFilePath = (path: string): FileNode | null => {
    const parts = path.split('/');
    let current = repoStructure as Record<string, FileNode>;
    
    for (const part of parts) {
      if (current[part]) {
        const node = current[part];
        if (node.type === 'folder' && node.children) {
          current = node.children;
        } else if (node.type === 'file') {
          return node;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    
    return null;
  };

  // ファイルを選択する関数
  const selectFile = (path: string) => {
    const fileObj = getFilePath(path);
    if (fileObj && fileObj.type === 'file' && fileObj.content) {
      setSelectedFile(path);
      setFileContent(fileObj.content);
      setOriginalContent(fileObj.content);
      setHasChanges(false);
    }
  };

  // ファイル内容を更新する関数
  const updateFileContent = (newContent: string) => {
    setFileContent(newContent);
    setHasChanges(newContent !== originalContent);
  };

  // フォルダの展開/折りたたみ
  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  // 変更差分を計算する関数
  interface DiffChange {
    type: 'added' | 'deleted' | 'modified';
    lineNum: number;
    original?: string;
    current?: string;
  }

  const getDiff = (): DiffChange[] => {
    if (!originalContent || !fileContent) return [];
    
    const originalLines = originalContent.split('\n');
    const currentLines = fileContent.split('\n');
    const diff: DiffChange[] = [];
    
    const maxLines = Math.max(originalLines.length, currentLines.length);
    for (let i = 0; i < maxLines; i++) {
      const original = originalLines[i] || '';
      const current = currentLines[i] || '';
      
      if (original !== current) {
        if (original && current) {
          diff.push({ type: 'modified', lineNum: i + 1, original, current });
        } else if (original) {
          diff.push({ type: 'deleted', lineNum: i + 1, original, current: undefined });
        } else {
          diff.push({ type: 'added', lineNum: i + 1, original: undefined, current });
        }
      }
    }
    
    return diff;
  };

  // ファイルツリーをレンダリングする関数
  const renderFileTree = (structure: Record<string, FileNode>, currentPath = ''): JSX.Element[] => {
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
            {isExpanded && item.children && (
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

  // 各タブのレンダリング関数
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
              <p className="text-2xl font-bold text-gray-900">5</p>
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
              onClick={() => saveToStorage()}
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

  // その他のレンダリング関数は元のコンポーネントと同様だが、省略
  const renderTemplates = () => <div className="p-8 text-center text-gray-600">テンプレート管理機能 (実装中)</div>;
  const renderSNS = () => <div className="p-8 text-center text-gray-600">SNS投稿管理機能 (実装中)</div>;
  const renderPreview = () => <div className="p-8 text-center text-gray-600">プレビュー機能 (実装中)</div>;
  const renderAnalytics = () => <div className="p-8 text-center text-gray-600">解析・分析機能 (実装中)</div>;
  const renderSettings = () => <div className="p-8 text-center text-gray-600">設定機能 (実装中)</div>;

  const renderContent_Tab = () => {
    switch(activeTab) {
      case 'dashboard': 
        return renderDashboard();
      case 'content': 
        return renderContent();
      case 'templates':
        return renderTemplates();
      case 'sns': 
        return renderSNS();
      case 'preview': 
        return renderPreview();
      case 'analytics': 
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default: 
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">CMS & SNS Tool</h1>
          <p className="text-sm text-gray-600">Astro対応</p>
        </div>
        
        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* GitHub接続状況 */}
        <div className="mt-8 mx-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Github className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">GitHub接続</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            <span className="text-xs text-gray-600">接続済み</span>
          </div>
        </div>

        {/* データストレージ状況 */}
        <div className="mx-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Save className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">データストレージ</span>
          </div>
          <div className="flex items-center mb-1">
            <span className={`w-2 h-2 rounded-full mr-2 ${
              storageStatus === 'saved' ? 'bg-green-400' :
              storageStatus === 'error' ? 'bg-red-400' : 'bg-blue-400 animate-pulse'
            }`}></span>
            <span className="text-xs text-gray-600">
              {storageStatus === 'saved' ? '保存済み' :
               storageStatus === 'error' ? 'エラー' : '同期中'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {autoSave ? '自動保存: 有効' : '自動保存: 無効'}
          </div>
          <div className="text-xs text-gray-500">
            最終保存: {lastSaved.split(' ')[1]?.substring(0,5) || '--:--'}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <div className={`h-full ${activeTab === 'content' ? '' : 'p-8 overflow-auto'}`}>
          {renderContent_Tab()}
        </div>
      </div>

      {/* テンプレート選択モーダル（簡易版） */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">テンプレート選択</h3>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowTemplateModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 text-center py-8">
              テンプレート機能は現在実装中です
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMS_SNS_Tool;