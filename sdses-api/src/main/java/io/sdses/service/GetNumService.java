package io.sdses.service;

import com.baomidou.mybatisplus.service.IService;

import io.sdses.entity.ResultEntity;
import io.sdses.entity.UserEntity;


import java.util.Map;

/**
 * 用户
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017-03-23 15:22:06
 */
public interface GetNumService extends IService<ResultEntity> {
	String getNum();
	Map<String, Object> getresult();

	
}
