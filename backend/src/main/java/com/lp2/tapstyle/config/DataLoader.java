package com.lp2.tapstyle.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;

import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.model.Rol;
import com.lp2.tapstyle.model.Usuario;
import com.lp2.tapstyle.model.Proveedor;
import com.lp2.tapstyle.repository.EmpresaRepository;
import com.lp2.tapstyle.repository.RolRepository;
import com.lp2.tapstyle.repository.UsuarioRepository;
import com.lp2.tapstyle.repository.ProveedorRepository;

/**
 * DataLoader - Carga automáticamente los datos iniciales
 * Se ejecuta al iniciar la aplicación
 */
@Configuration
public class DataLoader {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    /**
     * Carga los inserts SQL iniciales al iniciar la aplicación
     * Solo se ejecuta si la base de datos está vacía
     */
    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            try {
                long empresas = empresaRepository.count();
                long usuarios = usuarioRepository.count();
                if (empresas == 0 || usuarios == 0) {
                    Empresa empresa = Empresa.builder()
                            .nombreTienda("TapStyle - Sistema")
                            .rucEmpresa("20000000000")
                            .direccionLegal("Lima, Perú")
                            .telefono("999000000")
                            .emailContacto("info@tapstyle.com")
                            .estado(true)
                            .tasaComision(new java.math.BigDecimal("0.15"))
                            .build();
                    empresa = empresaRepository.save(empresa);

                    Rol rol = rolRepository.findByNombreRol("SuperAdmin")
                            .orElseGet(() -> rolRepository.save(Rol.builder()
                                    .nombreRol("SuperAdmin")
                                    .estado(true)
                                    .descripcion("Administrador del sistema")
                                    .build()));

                    Usuario usuario = Usuario.builder()
                            .empresa(empresa)
                            .rol(rol)
                            .nombres("Super")
                            .apellidos("Admin")
                            .username("superadmin")
                            .email("super@tapstyle.com")
                            .contraseñaHash("123456")
                            .estado(true)
                            .build();
                    usuarioRepository.save(usuario);

                    Proveedor proveedor = Proveedor.builder()
                            .empresa(empresa)
                            .razonSocial("Distribuidor Premium SPA")
                            .nombreComercial("Premium")
                            .ruc("20123456700")
                            .rubro("Textil")
                            .direccion("Jr. Industrial #500")
                            .telefono("987000001")
                            .email("proveedor@premium.com")
                            .build();
                    proveedorRepository.save(proveedor);

                    System.out.println("\n✓ Datos iniciales JPA cargados: empresa, superadmin y proveedor\n");
                }
            } catch (Exception e) {
                System.err.println("\n✗ Error al cargar datos: " + e.getMessage() + "\n");
            }
        };
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        showDataSummary();
    }

    /**
     * Muestra un resumen de los datos cargados
     */
    private void showDataSummary() {
        try {
            Integer empresas = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Empresas", Integer.class);
            Integer usuarios = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Usuarios", Integer.class);
            Integer proveedores = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Proveedores", Integer.class);

            System.out.println("========================================");
            System.out.println("RESUMEN DE DATOS CARGADOS");
            System.out.println("========================================");
            System.out.println("Empresas: " + empresas);
            System.out.println("Usuarios: " + usuarios);
            System.out.println("Proveedores: " + proveedores);
            System.out.println("========================================\n");

        } catch (Exception e) {
            System.err.println("Error mostrando resumen: " + e.getMessage());
        }
    }
}
