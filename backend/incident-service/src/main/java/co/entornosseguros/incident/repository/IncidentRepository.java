package co.entornosseguros.incident.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.incident.domain.IncidentEntity;

public interface IncidentRepository extends JpaRepository<IncidentEntity, Long> {

    List<IncidentEntity> findByIdUsuarioOrderByFechaReporteDesc(Long idUsuario);
}
