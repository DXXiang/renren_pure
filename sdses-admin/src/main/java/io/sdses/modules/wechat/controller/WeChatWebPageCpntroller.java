package io.sdses.modules.wechat.controller;

import me.chanjar.weixin.mp.api.WxMpService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Key;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/wechat/page")
public class WeChatWebPageCpntroller{
    @RequestMapping("{url}.html")
    public String module(@PathVariable("url") String url) {
        return "modules/wechat/" + url;
    }

}
