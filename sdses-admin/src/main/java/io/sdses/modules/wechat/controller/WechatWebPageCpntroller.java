package io.sdses.modules.wechat.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.*;

@CrossOrigin
@Controller
@RequestMapping("/wechat/page")
public class WechatWebPageCpntroller {
    @RequestMapping("{url}.html")
    public String Page(@PathVariable("url") String url) {
        return "modules/wechat/" + url;
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
