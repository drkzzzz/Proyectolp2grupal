package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.EmpresaDTO;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

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
        Empresa saved = empresaRepository.save(empresa);
        return convertToDTO(saved);
    }

    public EmpresaDTO actualizar(Integer id, EmpresaDTO dto) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + id));

        empresa.setNombreTienda(dto.getNombreTienda());
        empresa.setRucEmpresa(dto.getRucEmpresa());
        empresa.setDireccionLegal(dto.getDireccionLegal());
        empresa.setTelefono(dto.getTelefono());
        empresa.setEmailContacto(dto.getEmailContacto());
        empresa.setEstadoAprobacion(dto.getEstadoAprobacion());
        empresa.setTasaComision(dto.getTasaComision());

        Empresa updated = empresaRepository.save(empresa);
        return convertToDTO(updated);
    }

    public void eliminar(Integer id) {
        empresaRepository.deleteById(id);
    }

    private EmpresaDTO convertToDTO(Empresa empresa) {
        return EmpresaDTO.builder()
                .idEmpresa(empresa.getIdEmpresa())
                .nombreTienda(empresa.getNombreTienda())
                .rucEmpresa(empresa.getRucEmpresa())
                .direccionLegal(empresa.getDireccionLegal())
                .telefono(empresa.getTelefono())
                .emailContacto(empresa.getEmailContacto())
                .fechaRegistro(empresa.getFechaRegistro())
                .estadoAprobacion(empresa.getEstadoAprobacion())
                .tasaComision(empresa.getTasaComision())
                .build();
    }

    private Empresa convertToEntity(EmpresaDTO dto) {
        return Empresa.builder()
                .idEmpresa(dto.getIdEmpresa())
                .nombreTienda(dto.getNombreTienda())
                .rucEmpresa(dto.getRucEmpresa())
                .direccionLegal(dto.getDireccionLegal())
                .telefono(dto.getTelefono())
                .emailContacto(dto.getEmailContacto())
                .estadoAprobacion(dto.getEstadoAprobacion())
                .tasaComision(dto.getTasaComision())
                .build();
    }
}
