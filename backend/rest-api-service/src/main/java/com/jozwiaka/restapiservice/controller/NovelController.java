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

    @PostMapping("/{novelId}/tags/{tagId}")
    public void assignTag(@PathVariable Integer novelId, @PathVariable Integer tagId) {
        System.out.println("Assigning tag " + tagId + " to novel " + novelId);
        novelService.assignTag(novelId, tagId);
    }

    @DeleteMapping("/{novelId}/tags/{tagId}")
    public void unassingTag(@PathVariable Integer novelId, @PathVariable Integer tagId) {
        System.out.println("Unassigning tag " + tagId + " from novel " + novelId);
        novelService.unassignTag(novelId, tagId);
    }

}
