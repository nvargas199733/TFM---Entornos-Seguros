package co.entornosseguros.policereport.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.policereport.domain.PoliceReportEntity;

public interface PoliceReportRepository extends JpaRepository<PoliceReportEntity, Long> {

    List<PoliceReportEntity> findByIdIncidenteOrderByFechaReporteDesc(Long idIncidente);
}