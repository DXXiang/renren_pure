package io.sdses.modules.wechat.service;

import com.baomidou.mybatisplus.service.IService;
import io.sdses.common.utils.PageUtils;
import io.sdses.modules.wechat.entity.MessageEntity;

import java.util.List;
import java.util.Map;

/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-07-01 22:39:10
 */
public interface MessageService extends IService<MessageEntity> {

    PageUtils queryPage(Map<String, Object> params);
    int sendMessages(List<String> openids , String content);

}

