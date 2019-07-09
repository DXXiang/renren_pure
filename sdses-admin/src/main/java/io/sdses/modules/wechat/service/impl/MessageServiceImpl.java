package io.sdses.modules.wechat.service.impl;

import io.sdses.modules.wechat.utils.TemplateMessageMange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;

import io.sdses.modules.wechat.dao.MessageDao;
import io.sdses.modules.wechat.entity.MessageEntity;
import io.sdses.modules.wechat.service.MessageService;


@Service("messageService")
public class MessageServiceImpl extends ServiceImpl<MessageDao, MessageEntity> implements MessageService {
    @Autowired
    private MessageDao messageDao;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<MessageEntity> page = this.selectPage(
                new Query<MessageEntity>(params).getPage(),
                new EntityWrapper<MessageEntity>()
        );

        return new PageUtils(page);
    }

    @Override
    public int sendMessages(List<String> openids , String content) {
        TemplateMessageMange tmm = new TemplateMessageMange();
        List<String> failIds = tmm.groupSend(openids, content);
        if (failIds.size() != 0) {
            openids.removeAll(failIds);
        }
        List<MessageEntity> messageEntities = new ArrayList<>();
        for (String openid :openids) { //成功的
            MessageEntity message = new MessageEntity();
            message.setOpenid(openid);
            message.setMessCont(content);
//            message.setPushResults(0);
            message.setPushResults("0");
            message.setDeliveryTime(new Date());

            messageEntities.add(message);
        }
        for (String openid :failIds) { //失败的
            MessageEntity message = new MessageEntity();
            message.setOpenid(openid);
            message.setMessCont(content);
//            message.setPushResults(0);
            message.setPushResults("1");
            message.setDeliveryTime(new Date());

            messageEntities.add(message);
        }
        return messageDao.insertMessages(messageEntities);
    }


}
