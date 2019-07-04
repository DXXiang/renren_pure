package io.sdses.service.impl;



import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.dao.UserOpenidDao;
import io.sdses.entity.UserOpenidEntity;
import io.sdses.form.OpenidForm;
import io.sdses.service.OpenidDBService;
import io.sdses.service.OpenidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service("openidService")
public class OpenidServiceImpl extends ServiceImpl<UserOpenidDao, UserOpenidEntity> implements OpenidService {
	@Autowired
	private OpenidDBService openidDBService;

	@Override
	public String queryByMobile(String openid,String type) {
		System.out.println(openid);
		System.out.println(type);
		UserOpenidEntity userOpenidEntity = new UserOpenidEntity();
		userOpenidEntity.setOpenid(openid);
		userOpenidEntity.setType(type);
		openidDBService.createTest(userOpenidEntity);
		return "成功";
	}

	@Override
	public Map<String, Object> login(OpenidForm form) {
		String result = queryByMobile(form.getopenid(),form.gettype());

		Map<String, Object> map = new HashMap<>(2);
		map.put("result", result);
		return map;
	}

}


