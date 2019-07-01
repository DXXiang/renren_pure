package io.sdses.modules.wechat.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import io.sdses.modules.wechat.entity.UserCheckresultEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-07-01 16:33:17
 */
@Repository
public interface UserCheckresultDao extends BaseMapper<UserCheckresultEntity> {
    List<UserCheckresultEntity> selectAuthedPersons ();
    List<UserCheckresultEntity> selectAllPersons ();
}
