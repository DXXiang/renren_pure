package io.sdses.service.impl;


import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.dao.UserCheckresultDao;
import io.sdses.entity.ResultEntity;
import io.sdses.entity.TokenEntity;
import io.sdses.entity.UserEntity;
import io.sdses.service.TokenService;
import io.sdses.service.GetNumService;
import io.sdses.service.ResultService;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.fasterxml.jackson.databind.ObjectMapper;  
import java.util.HashMap;
import java.util.Map;

@Service("GetNumService")
public class GetNumServiceImpl extends ServiceImpl<UserCheckresultDao, ResultEntity> implements GetNumService {
	
	@Override
	public String getNum() {
		String url =  "http://rzt.sdses.com:6000/haloServer/front_liveGetFour.action";
	
		JSONObject paraJson = new JSONObject();
		paraJson.put("apptype", "SSDZ");
		paraJson.put("subtype", "SSDZ");		
		String params = paraJson.toString();
		System.out.println("参数========>"+params);
		String result = HttpUtils.sendPost(url, params);
		System.out.println("返回========>"+result);
		JSONObject jsonObject = JSONObject.parseObject(result);
		String code = jsonObject.getString("code");
		
		if (code.equals("0")) {
			String data = jsonObject.getString("data");
			com.alibaba.fastjson.JSONObject jsonObject1 = com.alibaba.fastjson.JSONObject.parseObject(data);
			String validate_data = jsonObject1.getString("validate_data");
			System.out.println(validate_data);
			System.out.println("----+++++------");
			System.out.println(System.getProperty("user.dir"));
			return validate_data;
			
		}else {
			return "获取失败";
		}
		
	}

	@Override
	public Map<String, Object> getresult() {
		String num4 = getNum();
		Map<String, Object> map = new HashMap<>(2);
		map.put("num4", num4);

		return map;
	}

}

