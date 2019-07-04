package io.sdses.service.impl;

import java.io.File;
import java.nio.charset.Charset;
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

public class CheckVideoTest {
	static String loginName = "";
	static String idnum = "370832198210043311";
	static String idname = "郭恩英";
	static String verifyNumber = "";
	static String appType = "";
	static String subType = "";
	static String appID = "";
	public static String checkVideo() throws ClientProtocolException, Exception {
		MultipartEntityBuilder mb=MultipartEntityBuilder.create().setMode(HttpMultipartMode.BROWSER_COMPATIBLE)			
				.setCharset(Charset.forName("utf-8"))	//,这个会导致服务端取值取不到	
				.addTextBody("loginName", "")
				.addTextBody("idnum", idnum)
				.addTextBody("idname", idname, ContentType.create("text", Charset.forName("utf-8")))
				.addTextBody("verifyNumber", "2018")
				.addTextBody("apptype", "SSDZ")
				.addTextBody("subtype", "SSDZ")
				.addTextBody("appid","")
				.addTextBody("streamNumber","123");
		File file = new File("E:\\video\\bm\\test\\123.mp4");	
		mb.addBinaryBody("video", file);
		File file2 = new File("E:\\video\\bm\\test\\123.jpg");
		mb.addBinaryBody("picture", file2);
		HttpEntity entity = mb.build();
		HttpPost httpPost = new HttpPost("http://rzt.sdses.com:6000/haloServer/front_verifyVideo.action");
		httpPost.setEntity(entity);
		HttpClient  httpClient = (HttpClient)HttpClients.createDefault();
		HttpResponse response = httpClient.execute(httpPost);  
		HttpEntity httpEntity = response.getEntity();  
		httpEntity = new BufferedHttpEntity(httpEntity);  
		String resultString = EntityUtils.toString(httpEntity); 
		System.out.println("====>"+new String(resultString));
		return resultString;  

	} 
}
