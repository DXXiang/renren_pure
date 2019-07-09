package io.sdses.modules.wechat.service;
import io.sdses.modules.wechat.config.TemplateMessageMange;
public class testing {
    public static void main(String[] args) {
        //测试发送功能
        // TODO Auto-generated method stub
        TemplateMessageMange tests=new TemplateMessageMange();
        String a ="oYhYl1f1Bx16E6gJInoFQpI7irZI";
        tests.sendTemplateMessage(a);
        String []openId ={"oYhYl1almlP5zuYmA040ikVyb8bc","oYhYl1f1Bx16E6gJInoFQpI7irZI","oYhYl1XkR0OBhgG3q4tTmLTGYI4Q","oYhYl1aQgVnR7W0cPUyZlBbNGPjE","oYhYl1Rw1Y2v3mtD1AMUW6TsJ974"} ;
        tests.groupSend(openId);
    }
}
