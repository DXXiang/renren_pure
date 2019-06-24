package io.sdses.modules.wechat.service.impl;

import com.google.gson.JsonObject;
import io.sdses.modules.wechat.entity.AccessToken;
import io.sdses.modules.wechat.entity.JsSDK;
import io.sdses.modules.wechat.entity.JsapiTicket;
import io.sdses.modules.wechat.service.WeChatAPIService;
import io.sdses.modules.wechat.utils.HttpUtils;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WeChatAPIServiceImpl implements WeChatAPIService {
    @Value("${spring.wechat.access_token_url_model}")
    private String access_token_url_model;
    @Value("${spring.wechat.jsapi_ticket_url_model}")
    private String jsapi_ticket_url_model;

    @Autowired
    private JsSDK jsSDK;


    /**
     * 获取最新的AccessToken
     * @return
     */
    @Override
    public AccessToken getAccessToken() {
        AccessToken accessToken = null;
        String access_token_url = access_token_url_model.replace("APPID", jsSDK.getAppId())
                .replace("APPSECRET", jsSDK.getAppSecret());
        JSONObject jsonObject = HttpUtils.doGetstr(access_token_url);
        if(null!=jsonObject){
            accessToken = (AccessToken) JSONObject.toBean(jsonObject, AccessToken.class);
            accessToken.setExpires_time(System.currentTimeMillis()+7200);
        }
        return accessToken;
    }

    /**
     * 根据AccessToken获取JsapiTicket
     * @param accessToken
     * @return
     */
    @Override
    public JsapiTicket getJsapiTicket(AccessToken accessToken) {
        JsapiTicket jsapiTicket = null;
        String jsapi_ticket_url = jsapi_ticket_url_model.replace("ACCESS_TOKEN"
                , accessToken.getAccess_token());
        JSONObject jsonObject = HttpUtils.doGetstr(jsapi_ticket_url);
        if(null!=jsonObject){
            jsapiTicket = (JsapiTicket) JSONObject.toBean(jsonObject, JsapiTicket.class);
            jsapiTicket.setExpires_time(System.currentTimeMillis());
//            jsapiTicket.setErrcode(jsonObject.getInt("errcode"));
//            jsapiTicket.setErrmsg(jsonObject.getString("errmsg"));
//            jsapiTicket.setTicket(jsonObject.getString("ticket"));
//            jsapiTicket.setExpires_in(jsonObject.getInt("expires_in"));
        }
        return jsapiTicket;
    }
}
