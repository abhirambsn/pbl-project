package com.abhirambsn.profileapi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Profile {
    @Id
    private String id;

    private String profileImageUrl;
    private List<String> knowledge_base_ids;
}
