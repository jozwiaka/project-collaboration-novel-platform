package com.jozwiaka.restapiservice.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tag")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    @JsonBackReference
    private User user;

    @ManyToMany(fetch=FetchType.LAZY, cascade = {CascadeType.ALL}, mappedBy = "tags")
    @JsonIgnore
    @JsonManagedReference
    private Set<Novel> novels = new HashSet<>();
}
