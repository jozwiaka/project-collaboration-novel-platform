package com.jozwiaka.restapiservice.respository;

import com.jozwiaka.restapiservice.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface TagRepository extends JpaRepository<Tag, Integer> {
    Tag[] findByUserId(Integer userId);

    Tag[] findByUserIdAndNovelTags_Novel_Id(Integer userId, Integer novelId);
}
