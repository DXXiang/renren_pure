package io.sdses.service;

import com.baomidou.mybatisplus.service.IService;
import io.sdses.entity.UserEntity;
import io.sdses.entity.UserOpenidEntity;
import io.sdses.entity.OcrEntity;
import io.sdses.form.OcrForm;
import io.sdses.form.OpenidForm;

import java.util.Map;

/**
 * 用户
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017-03-23 15:22:06
 */
public interface OpenidService extends IService<UserOpenidEntity> {

	String queryByMobile(String openid,String type);

	/**
	 * 用户登录
	 * @param form    登录表单
	 * @return        返回登录信息
	 */
	Map<String, Object> login(OpenidForm form);
}
