package com.jozwiaka.restapiservice.repository;

import com.jozwiaka.restapiservice.model.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;

@CrossOrigin("http://localhost:4200")
public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByName(String name);
    Page<Tag> findByUserId(Long userId, Pageable pageable);

    Page<Tag> findTagsByNovelsId(Long novelId, Pageable pageable);

    Page<Tag> findByUserIdAndNovelsId(Long userId, Long novelId, Pageable pageable);
}
