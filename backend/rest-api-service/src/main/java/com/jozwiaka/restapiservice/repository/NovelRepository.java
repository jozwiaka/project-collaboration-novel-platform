package com.jozwiaka.restapiservice.respository;

import com.jozwiaka.restapiservice.model.Novel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface NovelRepository extends JpaRepository<Novel, Integer> {
    Page<Novel> findByAuthorId(Integer authorId, Pageable pageable);

    Page<Novel> findByCollaborators_User_Id(Integer userId, Pageable pageable);

    @Query("SELECT n FROM Novel n JOIN n.collaborators c " +
            "WHERE n.authorId <> :userId AND c.user.id = :userId")
    Page<Novel> findSharedWithUserId(@Param("userId") Integer userId, Pageable pageable);

    Page<Novel> findByNovelTags_Tag_Id(Integer tagId, Pageable pageable);

//    TITLES

    Page<Novel> findByAuthorIdAndTitleContainingIgnoreCase(Integer authorId, String title, Pageable pageable);

    Page<Novel> findByCollaborators_User_IdAndTitleContainingIgnoreCase(Integer userId, String title, Pageable pageable);

    @Query("SELECT n FROM Novel n JOIN n.collaborators c " +
            "WHERE n.authorId <> :userId AND c.user.id = :userId AND lower(n.title) LIKE %:title%")
    Page<Novel> findSharedWithUserIdAndTitleContainingIgnoreCase(@Param("userId") Integer userId, @Param("title") String title, Pageable pageable);

    Page<Novel> findByNovelTags_Tag_IdAndTitleContainingIgnoreCase(Integer tagId, String title, Pageable pageable);
}
