package com.abhirambsn.profileapi.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
@ConfigurationProperties(prefix = "token.converter")
@Getter
@Setter
public class TokenConverterConfig {
    private String resourceId;
    private String principalAttribute;

    public Optional<String> getPrincipalAttribute() {
        return Optional.ofNullable(principalAttribute);
    }

}
