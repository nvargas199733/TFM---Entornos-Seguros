package co.entornosseguros.policereport.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.entornosseguros.policereport.domain.PoliceReportEntity;
import co.entornosseguros.policereport.repository.PoliceReportRepository;
import co.entornosseguros.policereport.web.dto.CreatePoliceReportRequest;
import co.entornosseguros.policereport.web.dto.PoliceReportResponse;

@Service
public class PoliceReportService {

    private final PoliceReportRepository policeReportRepository;

    public PoliceReportService(PoliceReportRepository policeReportRepository) {
        this.policeReportRepository = policeReportRepository;
    }

    @Transactional
    public PoliceReportResponse create(CreatePoliceReportRequest request) {
        PoliceReportEntity report = new PoliceReportEntity();
        report.setIdIncidente(request.idIncidente());
        report.setIdUsuarioPolicia(request.idUsuarioPolicia());
        report.setHuboHeridos(request.huboHeridos());
        report.setDescripcionAtencion(request.descripcionAtencion().trim());

        PoliceReportEntity saved = policeReportRepository.save(report);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PoliceReportResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public List<PoliceReportResponse> getByIncident(Long idIncidente) {
        return policeReportRepository.findByIdIncidenteOrderByFechaReporteDesc(idIncidente).stream()
            .sorted(Comparator.comparing(PoliceReportEntity::getFechaReporte).reversed())
            .map(this::toResponse)
            .toList();
    }

    private PoliceReportEntity findById(Long id) {
        return policeReportRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Reporte policial no encontrado"));
    }

    private PoliceReportResponse toResponse(PoliceReportEntity entity) {
        return new PoliceReportResponse(
            entity.getId(),
            entity.getIdIncidente(),
            entity.getIdUsuarioPolicia(),
            entity.getHuboHeridos(),
            entity.getDescripcionAtencion(),
            entity.getFechaReporte(),
            entity.getFechaActualizacion()
        );
    }
}