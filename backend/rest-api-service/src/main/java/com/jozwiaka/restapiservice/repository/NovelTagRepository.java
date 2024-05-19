package com.jozwiaka.restapiservice.repository;

import com.jozwiaka.restapiservice.model.NovelTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "novelTags", path = "novel-tags")
public interface NovelTagRepository extends JpaRepository<NovelTag, Long> {
    Optional<NovelTag> findByNovelIdAndTagId(Long novelId, Long tagId);
}
