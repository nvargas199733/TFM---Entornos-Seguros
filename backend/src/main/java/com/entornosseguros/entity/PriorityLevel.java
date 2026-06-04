package com.entornosseguros.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa los niveles de prioridad de los incidentes
 */
@Entity
@Table(name = "priority_levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriorityLevel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer level = 0;
}
