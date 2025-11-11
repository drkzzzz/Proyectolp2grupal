#!/usr/bin/env pwsh
# Script para iniciar XAMPP y ejecutar el backend de TapStyle

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TapStyle Backend - Inicializador" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Detectar ubicacion de XAMPP
Write-Host "[1/5] Buscando XAMPP..." -ForegroundColor Yellow
$xamppPaths = @(
    "C:\xampp\mysql\bin\mysqld.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\Program Files\xampp\mysql\bin\mysqld.exe",
    "D:\xampp\mysql\bin\mysqld.exe"
)

$xamppFound = $false
$mysqldPath = $null

foreach ($path in $xamppPaths) {
    if (Test-Path $path) {
        $xamppFound = $true
        $mysqldPath = $path
        Write-Host "[OK] XAMPP encontrado en: $(Split-Path $path -Parent)" -ForegroundColor Green
        break
    }
}

if (-not $xamppFound) {
    Write-Host "[ERROR] No se encontro XAMPP instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor instala XAMPP desde: https://www.apachefriends.org/" -ForegroundColor Yellow
    Write-Host "Y asegurate de que MySQL esta incluido en la instalacion" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# 2. Verificar si MySQL esta corriendo
Write-Host ""
Write-Host "[2/5] Verificando estado de MySQL..." -ForegroundColor Yellow
$mysqlRunning = Get-Process -Name mysqld -ErrorAction SilentlyContinue

if ($mysqlRunning) {
    Write-Host "[OK] MySQL ya esta corriendo (PID: $($mysqlRunning.Id))" -ForegroundColor Green
} else {
    Write-Host "[AVISO] MySQL no esta corriendo. Iniciando..." -ForegroundColor Yellow
    
    # Obtener la ruta de XAMPP Control Panel
    $xamppControlPanel = Split-Path $mysqldPath -Parent
    $xamppControlPanel = Split-Path $xamppControlPanel -Parent
    $xamppControlPanel = Split-Path $xamppControlPanel -Parent
    $xamppControlPanel = Join-Path $xamppControlPanel "xampp-control.exe"
    
    if (Test-Path $xamppControlPanel) {
        Write-Host "Iniciando XAMPP Control Panel..." -ForegroundColor Cyan
        Start-Process $xamppControlPanel
        Start-Sleep -Seconds 3
        Write-Host "Por favor, haz clic en 'Start' para el modulo MySQL" -ForegroundColor Yellow
        Read-Host "Presiona Enter cuando MySQL este corriendo"
    } else {
        Write-Host "[ERROR] No se pudo encontrar XAMPP Control Panel" -ForegroundColor Red
        Write-Host "Por favor inicia MySQL manualmente desde XAMPP" -ForegroundColor Yellow
        Read-Host "Presiona Enter cuando MySQL este corriendo"
    }
}

# 3. Verificar conexion a MySQL
Write-Host ""
Write-Host "[3/5] Verificando conexion a MySQL..." -ForegroundColor Yellow
$mysqlPath = Join-Path (Split-Path $mysqldPath -Parent) "mysql.exe"

if (Test-Path $mysqlPath) {
    try {
        $output = & $mysqlPath -u root -e "SELECT 1;" 2>&1
        Write-Host "[OK] Conexion a MySQL exitosa" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] No se pudo conectar a MySQL" -ForegroundColor Red
        Write-Host "Verifica que MySQL este corriendo en XAMPP" -ForegroundColor Yellow
        Read-Host "Presiona Enter para continuar"
    }
} else {
    Write-Host "[AVISO] No se encontro mysql.exe, continuando de todas formas..." -ForegroundColor Yellow
}

# 4. Crear base de datos si no existe
Write-Host ""
Write-Host "[4/5] Preparando base de datos..." -ForegroundColor Yellow

if (Test-Path $mysqlPath) {
    try {
        # Crear base de datos
        $sqlScript = "CREATE DATABASE IF NOT EXISTS TAPSTYLE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        & $mysqlPath -u root -e $sqlScript 2>$null
        Write-Host "[OK] Base de datos TAPSTYLE lista" -ForegroundColor Green
        
        # Aplicar schema
        $schemaPath = "..\..\tapstyle_schema_final.sql"
        if (Test-Path $schemaPath) {
            Write-Host "Aplicando schema..." -ForegroundColor Cyan
            Get-Content $schemaPath | & $mysqlPath -u root TAPSTYLE 2>$null
            Write-Host "[OK] Schema aplicado" -ForegroundColor Green
        } else {
            Write-Host "[AVISO] Schema no encontrado en $schemaPath" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[AVISO] Error preparando base de datos: $_" -ForegroundColor Yellow
        Write-Host "Continuando de todas formas..." -ForegroundColor Yellow
    }
} else {
    Write-Host "[AVISO] No se puede preparar la base de datos automaticamente" -ForegroundColor Yellow
    Write-Host "Por favor ejecuta manualmente:" -ForegroundColor Yellow
    Write-Host "  1. CREATE DATABASE TAPSTYLE;" -ForegroundColor Cyan
    Write-Host "  2. SOURCE tapstyle_schema_final.sql;" -ForegroundColor Cyan
}

# 5. Iniciar el backend
Write-Host ""
Write-Host "[5/5] Iniciando Spring Boot Backend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Backend iniciando en http://localhost:8080/api" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

cd backend
.\mvnw.cmd spring-boot:run

