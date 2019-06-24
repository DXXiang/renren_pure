package io.sdses.modules.wechat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/wechat/page")
public class WeChatWebPageCpntroller {
    @RequestMapping("{url}.html")
    public String module(@PathVariable("url") String url){
        return "/modules/wechat/" + url;
    }

}
