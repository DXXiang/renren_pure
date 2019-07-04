package io.sdses.service.impl;


import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.exception.RRException;
import io.sdses.common.validator.Assert;
import io.sdses.dao.UserDao;
import io.sdses.entity.TokenEntity;
import io.sdses.entity.UserEntity;
import io.sdses.entity.OcrEntity;
import io.sdses.form.OcrForm;
import io.sdses.service.TokenService;
import io.sdses.service.OcrService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@Service("OcrService")
public class OcrServiceImpl extends ServiceImpl<UserDao, UserEntity> implements OcrService {
	@Autowired
	private TokenService tokenService;

	@Override
	public OcrEntity queryByMobile(String photo,String type) {
		OcrEntity myocr = new OcrEntity();
		String url =  "http://103.239.152.236:6000/haloServer/front_ocrWithPhoto.action";
		JSONObject paraJson = new JSONObject();
		paraJson.put("apptype", "SSDZ");
		paraJson.put("subtype", "SSDZ");
		paraJson.put("file1", photo);
		paraJson.put("type1", type);
		String params = paraJson.toString();
		System.out.println("参数========>"+params);
		String results = HttpUtils.sendPost(url, params);
		System.out.println("返回========>"+results);
		if(type.equals("1")) {	
			JSONObject Results = JSONObject.parseObject(results);
			String ss = Results.getString("idcard_ocr_result");
			JSONObject Results2 = JSONObject.parseObject(ss);
			String citizen_id = Results2.getString("citizen_id");
			Assert.isNull(citizen_id, "请传正面照");
			String name = Results2.getString("name");
			String photo2 = Results2.getString("photo");
			myocr.setCitizen_id(citizen_id);
			myocr.setName(name);
			myocr.setPhoto(photo2);
			return myocr;
		}else {
    		JSONObject Results = JSONObject.parseObject(results);
    		String ss = Results.getString("idcard_ocr_result");
    		JSONObject Results2 = JSONObject.parseObject(ss);
    		String ss2 = Results2.getString("valid_date_end");
    		Assert.isNull(ss2, "请传背面照");
//    		Calendar cal=Calendar.getInstance();    
    		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
    		String time = format.format(Calendar.getInstance().getTime());	
    		if(Integer.parseInt(ss2)<Integer.parseInt(time)) {
    			myocr.setCheck("0");
    		}else {
    			myocr.setCheck("1");
    		}
    		return myocr;
    	}
	}

	@Override
	public Map<String, Object> login(OcrForm form) {
		OcrEntity ocr = queryByMobile(form.getphoto(),form.gettype());
		Assert.isNull(ocr, "照片错误");

		Map<String, Object> map = new HashMap<>(2);
		if("1".equals(ocr.getCheck())||"0".equals(ocr.getCheck()))
			map.put("check", ocr.getCheck());
		else {
			map.put("name", ocr.getName());
			map.put("cardID", ocr.getCitizen_id());
			map.put("photo", ocr.getPhoto());
		}
		return map;
	}

}


