package io.sdses.modules.wechat.dao;

import io.sdses.modules.wechat.entity.UserCheckresultEntity;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-06-28 17:53:52
 */
@Repository
public interface UserCheckresultDao extends BaseMapper<UserCheckresultEntity> {
	List<UserCheckresultEntity> selectAuthedPersons ();
	List<UserCheckresultEntity> selectAllPersons ();
}
