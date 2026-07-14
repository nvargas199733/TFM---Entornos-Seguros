package co.entornosseguros.incident.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.incident.domain.IncidentStatusHistoryEntity;

public interface IncidentStatusHistoryRepository extends JpaRepository<IncidentStatusHistoryEntity, Long> {

    List<IncidentStatusHistoryEntity> findByIncidenteIdOrderByFechaCambioDesc(Long incidentId);
}
