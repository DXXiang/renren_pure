package io.sdses.modules.wechat.config;
import io.sdses.modules.wechat.utils.Util;
import io.sdses.modules.wechat.service.WeixinService;
import java.text.SimpleDateFormat;
import java.util.*;
public class TemplateMessageMange {
    //private static final String OPENID="oYhYl1f1Bx16E6gJInoFQpI7irZI";
    //test
    //private static  String[]a= {"oYhYl1almlP5zuYmA040ikVyb8bc","oYhYl1f1Bx16E6gJInoFQpI7irZI","oYhYl1XkR0OBhgG3q4tTmLTGYI4Q","oYhYl1aQgVnR7W0cPUyZlBbNGPjE","oYhYl1Rw1Y2v3mtD1AMUW6TsJ974"};
    //test
    private Date date = new Date();
    SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd :hh:mm:ss");
    public void set() {
        String at =WeixinService.getAcceseeToken();
        String url="https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token="+at;
        String data="{\r\n" +
                "    \"industry_id1\":\"1\",\r\n" +
                "    \"industry_id2\":\"4\"\r\n" +
                "}";
        String result =Util.post(url, data);
        System.out.println(result);
    }
    public void get() {
        String at=WeixinService.getAcceseeToken();
        String url="https://api.weixin.qq.com/cgi-bin/template/get_industry?access_token="+at;
        String result=Util.get(url);
        System.out.println(result);
    }
    public void sendTemplateMessage(String a,String b) {
        //发送模板消息，a为要发送的openid

        String at=WeixinService.getAcceseeToken();
        String url="https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+at;
        String data="      {\r\n" +
                "           \"touser\":\""+a+"\",\r\n" +
                "           \"template_id\":\"JtOBv_eorHP6BqAdhMLC3mtRTkxZU8M5C6Auy_zty88\",\r\n" +
                "           \"data\":{\r\n" +
                "                   \"first\": {\r\n" +
                "                       \"value\":\""+b+"\",\r\n" +
                "                       \"color\":\"#173177\"\r\n" +
                "                   },\r\n" +
                "                   \"time\": {\r\n" +
                "                       \"value\":\""+dateFormat.format(date)+"\",\r\n" +
                "                       \"color\":\"#173177\"\r\n" +
                "                   }\r\n" +
                "           }\r\n" +
                "       }";//里面的内容可以改
        String result=Util.post(url, data);
        System.out.println(result);
        //System.out.print("123");

    }
    public void groupSend(String[] openId,String message) {
        //参数为openid的数组，群发消息
        for(int i=0;i<openId.length;i++) {
            sendTemplateMessage(openId[i],message);
            //System.out.println(openId[i]);
        }
    }
}
