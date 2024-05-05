package com.jozwiaka.restapiservice.repository;

import com.jozwiaka.restapiservice.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface TokenRepository extends JpaRepository<Token, Integer> {
}
