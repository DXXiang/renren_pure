package io.sdses.modules.qxda.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;

import io.sdses.modules.qxda.dao.PersonTelDao;
import io.sdses.modules.qxda.entity.PersonTelEntity;
import io.sdses.modules.qxda.service.PersonTelService;


@Service("personTelService")
public class PersonTelServiceImpl extends ServiceImpl<PersonTelDao, PersonTelEntity> implements PersonTelService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<PersonTelEntity> page = this.selectPage(
                new Query<PersonTelEntity>(params).getPage(),
                new EntityWrapper<PersonTelEntity>()
        );

        return new PageUtils(page);
    }

}
