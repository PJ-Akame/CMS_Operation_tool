# セットアップスクリプト集

## setup.sh (Mac/Linux用)

```bash
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
    
    # Docker チェック (オプション)
    if command -v docker &> /dev/null; then
        log_success "Docker が見つかりました"
        DOCKER_AVAILABLE=true
    else
        log_warning "Docker が見つかりません (オプション)"
        DOCKER_AVAILABLE=false
    fi
}

# 依存関係インストール
install_dependencies() {
    log_info "依存関係をインストール中..."
    
    if [[ -f "package-lock.json" ]]; then
        npm ci
    else
        npm install
    fi
    
    log_success "依存関係のインストールが完了しました"
}

# 環境変数設定
setup_environment() {
    log_info "環境変数を設定中..."
    
    if [[ ! -f ".env" ]]; then
        if [[ -f ".env.example" ]]; then
            cp .env.example .env
            log_success ".env ファイルを作成しました"
        else
            log_warning ".env.example が見つかりません。手動で .env を作成してください"
        fi
    else
        log_info ".env ファイルは既に存在します"
    fi
}

# データベースセットアップ
setup_database() {
    log_info "データベースをセットアップ中..."
    
    if [[ "$DOCKER_AVAILABLE" == true ]]; then
        read -p "Docker を使用してデータベースをセットアップしますか？ (y/n): " use_docker
        if [[ "$use_docker" == "y" || "$use_docker" == "Y" ]]; then
            log_info "Docker Compose でデータベースを起動中..."
            docker-compose up -d db redis
            
            # データベース起動待機
            log_info "データベースの起動を待機中..."
            sleep 10
            
            npm run db:migrate
            npm run db:seed
            log_success "Docker を使用したデータベースセットアップが完了しました"
            return
        fi
    fi
    
    # ローカルデータベースの場合
    log_info "ローカルデータベースをセットアップします"
    
    # PostgreSQL チェック
    if command -v psql &> /dev/null; then
        log_success "PostgreSQL が見つかりました"
        
        read -p "データベースを作成しますか？ (y/n): " create_db
        if [[ "$create_db" == "y" || "$create_db" == "Y" ]]; then
            read -p "データベース名を入力してください [astro_cms]: " db_name
            db_name=${db_name:-astro_cms}
            
            read -p "PostgreSQL ユーザー名を入力してください [postgres]: " db_user
            db_user=${db_user:-postgres}
            
            # データベース作成
            createdb -U "$db_user" "$db_name" 2>/dev/null || log_warning "データベースは既に存在する可能性があります"
            
            # .env ファイル更新
            if [[ -f ".env" ]]; then
                sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$db_user@localhost:5432/$db_name|" .env
                log_success "データベース接続設定を更新しました"
            fi
            
            npm run db:migrate
            npm run db:seed
        fi
    else
        log_warning "PostgreSQL が見つかりません"
        log_info "PostgreSQL をインストールするか、Docker を使用してください"
    fi
}

# 設定ガイダンス
setup_guidance() {
    log_info "初期設定のガイダンスを表示します..."
    
    echo ""
    echo "📝 次のステップ:"
    echo "1. .env ファイルを編集して、必要な API キーを設定してください:"
    echo "   - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET"
    echo "   - TWITTER_API_KEY, TWITTER_API_SECRET"
    echo "   - CLAUDE_API_KEY"
    echo "   - その他の SNS API 設定"
    echo ""
    echo "2. 開発サーバーを起動:"
    echo "   npm run dev"
    echo ""
    echo "3. ブラウザで http://localhost:3000 にアクセス"
    echo ""
    echo "📚 詳細な設定については以下を参照してください:"
    echo "   - README.md"
    echo "   - docs/configuration.md"
    echo ""
}

# エラーハンドリング
cleanup() {
    log_error "セットアップ中にエラーが発生しました"
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
    setup_database
    setup_guidance
    
    echo ""
    log_success "🎉 セットアップが完了しました！"
    echo ""
}

# スクリプト実行
main "$@"
```

## setup.bat (Windows用)

```batch
@echo off
setlocal enabledelayedexpansion

REM Astro CMS & SNS自動投稿ツール セットアップスクリプト (Windows)
echo 🚀 Astro CMS ^& SNS自動投稿ツール セットアップを開始します...
echo.

REM カラー設定
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM システム要件チェック
echo %BLUE%[INFO]%NC% システム要件をチェック中...

REM Node.js チェック
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Node.js が見つかりません
    echo Node.js をインストールしてください: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node --version') do (
    set NODE_MAJOR=%%a
    set NODE_MAJOR=!NODE_MAJOR:v=!
)

if !NODE_MAJOR! lss 18 (
    echo %RED%[ERROR]%NC% Node.js v18.0.0 以上が必要です
    echo 現在のバージョンをアップデートしてください
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%NC% Node.js が見つかりました

REM npm チェック
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%NC% npm が見つかりません
    pause
    exit /b 1
)

REM Git チェック
git --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Git が見つかりません
    echo Git をインストールしてください: https://git-scm.com/
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%NC% Git が見つかりました

REM Docker チェック (オプション)
docker --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING]%NC% Docker が見つかりません (オプション)
    set DOCKER_AVAILABLE=false
) else (
    echo %GREEN%[SUCCESS]%NC% Docker が見つかりました
    set DOCKER_AVAILABLE=true
)

echo.
echo %BLUE%[INFO]%NC% 依存関係をインストール中...

REM 依存関係インストール
if exist "package-lock.json" (
    npm ci
) else (
    npm install
)

if errorlevel 1 (
    echo %RED%[ERROR]%NC% 依存関係のインストールに失敗しました
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%NC% 依存関係のインストールが完了しました

echo.
echo %BLUE%[INFO]%NC% 環境変数を設定中...

REM 環境変数設定
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo %GREEN%[SUCCESS]%NC% .env ファイルを作成しました
    ) else (
        echo %YELLOW%[WARNING]%NC% .env.example が見つかりません
        echo 手動で .env ファイルを作成してください
    )
) else (
    echo %BLUE%[INFO]%NC% .env ファイルは既に存在します
)

echo.
echo %BLUE%[INFO]%NC% データベースをセットアップ中...

REM データベースセットアップ
if "%DOCKER_AVAILABLE%"=="true" (
    set /p use_docker="Docker を使用してデータベースをセットアップしますか？ (y/n): "
    if /i "!use_docker!"=="y" (
        echo %BLUE%[INFO]%NC% Docker Compose でデータベースを起動中...
        docker-compose up -d db redis
        
        REM データベース起動待機
        echo %BLUE%[INFO]%NC% データベースの起動を待機中...
        timeout /t 10 /nobreak >nul
        
        npm run db:migrate
        npm run db:seed
        echo %GREEN%[SUCCESS]%NC% Docker を使用したデータベースセットアップが完了しました
        goto guidance
    )
)

echo %BLUE%[INFO]%NC% ローカルデータベースのセットアップをスキップします
echo 詳細な設定については README.md を参照してください

:guidance
echo.
echo %BLUE%[INFO]%NC% 初期設定のガイダンスを表示します...
echo.
echo 📝 次のステップ:
echo 1. .env ファイルを編集して、必要な API キーを設定してください:
echo    - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
echo    - TWITTER_API_KEY, TWITTER_API_SECRET
echo    - CLAUDE_API_KEY
echo    - その他の SNS API 設定
echo.
echo 2. 開発サーバーを起動:
echo    npm run dev
echo.
echo 3. ブラウザで http://localhost:3000 にアクセス
echo.
echo 📚 詳細な設定については以下を参照してください:
echo    - README.md
echo    - docs/configuration.md
echo.

echo %GREEN%[SUCCESS]%NC% 🎉 セットアップが完了しました！
echo.
pause
```

## setup.ps1 (Windows PowerShell用)

```powershell
# Astro CMS & SNS自動投稿ツール セットアップスクリプト (PowerShell)

param(
    [switch]$SkipDockerSetup,
    [switch]$Verbose
)

# 実行ポリシーチェック
$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq "Restricted") {
    Write-Warning "PowerShell の実行ポリシーが制限されています"
    Write-Host "管理者として PowerShell を開き、以下を実行してください:" -ForegroundColor Yellow
    Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Cyan
    Read-Host "Enter キーを押して終了..."
    exit 1
}

# カラー関数
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# エラーハンドリング
$ErrorActionPreference = "Stop"

try {
    Write-Host "🚀 Astro CMS & SNS自動投稿ツール セットアップを開始します..." -ForegroundColor Cyan
    Write-Host "=" * 50
    Write-Host

    # システム要件チェック
    Write-Info "システム要件をチェック中..."

    # Node.js チェック
    try {
        $nodeVersion = node --version
        $nodeVersionNumber = [version]($nodeVersion -replace 'v', '')
        $requiredVersion = [version]"18.0.0"
        
        if ($nodeVersionNumber -ge $requiredVersion) {
            Write-Success "Node.js $nodeVersion が見つかりました"
        } else {
            throw "Node.js v18.0.0 以上が必要です (現在: $nodeVersion)"
        }
    } catch {
        Write-Error "Node.js が見つかりません"
        Write-Host "Node.js をインストールしてください: https://nodejs.org/" -ForegroundColor Yellow
        Read-Host "Enter キーを押して終了..."
        exit 1
    }

    # npm チェック
    try {
        npm --version | Out-Null
        Write-Success "npm が見つかりました"
    } catch {
        Write-Error "npm が見つかりません"
        Read-Host "Enter キーを押して終了..."
        exit 1
    }

    # Git チェック
    try {
        git --version | Out-Null
        Write-Success "Git が見つかりました"
    } catch {
        Write-Error "Git が見つかりません"
        Write-Host "Git をインストールしてください: https://git-scm.com/" -ForegroundColor Yellow
        Read-Host "Enter キーを押して終了..."
        exit 1
    }

    # Docker チェック
    $dockerAvailable = $false
    try {
        docker --version | Out-Null
        Write-Success "Docker が見つかりました"
        $dockerAvailable = $true
    } catch {
        Write-Warning "Docker が見つかりません (オプション)"
    }

    Write-Host

    # 依存関係インストール
    Write-Info "依存関係をインストール中..."
    
    if (Test-Path "package-lock.json") {
        npm ci
    } else {
        npm install
    }
    
    Write-Success "依存関係のインストールが完了しました"
    Write-Host

    # 環境変数設定
    Write-Info "環境変数を設定中..."
    
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Success ".env ファイルを作成しました"
        } else {
            Write-Warning ".env.example が見つかりません"
            Write-Host "手動で .env ファイルを作成してください" -ForegroundColor Yellow
        }
    } else {
        Write-Info ".env ファイルは既に存在します"
    }

    Write-Host

    # データベースセットアップ
    if (-not $SkipDockerSetup -and $dockerAvailable) {
        Write-Info "データベースをセットアップ中..."
        
        $useDocker = Read-Host "Docker を使用してデータベースをセットアップしますか？ (y/n)"
        
        if ($useDocker -eq "y" -or $useDocker -eq "Y") {
            Write-Info "Docker Compose でデータベースを起動中..."
            docker-compose up -d db redis
            
            Write-Info "データベースの起動を待機中..."
            Start-Sleep -Seconds 10
            
            npm run db:migrate
            npm run db:seed
            
            Write-Success "Docker を使用したデータベースセットアップが完了しました"
        }
    } else {
        Write-Info "データベースセットアップをスキップします"
    }

    Write-Host

    # 設定ガイダンス
    Write-Info "初期設定のガイダンスを表示します..."
    Write-Host
    Write-Host "📝 次のステップ:" -ForegroundColor Cyan
    Write-Host "1. .env ファイルを編集して、必要な API キーを設定してください:"
    Write-Host "   - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET"
    Write-Host "   - TWITTER_API_KEY, TWITTER_API_SECRET"
    Write-Host "   - CLAUDE_API_KEY"
    Write-Host "   - その他の SNS API 設定"
    Write-Host
    Write-Host "2. 開発サーバーを起動:"
    Write-Host "   npm run dev" -ForegroundColor Green
    Write-Host
    Write-Host "3. ブラウザで http://localhost:3000 にアクセス"
    Write-Host
    Write-Host "📚 詳細な設定については以下を参照してください:"
    Write-Host "   - README.md"
    Write-Host "   - docs/configuration.md"
    Write-Host

    Write-Success "🎉 セットアップが完了しました！"
    
} catch {
    Write-Error "セットアップ中にエラーが発生しました: $($_.Exception.Message)"
    if ($Verbose) {
        Write-Host "詳細エラー情報:" -ForegroundColor Red
        Write-Host $_.Exception.StackTrace -ForegroundColor Red
    }
    Read-Host "Enter キーを押して終了..."
    exit 1
}

Write-Host
Read-Host "Enter キーを押して終了..."
```

## package.json に追加するスクリプト

```json
{
  "scripts": {
    "setup": "node -e \"const os = require('os'); const { execSync } = require('child_process'); const platform = os.platform(); if (platform === 'win32') { try { execSync('powershell -ExecutionPolicy Bypass -File setup.ps1', { stdio: 'inherit' }); } catch { execSync('setup.bat', { stdio: 'inherit' }); } } else { execSync('chmod +x setup.sh && ./setup.sh', { stdio: 'inherit' }); }\"",
    "setup:docker": "docker-compose up -d && npm run db:migrate && npm run db:seed",
    "setup:clean": "rm -rf node_modules package-lock.json && npm install",
    "setup:windows": "powershell -ExecutionPolicy Bypass -File setup.ps1",
    "setup:unix": "chmod +x setup.sh && ./setup.sh"
  }
}
```

## 使用方法

### 自動セットアップ
```bash
# クロスプラットフォーム対応
npm run setup

# または直接実行
# Windows (PowerShell)
./setup.ps1

# Windows (Command Prompt)
setup.bat

# Mac/Linux
chmod +x setup.sh && ./setup.sh
```

### オプション付きセットアップ
```powershell
# PowerShell オプション例
./setup.ps1 -SkipDockerSetup    # Docker セットアップをスキップ
./setup.ps1 -Verbose            # 詳細ログ表示
```

これらのスクリプトにより、どのプラットフォームでも簡単にセットアップが可能になります！