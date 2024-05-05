package com.jozwiaka.restapiservice.controller;

import com.jozwiaka.restapiservice.model.Tag;
import com.jozwiaka.restapiservice.service.NovelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class NovelController {

    @Autowired
    private NovelService novelService;

    @PostMapping("/novels/{novelId}/tags")
    public ResponseEntity<Tag> addTagToNovel(@PathVariable Integer novelId, @RequestBody Tag tag) {
        Tag addedTag = novelService.addTagToNovel(novelId, tag);
        return new ResponseEntity<>(addedTag, HttpStatus.CREATED);
    }
}
