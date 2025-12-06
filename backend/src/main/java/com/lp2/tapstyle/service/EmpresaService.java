package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.CrearEmpresaConAdminRequest;
import com.lp2.tapstyle.dto.DatosAdminDTO;
import com.lp2.tapstyle.dto.EmpresaDTO;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.model.Rol;
import com.lp2.tapstyle.model.Usuario;
import com.lp2.tapstyle.model.Plan;
import com.lp2.tapstyle.repository.EmpresaRepository;
import com.lp2.tapstyle.repository.PlanRepository;
import com.lp2.tapstyle.repository.RolRepository;
import com.lp2.tapstyle.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final PlanRepository planRepository;

    public List<EmpresaDTO> obtenerTodas() {
        return empresaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EmpresaDTO obtenerPorId(Integer id) {
        return empresaRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + id));
    }

    public EmpresaDTO crear(EmpresaDTO dto) {
        if (empresaRepository.findByNombreTienda(dto.getNombreTienda()).isPresent()) {
            throw new RuntimeException("Ya existe una tienda con el nombre: " + dto.getNombreTienda());
        }

        Empresa empresa = convertToEntity(dto);

        // Lógica de PLANES (Creación simple)
        if (dto.getPlanId() != null) {
            Plan plan = planRepository.findById(dto.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

            empresa.setTasaComision(plan.getComisionAdicional());
            List<String> modulosDelPlan = planRepository.findModulosByPlanId(plan.getIdPlan());
            empresa.setModulosActivos(String.join(",", modulosDelPlan));
        }

        Empresa saved = empresaRepository.save(empresa);
        return convertToDTO(saved);
    }

    public EmpresaDTO actualizar(Integer id, EmpresaDTO dto) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + id));

        if (dto.getNombreTienda() != null)
            empresa.setNombreTienda(dto.getNombreTienda());
        if (dto.getRucEmpresa() != null)
            empresa.setRucEmpresa(dto.getRucEmpresa());
        if (dto.getDireccionLegal() != null)
            empresa.setDireccionLegal(dto.getDireccionLegal());
        if (dto.getTelefono() != null)
            empresa.setTelefono(dto.getTelefono());
        if (dto.getEmailContacto() != null)
            empresa.setEmailContacto(dto.getEmailContacto());
        if (dto.getEstado() != null)
            empresa.setEstado(dto.getEstado());

        // La tasa de comisión se actualiza si viene directa, pero el PLAN tiene
        // prioridad abajo
        if (dto.getTasaComision() != null)
            empresa.setTasaComision(dto.getTasaComision());

        if (dto.getModulosActivos() != null) {
            empresa.setModulosActivos(dto.getModulosActivos());
        }

        // Lógica de PLANES en Actualización
        if (dto.getPlanId() != null) {
            Plan plan = planRepository.findById(dto.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

            empresa.setTasaComision(plan.getComisionAdicional());
            List<String> modulosDelPlan = planRepository.findModulosByPlanId(plan.getIdPlan());
            empresa.setModulosActivos(String.join(",", modulosDelPlan));
            empresa.setPlanId(plan.getIdPlan()); // Persistir el ID del plan
        }

        Empresa updated = empresaRepository.save(empresa);
        return convertToDTO(updated);
    }

    public void cambiarEstado(Integer id, Boolean active) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + id));

        empresa.setEstado(active);
        empresaRepository.save(empresa);

        // También actualizar el estado del usuario administrador asociado
        // Buscamos usuarios con rol de admin (id_rol=2) y que pertenezcan a esta
        // empresa
        List<Usuario> admins = usuarioRepository.findByEmpresaAndRolIdRol(empresa, 2);
        for (Usuario admin : admins) {
            admin.setEstado(active);
            usuarioRepository.save(admin);
        }
    }

    public void actualizarModulos(Integer id, String modulos) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + id));

        empresa.setModulosActivos(modulos);
        empresaRepository.save(empresa);
    }

    /**
     * Crear empresa con su usuario administrador de forma atómica
     */
    public EmpresaDTO crearEmpresaConAdministrador(CrearEmpresaConAdminRequest request) {
        EmpresaDTO empresaDTO = request.getEmpresa();
        DatosAdminDTO adminDTO = request.getAdministrador();

        // Validaciones de empresa
        validarDatosEmpresa(empresaDTO);

        // Validaciones de administrador
        validarDatosAdministrador(adminDTO);

        // Crear la empresa con estado activo por defecto
        Empresa empresa = convertToEntity(empresaDTO);
        empresa.setEstado(true);

        // Si no se especifica tasa de comisión, usar valor por defecto 0.15
        // Si no se especifica tasa de comisión, usar valor por defecto 0.15
        if (empresa.getTasaComision() == null) {
            empresa.setTasaComision(new java.math.BigDecimal("0.15"));
        }

        // Lógica de PLANES (Creación con Admin)
        if (empresaDTO.getPlanId() != null) {
            Plan plan = planRepository.findById(empresaDTO.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

            empresa.setTasaComision(plan.getComisionAdicional());
            List<String> modulosDelPlan = planRepository.findModulosByPlanId(plan.getIdPlan());
            empresa.setModulosActivos(String.join(",", modulosDelPlan));
            empresa.setPlanId(plan.getIdPlan()); // Persistir el ID del plan
            empresa.setModulosActivos(String.join(",", modulosDelPlan));
        } else {
            // Default Legacy si no hay plan
            if (empresa.getModulosActivos() == null || empresa.getModulosActivos().isEmpty()) {
                empresa.setModulosActivos("DASHBOARD,CATALOGO,OPERACIONES,FINANZAS,ADMINISTRACION");
            }
        }

        // Si no se especifican módulos, usar valor por defecto
        // Si no se especifican módulos, usar valor por defecto (YA MANEJADO ARRIBA)
        if (empresa.getModulosActivos() == null || empresa.getModulosActivos().isEmpty()) {
            // empresa.setModulosActivos("DASHBOARD,CATALOGO,OPERACIONES,FINANZAS,ADMINISTRACION");
        }

        Empresa empresaGuardada = empresaRepository.save(empresa);

        // Crear el usuario administrador
        crearUsuarioAdministrador(empresaGuardada, adminDTO);

        return convertToDTO(empresaGuardada);
    }

    public List<EmpresaDTO> obtenerPorEstado(Boolean estado) {
        return empresaRepository.findByEstadoOrderByFechaRegistroDesc(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ============ Métodos de Validación ============

    private void validarDatosEmpresa(EmpresaDTO dto) {
        // Validar nombre único
        if (empresaRepository.findByNombreTienda(dto.getNombreTienda()).isPresent()) {
            throw new RuntimeException("Ya existe una empresa con el nombre: " + dto.getNombreTienda());
        }

        // Validar RUC único y formato
        if (dto.getRucEmpresa() != null && !dto.getRucEmpresa().isEmpty()) {
            if (empresaRepository.findByRucEmpresa(dto.getRucEmpresa()).isPresent()) {
                throw new RuntimeException("Ya existe una empresa con el RUC: " + dto.getRucEmpresa());
            }

            // Validar formato RUC: 11 dígitos numéricos
            if (!dto.getRucEmpresa().matches("\\d{11}")) {
                throw new RuntimeException("El RUC debe tener exactamente 11 dígitos numéricos");
            }
        }
    }

    private void validarDatosAdministrador(DatosAdminDTO adminDTO) {
        if (adminDTO == null) {
            throw new RuntimeException("Los datos del administrador son requeridos");
        }

        if (adminDTO.getEmail() == null || adminDTO.getEmail().isEmpty()) {
            throw new RuntimeException("El email del administrador es requerido");
        }

        if (adminDTO.getPassword() == null || adminDTO.getPassword().length() < 6) {
            throw new RuntimeException("La contraseña del administrador debe tener al menos 6 caracteres");
        }

        // Validar email único
        if (usuarioRepository.existsByEmail(adminDTO.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + adminDTO.getEmail());
        }
    }

    private void crearUsuarioAdministrador(Empresa empresa, DatosAdminDTO adminDTO) {
        // Buscar rol de Admin (id_rol = 2)
        Rol rolAdmin = rolRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("No se encontró el rol de Administrador"));

        // Crear username a partir del email (parte antes del @)
        String username = adminDTO.getEmail().split("@")[0];

        // Si el username ya existe, agregar ID de empresa
        if (usuarioRepository.existsByUsername(username)) {
            username = username + "_" + empresa.getIdEmpresa();
        }

        // Crear el usuario
        Usuario admin = Usuario.builder()
                .empresa(empresa)
                .rol(rolAdmin)
                .nombres(adminDTO.getNombres() != null ? adminDTO.getNombres() : "Admin")
                .apellidos(adminDTO.getApellidos() != null ? adminDTO.getApellidos() : empresa.getNombreTienda())
                .email(adminDTO.getEmail())
                .username(username)
                .contraseñaHash(passwordEncoder.encode(adminDTO.getPassword()))
                .estado(true)
                .build();

        usuarioRepository.save(admin);
    }

    private EmpresaDTO convertToDTO(Empresa empresa) {
        EmpresaDTO dto = EmpresaDTO.builder()
                .idEmpresa(empresa.getIdEmpresa())
                .nombreTienda(empresa.getNombreTienda())
                .rucEmpresa(empresa.getRucEmpresa())
                .direccionLegal(empresa.getDireccionLegal())
                .telefono(empresa.getTelefono())
                .emailContacto(empresa.getEmailContacto())
                .fechaRegistro(empresa.getFechaRegistro())
                .estado(empresa.getEstado())
                .tasaComision(empresa.getTasaComision())
                .modulosActivos(empresa.getModulosActivos())
                .planId(empresa.getPlanId()) // Mapear planId al DTO
                .build();

        if (empresa.getPlanId() != null) {
            planRepository.findById(empresa.getPlanId()).ifPresent(plan -> {
                dto.setNombrePlan(plan.getNombrePlan());
                dto.setPrecioMensual(plan.getPrecioMensual());
            });
        }

        return dto;
    }

    private Empresa convertToEntity(EmpresaDTO dto) {
        return Empresa.builder()
                .idEmpresa(dto.getIdEmpresa())
                .nombreTienda(dto.getNombreTienda())
                .rucEmpresa(dto.getRucEmpresa())
                .direccionLegal(dto.getDireccionLegal())
                .telefono(dto.getTelefono())
                .emailContacto(dto.getEmailContacto())
                .estado(dto.getEstado())
                .tasaComision(dto.getTasaComision())
                .modulosActivos(dto.getModulosActivos())
                .build();
    }
}
