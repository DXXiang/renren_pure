package io.sdses.modules.common.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import io.sdses.common.exception.RRException;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;
import io.sdses.common.utils.SocketMessage;
import io.sdses.modules.common.dao.ComMsgDao;
import io.sdses.modules.common.entity.ComMsgEntity;
import io.sdses.modules.common.service.ComMsgService;


@Service("comMsgService")
public class ComMsgServiceImpl extends ServiceImpl<ComMsgDao, ComMsgEntity> implements ComMsgService {
	
	@Autowired
	private ComMsgDao comMsgDao;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<ComMsgEntity> page = this.selectPage(
                new Query<ComMsgEntity>(params).getPage(),
                new EntityWrapper<ComMsgEntity>()
        );

        return new PageUtils(page);
    }

	@Override
	public ComMsgEntity msgHandler(Long receiveUserId, Long relationId, String title, String content, String type, Date msgDate) {
		ComMsgEntity entity = new ComMsgEntity();
		entity.setRelationId(relationId);
		entity.setTitle(title);
		//不弹出页面，不需要 内容字段
		//entity.setContent(content);
		entity.setType(type);
		if(msgDate == null){
			msgDate = new Date();
			entity.setIsDelay(0);
		} else {
			entity.setIsDelay(1);
		}
		entity.setMsgTime(msgDate);
		entity.setIsRead("0");
		entity.setReceivedUserId(receiveUserId);
		entity.setUuid(UUID.randomUUID().toString().replace("-", ""));
		this.insert(entity);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		// 没有提醒时间、或者提醒时间 为 今天
		if(msgDate == null || sdf.format(msgDate).equals(sdf.format(new Date()))){
			//WebSocketServer.sendInfo(JSON.toJSONString(entity), receiveUserId.toString());
			SocketMessage socketMessageThread = new SocketMessage(JSON.toJSONString(entity), receiveUserId.toString());
			socketMessageThread.run();
		}
		return entity;
	}
	
	@Override
	public ComMsgEntity msgHandler(Long receiveUserId, Long relationId, String title, String content, String type, Date msgDate, String uuid) {
		ComMsgEntity entity = new ComMsgEntity();
		entity.setRelationId(relationId);
		entity.setTitle(title);
		//不弹出页面，不需要 内容字段
		//entity.setContent(content);
		entity.setType(type);
		if(msgDate == null){
			msgDate = new Date();
			entity.setIsDelay(0);
		} else {
			entity.setIsDelay(1);
		}
		entity.setMsgTime(msgDate);
		entity.setIsRead("0");
		entity.setReceivedUserId(receiveUserId);
		entity.setUuid(uuid);
		this.insert(entity);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		// 没有提醒时间、或者提醒时间 为 今天
		if(msgDate == null || sdf.format(msgDate).equals(sdf.format(new Date()))){
			//WebSocketServer.sendInfo(JSON.toJSONString(entity), receiveUserId.toString());
			SocketMessage socketMessageThread = new SocketMessage(JSON.toJSONString(entity), receiveUserId.toString());
			socketMessageThread.run();
		}
		return entity;
		/*ComMsgEntity entity = new ComMsgEntity();
		entity.setRelationId(relationId);
		entity.setTitle(title);
		//不弹出页面，不需要 内容字段
		//entity.setContent(content);
		entity.setType(type);
		entity.setMsgTime(new Date());
		entity.setIsRead("0");
		entity.setReceivedUserId(receiveUserId);
		entity.setUuid(uuid);
		this.insert(entity);
		
		SocketMessage socketMessageThread = new SocketMessage(JSON.toJSONString(entity), receiveUserId.toString());
		socketMessageThread.run();
		
		//插入 定时消息
		entity.setMsgId(null);
		entity.setMsgTime(msgDate);
		this.insert(entity);
		return entity;*/
	}
	

	@Override
	public List<ComMsgEntity> selectByUserId(Long userId) {
		return comMsgDao.selectByUserId(userId);
	}

	@Override
	public List<ComMsgEntity> selectNoticeByUserId(Long userId, int num) {
		return comMsgDao.selectNoticeByUserId(userId, num);
	}

	@Override
	public List<ComMsgEntity> selectShowMsgByUserId(Long userId, String currentDate) {
		return comMsgDao.selectShowMsgByUserId(userId, currentDate);
	}

	@Override
	public List<ComMsgEntity> selectHideMsgByUserId(Long userId, String currentDate) {
		return comMsgDao.selectHideMsgByUserId(userId, currentDate);
	}

	@Override
	public ComMsgEntity msgRead(Long msgId) throws RRException{
		ComMsgEntity entityNow = this.selectById(msgId);
		if(entityNow != null){
			if(entityNow.getType().equals("5")){	//工作通知模块单独处理
				List<ComMsgEntity> entityList = this.selectList(new EntityWrapper<ComMsgEntity>().eq("uuid", entityNow.getUuid()));
				//获取提醒时间
				Date msgTime;
				if(entityList.get(0).getMsgTime().before(entityList.get(1).getMsgTime())){
					msgTime = entityList.get(1).getMsgTime();
				} else {
					msgTime = entityList.get(0).getMsgTime();
				}
				//提醒时间 <= 当前时间，更新两条数据
				if(msgTime.before(new Date())){
					entityList.get(0).setIsRead("1");
					entityList.get(1).setIsRead("1");
					this.updateBatchById(entityList);
					return entityList.get(0);
				} 
			} 
			
			ComMsgEntity entity = new ComMsgEntity();
			entity.setMsgId(msgId);
			entity.setIsRead("1");
			this.updateById(entity);
			return entityNow;
		} else {
			throw new RRException("该消息已删除，无法查看！");
		}
	}

}
