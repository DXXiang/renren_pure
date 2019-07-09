package io.sdses.modules.wechat.dao;

import io.sdses.modules.wechat.entity.UserOpenidEntity;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
public interface UserOpenidDao extends BaseMapper<UserOpenidEntity> {
	List<UserOpenidEntity> selectAllOpenId ();
    List<UserOpenidEntity> selectMpOpenId ();

}
