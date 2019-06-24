package io.sdses.modules.wechat.controller;

import me.chanjar.weixin.mp.api.WxMpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/wechat/page")
public class WeChatWebPageCpntroller {
    @RequestMapping("{url}.html")
    public String module(@PathVariable("url") String url) {
        return "/modules/wechat/" + url;
    }
}
