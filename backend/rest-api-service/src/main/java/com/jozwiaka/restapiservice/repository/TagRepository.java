package com.jozwiaka.restapiservice.repository;

import com.jozwiaka.restapiservice.model.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface TagRepository extends JpaRepository<Tag, Integer> {

    Tag findByName(String name);
    Page<Tag> findByUserId(Integer userId, Pageable pageable);

    Page<Tag> findByUserIdAndNovelTags_Novel_Id(Integer userId, Integer novelId, Pageable pageable);
}
