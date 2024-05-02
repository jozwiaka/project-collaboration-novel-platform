package com.jozwiaka.restapiservice.model;

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

    @ManyToMany(mappedBy = "tag")
    private List<NovelTag> novelTags;

}
