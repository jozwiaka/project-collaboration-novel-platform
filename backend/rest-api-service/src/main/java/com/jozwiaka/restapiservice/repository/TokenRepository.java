package com.jozwiaka.restapiservice.repositories;

import com.jozwiaka.restapiservice.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface TokenRepository extends JpaRepository<Token, Integer> {
}
