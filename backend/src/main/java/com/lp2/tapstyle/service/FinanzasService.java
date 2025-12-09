package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.CuentaFinancieraDTO;
import com.lp2.tapstyle.model.FacturaSuscripcion;
import com.lp2.tapstyle.repository.FacturaSuscripcionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanzasService {

        private final FacturaSuscripcionRepository facturaSuscripcionRepository;
        private final com.lp2.tapstyle.repository.ComprobantePagoRepository comprobantePagoRepository;
        private final com.lp2.tapstyle.repository.ClienteRepository clienteRepository;
        private final com.lp2.tapstyle.repository.PagosEmpresaATapStyleRepository pagosEmpresaATapStyleRepository;
        private final com.lp2.tapstyle.repository.SuscripcionEmpresaRepository suscripcionEmpresaRepository;

        public com.lp2.tapstyle.dto.ReporteFinancieroDTO obtenerReporte(Integer idEmpresa) {
                // Ingresos: Suma de Comprobantes Pagados este mes (simplificado a total
                // histórico por ahora o query compleja)
                List<com.lp2.tapstyle.model.ComprobantePago> ventas = comprobantePagoRepository
                                .findByIdEmpresa(idEmpresa);
                java.math.BigDecimal ingresos = ventas.stream()
                                .filter(v -> !"Anulado".equals(v.getEstado()))
                                .map(com.lp2.tapstyle.model.ComprobantePago::getTotal)
                                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

                // Gastos: Suma de Pagos a TapStyle
                List<com.lp2.tapstyle.model.PagosEmpresaATapStyle> pagosPlataforma = pagosEmpresaATapStyleRepository
                                .findByIdEmpresa(idEmpresa);
                java.math.BigDecimal gastos = pagosPlataforma.stream()
                                .map(com.lp2.tapstyle.model.PagosEmpresaATapStyle::getMontoPagado)
                                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

                // Por Cobrar: Ventas Pendientes
                java.math.BigDecimal porCobrar = obtenerCuentasPorCobrar(idEmpresa).stream()
                                .map(CuentaFinancieraDTO::getMonto)
                                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

                // Por Pagar: Facturas Suscripción Pendientes
                java.math.BigDecimal porPagar = obtenerCuentasPorPagar(idEmpresa).stream()
                                .map(CuentaFinancieraDTO::getMonto)
                                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

                return com.lp2.tapstyle.dto.ReporteFinancieroDTO.builder()
                                .ingresosMes(ingresos)
                                .gastosMes(gastos)
                                .totalPorCobrar(porCobrar)
                                .totalPorPagar(porPagar)
                                .build();
        }

        public void registrarPagoSuscripcion(Integer idEmpresa, Long idFactura, String metodoPago) {
                FacturaSuscripcion factura = facturaSuscripcionRepository.findById(idFactura)
                                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));

                if (!factura.getIdEmpresa().equals(idEmpresa)) {
                        throw new RuntimeException("No tiene permisos para pagar esta factura");
                }

                if ("Pagado".equals(factura.getEstado())) {
                        throw new RuntimeException("La factura ya está pagada");
                }

                // 1. Actualizar Factura
                factura.setEstado("Pagado");
                factura.setFechaPago(java.time.LocalDateTime.now());
                factura.setMetodoPago(metodoPago);
                facturaSuscripcionRepository.save(factura);

                // 2. Registrar en Historial de Pagos (Para SuperAdmin)
                com.lp2.tapstyle.model.PagosEmpresaATapStyle pago = com.lp2.tapstyle.model.PagosEmpresaATapStyle
                                .builder()
                                .idEmpresa(idEmpresa)
                                .tipoPago("SUSCRIPCION")
                                .idFacturaSuscripcion(factura.getIdFacturaSuscripcion())
                                .montoPagado(factura.getMontoSuscripcion())
                                .fechaPago(java.time.LocalDateTime.now())
                                .metodoPago(metodoPago)
                                .referenciaPago("PAGO-AUTO-" + System.currentTimeMillis())
                                .build();
                pagosEmpresaATapStyleRepository.save(pago);

                // 3. Actualizar Suscripción Padre
                if (factura.getSuscripcion() != null) {
                        com.lp2.tapstyle.model.SuscripcionEmpresa sub = factura.getSuscripcion();
                        sub.setEstado("Pagado");
                        suscripcionEmpresaRepository.save(sub);
                }
        }

        public List<CuentaFinancieraDTO> obtenerCuentasPorPagar(Integer idEmpresa) {
                List<FacturaSuscripcion> facturasSuscripcion = facturaSuscripcionRepository.findByIdEmpresa(idEmpresa);

                return facturasSuscripcion.stream()
                                .filter(f -> !"Pagado".equals(f.getEstado()))
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        public List<CuentaFinancieraDTO> obtenerCuentasPorCobrar(Integer idEmpresa) {
                List<com.lp2.tapstyle.model.ComprobantePago> comprobantes = comprobantePagoRepository
                                .findByIdEmpresaAndEstado(idEmpresa, "Pendiente");

                return comprobantes.stream()
                                .map(this::mapCobroToDTO)
                                .collect(Collectors.toList());
        }

        private CuentaFinancieraDTO mapToDTO(FacturaSuscripcion f) {
                return CuentaFinancieraDTO.builder()
                                .idFactura(f.getIdFacturaSuscripcion())
                                .numeroFactura(f.getNumeroFactura())
                                .nombreProveedor("TapStyle Suscripciones")
                                .monto(f.getMontoSuscripcion())
                                .fechaVencimiento(f.getFechaVencimiento())
                                .estado(f.getEstado())
                                .tipo("SUSCRIPCION")
                                .build();
        }

        private CuentaFinancieraDTO mapCobroToDTO(com.lp2.tapstyle.model.ComprobantePago c) {
                String nombreCliente = "Cliente Desconocido";
                if (c.getIdCliente() != null) {
                        nombreCliente = clienteRepository.findById(c.getIdCliente())
                                        .map(cliente -> cliente.getNombre() + " " + cliente.getApellido())
                                        .orElse("Cliente No Encontrado");
                }

                return CuentaFinancieraDTO.builder()
                                .idFactura(c.getIdComprobante())
                                .numeroFactura(c.getNumeroComprobante())
                                .nombreCliente(nombreCliente)
                                .monto(c.getTotal())
                                .fechaVencimiento(c.getFechaEmision().toLocalDate().plusDays(30))
                                .estado(c.getEstado())
                                .tipo("VENTA")
                                .build();
        }
}
