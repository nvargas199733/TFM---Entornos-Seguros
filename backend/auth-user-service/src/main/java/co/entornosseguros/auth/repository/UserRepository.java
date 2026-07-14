package co.entornosseguros.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.auth.domain.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByCedula(String cedula);

    Optional<UserEntity> findByCorreoIgnoreCase(String correo);
}
