package com.jozwiaka.restapiservice.controller;

import com.jozwiaka.restapiservice.service.NovelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/novels")
@CrossOrigin("http://localhost:4200")
public class NovelController {
    @Autowired
    private NovelService novelService;

    @GetMapping("/hello")
    public String hello() {
        System.out.println("Hello");
        return "Hello, world!";
    }

    @PostMapping("/{novelId}/tags/{tagId}")
    public void assignTagToNovel(@PathVariable Integer novelId, @PathVariable Integer tagId) {
        System.out.println("Assigning tag " + tagId + " to novel " + novelId);
        novelService.assignTagToNovel(novelId, tagId);
    }

}
