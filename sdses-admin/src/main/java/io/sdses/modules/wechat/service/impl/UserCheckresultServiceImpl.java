package io.sdses.modules.wechat.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;

import io.sdses.modules.wechat.dao.UserCheckresultDao;
import io.sdses.modules.wechat.entity.UserCheckresultEntity;
import io.sdses.modules.wechat.service.UserCheckresultService;


@Service("userCheckresultService")
public class UserCheckresultServiceImpl extends ServiceImpl<UserCheckresultDao, UserCheckresultEntity> implements UserCheckresultService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<UserCheckresultEntity> page = this.selectPage(
                new Query<UserCheckresultEntity>(params).getPage(),
                new EntityWrapper<UserCheckresultEntity>()
        );

        return new PageUtils(page);
    }

}
