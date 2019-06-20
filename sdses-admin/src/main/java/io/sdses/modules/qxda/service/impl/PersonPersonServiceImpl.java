package io.sdses.modules.qxda.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;

import io.sdses.modules.qxda.dao.PersonPersonDao;
import io.sdses.modules.qxda.entity.PersonPersonEntity;
import io.sdses.modules.qxda.service.PersonPersonService;


@Service("personPersonService")
public class PersonPersonServiceImpl extends ServiceImpl<PersonPersonDao, PersonPersonEntity> implements PersonPersonService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<PersonPersonEntity> page = this.selectPage(
                new Query<PersonPersonEntity>(params).getPage(),
                new EntityWrapper<PersonPersonEntity>()
        );

        return new PageUtils(page);
    }

}
