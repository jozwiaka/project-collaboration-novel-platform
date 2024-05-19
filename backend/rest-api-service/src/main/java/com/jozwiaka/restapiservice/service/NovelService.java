package com.jozwiaka.restapiservice.service;

import com.jozwiaka.restapiservice.model.NovelTag;
import com.jozwiaka.restapiservice.repository.NovelRepository;
import com.jozwiaka.restapiservice.repository.NovelTagRepository;
import com.jozwiaka.restapiservice.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void assignTagToNovel(Integer novelId, Integer tagId) {
        NovelTag novelTag = new NovelTag();
        novelTag.setNovelId(novelId);
        novelTag.setTagId(tagId);

        novelTagRepository.save(novelTag);
    }
}
