package com.jozwiaka.restapiservice.controller;

import com.jozwiaka.restapiservice.repository.NovelRepository;
import com.jozwiaka.restapiservice.repository.TagRepository;
import com.jozwiaka.restapiservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/novels")
@CrossOrigin("http://localhost:4200")
public class NovelController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private NovelRepository novelRepository;

}
