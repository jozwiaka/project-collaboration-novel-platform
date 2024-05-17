package com.jozwiaka.restapiservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "tag")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "user_id")
    private Integer userId;

    @ManyToMany(fetch=FetchType.LAZY, cascade = {CascadeType.ALL}, mappedBy = "tags")
    @JsonIgnore
    private List<Novel> novels;
}
