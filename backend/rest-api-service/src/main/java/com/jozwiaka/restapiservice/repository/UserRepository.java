package com.jozwiaka.restapiservice.respository;

import com.jozwiaka.restapiservice.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin("http://localhost:4200")
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);

    Page<User> findByCollaborators_Novel_Id(Long novelId, Pageable pageable);
}
