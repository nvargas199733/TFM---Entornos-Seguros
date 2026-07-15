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

    @Column(name = "fecha_reporte", nullable = false)
    private OffsetDateTime fechaReporte;

    @Column(name = "fecha_actualizacion", nullable = false)
    private OffsetDateTime fechaActualizacion;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (fechaReporte == null) {
            fechaReporte = now;
        }
        fechaActualizacion = now;
    }

    @PreUpdate
    void onUpdate() {
        fechaActualizacion = OffsetDateTime.now();
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
}