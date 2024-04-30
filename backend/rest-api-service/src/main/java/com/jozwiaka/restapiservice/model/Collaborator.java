package com.jozwiaka.restapiservice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Data
@Table(name = "collaborator")
public class Collaborator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "novel_id")
    private Integer novelId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "is_read_only")
    private boolean isReadOnly;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "novel_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Novel novel;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
