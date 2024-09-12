package com.abhirambsn.profileapi.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KnowledgeBase {
    private String id;
    private String name;
    private String slug;
    private List<String> files;
    private String createdBy;
    private boolean isPrivate;
}
