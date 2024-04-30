package com.jozwiaka.restapiservice.respository;

import com.jozwiaka.restapiservice.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@CrossOrigin("http://localhost:4200")
public interface TagRepository extends JpaRepository<Tag, Integer> {
    Page<Tag> findByUserId(Integer userId, Pageable pageable);
}
