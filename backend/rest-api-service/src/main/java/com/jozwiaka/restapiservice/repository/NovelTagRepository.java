package com.jozwiaka.restapiservice.repository;

import com.jozwiaka.restapiservice.model.NovelTag;
import org.springframework.data.jpa.repository.JpaRepository;

//@CrossOrigin("http://localhost:4200")
//@RepositoryRestResource(collectionResourceRel = "novelTags", path = "novel-tags")
public interface NovelTagRepository extends JpaRepository<NovelTag, Integer> {

//    NovelTag findByNovelIdAndTagId(Integer novelId, Integer tagId);
}
