#!/bin/bash

# Astro CMS & SNS自動投稿ツール セットアップスクリプト
# 対応OS: macOS, Linux

set -e

echo "🚀 Astro CMS & SNS自動投稿ツール セットアップを開始します..."

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ関数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# システム要件チェック
check_requirements() {
    log_info "システム要件をチェック中..."
    
    # Node.js バージョンチェック
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_VERSION="18.0.0"
        if [[ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" == "$REQUIRED_VERSION" ]]; then
            log_success "Node.js v$NODE_VERSION が見つかりました"
        else
            log_error "Node.js v18.0.0 以上が必要です (現在: v$NODE_VERSION)"
            log_info "Node.js をアップデートしてください: https://nodejs.org/"
            exit 1
        fi
    else
        log_error "Node.js が見つかりません"
        log_info "Node.js をインストールしてください: https://nodejs.org/"
        exit 1
    fi
    
    # npm チェック
    if ! command -v npm &> /dev/null; then
        log_error "npm が見つかりません"
        exit 1
    fi
    
    # Git チェック
    if ! command -v git &> /dev/null; then
        log_error "Git が見つかりません"
        log_info "Git をインストールしてください: https://git-scm.com/"
        exit 1
    fi
    
    log_success "システム要件チェック完了"
}

# 依存関係インストール
install_dependencies() {
    log_info "依存関係をインストール中..."
    
    if [[ -f "package-lock.json" ]]; then
        npm ci
    else
        npm install
    fi
    
    if [[ $? -eq 0 ]]; then
        log_success "依存関係のインストールが完了しました"
    else
        log_error "依存関係のインストールに失敗しました"
        exit 1
    fi
}

# 環境変数設定
setup_environment() {
    log_info "環境変数を設定中..."
    
    if [[ ! -f ".env" ]]; then
        if [[ -f ".env.example" ]]; then
            cp .env.example .env
            log_success ".env ファイルを作成しました"
            log_info ".env ファイルを編集して必要なAPI キーを設定してください"
        else
            log_warning ".env.example が見つかりません。手動で .env を作成してください"
        fi
    else
        log_info ".env ファイルは既に存在します"
    fi
}

# プロジェクト構造作成
create_project_structure() {
    log_info "プロジェクト構造を確認中..."
    
    # 必要なディレクトリを作成
    mkdir -p src/components
    mkdir -p public
    
    # public ディレクトリにファビコンを作成（簡易版）
    if [[ ! -f "public/vite.svg" ]]; then
        echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#646cff" stroke-width="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"/><path d="M9 9V5a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2z"/></svg>' > public/vite.svg
    fi
    
    log_success "プロジェクト構造を確認しました"
}

# 初期ビルドテスト
test_build() {
    log_info "初期ビルドテストを実行中..."
    
    npm run type-check
    if [[ $? -eq 0 ]]; then
        log_success "TypeScript型チェックが成功しました"
    else
        log_warning "TypeScript型チェックでエラーが発生しました"
    fi
    
    npm run lint
    if [[ $? -eq 0 ]]; then
        log_success "ESLintチェックが成功しました"
    else
        log_warning "ESLintでエラーが発生しました"
    fi
}

# 設定ガイダンス
setup_guidance() {
    log_info "セットアップ完了！次のステップを確認してください..."
    
    echo ""
    echo "📝 次のステップ:"
    echo "1. .env ファイルを編集して、必要な API キーを設定してください:"
    echo "   - VITE_GITHUB_CLIENT_ID, VITE_GITHUB_CLIENT_SECRET (GitHub連携用)"
    echo "   - VITE_CLAUDE_API_KEY (Claude AI連携用)"
    echo "   - その他のSNS API設定"
    echo ""
    echo "2. 開発サーバーを起動:"
    echo "   npm run dev"
    echo ""
    echo "3. ブラウザで http://localhost:3000 にアクセス"
    echo ""
    echo "🛠 利用可能なコマンド:"
    echo "   npm run dev          # 開発サーバー起動"
    echo "   npm run build        # プロダクションビルド"
    echo "   npm run preview      # ビルド結果のプレビュー"
    echo "   npm run lint         # コード品質チェック"
    echo "   npm run type-check   # TypeScript型チェック"
    echo ""
    echo "📚 詳細な設定については以下を参照してください:"
    echo "   - README.md"
    echo "   - ローカルセットアップガイド.md"
    echo ""
}

# エラーハンドリング
cleanup() {
    log_error "セットアップ中にエラーが発生しました"
    echo "詳細なログを確認し、問題を解決してから再度実行してください。"
    exit 1
}

trap cleanup ERR

# メイン実行
main() {
    echo "🎯 Astro CMS & SNS Tool Setup Script v1.0"
    echo "=========================================="
    echo ""
    
    check_requirements
    install_dependencies
    setup_environment
    create_project_structure
    test_build
    setup_guidance
    
    echo ""
    log_success "🎉 セットアップが完了しました！"
    echo ""
    echo "開発を始めるには:"
    echo "  npm run dev"
    echo ""
}

# スクリプト実行
main "$@"