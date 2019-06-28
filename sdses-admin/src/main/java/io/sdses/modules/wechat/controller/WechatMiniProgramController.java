package io.sdses.modules.wechat.controller;


import com.alibaba.fastjson.JSON;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Result;
import java.io.*;
import java.util.*;
import java.util.logging.FileHandler;

//@CrossOrigin
@Controller
@RequestMapping("/wechat/miniprogram")
public class WechatMiniProgramController {
    private static final Logger logger = LoggerFactory.getLogger(WechatMiniProgramController.class);

    @RequestMapping("/upload")
    @ResponseBody
    public void uploadPicture(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //Result result = new Result();

        //获取文件上传到的路径
        //File directory = new File("..");
        String path = request.getRealPath("/upload") + "/";

        //判断文件夹是否存在（不存在则创建）
        File dir = new File(path);
        if (!dir.exists()) {
            dir.mkdir();
        }
        logger.debug("path=" + path);

        request.setCharacterEncoding("utf-8");
        DiskFileItemFactory factory = new DiskFileItemFactory();
        factory.setRepository(dir);
        factory.setSizeThreshold(1080 * 1080);
        ServletFileUpload upload = new ServletFileUpload(factory);
        JSONArray jsonArray = new JSONArray();

        try {
            List<FileItem> list = upload.parseRequest(request);
            FileItem picture = null;
            for (FileItem item : list) {
                //获取表单的属性名字
                String name = item.getFieldName();
                //如果获取的表单信息是普通的 文本 信息
                if (item.isFormField()) {
                    //获取用户具体输入的字符串
                    String value = item.getString();
                    request.setAttribute(name, value);
                    logger.debug("name=" + name + ",value=" + value);
                } else {
                    picture = item;
                }
            }

            //自定义上传图片的名字为userId.jpg
            String fileName = request.getAttribute("userId") + ".jpg";
            String destPath = path + fileName;
            logger.debug("destPath=" + destPath);

            //真正写到磁盘上
            File file = new File(destPath);
            OutputStream out = new FileOutputStream(file);
            InputStream in;
            in = picture.getInputStream();
            int length = 0;
            byte[] buf = new byte[1024];
            in.read(buf); //每次读到的数据存放在buf 数组中
            while ((length = in.read(buf)) != -1) {
                //在buf数组中取出数据写到（输出流）磁盘上
                out.write(buf, 0, length);
            }

            in.close();
            out.close();
        } catch (FileUploadException e1) {
            logger.error("111", e1);
        } catch (Exception e) {
            logger.error("123", e);
        }

        PrintWriter printWriter = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        HashMap<String, Object> res = new HashMap<String, Object>();
        res.put("success", true);
        printWriter.write(JSON.toJSONString(res));
        printWriter.flush();
    }
}
