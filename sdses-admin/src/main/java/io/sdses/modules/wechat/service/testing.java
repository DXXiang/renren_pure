package io.sdses.modules.wechat.service;
import io.sdses.modules.wechat.config.TemplateMessageMange;
public class testing {
    public static void main(String[] args) {
        //测试发送功能
        // TODO Auto-generated method stub
        TemplateMessageMange tests=new TemplateMessageMange();
        String a ="oY7my58dQ6P50qDVorOoWX4MjOhQ";
        tests.sendTemplateMessage(a,"abc");
        String []openId ={"oY7my55v3aAko38PBGNImZnyar7Q",a} ;
        tests.groupSend(openId,"请于7.10前进行认证");

    }
}
