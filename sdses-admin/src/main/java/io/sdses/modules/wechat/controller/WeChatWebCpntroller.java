package io.sdses.modules.wechat.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/wechat/page")
public class WeChatWebCpntroller {
    @RequestMapping("/modules/{module}/{url}.html")
    public String module(@PathVariable("module") String module, @PathVariable("url") String url){
        return "modules/" + module + "/" + url;
    }
}
