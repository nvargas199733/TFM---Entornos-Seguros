package co.entornosseguros.policereport.domain;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "reporte_policial", schema = "police_report")
public class PoliceReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte_policial")
    private Long id;

    @Column(name = "id_incidente", nullable = false)
    private Long idIncidente;

    @Column(name = "id_usuario_policia", nullable = false)
    private Long idUsuarioPolicia;

    @Column(name = "hubo_heridos", nullable = false)
    private Boolean huboHeridos;

    @Column(name = "descripcion_atencion", nullable = false, columnDefinition = "TEXT")
    private String descripcionAtencion;

    @Column(name = "fecha_atencion", nullable = false, updatable = false)
    private OffsetDateTime fechaAtencion;

    @Column(name = "fecha_reporte", nullable = false, updatable = false)
    private OffsetDateTime fechaReporte;

    @Column(name = "fecha_actualizacion", nullable = false)
    private OffsetDateTime fechaActualizacion;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (fechaAtencion == null) {
            fechaAtencion = now;
        }
        if (fechaReporte == null) {
            fechaReporte = now;
        }
        if (fechaActualizacion == null) {
            fechaActualizacion = now;
        }
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        OffsetDateTime now = OffsetDateTime.now();
        fechaActualizacion = now;
        updatedAt = now;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdIncidente() {
        return idIncidente;
    }

    public void setIdIncidente(Long idIncidente) {
        this.idIncidente = idIncidente;
    }

    public Long getIdUsuarioPolicia() {
        return idUsuarioPolicia;
    }

    public void setIdUsuarioPolicia(Long idUsuarioPolicia) {
        this.idUsuarioPolicia = idUsuarioPolicia;
    }

    public Boolean getHuboHeridos() {
        return huboHeridos;
    }

    public void setHuboHeridos(Boolean huboHeridos) {
        this.huboHeridos = huboHeridos;
    }

    public String getDescripcionAtencion() {
        return descripcionAtencion;
    }

    public void setDescripcionAtencion(String descripcionAtencion) {
        this.descripcionAtencion = descripcionAtencion;
    }

    public OffsetDateTime getFechaAtencion() {
        return fechaAtencion;
    }

    public void setFechaAtencion(OffsetDateTime fechaAtencion) {
        this.fechaAtencion = fechaAtencion;
    }

    public OffsetDateTime getFechaReporte() {
        return fechaReporte;
    }

    public void setFechaReporte(OffsetDateTime fechaReporte) {
        this.fechaReporte = fechaReporte;
    }

    public OffsetDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}