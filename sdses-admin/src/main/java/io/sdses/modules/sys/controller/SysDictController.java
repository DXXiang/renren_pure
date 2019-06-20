/**
 * Copyright 2018 神思电子 http://www.sdses.com
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package io.sdses.modules.sys.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.R;
import io.sdses.common.validator.ValidatorUtils;
import io.sdses.modules.sys.entity.SysDictEntity;
import io.sdses.modules.sys.service.SysDictService;

/**
 * 数据字典
 *
 * @author Mark sunlightcs@gmail.com
 * @since 3.1.0 2018-01-27
 */
@RestController
@RequestMapping("sys/dict")
public class SysDictController {
    @Autowired
    private SysDictService sysDictService;
    
    /**
     * 字典列表
     * 根据type查询
     */
    @RequestMapping("/listByType")
    public R listByType(@RequestParam String type){
        List<SysDictEntity> dictList = sysDictService.queryAllByType(type);

        return R.ok().put("dictList", dictList);
    }
    
    /**
     * 字典列表
     * 根据type查询
     */
    @RequestMapping("/listAll")
    public R listAll(){
    	Map<String, List<SysDictEntity>> dictListMap = sysDictService.queryAll();
        return R.ok().put("dictListMap", dictListMap);
    }

    /**
     * 列表
     */
    @RequestMapping("/list")
    @RequiresPermissions("sys:dict:list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = sysDictService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{id}")
    @RequiresPermissions("sys:dict:info")
    public R info(@PathVariable("id") Long id){
        SysDictEntity dict = sysDictService.selectById(id);

        return R.ok().put("dict", dict);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    @RequiresPermissions("sys:dict:save")
    public R save(@RequestBody SysDictEntity dict){
        //校验类型
        ValidatorUtils.validateEntity(dict);
        if(sysDictService.isContainDictForSave(dict.getType(), dict.getCode())){
			return R.error("记录已存在");
		}
        sysDictService.insert(dict);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    @RequiresPermissions("sys:dict:update")
    public R update(@RequestBody SysDictEntity dict){
    	//判断角色是否被删除
		SysDictEntity dbDict = sysDictService.selectById(dict.getId());
		if(dbDict == null){
			return R.error("该字典值已被删除，无法修改！");
		}
        //校验类型
        ValidatorUtils.validateEntity(dict);
        if(sysDictService.isContainDictForUpdate(dict.getType(), dict.getCode(), dict.getId())){
			return R.error("记录已存在");
		}
        sysDictService.updateById(dict);

        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @RequiresPermissions("sys:dict:delete")
    public R delete(@RequestBody Long[] ids){
        sysDictService.deleteBatchIds(Arrays.asList(ids));

        return R.ok();
    }

}
