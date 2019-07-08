package io.sdses.modules.wechat.service;

import com.baomidou.mybatisplus.service.IService;
import io.sdses.common.utils.PageUtils;
import io.sdses.modules.wechat.entity.UserCheckresultEntity;

import java.util.List;
import java.util.Map;

/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-07-01 16:33:17
 */
public interface UserCheckresultService extends IService<UserCheckresultEntity> {

    PageUtils queryPage(Map<String, Object> params);
    List<UserCheckresultEntity> queryAllByParams(Map<String, Object> params);
    List<UserCheckresultEntity> getAuthedPersons();
    List<UserCheckresultEntity> getAllPersons();
}

