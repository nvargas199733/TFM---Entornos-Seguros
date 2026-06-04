package com.entornosseguros.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa los estados de los incidentes
 */
@Entity
@Table(name = "statuses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Status {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}
