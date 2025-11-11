@echo off
REM =====================================================================
REM  SCRIPT DE DEMOSTRACIÓN - TapStyle Backend con Datos Precargados
REM  Uso: Ejecutar después de tener la BD creada
REM =====================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║                    🎯 TAPSTYLE BACKEND SETUP                       ║
echo ║              Cargando datos de prueba y iniciando servidor         ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

REM Cambiar a directorio backend
cd /d "%~dp0backend"

if not exist pom.xml (
    echo ✗ ERROR: No se encontró pom.xml en %CD%
    echo   Asegúrate de estar en la carpeta correcta
    pause
    exit /b 1
)

echo ✓ Directorio backend encontrado
echo.

REM Verificar si Java está instalado
java -version >nul 2>&1
if errorlevel 1 (
    echo ✗ ERROR: Java no está instalado o no está en PATH
    pause
    exit /b 1
)
echo ✓ Java detectado

REM Verificar si Maven está instalado
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ✗ ADVERTENCIA: Maven no está en PATH
    echo   Usando mvnw.cmd en su lugar
    set MVN=mvnw.cmd
) else (
    echo ✓ Maven detectado
    set MVN=mvn
)

echo.
echo ════════════════════════════════════════════════════════════════════
echo  Compilando el proyecto con Maven...
echo ════════════════════════════════════════════════════════════════════
echo.

REM Compilar
call %MVN% clean install -DskipTests
if errorlevel 1 (
    echo ✗ Error durante la compilación
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════════════
echo  ✓ Compilación exitosa!
echo ════════════════════════════════════════════════════════════════════
echo.
echo 📋 INFORMACIÓN IMPORTANTE:
echo ────────────────────────────────────────────────────────────────────
echo.
echo 1. Asegúrate de que MySQL está corriendo:
echo    - En Windows: Services → MySQL80 (debe estar iniciado)
echo.
echo 2. Base de datos TAPSTYLE debe estar creada:
echo    mysql -u root -p < tapstyle_schema_final.sql
echo.
echo 3. El DataLoader cargará automáticamente:
echo    - 4 Empresas
echo    - 22 Usuarios con diferentes roles
echo    - 10 Productos con 35 variantes
echo    - 5 Almacenes con inventario
echo    - Y mucho más...
echo.
echo 4. API disponible en: http://localhost:8080/api
echo.
echo ════════════════════════════════════════════════════════════════════
echo  Presiona una tecla para iniciar el servidor...
echo ════════════════════════════════════════════════════════════════════
echo.
pause

REM Iniciar servidor
echo Iniciando TapStyle Backend...
echo.
call %MVN% spring-boot:run

pause
