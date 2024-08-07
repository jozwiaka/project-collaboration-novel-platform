package com.jozwiaka.restapiservice.repository;

import com.jozwiaka.restapiservice.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;



@CrossOrigin("http://localhost:4200")
public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByNovelId(Long novelId, Pageable pageable);
}
