package com.artgallery.oauth;

/**
 * OAuth 提供者接口
 * 定义第三方登录提供商的标准 OAuth 功能
 * 
 * 策略模式：每个 OAuth 提供者都实现此接口
 * 
 * @author Art Gallery Team
 */
public interface OAuthProvider {

    /**
     * 使用授权码交换访问令牌
     * 
     * @param code 来自 OAuth 提供商的授权码
     * @return 访问令牌字符串
     * @throws OAuthException 如果令牌交换失败
     */
    String exchangeCodeForToken(String code) throws OAuthException;

    /**
     * 使用访问令牌获取用户信息
     * 
     * @param accessToken 来自 OAuth 提供商的访问令牌
     * @return OAuth 用户信息
     * @throws OAuthException 如果获取用户信息失败
     */
    OAuthUserInfo getUserInfo(String accessToken) throws OAuthException;

    /**
     * 获取提供商名称（例如："github"、"google"、"wechat"）
     * 
     * @return 提供商名称
     */
    String getProviderName();
}
