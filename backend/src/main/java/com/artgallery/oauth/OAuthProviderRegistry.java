package com.artgallery.oauth;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * OAuth Provider Registry
 * Manages all OAuth provider implementations
 * 
 * Factory/Registry Pattern: Automatically registers all OAuthProvider beans
 * and provides lookup by provider name
 * 
 * @author Art Gallery Team
 */
@Component
public class OAuthProviderRegistry {

    private final Map<String, OAuthProvider> providers;

    /**
     * Constructor - auto-injects all OAuthProvider implementations
     * 
     * @param providerCollection Collection of all OAuthProvider beans
     */
    public OAuthProviderRegistry(Collection<OAuthProvider> providerCollection) {
        this.providers = providerCollection.stream()
            .collect(Collectors.toMap(
                OAuthProvider::getProviderName,
                Function.identity()
            ));
    }

    /**
     * Get OAuth provider by name
     * 
     * @param providerName Provider name (e.g., "github", "google")
     * @return OAuth provider implementation
     * @throws OAuthException if provider not found
     */
    public OAuthProvider getProvider(String providerName) throws OAuthException {
        OAuthProvider provider = providers.get(providerName.toLowerCase());
        if (provider == null) {
            throw new OAuthException("PROVIDER_NOT_FOUND", 
                "Unsupported OAuth provider: " + providerName);
        }
        return provider;
    }

    /**
     * Check if provider is supported
     * 
     * @param providerName Provider name
     * @return true if supported, false otherwise
     */
    public boolean isProviderSupported(String providerName) {
        return providers.containsKey(providerName.toLowerCase());
    }

    /**
     * Get all registered provider names
     * 
     * @return Collection of provider names
     */
    public Collection<String> getSupportedProviders() {
        return providers.keySet();
    }
}
