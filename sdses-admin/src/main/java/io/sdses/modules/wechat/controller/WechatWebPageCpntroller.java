package io.sdses.modules.wechat.controller;


import io.sdses.common.utils.HttpUtil;
import io.sdses.modules.wechat.utils.HttpUtils;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.*;


@Controller
@RequestMapping("/wechat/page")
public class WechatWebPageCpntroller {
    @RequestMapping("{url}.html")
    public String Page(@PathVariable("url") String url) {
        return "modules/wechat/" + url;
    }

    @RequestMapping("/getOpenID")
    @ResponseBody
    public Map<String,String> getOpenID(HttpServletRequest request){

        Map<String,String> map=new HashMap<String,String>();
        String code = request.getParameter("code");

        String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx679677b804f19fcc&secret=73b6c99b7556e5a590347f6b6e8a7945&code="+code+"&grant_type=authorization_code";
        JSONObject jsonObject = HttpUtils.doGetstr(url);

        map.put("openid",jsonObject.get("openid").toString());
        return map;
    }

    @RequestMapping("/saveOpenID")
    @ResponseBody
    public JSONObject saveOpenID(HttpServletRequest request){
        JSONObject send = JSONObject.fromObject("{openid:'"+request.getParameter("openid")+"',type:'1'}");
        String url = "http://47.93.1.226:8081/sdses-api/api/sendopenid";
        JSONObject jsonObject = HttpUtils.doPost(url,send);

        return jsonObject;
    }

    @RequestMapping("/uploadpic")
    @ResponseBody
    public JSONObject uploadpic(HttpServletRequest request) throws IOException {
        String base64 = request.getParameter("photo").split(",")[1];
        String type= request.getParameter("type");
        JSONObject send = JSONObject.fromObject("{photo:'"+base64+"',type:'"+type+"'}");
        System.out.println("接收："+send.toString());
        String url = "http://47.93.1.226:8081/sdses-api/api/ocr";
        JSONObject jsonObject = HttpUtils.doPost(url,send);
        System.out.println(jsonObject.toString());
        return jsonObject;
    }

    @RequestMapping("/getNum")
    @ResponseBody
    public JSONObject getNum(){
        String url = "http://47.93.1.226:8081/sdses-api/api/getnum";
        String result = HttpUtil.httpURLConnectionPOST(url);
        JSONObject jsonObject =JSONObject.fromObject(result);
        return jsonObject;
    }

    @RequestMapping("/test")
    @ResponseBody
    public JSONObject test(HttpServletRequest request) throws IOException {
        String name = request.getParameter("idname");
        System.out.println("默认："+name);
        byte bytes[] = name.getBytes("UTF-8");
        name = new String(bytes,"ISO8859-1");
        System.out.println("ISO8859-1："+name);
        bytes = name.getBytes("ISO8859-1");
        name = new String(bytes,"UTF-8");
        System.out.println("UTF-8："+name);
        return null;
    }

    @RequestMapping("/uploadvideo")
    @ResponseBody
    public JSONObject uploadvideo(MultipartFile[] file, HttpServletRequest request) throws IOException {
        String result = "";
        if (file != null && file.length > 0) {
            System.out.println("fileLength"+ file.length);
            for (int i = 0; i < file.length; i++) {
                MultipartFile filex = file[i];
                // 保存文件
                result = HttpUtils.uploadFileToOSS(filex,"http://47.93.1.226:8081/sdses-api/api/upload",request);
            }
        }else{
            result = "{mes:'上传失败'}";
        }
        return JSONObject.fromObject(result);
    }

    @RequestMapping("/upLoad")
    @ResponseBody
    public Map<String,Object> MultiPictareadData(MultipartFile[] file, HttpServletRequest request) throws IOException {
        List<String> list = new ArrayList<String>();
        Map<String,Object> map=new HashMap<String,Object>();
        if (file != null && file.length > 0) {
            System.out.println("fileLength"+ file.length);
            for (int i = 0; i < file.length; i++) {
                MultipartFile filex = file[i];
                // 保存文件
                saveFile(request, filex);
            }
            map.put("msg","上传成功");
        }else{
            System.out.println(file.length+"：长度就是零");
            map.put("msg","上传失败");
        }
        return map;
    }
    private void saveFile(HttpServletRequest request,MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String name = file.getName();
        String randomUUID = UUID.randomUUID().toString();
        int index = originalFilename.lastIndexOf(".");
        String exet = originalFilename.substring(index);
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd\\HH\\mm\\ss");
        String dateStr = sdf.format(date);
        String filePath = "C:\\Users\\HPuser\\Desktop\\" + dateStr;
        System.out.println("filePath=" + filePath);
        File file2 = new File(filePath);
        if (!file2.exists()) {
            file2.mkdirs();
        }
        filePath += "\\" + randomUUID + exet;
        System.out.println(filePath + "P");
        file.transferTo(new File(filePath));// ctrl+1
    }
}
