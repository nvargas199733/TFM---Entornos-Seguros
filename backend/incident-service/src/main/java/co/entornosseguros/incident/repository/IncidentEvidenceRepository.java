package co.entornosseguros.incident.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.incident.domain.IncidentEvidenceEntity;

public interface IncidentEvidenceRepository extends JpaRepository<IncidentEvidenceEntity, Long> {

    List<IncidentEvidenceEntity> findByIncidenteIdOrderByFechaCargaDesc(Long incidentId);
}
