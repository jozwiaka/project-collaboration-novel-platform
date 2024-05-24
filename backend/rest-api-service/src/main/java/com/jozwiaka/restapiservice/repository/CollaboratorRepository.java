package com.jozwiaka.restapiservice.repository;

import com.jozwiaka.restapiservice.model.Collaborator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;

@CrossOrigin("http://localhost:4200")
public interface CollaboratorRepository extends JpaRepository<Collaborator, Long> {
    
    Optional<Collaborator> findByNovelIdAndUserId(Long novelId, Long userId);

    Page<Collaborator> findByNovelId(Long novelId, Pageable pageable);
}
