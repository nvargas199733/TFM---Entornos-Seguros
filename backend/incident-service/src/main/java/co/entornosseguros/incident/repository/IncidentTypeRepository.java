package co.entornosseguros.incident.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.incident.domain.IncidentTypeEntity;

public interface IncidentTypeRepository extends JpaRepository<IncidentTypeEntity, Long> {

    Optional<IncidentTypeEntity> findByNombreIgnoreCase(String nombre);
}
