package io.sdses.service.impl;


import java.io.BufferedOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.UUID;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.exception.RRException;
import io.sdses.common.validator.Assert;
import io.sdses.dao.UserCheckresultDao;
import io.sdses.dao.UserDao;
import io.sdses.entity.ResultEntity;
import io.sdses.entity.TokenEntity;
import io.sdses.entity.UserEntity;
import io.sdses.service.TokenService;
import io.sdses.service.UploadFileService;
import io.sdses.service.GetNumService;
import io.sdses.service.ResultService;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.hibernate.validator.internal.util.StringHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;



import javax.servlet.http.HttpServletRequest;

@Service("uploadFileService")
public class UploadFileImpl extends ServiceImpl<UserCheckresultDao, ResultEntity> implements UploadFileService {
	
	private static final Logger LOG = LoggerFactory.getLogger(UploadFileImpl.class);
	
	@Autowired
	private ResultService resultService;
	
	private String failemesg="";
	
	@Override
	public String uploadFile(HttpServletRequest request,MultipartFile[] files){
		System.out.println("-------------");
		LOG.info("进入上传...");
		
		
		System.out.println("-------------");
		System.out.println("-------------");
		String openid = request.getParameter("openid");
		String idname = request.getParameter("idname");
		String idnum = request.getParameter("idnum");
		String num4 = request.getParameter("num4");
		String image = request.getParameter("image");
		String uploadPath=System.getProperty("user.dir")+"/video/"+openid+"/";//存放到本地路径（示例）
		
		System.out.println(openid);
		System.out.println(idname);
		System.out.println(idnum);
		System.out.println(num4);
		System.out.println(image);
		System.out.println(uploadPath);
		
		System.out.println("-------------");
		System.out.println("-------------");
		
		
		//视频文件存储,获得本地路径
		String videopath="";
		if(files!=null && files.length>=1) {
	            BufferedOutputStream bw = null;
	            try {
	                String fileName = files[0].getOriginalFilename();
	                //判断是否有文件
	                if(StringUtils.isNoneBlank(fileName)) {
	                	videopath = uploadPath + UUID.randomUUID().toString()+ getFileType(fileName);
	                	File outFile = new File(videopath);
	                	LOG.info("Videopath=="+videopath);  
	                	FileUtils.copyInputStreamToFile(files[0].getInputStream(), outFile);
                        //输出到本地路径
	                	FileUtils.copyInputStreamToFile(files[0].getInputStream(), outFile);
	                	System.out.println(videopath);
                         }            
	                } 
	            catch (Exception e) {
	            	e.printStackTrace();
	            	} finally {     
	                try {     
	            		if(bw!=null) {bw.close();}    
	            		} 
	            	catch (IOException e) {    
	            		e.printStackTrace();                
	            		}            
	            	} 
	            
	            }
		
		//base64字符转图片
		String imagepath;
		ImageUtils imageUtils = new ImageUtils();
		imagepath = imageUtils.decodeBase64ToImage(image, uploadPath, UUID.randomUUID().toString()+"123");
		System.out.print("+++++++++++++++");
		System.out.print(imagepath);
		
		//调用视频接口
		MultipartEntityBuilder mb=MultipartEntityBuilder.create().setMode(HttpMultipartMode.BROWSER_COMPATIBLE)			
				.setCharset(Charset.forName("utf-8"))//,这个会导致服务端取值取不到	
				.addTextBody("apptype", "SSDZ")
				.addTextBody("subtype", "SSDZ")
				.addTextBody("idnum", idnum)
				.addTextBody("idname", idname, ContentType.create("text", Charset.forName("utf-8")))
				.addTextBody("verifyNumber",num4);
		File file = new File(videopath);	
		mb.addBinaryBody("video", file);
		File file2 = new File(imagepath);
		mb.addBinaryBody("picture", file2);
		HttpEntity entity = mb.build();
		HttpPost httpPost = new HttpPost("http://rzt.sdses.com:6000/haloServer/front_verifyVideo.action");
		httpPost.setEntity(entity);
		HttpClient  httpClient = (HttpClient)HttpClients.createDefault();
		HttpResponse response;
		try {
			
		response = httpClient.execute(httpPost); 
		HttpEntity httpEntity = response.getEntity();  
		httpEntity = new BufferedHttpEntity(httpEntity);  
		String resultString = EntityUtils.toString(httpEntity); 
		System.out.println("====>"+new String(resultString));
		
		//数据库操作
		Date date = new Date();
		com.alibaba.fastjson.JSONObject jsonObject1 = com.alibaba.fastjson.JSONObject.parseObject(resultString);
		String message = jsonObject1.getString("message");
		String code = jsonObject1.getString("code");
		if (code.equals("1")) {
			//测试数据库
			ResultEntity resultEntity = new ResultEntity();
			resultEntity.setIdname(idname);
			resultEntity.setIdnum(idnum);
			resultEntity.setOpenid(openid);
			resultEntity.setFailReason(message);
			resultEntity.setResult("认证失败");
			resultEntity.setPicture(image);
			resultEntity.setDate(date);
			
			resultService.createTest(resultEntity);
			failemesg = message;
			return "认证失败";
		}else {
			
			com.alibaba.fastjson.JSONObject jsonObject2 = com.alibaba.fastjson.JSONObject.parseObject(message);
			String code1 = jsonObject2.getString("code");
			String failmesg = jsonObject2.getString("message");
			if (code1.equals("1")) {
				ResultEntity resultEntity = new ResultEntity();
				resultEntity.setIdname(idname);
				resultEntity.setIdnum(idnum);
				resultEntity.setOpenid(openid);
				resultEntity.setFailReason(failmesg);
				resultEntity.setResult("认证失败");
				resultEntity.setPicture(image);
				resultEntity.setDate(date);
				resultService.createTest(resultEntity);
				failemesg = failmesg;
				return "认证失败";
			}else {
				//测试数据库
				ResultEntity resultEntity = new ResultEntity();
				resultEntity.setIdname(idname);
				resultEntity.setIdnum(idnum);
				resultEntity.setOpenid(openid);
				resultEntity.setFailReason("");
				resultEntity.setResult("认证成功");
				resultEntity.setPicture(image);
				resultEntity.setDate(date);
				
				resultService.createTest(resultEntity);
		
				return "认证成功";
			}
			
			
			
			
		}
		
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return "认证失败";
		
}

	@Override
	public Map<String, Object> upload(HttpServletRequest request,MultipartFile[] files) {
		String result = uploadFile(request,files);
		Map<String, Object> map = new HashMap<>(2);
		if (result.equals("认证成功")) {
			map.put("result", result);
		}else {
			map.put("result", result);
			map.put("failreason", failemesg);
		}
	
		return map;
	}
	
	public static String getFileType(String filename){
         if(filename.endsWith(".mp4") || filename.endsWith(".MP4")){
        	return ".mp4";
        }else{
            return "application/octet-stream";
        }
	}

}

