package io.sdses.modules.wechat.controller;

import io.sdses.modules.wechat.entity.AccessToken;
import io.sdses.modules.wechat.entity.JsSDK;
import io.sdses.modules.wechat.entity.JsapiTicket;
import io.sdses.modules.wechat.service.WeChatAPIService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * 测试微信通信
 */
@CrossOrigin
@RestController
@RequestMapping("/wechat/dev")
public class WechatAPIController {
    @Autowired
    private WeChatAPIService weChatAPIService = null;
    @Autowired
    private JsSDK jsSDK = null;

    @RequestMapping("/upLoad")
    @ResponseBody
    public Map<String,Object> upLoad(){
        Map<String,Object> result = new HashMap<>();
        result.put("key1", "value1");
        result.put("key2", "value2");
        return result;
    }

    @RequestMapping("/getJson")
    public Map<String,Object> getAccessToken(){
        Map<String,Object> result = new HashMap<>();
        result.put("key1", "value1");
        result.put("key2", "value2");
        result.put("code", "1");
        result.put("code1", "2");
        return result;
    }

    @RequestMapping("/getJsSDK")
    public JsSDK getJsSDK(){
        return jsSDK;
    }

    @RequestMapping("/getAccessToken")
    public Map<String,Object> getAccessToken(
            @CookieValue(
                    name = "AccessToken" ,
                    defaultValue = ""
            ) String cookieTokenStr, HttpServletResponse response){
        Map<String,Object> result = new HashMap<>();
        AccessToken accessToken = null;
        if (!"" .equals(cookieTokenStr)){ // 如果取到了cookieToken
            JSONObject jsonObject = JSONObject.fromObject(cookieTokenStr);
            AccessToken cookie_token = (AccessToken) JSONObject.toBean(jsonObject, AccessToken.class);
            if (cookie_token.getExpires_time() > System.currentTimeMillis()/1000){ //而且没过期
                result.put("AccessToken", cookie_token); //返回缓存的
                return result;
            }
        }
        //没取到或者过期就取新的
        accessToken = weChatAPIService.getAccessToken();
        result.put("AccessToken", accessToken);
        JSONObject tokenObject = JSONObject.fromObject(accessToken);
        Cookie cookie = new Cookie("AccessToken", tokenObject.toString());//将新AccessToken的加入缓存
        response.addCookie(cookie);
        return result;
    }

    @RequestMapping("/getJsapiTicket")
    public Map<String,Object> getJsapiTicket(
            @CookieValue(
                    name = "JsapiTicket" ,
                    defaultValue = ""
            ) String cookieTicketStr, HttpServletResponse response
    ) throws UnsupportedEncodingException {
        Map<String,Object> result = new HashMap<>();
        JsapiTicket jsapiTicket = null;
        if ( !"" .equals(cookieTicketStr) ) { // 如果取到了cookieTicket
            JSONObject ticketjsonObject = JSONObject.fromObject(cookieTicketStr);
            jsapiTicket = (JsapiTicket) JSONObject.toBean(ticketjsonObject, JsapiTicket.class);
            if (jsapiTicket.getExpires_time() > System.currentTimeMillis()/1000) { //而且没过期
                result.put("jsapiTicket", jsapiTicket);//就返回
                return result;
            }
        }
        //重新获取AccessToken
        AccessToken newAccessToken = weChatAPIService.getAccessToken();//取新的AccessToken
        //然后根据AccessToken获取jsapiTicket,保存到Cookie
        jsapiTicket = weChatAPIService.getJsapiTicket(newAccessToken);
        JSONObject tokenJsonObject = JSONObject.fromObject(newAccessToken);
        JSONObject ticketJsonObject = JSONObject.fromObject(jsapiTicket);
        Cookie cookieToken = new Cookie("AccessToken", URLEncoder.encode(tokenJsonObject.toString(),
                "utf-8"));//使用json字符串存储
        Cookie cookieTicket = new Cookie("JsapiTicket",URLEncoder.encode(ticketJsonObject.toString(),
                "utf-8"));
        response.addCookie(cookieToken);
        response.addCookie(cookieTicket);
        result.put("jsapiTicket", jsapiTicket);
        return result;
    }

    @RequestMapping("/getSignature")
    public Map<String,Object> getSignature(
            @CookieValue(
                    name = "JsapiTicket" ,
                    defaultValue = ""
            ) String cookieTicketStr, HttpServletResponse response
    ) {
        Map<String,Object> result = new HashMap<>();

        return result;
    }
}
