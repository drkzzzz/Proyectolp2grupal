package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.CajaDTO;
import com.lp2.tapstyle.model.AperturaCaja;
import com.lp2.tapstyle.model.Caja;
import com.lp2.tapstyle.model.CierreCaja;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.repository.CajaRepository;
import com.lp2.tapstyle.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CajaService {

    private final CajaRepository cajaRepository;
    private final EmpresaRepository empresaRepository;
    private final com.lp2.tapstyle.repository.AperturaCajaRepository aperturaCajaRepository;
    private final com.lp2.tapstyle.repository.CierreCajaRepository cierreCajaRepository;

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

    public CajaDTO abrirCaja(Integer id, BigDecimal montoInicial, Integer idUsuario) {
        Caja caja = cajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        if ("Abierta".equals(caja.getEstado())) {
            throw new RuntimeException("La caja ya está abierta");
        }

        // Registrar apertura
        AperturaCaja apertura = AperturaCaja.builder()
                .caja(caja)
                .idUsuario(idUsuario != null ? idUsuario : 1) // Default to 1 if null (system/admin)
                .fechaApertura(LocalDate.now())
                .horaApertura(LocalTime.now())
                .montoInicial(montoInicial != null ? montoInicial : BigDecimal.ZERO)
                .build();
        aperturaCajaRepository.save(apertura);

        // Actualizar caja
        caja.setEstado("Abierta");
        caja.setMontoInicial(montoInicial != null ? montoInicial : BigDecimal.ZERO);
        caja.setMontoActual(montoInicial != null ? montoInicial : BigDecimal.ZERO);
        caja.setFechaApertura(LocalDateTime.now());
        caja.setFechaCierre(null);

        Caja updated = cajaRepository.save(caja);
        return convertToDTO(updated);
    }

    public CajaDTO cerrarCaja(Integer id, BigDecimal montoFinal, String observaciones, Integer idUsuario) {
        Caja caja = cajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        if ("Cerrada".equals(caja.getEstado())) {
            throw new RuntimeException("La caja ya está cerrada");
        }

        // Buscar la última apertura
        AperturaCaja ultimaApertura = aperturaCajaRepository
                .findTopByCaja_IdCajaOrderByFechaAperturaDescHoraAperturaDesc(id)
                .orElseThrow(() -> new RuntimeException("No se encontró registro de apertura para esta caja"));

        // Calcular montos
        // Monto esperado podría ser calculado sumando movimientos, pero por ahora
        // usamos el montoActual que se supone se actualiza con movimientos
        BigDecimal montoEsperado = caja.getMontoActual();
        BigDecimal diferencia = (montoFinal != null ? montoFinal : BigDecimal.ZERO).subtract(montoEsperado);

        // Registrar cierre
        CierreCaja cierre = CierreCaja.builder()
                .apertura(ultimaApertura)
                .caja(caja)
                .idUsuario(idUsuario != null ? idUsuario : 1)
                .fechaCierre(LocalDate.now())
                .horaCierre(LocalTime.now())
                .montoFinal(montoFinal != null ? montoFinal : BigDecimal.ZERO)
                .montoEsperado(montoEsperado)
                .diferencia(diferencia)
                .observaciones(observaciones)
                .build();
        cierreCajaRepository.save(cierre);

        // Actualizar caja
        caja.setEstado("Cerrada");
        caja.setFechaCierre(LocalDateTime.now());
        // No reseteamos montos a 0 aquí, se quedan como 'último estado' hasta la
        // próxima apertura?
        // Normalmente se dejan para historial, en apertura se resetean.
        // Pero para UI limpia, tal vez resetear? Sigamos la lógica anterior de apertura
        // que sobreescribe.

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
