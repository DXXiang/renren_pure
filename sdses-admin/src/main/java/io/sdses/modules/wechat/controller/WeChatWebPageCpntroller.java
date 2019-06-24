package io.sdses.modules.wechat.controller;

import me.chanjar.weixin.mp.api.WxMpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/wechat/page")
<<<<<<< HEAD:sdses-admin/src/main/java/io/sdses/modules/wechat/controller/WeChatWebPageCpntroller.java
public class WeChatWebPageCpntroller {
    @RequestMapping("{url}.html")
    public String module(@PathVariable("url") String url){
        return "/modules/wechat/" + url;
=======
public class WeChatWebCpntroller {
    @RequestMapping("/modules/{module}/{url}.html")
    public String module(@PathVariable("module") String module, @PathVariable("url") String url){
        System.out.println("modules/" + module + "/" + url);
        return "modules/" + module + "/" + url;
>>>>>>> 8c9c1c96fffa777346f8a0b9ede37489d72ab557:sdses-admin/src/main/java/io/sdses/modules/wechat/controller/WeChatWebCpntroller.java
    }

}
