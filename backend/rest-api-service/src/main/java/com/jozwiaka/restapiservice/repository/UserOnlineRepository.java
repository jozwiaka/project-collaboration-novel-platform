package com.jozwiaka.restapiservice.repositories;

import com.jozwiaka.restapiservice.models.UserOnline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@CrossOrigin("http://localhost:4200")
public interface UserOnlineRepository extends JpaRepository<UserOnline, Integer> {
    
    UserOnline findByNovelIdAndUserId(Integer novelId, Integer userId);

    Page<UserOnline> findByNovelId(Integer novelId, Pageable pageable);
}
