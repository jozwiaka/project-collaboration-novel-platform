package com.jozwiaka.restapiservice.controller;


import com.jozwiaka.restapiservice.model.Tag;
import com.jozwiaka.restapiservice.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:4200")
public class TagController {

    @Autowired
    TagService tagService;

    @PostMapping("/users/{userId}/tags")
    public ResponseEntity<Tag> createTag(@PathVariable Long userId, @RequestBody Tag tagRequest) {
        return tagService.createTag(userId, tagRequest)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{userId}/tags/{tagId}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long tagId) {
        if (tagService.deleteTag(tagId)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
