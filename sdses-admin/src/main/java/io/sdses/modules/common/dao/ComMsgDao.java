package io.sdses.modules.common.dao;

import io.sdses.modules.common.entity.ComMsgEntity;

import java.util.List;

import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2018-12-29 10:49:38
 */
public interface ComMsgDao extends BaseMapper<ComMsgEntity> {

	List<ComMsgEntity> selectByUserId(Long userId);
	List<ComMsgEntity> selectNoticeByUserId(Long userId,int num);
	
	List<ComMsgEntity> selectShowMsgByUserId(Long userId, String currentTime);
	List<ComMsgEntity> selectHideMsgByUserId(Long userId, String currentTime);
	
}
