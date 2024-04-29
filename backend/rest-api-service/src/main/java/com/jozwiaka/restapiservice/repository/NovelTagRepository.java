package com.jozwiaka.restapiservice.repositories;

import com.jozwiaka.restapiservice.models.NovelTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "novelTags", path = "novel-tags")
public interface NovelTagRepository extends JpaRepository<NovelTag, Integer> {
    
}
