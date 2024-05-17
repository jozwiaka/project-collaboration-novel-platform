package com.jozwiaka.restapiservice.controller;


import com.jozwiaka.restapiservice.repository.NovelRepository;
import com.jozwiaka.restapiservice.repository.TagRepository;
import com.jozwiaka.restapiservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tags")
public class TagController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private NovelRepository novelRepository;

//    @GetMapping("/novels/{novelId}/tags")
//    public ResponseEntity<Page<Tag>> getAllTagsByNovelId(
//            @PathVariable(value = "novelId") Integer novelId,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size) {
//
//        if (!novelRepository.existsById(novelId)) {
//            throw new ResourceNotFoundException("Not found Novel with id = " + novelId);
//        }
//
//        Pageable pageable = PageRequest.of(page, size);
//        Page<Tag> tags = tagRepository.findTagsByNovelsId(novelId, pageable);
//        return new ResponseEntity<>(tags, HttpStatus.OK);
//    }

//    @GetMapping("/tags/{id}")
//    public ResponseEntity<Tag> getTagsById(@PathVariable(value = "id") Integer id) {
//        Tag tag = tagRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Not found Tag with id = " + id));
//
//        return new ResponseEntity<>(tag, HttpStatus.OK);
//    }
//
//    @GetMapping("/tags/{tagId}/novels")
//    public ResponseEntity<List<Novel>> getAllNovelsByTagId(@PathVariable(value = "tagId") Integer tagId) {
//        if (!tagRepository.existsById(tagId)) {
//            throw new ResourceNotFoundException("Not found Tag  with id = " + tagId);
//        }
//
//        List<Novel> novels = novelRepository.findNovelsByTagsId(tagId);
//        return new ResponseEntity<>(novels, HttpStatus.OK);
//    }
//
//    @PostMapping("/novels/{novelId}/tags")
//    public ResponseEntity<Tag> addTag(@PathVariable(value = "novelId") Integer novelId, @RequestBody Tag tagRequest) {
//        Tag tag = novelRepository.findById(novelId).map(novel -> {
//            int tagId = tagRequest.getId();
//
//            // tag is existed
//            if (tagId != 0L) {
//                Tag _tag = tagRepository.findById(tagId)
//                        .orElseThrow(() -> new ResourceNotFoundException("Not found Tag with id = " + tagId));
//                novel.addTag(_tag);
//                novelRepository.save(novel);
//                return _tag;
//            }
//
//            // add and create new Tag
//            novel.addTag(tagRequest);
//            return tagRepository.save(tagRequest);
//        }).orElseThrow(() -> new ResourceNotFoundException("Not found Novel with id = " + novelId));
//
//        return new ResponseEntity<>(tag, HttpStatus.CREATED);
//    }

//    @PutMapping("/tags/{id}")
//    public ResponseEntity<Tag> updateTag(@PathVariable("id") int id, @RequestBody Tag tagRequest) {
//        Tag tag = tagRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("TagId " + id + "not found"));
//
//        tag.setName(tagRequest.getName());
//
//        return new ResponseEntity<>(tagRepository.save(tag), HttpStatus.OK);
//    }
//
//    @DeleteMapping("/novels/{novelId}/tags/{tagId}")
//    public ResponseEntity<HttpStatus> deleteTagFromNovel(@PathVariable(value = "novelId") Integer novelId, @PathVariable(value = "tagId") Integer tagId) {
//        Novel novel = novelRepository.findById(novelId)
//                .orElseThrow(() -> new ResourceNotFoundException("Not found Novel with id = " + novelId));
//
//        novel.removeTag(tagId);
//        novelRepository.save(novel);
//
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }
//
//    @DeleteMapping("/tags/{id}")
//    public ResponseEntity<HttpStatus> deleteTag(@PathVariable("id") int id) {
//        tagRepository.deleteById(id);
//
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }


}
