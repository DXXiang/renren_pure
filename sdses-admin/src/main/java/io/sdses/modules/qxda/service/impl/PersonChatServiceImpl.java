package io.sdses.modules.qxda.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;

import io.sdses.modules.qxda.dao.PersonChatDao;
import io.sdses.modules.qxda.entity.PersonChatEntity;
import io.sdses.modules.qxda.service.PersonChatService;


@Service("personChatService")
public class PersonChatServiceImpl extends ServiceImpl<PersonChatDao, PersonChatEntity> implements PersonChatService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<PersonChatEntity> page = this.selectPage(
                new Query<PersonChatEntity>(params).getPage(),
                new EntityWrapper<PersonChatEntity>()
        );

        return new PageUtils(page);
    }

}
