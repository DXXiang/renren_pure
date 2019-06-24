package io.sdses.modules.wechat.service;

import io.sdses.modules.wechat.entity.AccessToken;
import io.sdses.modules.wechat.entity.JsapiTicket;

public interface WeChatAPIService {
    AccessToken getAccessToken();
    JsapiTicket getJsapiTicket(AccessToken accessToken);
}
