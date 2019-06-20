package io.sdses.modules.common.service;

import com.baomidou.mybatisplus.service.IService;
import io.sdses.common.utils.PageUtils;
import io.sdses.modules.common.entity.ComFileEntity;

import java.util.Map;

/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-04 09:02:00
 */
public interface ComFileService extends IService<ComFileEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

