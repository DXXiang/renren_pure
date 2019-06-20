package io.sdses.modules.gztz.service;

import com.baomidou.mybatisplus.service.IService;
import io.sdses.common.utils.PageUtils;
import io.sdses.modules.gztz.entity.GoodsEntity;

import java.util.Map;

/**
 * 商品管理
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-06-20 16:33:47
 */
public interface GoodsService extends IService<GoodsEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

