package io.sdses.modules.common.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.sdses.common.exception.RRException;
import io.sdses.common.utils.R;
import io.sdses.modules.common.entity.ComMsgEntity;
import io.sdses.modules.common.service.ComMsgService;



/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2018-12-29 10:49:38
 */
@RestController
@RequestMapping("common/commsg")
public class ComMsgController {
    @Autowired
    private ComMsgService comMsgService;

    /**
     * 列表
     */
    @RequestMapping("/list/{userId}")
    public R list(@PathVariable Long userId){
    	List<ComMsgEntity> entityList = comMsgService.selectByUserId(userId);
        return R.ok().put("list", entityList);
    }
    
    /**
     * 列表 - 首页展示
     */
    @RequestMapping("/listHome/{userId}")
    public R listHome(@PathVariable Long userId){
    	String currentDate = (new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()); 
    	List<ComMsgEntity> showList = comMsgService.selectShowMsgByUserId(userId, currentDate);
    	List<ComMsgEntity> hideList = comMsgService.selectHideMsgByUserId(userId, currentDate);
    	Map<String, List<ComMsgEntity>> map = new HashMap<String, List<ComMsgEntity>>();
    	map.put("showList", showList);
    	map.put("hideList", hideList);
        return R.ok().put("map", map);
    }
    
    /**
     * 查看消息
     */
    @RequestMapping("/read/{msgId}")
    public R read(@PathVariable("msgId") Long msgId){
    	try{
    		return R.ok().put("msg", comMsgService.msgRead(msgId));
    	} catch (RRException e){
    		return R.error(e.getMessage());
    	}
    }
    
    /**
     * 测试信息发送
     */
    @RequestMapping("/test/sendMsg/{msgId}/{msg}")
    public R sendMsg(@PathVariable("msgId") Long msgId,@PathVariable("msg") String msg){
    	comMsgService.msgHandler(msgId, 0L, "你好", msg, "1", new Date());
        return R.ok();
    }
    
    @RequestMapping("/notice/{userId}/{num}")
    public R getNotice(@PathVariable Long userId,@PathVariable int num){
    	List<ComMsgEntity> entityList = comMsgService.selectNoticeByUserId(userId, num);
        return R.ok().put("notice", entityList);
    }
}
