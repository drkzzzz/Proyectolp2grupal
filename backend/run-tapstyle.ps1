#!/usr/bin/env pwsh

<#
╔════════════════════════════════════════════════════════════════════════╗
║        SCRIPT DE INICIO - TapStyle Backend con Datos Precargados      ║
║                          PowerShell Version                           ║
╚════════════════════════════════════════════════════════════════════════╝

Uso: 
    PowerShell -ExecutionPolicy Bypass -File run-tapstyle.ps1

O desde PowerShell:
    .\run-tapstyle.ps1
#>

$ErrorActionPreference = "Stop"

# Colores para output
$Green = [System.Console]::ForegroundColor = 'Green'
$Red = [System.Console]::ForegroundColor = 'Red'
$Yellow = [System.Console]::ForegroundColor = 'Yellow'
$Cyan = [System.Console]::ForegroundColor = 'Cyan'
$Reset = [System.Console]::ResetColor()

# Banner
Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              🎯 TAPSTYLE BACKEND SETUP                            ║" -ForegroundColor Cyan
Write-Host "║         Cargando datos de prueba y iniciando servidor             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Función para cambiar color
function WriteSuccess($msg) {
    Write-Host "✓ $msg" -ForegroundColor Green
}

function WriteError($msg) {
    Write-Host "✗ $msg" -ForegroundColor Red
}

function WriteWarning($msg) {
    Write-Host "⚠ $msg" -ForegroundColor Yellow
}

function WriteInfo($msg) {
    Write-Host "ℹ $msg" -ForegroundColor Cyan
}

# Cambiar a directorio backend
$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
$backendPath = Join-Path -Path (Split-Path -Parent -Path $scriptPath) -ChildPath "backend"

if (-not (Test-Path $backendPath)) {
    WriteError "Directorio backend no encontrado en: $backendPath"
    exit 1
}

Set-Location $backendPath
WriteSuccess "Directorio backend encontrado: $(Get-Location)"

# Verificar Java
Write-Host "`n════════════════════════════════════════════════════════════════════"
Write-Host "Verificando requisitos..."
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

try {
    $javaVersion = java -version 2>&1
    WriteSuccess "Java detectado"
    Write-Host "  $($javaVersion[0])" -ForegroundColor DarkGray
} catch {
    WriteError "Java no está instalado o no está en PATH"
    Write-Host "  Descargalo desde: https://www.oracle.com/java/technologies/" -ForegroundColor Yellow
    exit 1
}

# Verificar Maven
try {
    $mvnVersion = mvn -version 2>&1 | Select-Object -First 1
    WriteSuccess "Maven detectado"
    Write-Host "  $mvnVersion" -ForegroundColor DarkGray
    $MVN = "mvn"
} catch {
    WriteWarning "Maven no está en PATH, intentando con mvnw..."
    
    if (Test-Path "mvnw.cmd") {
        $MVN = "mvnw.cmd"
        WriteSuccess "Usando Maven Wrapper"
    } else {
        WriteError "Ni Maven ni Maven Wrapper encontrados"
        exit 1
    }
}

# Verificar pom.xml
if (-not (Test-Path "pom.xml")) {
    WriteError "pom.xml no encontrado en el directorio actual"
    exit 1
}
WriteSuccess "pom.xml encontrado"

Write-Host "`n════════════════════════════════════════════════════════════════════"
Write-Host "Compilando el proyecto con Maven..."
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Compilar
& $MVN clean install -DskipTests
if ($LASTEXITCODE -ne 0) {
    WriteError "Error durante la compilación"
    exit 1
}

Write-Host "`n════════════════════════════════════════════════════════════════════"
WriteSuccess "Compilación exitosa!"
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Mostrar información importante
Write-Host "`n📋 INFORMACIÓN IMPORTANTE:" -ForegroundColor Cyan
Write-Host "────────────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""
WriteInfo "1. Asegúrate de que MySQL está corriendo"
Write-Host "   En Windows: Services → MySQL80 (debe estar iniciado)" -ForegroundColor DarkGray
Write-Host ""
WriteInfo "2. Base de datos TAPSTYLE debe estar creada"
Write-Host "   Ejecuta: mysql -u root -p < tapstyle_schema_final.sql" -ForegroundColor DarkGray
Write-Host ""
WriteInfo "3. El DataLoader cargará automáticamente" -ForegroundColor Cyan
Write-Host "   • 4 Empresas" -ForegroundColor DarkGray
Write-Host "   • 22 Usuarios con diferentes roles" -ForegroundColor DarkGray
Write-Host "   • 10 Productos con 35 variantes" -ForegroundColor DarkGray
Write-Host "   • 5 Almacenes con inventario" -ForegroundColor DarkGray
Write-Host "   • Y mucho más..." -ForegroundColor DarkGray
Write-Host ""
WriteInfo "4. API disponible en: http://localhost:8080/api" -ForegroundColor Green
Write-Host ""
WriteInfo "5. Credenciales de prueba:" -ForegroundColor Cyan
Write-Host "   Usuario: superadmin  |  Contraseña: password" -ForegroundColor DarkGray
Write-Host "   Usuario: admin_ge    |  Contraseña: password" -ForegroundColor DarkGray
Write-Host "   Usuario: vendedor_ge1|  Contraseña: password" -ForegroundColor DarkGray
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Esperar input antes de iniciar
Write-Host "`nPresiona cualquier tecla para iniciar el servidor..." -ForegroundColor Yellow
[Console]::ReadKey($true) | Out-Null

# Iniciar servidor
Write-Host "`nIniciando TapStyle Backend..." -ForegroundColor Green
Write-Host "`n════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

& $MVN spring-boot:run

# Esperar al final
Write-Host "`nPresiona cualquier tecla para cerrar..." -ForegroundColor Yellow
[Console]::ReadKey($true) | Out-Null
