package io.sdses.modules.wechat.dao;

import com.baomidou.mybatisplus.mapper.Wrapper;
import io.sdses.modules.wechat.entity.MessageEntity;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Map;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-07-01 22:39:10
 */
@Repository
public interface MessageDao extends BaseMapper<MessageEntity> {
    Integer insertMessages (List<MessageEntity> messageEntities);

}
