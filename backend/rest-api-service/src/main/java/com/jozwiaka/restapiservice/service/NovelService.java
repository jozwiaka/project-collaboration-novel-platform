package com.jozwiaka.restapiservice.service;

import com.jozwiaka.restapiservice.model.Novel;
import com.jozwiaka.restapiservice.model.NovelTag;
import com.jozwiaka.restapiservice.model.Tag;
import com.jozwiaka.restapiservice.repository.NovelRepository;
import com.jozwiaka.restapiservice.repository.NovelTagRepository;
import com.jozwiaka.restapiservice.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NovelService {
    @Autowired
    private NovelRepository novelRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private NovelTagRepository novelTagRepository;

    @Transactional
    public void assignTag(Integer novelId, Integer tagId) {
        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new ResourceNotFoundException("Novel not found with id " + novelId));
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

        novelTagRepository.save(new NovelTag(novelId, tagId));
    }

    @Transactional
    public void unassignTag(Integer novelId, Integer tagId) {
        NovelTag novelTag = this.novelTagRepository.findByNovelIdAndTagId(novelId, tagId)
                .orElseThrow(() -> new ResourceNotFoundException("NovelTag not found with novelId " + novelId + " and tagId " + tagId));

        novelTagRepository.delete(novelTag);
    }
}
