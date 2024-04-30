package com.jozwiaka.restapiservice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Data
@Table(name = "novel_tag")
public class NovelTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "novel_id")
    private Integer novelId;

    @Column(name = "tag_id")
    private Integer tagId;

    @ManyToOne
    @JoinColumn(name = "novel_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Novel novel;

    @ManyToOne
    @JoinColumn(name = "tag_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Tag tag;
}
