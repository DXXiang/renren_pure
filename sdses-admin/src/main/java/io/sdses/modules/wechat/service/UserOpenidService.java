package io.sdses.modules.wechat.service;

import com.baomidou.mybatisplus.service.IService;
import io.sdses.common.utils.PageUtils;
import io.sdses.modules.wechat.entity.UserOpenidEntity;

import java.util.Map;

/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-06-28 17:53:52
 */
public interface UserOpenidService extends IService<UserOpenidEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

