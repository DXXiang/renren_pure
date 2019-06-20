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

import java.util.ArrayList;
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

import io.sdses.common.annotation.SysLog;
import io.sdses.common.utils.Constant;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.R;
import io.sdses.common.validator.ValidatorUtils;
import io.sdses.modules.sys.entity.SysRoleEntity;
import io.sdses.modules.sys.entity.SysUserEntity;
import io.sdses.modules.sys.service.SysRoleDeptService;
import io.sdses.modules.sys.service.SysRoleMenuService;
import io.sdses.modules.sys.service.SysRoleService;
import io.sdses.modules.sys.service.SysUserRoleService;
import io.sdses.modules.sys.shiro.ShiroUtils;

/**
 * 角色管理
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2016年11月8日 下午2:18:33
 */
@RestController
@RequestMapping("/sys/role")
public class SysRoleController extends AbstractController {
	@Autowired
	private SysRoleService sysRoleService;
	@Autowired
	private SysRoleMenuService sysRoleMenuService;
	@Autowired
	private SysRoleDeptService sysRoleDeptService;
	@Autowired
	private SysUserRoleService sysUserRoleService;
	/**
	 * 角色列表
	 */
	@RequestMapping("/list")
	@RequiresPermissions("sys:role:list")
	public R list(@RequestParam Map<String, Object> params){
		PageUtils page = sysRoleService.queryPage(params);

		return R.ok().put("page", page);
	}
	
	/**
	 * 角色列表
	 */
	@RequestMapping("/select")
	@RequiresPermissions("sys:role:select")
	public R select(){
	    //当前登陆用户
		SysUserEntity user = ShiroUtils.getUserEntity();
		List<SysRoleEntity> list = null;
        if(user.getUserId() != Constant.SUPER_ADMIN) {
//        	List<Long> idList = user.getRoleIdList();
        	//查询用户所在组织机构及下级组织机构角色
        	list = sysRoleService.queryRoleListByDept(user.getDeptId());
        } else {
        	list = sysRoleService.selectList(null);
        }
		return R.ok().put("list", list);
	}
	
	/**
	 * 角色信息
	 */
	@RequestMapping("/info/{roleId}")
	@RequiresPermissions("sys:role:info")
	public R info(@PathVariable("roleId") Long roleId){
		SysRoleEntity role = sysRoleService.selectById(roleId);
		
		//查询角色对应的菜单
		List<Long> menuIdList = sysRoleMenuService.queryMenuIdList(roleId);
		role.setMenuIdList(menuIdList);

		//查询角色对应的部门
		List<Long> deptIdList = sysRoleDeptService.queryDeptIdList(new Long[]{roleId});
		role.setDeptIdList(deptIdList);
		
		return R.ok().put("role", role);
	}
	
	/**
	 * 保存角色
	 */
	@SysLog("保存角色")
	@RequestMapping("/save")
	@RequiresPermissions("sys:role:save")
	public R save(@RequestBody SysRoleEntity role){
		ValidatorUtils.validateEntity(role);
		//判断角色名称是否重复（同机构）
		if(sysRoleService.isContainRoleNameForSave(role)){
			return R.error("角色名称已存在");
		}
		sysRoleService.save(role);
		
		return R.ok();
	}
	
	/**
	 * 修改角色
	 */
	@SysLog("修改角色")
	@RequestMapping("/update")
	@RequiresPermissions("sys:role:update")
	public R update(@RequestBody SysRoleEntity role){
		//判断角色是否被删除
		SysRoleEntity dbRole = sysRoleService.selectById(role.getRoleId());
		if(dbRole == null){
			return R.error("该角色已被删除，无法修改！");
		}
		
		ValidatorUtils.validateEntity(role);
		//判断角色名称是否重复（同机构）
		if(sysRoleService.isContainRoleNameForUpdate(role)){
			return R.error("角色名称已存在");
		}
		sysRoleService.update(role);
		
		return R.ok();
	}
	
	/**
	 * 删除角色
	 */
	@SysLog("删除角色")
	@RequestMapping("/delete")
	@RequiresPermissions("sys:role:delete")
	public R delete(@RequestBody Long[] roleIds){
		List<Long> arrList = Arrays.asList(roleIds);
        List<Long> roleIdList = new ArrayList<Long>(arrList);
        boolean flag = true;
        String msg="";
		//查询角色是否关联用户
		for(int i=0;i<roleIdList.size();i++){
			List<Long> userList = sysUserRoleService.queryUserIdList(roleIdList.get(i));
			if(userList.size()>0){
				msg=msg+roleIdList.get(i)+";";
				roleIdList.remove(i);	
				flag=false;
			}			
		}
		if(!flag){
			return R.error("存在关联用户，无法删除");
			 
			
		}
	roleIds = (Long[])roleIdList.toArray(new Long[roleIdList.size()]); 
	if(roleIds.length>0&&roleIds!=null){
	    sysRoleService.deleteBatch(roleIds);
	    sysRoleDeptService.deleteBatch(roleIds);
	}
	   
	return R.ok();    
	}
}
