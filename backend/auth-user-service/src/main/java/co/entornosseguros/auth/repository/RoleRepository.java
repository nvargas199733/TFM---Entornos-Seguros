package co.entornosseguros.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.auth.domain.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {

    Optional<RoleEntity> findByNombreIgnoreCase(String nombre);
}
