# 📋 Guía: Cómo Hacer Backup de la Base de Datos TapStyle

## 🎯 Opción 1: Usar phpMyAdmin (RECOMENDADO para Windows)

Esta es la forma más sencilla cuando usas XAMPP:

### Pasos:

1. **Abrir phpMyAdmin**
   - Abre tu navegador
   - Ve a: `http://localhost/phpmyadmin`

2. **Seleccionar la base de datos**
   - En el panel izquierdo, haz clic en `tapstyle`

3. **Exportar la base de datos**
   - Haz clic en la pestaña **"Exportar"** en la parte superior
   
4. **Configurar la exportación**
   - Método: Selecciona **"Rápido"** (o "Personalizado" si quieres opciones avanzadas)
   - Formato: Deja **"SQL"**
   
5. **Descargar el backup**
   - Haz clic en el botón **"Continuar"**
   - Se descargará un archivo `tapstyle.sql`

6. **Guardar el archivo**
   - Mueve el archivo descargado a tu carpeta del proyecto:
   ```
   e:\SEPTIMO CICLO\LP2\Proyectolp2grupal\tapstyle_backup_antes_limpieza.sql
   ```

✅ **¡Listo! Ya tienes tu backup.**

---

## 🎯 Opción 2: Usar mysqldump desde la línea de comandos

Si prefieres usar la consola, necesitas agregar MySQL al PATH o usar la ruta completa:

### Paso 1: Encontrar la ubicación de mysqldump

Con XAMPP, generalmente está en:
```
C:\xampp\mysql\bin\mysqldump.exe
```

### Paso 2: Ejecutar el comando con ruta completa

```powershell
# Navegar a tu carpeta del proyecto
cd "e:\SEPTIMO CICLO\LP2\Proyectolp2grupal"

# Ejecutar mysqldump con ruta completa
& "C:\xampp\mysql\bin\mysqldump.exe" -u root tapstyle > tapstyle_backup_antes_limpieza.sql
```

**Nota:** Si XAMPP está instalado en otra ubicación, busca la carpeta `xampp\mysql\bin\`

---

## 🎯 Opción 3: Agregar MySQL al PATH (Opcional)

Si quieres usar `mysqldump` sin la ruta completa:

### En PowerShell (Temporal - solo para esta sesión):

```powershell
$env:Path += ";C:\xampp\mysql\bin"
```

Luego puedes usar:
```powershell
mysqldump -u root tapstyle > tapstyle_backup_antes_limpieza.sql
```

---

## ❓ ¿Realmente necesito el backup?

### Para este caso específico: **NO es crítico**

Los scripts que vamos a ejecutar son **muy seguros**:

1. **`cleanup_database.sql`:**
   - Solo elimina tablas **VACÍAS** (sin datos)
   - Son tablas duplicadas que no se usan

2. **`encriptar_password.sql`:**
   - Solo actualiza 1 campo de 1 registro
   - Puedes revertirlo fácilmente

### ¿Cuándo SÍ necesitas backup?

- ✅ Si la BD tiene datos importantes de clientes/productos
- ✅ Si es un ambiente de producción
- ✅ Si no estás seguro de lo que hacen los scripts

### ¿Cuándo NO es tan crítico?

- ⭕ Si es ambiente de desarrollo
- ⭕ Si puedes re-ejecutar el script original (`tapstyle_schema_final.sql`)
- ⭕ Si las tablas a eliminar están vacías (como en este caso)

---

## 🚀 Mi Recomendación

**Para tu caso:**

1. **Haz un backup rápido desde phpMyAdmin** (toma 30 segundos)
2. **Ejecuta los scripts SQL directamente en phpMyAdmin**
3. **Verifica que todo funciona**

Si algo sale mal (muy poco probable), simplemente:
- Importas el backup
- O re-ejecutas `tapstyle_schema_final.sql`

---

## 📝 Resumen de Pasos

### Backup + Limpieza:

```
1. Abrir phpMyAdmin → tapstyle → Exportar → Continuar
2. Guardar el archivo descargado
3. En phpMyAdmin → tapstyle → SQL
4. Copiar contenido de cleanup_database.sql
5. Ejecutar
6. Copiar contenido de encriptar_password.sql  
7. Ejecutar
```

**Tiempo estimado:** 2-3 minutos ⏱️

---

## 🆘 Si algo sale mal

### Restaurar el backup:

**Opción A - phpMyAdmin:**
1. Eliminar la BD `tapstyle`
2. Crear nueva BD `tapstyle`
3. Ir a "Importar"
4. Seleccionar tu archivo de backup
5. Continuar

**Opción B - Re-ejecutar schema original:**
1. En phpMyAdmin, seleccionar `tapstyle`
2. Ir a SQL
3. Copiar contenido de `tapstyle_schema_final.sql`
4. Ejecutar

---

## ✨ Conclusión

**Lo más fácil:** Usa phpMyAdmin para todo (backup, ejecutar scripts).

**No necesitas** configurar PATH ni usar línea de comandos para MySQL si tienes XAMPP con phpMyAdmin.
