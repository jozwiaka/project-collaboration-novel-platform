package com.jozwiaka.restapiservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "novel_tag")
@NoArgsConstructor
public class NovelTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "novel_id")
    private Long novelId;

    @Column(name = "tag_id")
    private Long tagId;
    public NovelTag(Long novelId, Long tagId){
        this.novelId = novelId;
        this.tagId = tagId;
    }
}
