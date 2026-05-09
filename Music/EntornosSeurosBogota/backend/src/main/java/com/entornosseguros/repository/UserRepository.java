package com.entornosseguros.repository;

import com.entornosseguros.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio de Usuarios
 * Proporciona métodos CRUD y búsquedas personalizadas
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndIsActiveTrue(String email);
    
    Page<User> findAllByIsActiveTrue(Pageable pageable);
    
    Page<User> findAllByRoleId(Long roleId, Pageable pageable);
    
    boolean existsByEmail(String email);
    
    long countByIsActiveTrue();
}
