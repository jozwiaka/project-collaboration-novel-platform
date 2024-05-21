package com.jozwiaka.restapiservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "tag")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToMany(fetch=FetchType.LAZY, cascade = {CascadeType.ALL}, mappedBy = "tags")
    @JsonIgnore
//    @JsonBackReference
    private Set<Novel> novels = new HashSet<>();
}
