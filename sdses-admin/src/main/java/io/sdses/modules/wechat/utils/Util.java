package io.sdses.modules.wechat.utils;
import java.net.MalformedURLException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.*;
public class Util {
    public static String get(String url) {
        try {URL urlObj= new URL(url);
            URLConnection connection =urlObj.openConnection();
            InputStream is=connection.getInputStream();
            byte[] b=new byte[1024];
            int len;
            StringBuilder sb=new StringBuilder();
            while((len=is.read(b))!=-1) {
                sb.append(new String(b,0,len));
            }
            return sb.toString();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }
    public static String post(String url,String data) {
        //向指定地址发送一个post请求，带data数据
        try {
            URL urlObj= new URL(url);
            URLConnection connection=urlObj.openConnection();
            connection.setDoOutput(true);
            OutputStream os=connection.getOutputStream();
            os.write(data.getBytes());
            os.close();
            InputStream is=connection.getInputStream();
            byte[] b=new byte[1024];
            int len;
            StringBuilder sb=new StringBuilder();
            while((len=is.read(b))!=-1) {
                sb.append(new String(b,0,len));
            }
            return sb.toString();

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }
}
