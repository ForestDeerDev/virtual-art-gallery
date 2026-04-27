package com.artgallery.oauth;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * OAuth 提供者注册表
 * 管理所有 OAuth 提供者实现
 * 
 * 工厂/注册表模式：自动注册所有 OAuthProvider bean
 * 并通过提供者名称进行查找
 * 
 * @author Art Gallery Team
 */
@Component
public class OAuthProviderRegistry {

    private final Map<String, OAuthProvider> providers;

    /**
     * 构造函数 - 自动注入所有 OAuthProvider 实现
     * 
     * @param providerCollection 所有 OAuthProvider bean 的集合
     */
    // https://chatgpt.com/c/69ec8bac-b650-83ea-9689-c3ed1906a629
    public OAuthProviderRegistry(Collection<OAuthProvider> providerCollection) {
        this.providers = providerCollection.stream()
            .collect(Collectors.toMap(
                OAuthProvider::getProviderName,
                Function.identity()
            ));
    }

    /**
     * 根据名称获取 OAuth 提供者
     * 
     * @param providerName 提供者名称（例如 "github", "google"）
     * @return OAuth 提供者实现
     * @throws OAuthException 如果未找到提供者
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
     * 检查提供者是否受支持
     * 
     * @param providerName 提供者名称
     * @return 如果支持返回 true，否则返回 false
     */
    public boolean isProviderSupported(String providerName) {
        return providers.containsKey(providerName.toLowerCase());
    }

    /**
     * 获取所有已注册的提供者名称
     * 
     * @return 提供者名称集合
     */
    public Collection<String> getSupportedProviders() {
        return providers.keySet();
    }
}
