package co.entornosseguros.incident.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.incident.domain.IncidentStatusEntity;

public interface IncidentStatusRepository extends JpaRepository<IncidentStatusEntity, Long> {

    Optional<IncidentStatusEntity> findByNombreIgnoreCase(String nombre);
}
