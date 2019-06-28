package io.sdses.modules.wechat.controller;

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

import io.sdses.modules.wechat.entity.UserOpenidEntity;
import io.sdses.modules.wechat.service.UserOpenidService;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.R;



/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-06-28 17:53:52
 */
@RestController
@RequestMapping("wechat/useropenid")
public class UserOpenidController {
    @Autowired
    private UserOpenidService userOpenidService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    @RequiresPermissions("wechat:useropenid:list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = userOpenidService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{openid}")
    @RequiresPermissions("wechat:useropenid:info")
    public R info(@PathVariable("openid") String openid){
        UserOpenidEntity userOpenid = userOpenidService.selectById(openid);

        return R.ok().put("userOpenid", userOpenid);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    @RequiresPermissions("wechat:useropenid:save")
    public R save(@RequestBody UserOpenidEntity userOpenid){
        userOpenidService.insert(userOpenid);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    @RequiresPermissions("wechat:useropenid:update")
    public R update(@RequestBody UserOpenidEntity userOpenid){
        ValidatorUtils.validateEntity(userOpenid);
        userOpenidService.updateAllColumnById(userOpenid);//全部更新
        
        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @RequiresPermissions("wechat:useropenid:delete")
    public R delete(@RequestBody String[] openids){
        userOpenidService.deleteBatchIds(Arrays.asList(openids));

        return R.ok();
    }

}
