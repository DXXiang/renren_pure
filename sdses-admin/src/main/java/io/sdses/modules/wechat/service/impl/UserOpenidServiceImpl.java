package io.sdses.modules.wechat.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;

import io.sdses.modules.wechat.dao.UserOpenidDao;
import io.sdses.modules.wechat.entity.UserOpenidEntity;
import io.sdses.modules.wechat.service.UserOpenidService;


@Service("userOpenidService")
public class UserOpenidServiceImpl extends ServiceImpl<UserOpenidDao, UserOpenidEntity> implements UserOpenidService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<UserOpenidEntity> page = this.selectPage(
                new Query<UserOpenidEntity>(params).getPage(),
                new EntityWrapper<UserOpenidEntity>()
        );

        return new PageUtils(page);
    }

}
