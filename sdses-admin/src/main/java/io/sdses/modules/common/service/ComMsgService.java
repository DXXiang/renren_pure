package io.sdses.modules.common.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.service.IService;

import io.sdses.common.exception.RRException;
import io.sdses.common.utils.PageUtils;
import io.sdses.modules.common.entity.ComMsgEntity;

/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2018-12-29 10:49:38
 */
public interface ComMsgService extends IService<ComMsgEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
    ComMsgEntity msgHandler(Long receiveUserId, Long relationId, String title, String content, String type, Date msgDate);
    
    ComMsgEntity msgHandler(Long receiveUserId, Long relationId, String title, String content, String type, Date msgDate, String uuid);
    
    ComMsgEntity msgRead(Long msgId) throws RRException;

	/**
	 * 根据用户id查询消息列表
	 * @param userId
	 * @return
	 */
	List<ComMsgEntity> selectByUserId(Long userId);
	
	/**
	 * 根据用户id查询通知类型的消息
	 * @return
	 */
	List<ComMsgEntity> selectNoticeByUserId(Long userId,int num);

	/**
	 * 获取用户历史 未读消息
	 * @param userId
	 * @param currentDate
	 * @return
	 */
	List<ComMsgEntity> selectShowMsgByUserId(Long userId, String currentDate);

	/**
	 * 获取用户当天提醒的消息，提醒时间大于当前时间
	 * @param userId
	 * @param currentDate
	 * @return
	 */
	List<ComMsgEntity> selectHideMsgByUserId(Long userId, String currentDate);
}

