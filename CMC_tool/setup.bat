@echo off
setlocal enabledelayedexpansion

REM Astro CMS & SNS自動投稿ツール セットアップスクリプト (Windows)
echo 🚀 Astro CMS ^& SNS自動投稿ツール セットアップを開始します...
echo.

REM カラー設定（Windows 10以降）
for /F %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"
set "RED=%ESC%[91m"
set "GREEN=%ESC%[92m"
set "YELLOW=%ESC%[93m"
set "BLUE=%ESC%[94m"
set "NC=%ESC%[0m"

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
    echo %YELLOW%[WARNING]%NC% Git が見つかりません
    echo Git をインストールすることを推奨します: https://git-scm.com/
) else (
    echo %GREEN%[SUCCESS]%NC% Git が見つかりました
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
        copy ".env.example" ".env" >nul
        echo %GREEN%[SUCCESS]%NC% .env ファイルを作成しました
        echo %BLUE%[INFO]%NC% .env ファイルを編集して必要なAPI キーを設定してください
    ) else (
        echo %YELLOW%[WARNING]%NC% .env.example が見つかりません
        echo 手動で .env ファイルを作成してください
    )
) else (
    echo %BLUE%[INFO]%NC% .env ファイルは既に存在します
)

echo.
echo %BLUE%[INFO]%NC% プロジェクト構造を確認中...

REM 必要なディレクトリを作成
if not exist "src\components" mkdir src\components
if not exist "public" mkdir public

REM 簡易ファビコン作成
if not exist "public\vite.svg" (
    echo ^<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#646cff" stroke-width="2"^>^<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"/^>^<path d="M9 9V5a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2z"/^>^</svg^> > public\vite.svg
)

echo %GREEN%[SUCCESS]%NC% プロジェクト構造を確認しました

echo.
echo %BLUE%[INFO]%NC% 初期ビルドテストを実行中...

REM TypeScript型チェック
npm run type-check >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING]%NC% TypeScript型チェックでエラーが発生しました
) else (
    echo %GREEN%[SUCCESS]%NC% TypeScript型チェックが成功しました
)

REM ESLintチェック
npm run lint >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING]%NC% ESLintでエラーが発生しました
) else (
    echo %GREEN%[SUCCESS]%NC% ESLintチェックが成功しました
)

echo.
echo %BLUE%[INFO]%NC% セットアップ完了！次のステップを確認してください...
echo.
echo 📝 次のステップ:
echo 1. .env ファイルを編集して、必要な API キーを設定してください:
echo    - VITE_GITHUB_CLIENT_ID, VITE_GITHUB_CLIENT_SECRET (GitHub連携用)
echo    - VITE_CLAUDE_API_KEY (Claude AI連携用)
echo    - その他のSNS API設定
echo.
echo 2. 開発サーバーを起動:
echo    npm run dev
echo.
echo 3. ブラウザで http://localhost:3000 にアクセス
echo.
echo 🛠 利用可能なコマンド:
echo    npm run dev          # 開発サーバー起動
echo    npm run build        # プロダクションビルド
echo    npm run preview      # ビルド結果のプレビュー
echo    npm run lint         # コード品質チェック
echo    npm run type-check   # TypeScript型チェック
echo.
echo 📚 詳細な設定については以下を参照してください:
echo    - README.md
echo    - ローカルセットアップガイド.md
echo.

echo %GREEN%[SUCCESS]%NC% 🎉 セットアップが完了しました！
echo.
echo 開発を始めるには:
echo   npm run dev
echo.
pause