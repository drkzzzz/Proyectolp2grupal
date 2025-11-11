package com.lp2.tapstyle.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * DataLoader - Carga automáticamente los datos iniciales
 * Se ejecuta al iniciar la aplicación
 */
@Configuration
public class DataLoader {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Carga los inserts SQL iniciales al iniciar la aplicación
     * Solo se ejecuta si la base de datos está vacía
     */
    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            try {
                // Verificar si ya hay datos
                Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Empresas", Integer.class);

                if (count == null || count == 0) {
                    System.out.println("╔════════════════════════════════════════════════════════════╗");
                    System.out.println("║  Cargando datos iniciales en la base de datos...           ║");
                    System.out.println("╚════════════════════════════════════════════════════════════╝");

                    // Cargar script principal
                    loadSqlScript("inserts/01-insert-data-initial.sql");

                    System.out.println("✓ Datos iniciales cargados correctamente");

                    // Mostrar resumen de carga
                    showDataSummary();
                } else {
                    System.out.println("✓ Base de datos ya contiene " + count + " empresa(s). Skipping data load.");
                }
            } catch (Exception e) {
                System.err.println("✗ Error al cargar datos iniciales: " + e.getMessage());
                // No lanzar excepción para permitir que la app siga funcionando
            }
        };
    }

    /**
     * Carga un archivo SQL desde resources
     */
    private void loadSqlScript(String resourcePath) throws Exception {
        String scriptPath = "classpath:" + resourcePath;
        File file = ResourceUtils.getFile(scriptPath);
        String sql = new String(Files.readAllBytes(Paths.get(file.toURI())));

        // Dividir por puntos y coma y ejecutar cada statement
        String[] statements = sql.split(";");
        int executedCount = 0;

        for (String statement : statements) {
            String trimmed = statement.trim();
            // Ignorar comentarios y statements vacíos
            if (!trimmed.isEmpty() && !trimmed.startsWith("--")) {
                try {
                    jdbcTemplate.execute(trimmed + ";");
                    executedCount++;
                } catch (Exception e) {
                    // Log pero no fallar - algunos statements pueden ser queries de validación
                    System.out.println("  ⚠ Statement ignorado: " + e.getMessage().substring(0, 50) + "...");
                }
            }
        }

        System.out.println("  → Ejecutados " + executedCount + " statements SQL");
    }

    /**
     * Muestra un resumen de los datos cargados
     */
    private void showDataSummary() {
        try {
            Integer empresas = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Empresas", Integer.class);
            Integer usuarios = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Usuarios", Integer.class);
            Integer productos = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Productos", Integer.class);
            Integer variantes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM VarianteProducto", Integer.class);
            Integer proveedores = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Proveedores", Integer.class);
            Integer almacenes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Almacenes", Integer.class);
            Integer inventarios = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Inventarios", Integer.class);
            Integer clientes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Clientes", Integer.class);

            System.out.println("\n╔════════════════════════════════════════════════════════════╗");
            System.out.println("║  RESUMEN DE DATOS CARGADOS EN TAPSTYLE                      ║");
            System.out.println("╠════════════════════════════════════════════════════════════╣");
            System.out.println("║  🏢 Empresas:           " + String.format("%2d", empresas)
                    + "                                          ║");
            System.out.println("║  👥 Usuarios:           " + String.format("%2d", usuarios)
                    + "                                          ║");
            System.out.println("║  📦 Productos:          " + String.format("%2d", productos)
                    + "                                          ║");
            System.out.println("║  🏷️  Variantes:         " + String.format("%2d", variantes)
                    + "                                          ║");
            System.out.println("║  🤝 Proveedores:        " + String.format("%2d", proveedores)
                    + "                                          ║");
            System.out.println("║  🏪 Almacenes:          " + String.format("%2d", almacenes)
                    + "                                          ║");
            System.out.println("║  📊 Registros Inv:      " + String.format("%2d", inventarios)
                    + "                                          ║");
            System.out.println("║  👤 Clientes:           " + String.format("%2d", clientes)
                    + "                                          ║");
            System.out.println("╚════════════════════════════════════════════════════════════╝\n");
        } catch (Exception e) {
            System.out.println("⚠ No se pudo mostrar el resumen de datos");
        }
    }
}
