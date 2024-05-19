package com.jozwiaka.restapiservice.service;

import com.jozwiaka.restapiservice.model.Tag;
import com.jozwiaka.restapiservice.repository.TagRepository;
import com.jozwiaka.restapiservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Optional<Tag> createTag(Long userId, Tag tagRequest) {
        return userRepository.findById(userId).map(user -> {
            tagRequest.setUser(user);
            return tagRepository.save(tagRequest);
        });
    }

//    @Transactional
//    public boolean deleteTag(Long tagId) {
//        if (tagRepository.existsById(tagId)) {
//            tagRepository.deleteById(tagId);
//            return true;
//        } else {
//            return false;
//        }
//    }
}
