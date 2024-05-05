package com.jozwiaka.restapiservice.service;
// NovelService.java

import com.jozwiaka.restapiservice.model.Tag;
import com.jozwiaka.restapiservice.model.Novel;
import com.jozwiaka.restapiservice.model.NovelTag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NovelService {

    @Autowired
    private com.jozwiaka.restapiservice.repository.NovelRepository novelRepository;

    @Autowired
    private com.jozwiaka.restapiservice.repository.TagRepository tagRepository;

    @Autowired
    private com.jozwiaka.restapiservice.repository.NovelTagRepository novelTagRepository;

    public Tag addTagToNovel(Integer novelId, Tag tag) {
        Novel novel = novelRepository.findById(novelId).orElse(null);
        if (novel == null) {
            // Handle error
        }
        // Check if tag already exists
        Tag existingTag = tagRepository.findByName(tag.getName());
        if (existingTag == null) {
            existingTag = tagRepository.save(tag);
        }
        // Create NovelTag instance
        NovelTag novelTag = new NovelTag();
        novelTag.setNovel(novel);
        novelTag.setTag(existingTag);
        novelTagRepository.save(novelTag);
        return existingTag;
    }
}
