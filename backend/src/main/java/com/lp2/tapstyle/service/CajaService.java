package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.CajaDTO;
import com.lp2.tapstyle.model.Caja;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.repository.CajaRepository;
import com.lp2.tapstyle.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CajaService {

    private final CajaRepository cajaRepository;
    private final EmpresaRepository empresaRepository;

    public List<CajaDTO> obtenerTodas() {
        return cajaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CajaDTO> obtenerPorEmpresa(Integer empresaId) {
        return cajaRepository.findByEmpresa_IdEmpresa(empresaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CajaDTO obtenerPorId(Integer id) {
        return cajaRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Caja no encontrada con id: " + id));
    }

    public CajaDTO crear(CajaDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        Caja caja = Caja.builder()
                .empresa(empresa)
                .nombreCaja(dto.getNombreCaja())
                .ubicacion(dto.getUbicacion())
                .estado("Cerrada")
                .montoInicial(BigDecimal.ZERO)
                .montoActual(BigDecimal.ZERO)
                .build();

        Caja saved = cajaRepository.save(caja);
        return convertToDTO(saved);
    }

    public CajaDTO actualizar(Integer id, CajaDTO dto) {
        Caja caja = cajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        caja.setNombreCaja(dto.getNombreCaja());
        caja.setUbicacion(dto.getUbicacion());

        Caja updated = cajaRepository.save(caja);
        return convertToDTO(updated);
    }

    public CajaDTO abrirCaja(Integer id, BigDecimal montoInicial) {
        Caja caja = cajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        if ("Abierta".equals(caja.getEstado())) {
            throw new RuntimeException("La caja ya está abierta");
        }

        caja.setEstado("Abierta");
        caja.setMontoInicial(montoInicial != null ? montoInicial : BigDecimal.ZERO);
        caja.setMontoActual(montoInicial != null ? montoInicial : BigDecimal.ZERO);
        caja.setFechaApertura(LocalDateTime.now());
        caja.setFechaCierre(null);

        Caja updated = cajaRepository.save(caja);
        return convertToDTO(updated);
    }

    public CajaDTO cerrarCaja(Integer id) {
        Caja caja = cajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        if ("Cerrada".equals(caja.getEstado())) {
            throw new RuntimeException("La caja ya está cerrada");
        }

        caja.setEstado("Cerrada");
        caja.setFechaCierre(LocalDateTime.now());

        Caja updated = cajaRepository.save(caja);
        return convertToDTO(updated);
    }

    public void eliminar(Integer id) {
        Caja caja = cajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        if ("Abierta".equals(caja.getEstado())) {
            throw new RuntimeException("No se puede eliminar una caja abierta. Ciérrala primero.");
        }

        cajaRepository.deleteById(id);
    }

    private CajaDTO convertToDTO(Caja caja) {
        return CajaDTO.builder()
                .idCaja(caja.getIdCaja())
                .idEmpresa(caja.getEmpresa().getIdEmpresa())
                .nombreCaja(caja.getNombreCaja())
                .ubicacion(caja.getUbicacion())
                .estado(caja.getEstado())
                .montoInicial(caja.getMontoInicial() != null ? caja.getMontoInicial() : BigDecimal.ZERO)
                .montoActual(caja.getMontoActual() != null ? caja.getMontoActual() : BigDecimal.ZERO)
                .fechaApertura(caja.getFechaApertura())
                .fechaCierre(caja.getFechaCierre())
                .build();
    }
}
