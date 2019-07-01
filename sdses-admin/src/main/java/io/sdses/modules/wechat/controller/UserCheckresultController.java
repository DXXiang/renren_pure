package io.sdses.modules.wechat.controller;

import java.util.Arrays;
import java.util.Map;

import io.sdses.common.validator.ValidatorUtils;
<<<<<<< HEAD
import io.sdses.modules.wechat.service.ExcelExportService;
import io.sdses.modules.wechat.view.ExcelView;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
=======

>>>>>>> 2e1822a4b6556d731e96ef6d4531e80a896e606c
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.sdses.modules.wechat.entity.UserCheckresultEntity;
import io.sdses.modules.wechat.service.UserCheckresultService;
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
@RequestMapping("wechat/usercheckresult")
public class UserCheckresultController {
    @Autowired
    private UserCheckresultService userCheckresultService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    @RequiresPermissions("wechat:usercheckresult:list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = userCheckresultService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{id}")
    @RequiresPermissions("wechat:usercheckresult:info")
    public R info(@PathVariable("id") Long id){
        UserCheckresultEntity userCheckresult = userCheckresultService.selectById(id);

        return R.ok().put("userCheckresult", userCheckresult);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    @RequiresPermissions("wechat:usercheckresult:save")
    public R save(@RequestBody UserCheckresultEntity userCheckresult){
        userCheckresultService.insert(userCheckresult);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    @RequiresPermissions("wechat:usercheckresult:update")
    public R update(@RequestBody UserCheckresultEntity userCheckresult){
        ValidatorUtils.validateEntity(userCheckresult);
        userCheckresultService.updateAllColumnById(userCheckresult);//全部更新
        
        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @RequiresPermissions("wechat:usercheckresult:delete")
    public R delete(@RequestBody Long[] ids){
        userCheckresultService.deleteBatchIds(Arrays.asList(ids));

        return R.ok();
    }

}
