package com.abhirambsn.profileapi.util;


import com.abhirambsn.profileapi.config.TokenConverterConfig;
import lombok.NonNull;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class KeycloakJwtConverter implements Converter<Jwt, JwtAuthenticationToken> {

    private static final String RESOURCE_ACCESS = "resource_access";
    private static final String ROLES = "roles";
    private static final String ROLE_PREFIX = "ROLE_";
    private final JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter;
    private final TokenConverterConfig properties;

    public KeycloakJwtConverter(
            JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter,
            TokenConverterConfig properties
    ) {
        this.jwtGrantedAuthoritiesConverter = jwtGrantedAuthoritiesConverter;
        this.properties = properties;
    }

    @Override
    public JwtAuthenticationToken convert(@NonNull Jwt jwt) {
        Stream<SimpleGrantedAuthority> access = Optional.of(jwt)
                .map(token -> token.getClaimAsMap(RESOURCE_ACCESS))
                .map(claimMap -> (Map<String, Object>) claimMap.get(properties.getResourceId()))
                .map(resourceData -> (Collection<String>) resourceData.get(ROLES))
                .stream()
                .map(role -> new SimpleGrantedAuthority(ROLE_PREFIX + role))
                .distinct();

        Set<GrantedAuthority> authorities = Stream
                .concat(jwtGrantedAuthoritiesConverter.convert(jwt).stream(), access)
                .collect(Collectors.toSet());

        String principalClaimName = properties.getPrincipalAttribute()
                .map(jwt::getClaimAsString)
                .orElse(jwt.getClaimAsString(JwtClaimNames.SUB));

        return new JwtAuthenticationToken(jwt, authorities, principalClaimName);
    }
}
