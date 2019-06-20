package io.sdses.modules.qxda.service;

import com.baomidou.mybatisplus.service.IService;
import io.sdses.common.utils.PageUtils;
import io.sdses.modules.qxda.entity.PersonChatEntity;

import java.util.Map;

/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-02 15:04:13
 */
public interface PersonChatService extends IService<PersonChatEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

