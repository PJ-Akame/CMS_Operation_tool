# Astro CMS and SNS Tool Setup Script (PowerShell)

param(
    [switch]$SkipTests,
    [switch]$Verbose
)

# Set console encoding to UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Check execution policy
$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq "Restricted") {
    Write-Warning "PowerShell execution policy is restricted"
    Write-Host "Please open PowerShell as administrator and run:" -ForegroundColor Yellow
    Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Cyan
    Read-Host "Press Enter to exit..."
    exit 1
}

# Color functions
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

# Error handling
$ErrorActionPreference = "Stop"

try {
    Write-Host "Starting Astro CMS and SNS Tool Setup..." -ForegroundColor Cyan
    Write-Host "=" * 60
    Write-Host

    # System requirements check
    Write-Info "Checking system requirements..."

    # Node.js check
    try {
        $nodeVersion = node --version
        $nodeVersionNumber = [version]($nodeVersion -replace 'v', '')
        $requiredVersion = [version]"18.0.0"
        
        if ($nodeVersionNumber -ge $requiredVersion) {
            Write-Success "Node.js $nodeVersion found"
        } else {
            throw "Node.js v18.0.0 or higher required (current: $nodeVersion)"
        }
    } catch {
        Write-Error "Node.js not found"
        Write-Host "Please install Node.js: https://nodejs.org/" -ForegroundColor Yellow
        Read-Host "Press Enter to exit..."
        exit 1
    }

    # npm check
    try {
        npm --version | Out-Null
        Write-Success "npm found"
    } catch {
        Write-Error "npm not found"
        Read-Host "Press Enter to exit..."
        exit 1
    }

    # Git check
    try {
        git --version | Out-Null
        Write-Success "Git found"
    } catch {
        Write-Warning "Git not found"
        Write-Host "We recommend installing Git: https://git-scm.com/" -ForegroundColor Yellow
    }

    Write-Host

    # Install dependencies
    Write-Info "Installing dependencies..."
    
    if (Test-Path "package-lock.json") {
        if ($Verbose) { npm ci } else { npm ci --silent }
    } else {
        if ($Verbose) { npm install } else { npm install --silent }
    }
    
    Write-Success "Dependencies installation completed"
    Write-Host

    # Environment variables setup
    Write-Info "Setting up environment variables..."
    
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Success ".env file created"
            Write-Info "Please edit .env file to configure required API keys"
        } else {
            Write-Warning ".env.example not found"
            Write-Host "Please create .env file manually" -ForegroundColor Yellow
        }
    } else {
        Write-Info ".env file already exists"
    }

    Write-Host

    # Create project structure
    Write-Info "Creating project structure..."
    
    # Create required directories
    if (-not (Test-Path "src\components")) { New-Item -ItemType Directory -Path "src\components" -Force | Out-Null }
    if (-not (Test-Path "public")) { New-Item -ItemType Directory -Path "public" -Force | Out-Null }
    
    # Create simple favicon
    if (-not (Test-Path "public\vite.svg")) {
        $svgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#646cff" stroke-width="2">
<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"/>
<path d="M9 9V5a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2z"/>
</svg>
"@
        Set-Content -Path "public\vite.svg" -Value $svgContent
    }
    
    Write-Success "Project structure verified"
    Write-Host

    # Initial build test
    if (-not $SkipTests) {
        Write-Info "Running initial build tests..."
        
        try {
            if ($Verbose) { npm run type-check } else { npm run type-check --silent }
            Write-Success "TypeScript type check successful"
        } catch {
            Write-Warning "TypeScript type check failed"
            if ($Verbose) { Write-Host $_.Exception.Message -ForegroundColor Red }
        }
        
        try {
            if ($Verbose) { npm run lint } else { npm run lint --silent }
            Write-Success "ESLint check successful"
        } catch {
            Write-Warning "ESLint check failed"
            if ($Verbose) { Write-Host $_.Exception.Message -ForegroundColor Red }
        }
        
        Write-Host
    }

    # Create VS Code settings
    Write-Info "Creating VS Code settings..."
    
    if (-not (Test-Path ".vscode")) { New-Item -ItemType Directory -Path ".vscode" -Force | Out-Null }
    
    $vscodeSettings = @{
        "editor.formatOnSave" = $true
        "editor.codeActionsOnSave" = @{
            "source.fixAll.eslint" = $true
        }
        "typescript.preferences.importModuleSpecifier" = "relative"
        "emmet.includeLanguages" = @{
            "typescript" = "html"
            "typescriptreact" = "html"
        }
    }
    
    if (-not (Test-Path ".vscode\settings.json")) {
        $vscodeSettings | ConvertTo-Json -Depth 5 | Set-Content ".vscode\settings.json"
        Write-Success "VS Code settings file created"
    }
    
    # Setup guidance
    Write-Info "Setup completed! Please check the next steps..."
    Write-Host
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Edit .env file to configure required API keys:"
    Write-Host "   - VITE_GITHUB_CLIENT_ID, VITE_GITHUB_CLIENT_SECRET (for GitHub integration)"
    Write-Host "   - VITE_CLAUDE_API_KEY (for Claude AI integration)"
    Write-Host "   - Other SNS API settings"
    Write-Host
    Write-Host "2. Start development server:"
    Write-Host "   npm run dev" -ForegroundColor Green
    Write-Host
    Write-Host "3. Open browser and navigate to http://localhost:3000"
    Write-Host
    Write-Host "Available Commands:" -ForegroundColor Cyan
    Write-Host "   npm run dev          # Start development server"
    Write-Host "   npm run build        # Build for production"
    Write-Host "   npm run preview      # Preview production build"
    Write-Host "   npm run lint         # Code quality check"
    Write-Host "   npm run type-check   # TypeScript type check"
    Write-Host
    Write-Host "For detailed configuration, please refer to:"
    Write-Host "   - README.md"
    Write-Host "   - Local Setup Guide.md"
    Write-Host

    Write-Success "Setup completed successfully!"
    Write-Host
    Write-Host "To start development:" -ForegroundColor Green
    Write-Host "  npm run dev" -ForegroundColor Green
    
} catch {
    Write-Error "An error occurred during setup: $($_.Exception.Message)"
    if ($Verbose) {
        Write-Host "Detailed error information:" -ForegroundColor Red
        Write-Host $_.Exception.StackTrace -ForegroundColor Red
    }
    Write-Host "Please check the logs and resolve the issue before running again."
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host
Read-Host "Press Enter to exit..."