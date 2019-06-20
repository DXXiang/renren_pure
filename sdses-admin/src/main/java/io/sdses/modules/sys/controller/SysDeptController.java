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

import java.util.HashMap;
import java.util.List;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.sdses.common.utils.Constant;
import io.sdses.common.utils.R;
import io.sdses.common.validator.ValidatorUtils;
import io.sdses.common.validator.group.AddGroup;
import io.sdses.common.validator.group.UpdateGroup;
import io.sdses.modules.sys.entity.SysDeptEntity;
import io.sdses.modules.sys.service.SysDeptService;


/**
 * 部门管理
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017-06-20 15:23:47
 */
@RestController
@RequestMapping("/sys/dept")
public class SysDeptController extends AbstractController {
	@Autowired
	private SysDeptService sysDeptService;
	
	/**
	 * 列表
	 */
	@RequestMapping("/list")
	@RequiresPermissions("sys:dept:list")
	public List<SysDeptEntity> list(){
		List<SysDeptEntity> deptList = sysDeptService.queryList(new HashMap<String, Object>());

		return deptList;
	}

	/**
	 * 选择部门(添加、修改菜单)
	 */
	@RequestMapping("/select")
	@RequiresPermissions("sys:dept:select")
	public R select(){
		List<SysDeptEntity> deptList = sysDeptService.queryList(new HashMap<String, Object>());

		//添加一级部门
		if(getUserId() == Constant.SUPER_ADMIN){
			SysDeptEntity root = new SysDeptEntity();
			root.setDeptId(0L);
			root.setName("一级部门");
			root.setParentId(-1L);
			root.setOpen(true);
			deptList.add(root);
		}

		return R.ok().put("deptList", deptList);
	}

	/**
	 * 上级部门Id(管理员则为0)
	 */
	@RequestMapping("/info")
	@RequiresPermissions("sys:dept:list")
	public R info(){
		long deptId = 0;
		if(getUserId() != Constant.SUPER_ADMIN){
			List<SysDeptEntity> deptList = sysDeptService.queryList(new HashMap<String, Object>());
			Long parentId = null;
			for(SysDeptEntity sysDeptEntity : deptList){
				if(parentId == null){
					parentId = sysDeptEntity.getParentId();
					continue;
				}

				if(parentId > sysDeptEntity.getParentId().longValue()){
					parentId = sysDeptEntity.getParentId();
				}
			}
			deptId = parentId;
		}

		return R.ok().put("deptId", deptId);
	}
	
	/**
	 * 信息
	 */
	@RequestMapping("/info/{deptId}")
	public R info(@PathVariable("deptId") Long deptId){
		SysDeptEntity dept = sysDeptService.selectById(deptId);
		
		return R.ok().put("dept", dept);
	}
	
	/**
	 * 保存
	 */
	@RequestMapping("/save")
	@RequiresPermissions("sys:dept:save")
	public R save(@RequestBody SysDeptEntity dept){
		ValidatorUtils.validateEntity(dept, AddGroup.class);
		//机构名称过滤空格
		dept.setName(dept.getName().trim());
		//判断机构名称是否重复
		if(sysDeptService.isContainDeptNameForSave(dept.getName())){
			return R.error("机构名称已存在");
		}
		
		sysDeptService.insert(dept);		
		return R.ok();
	}
	
	/**
	 * 修改
	 */
	@RequestMapping("/update")
	@RequiresPermissions("sys:dept:update")
	public R update(@RequestBody SysDeptEntity dept){
		//判断机构是否被删除
		SysDeptEntity dbDept = sysDeptService.selectById(dept.getDeptId());
		if(dbDept == null || dbDept.getDelFlag() == -1){
			return R.error("该机构已被删除，无法修改！");
		}
		
		ValidatorUtils.validateEntity(dept, UpdateGroup.class);
		//机构名称过滤空格
		dept.setName(dept.getName().trim());
		//判断机构名称是否重复
		if(sysDeptService.isContainDeptNameForUpdate(dept.getName(), dept.getDeptId())){
			return R.error("机构名称已存在");
		}
 		if(dept.getDeptId().equals(dept.getParentId())){
			return R.error("请选择其他机构作为上级机构");
		}
		sysDeptService.updateById(dept);
		
		return R.ok();
	}
	
	/**
	 * 删除
	 */
	@RequestMapping("/delete")
	@RequiresPermissions("sys:dept:delete")
	public R delete(long deptId){
		//自己不能删除自己
		if(getDeptId() == deptId) {
			return R.error("不能删除自己所在部门");
		}
		//判断是否有子部门
		List<Long> deptList = sysDeptService.queryDetpIdList(deptId);
		if(deptList.size() > 0){
			return R.error("请先删除子部门");
		}
        //判断是否有有用户
		List<Long> userList = sysDeptService.queryUserIdList(deptId);
		if(userList.size() > 0){
			return R.error("请先删除机构下的用户");
		}
		//判断是否有有角色
		List<Long> roleList = sysDeptService.queryRoleIdList(deptId);
		if(roleList.size() > 0){
			return R.error("请先删除机构下的角色");
		}
		sysDeptService.deleteById(deptId);
		
		return R.ok();
	}
}
