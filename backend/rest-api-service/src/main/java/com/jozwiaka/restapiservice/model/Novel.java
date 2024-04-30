package com.jozwiaka.restapiservice.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Entity
@Data
@Table(name = "novel")
public class Novel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "author_id", nullable = false)
    private Integer authorId;

    @Column(nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @ManyToOne
    @JoinColumn(name = "author_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User author;

    @OneToMany(mappedBy = "novel")
    private List<Collaborator> collaborators;

    // @ManyToMany(mappedBy = "novel")
    // private List<NovelTag> novelTags;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
