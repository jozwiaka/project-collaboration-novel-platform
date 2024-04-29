package com.jozwiaka.restapiservice.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Data
@Table(name = "user_online")
public class UserOnline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "novel_id")
    private Integer novelId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @ManyToOne
    @JoinColumn(name = "novel_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Novel novel;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
