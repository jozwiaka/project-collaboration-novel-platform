package com.jozwiaka.restapiservice.model;

import jakarta.persistence.*;
import lombok.Data;

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

    public NovelTag(){}

    public NovelTag(Integer novelId, Integer tagId){
        this.novelId = novelId;
        this.tagId = tagId;
    }
}
