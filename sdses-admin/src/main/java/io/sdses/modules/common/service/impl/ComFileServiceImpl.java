package io.sdses.modules.common.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;

import io.sdses.modules.common.dao.ComFileDao;
import io.sdses.modules.common.entity.ComFileEntity;
import io.sdses.modules.common.service.ComFileService;


@Service("comFileService")
public class ComFileServiceImpl extends ServiceImpl<ComFileDao, ComFileEntity> implements ComFileService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<ComFileEntity> page = this.selectPage(
                new Query<ComFileEntity>(params).getPage(),
                new EntityWrapper<ComFileEntity>()
        );

        return new PageUtils(page);
    }

}
