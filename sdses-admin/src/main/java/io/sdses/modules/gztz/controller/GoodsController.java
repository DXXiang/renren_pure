package io.sdses.modules.gztz.controller;

import java.util.Arrays;
import java.util.Map;

import io.sdses.common.validator.ValidatorUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.sdses.modules.gztz.entity.GoodsEntity;
import io.sdses.modules.gztz.service.GoodsService;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.R;



/**
 * 商品管理
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-06-20 16:33:47
 */
@RestController
@RequestMapping("gztz/goods")
public class GoodsController {
    @Autowired
    private GoodsService goodsService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    @RequiresPermissions("gztz:goods:list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = goodsService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{goodsId}")
    @RequiresPermissions("gztz:goods:info")
    public R info(@PathVariable("goodsId") Long goodsId){
        GoodsEntity goods = goodsService.selectById(goodsId);

        return R.ok().put("goods", goods);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    @RequiresPermissions("gztz:goods:save")
    public R save(@RequestBody GoodsEntity goods){
        goodsService.insert(goods);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    @RequiresPermissions("gztz:goods:update")
    public R update(@RequestBody GoodsEntity goods){
        ValidatorUtils.validateEntity(goods);
        goodsService.updateAllColumnById(goods);//全部更新
        
        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @RequiresPermissions("gztz:goods:delete")
    public R delete(@RequestBody Long[] goodsIds){
        goodsService.deleteBatchIds(Arrays.asList(goodsIds));

        return R.ok();
    }

}
