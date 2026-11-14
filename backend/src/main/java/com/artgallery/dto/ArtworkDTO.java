package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtworkDTO {

    private Long id;
    private String title;
    private String artist;
    private Long artistId;
    private String category;
    private String description;
    private String imageUrl;
    private Integer imageWidth;
    private Integer imageHeight;
    private String videoUrl;
    private List<String> tags;
    private String dimensions;
    private String material;
    private LocalDateTime artworkCreateTime;
    private Integer viewCount;
    private Integer likeCount;
    private Boolean featured;
    private Boolean enabled;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
