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


import io.sdses.common.annotation.SysLog;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.R;
import io.sdses.common.validator.Assert;
import io.sdses.common.validator.ValidatorUtils;
import io.sdses.common.validator.group.AddGroup;
import io.sdses.common.validator.group.UpdateGroup;
import io.sdses.modules.sys.entity.SysUserEntity;
import io.sdses.modules.sys.service.SysUserRoleService;
import io.sdses.modules.sys.service.SysUserService;
import io.sdses.modules.sys.shiro.ShiroUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * 系统用户
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2016年10月31日 上午10:40:10
 */
@RestController
@RequestMapping("/sys/user")
public class SysUserController extends AbstractController {
	@Autowired
	private SysUserService sysUserService;
	@Autowired
	private SysUserRoleService sysUserRoleService;
	@Value("${user.defaultPassword}")
	private String defaultPassword;
	 
	/**
	 * 所有用户列表
	 */
	@RequestMapping("/list")
	@RequiresPermissions("sys:user:list")
	public R list(@RequestParam Map<String, Object> params){
		PageUtils page = sysUserService.queryPage(params);

		return R.ok().put("page", page);
	}
	
	/**
	 * 获取登录的用户信息
	 */
	@RequestMapping("/info")
	public R info(){
		return R.ok().put("user", getUser());
	}
	
	/**
	 * 修改登录用户密码
	 */
	@SysLog("修改密码")
	@RequestMapping("/password")
	public R password(@RequestParam Map<String, Object> params){
		String password = (String) params.get("password");
		String newPassword = (String) params.get("newPassword");
		Assert.isBlank(newPassword, "新密码不为能空");

		//原密码
		password = ShiroUtils.sha256(password, getUser().getSalt());
		//新密码
		newPassword = ShiroUtils.sha256(newPassword, getUser().getSalt());
				
		//更新密码
		boolean flag = sysUserService.updatePassword(getUserId(), password, newPassword);
		if(!flag){
			return R.error("原密码不正确");
		}
		
		return R.ok();
	}

	/**
	 * 用户信息
	 */
	@RequestMapping("/info/{userId}")
	@RequiresPermissions("sys:user:info")
	public R info(@PathVariable("userId") Long userId){
		SysUserEntity user = sysUserService.selectById(userId);
		
		//获取用户所属的角色列表
		List<Long> roleIdList = sysUserRoleService.queryRoleIdList(userId);
		user.setRoleIdList(roleIdList);
		return R.ok().put("user", user);
	}
	
	/**
	 * 保存用户
	 */
	@SysLog("保存用户")
	@RequestMapping("/save")
	@RequiresPermissions("sys:user:save")
	public R save(@RequestBody SysUserEntity user){
		ValidatorUtils.validateEntity(user, AddGroup.class);
		if(sysUserService.isContainUserNameForSave(user.getUsername())){
			return R.error("用户名称已存在");
		}
		if(!StringUtils.isNotBlank(user.getPassword())){
			user.setPassword(defaultPassword);
		}
		sysUserService.save(user);
		return R.ok();
	}
	
	/**
	 * 修改用户
	 */
	@SysLog("修改用户")
	@RequestMapping("/update")
	@RequiresPermissions("sys:user:update")
	public R update(@RequestBody SysUserEntity user){
		//判断用户是否被删除
		SysUserEntity dbUser = sysUserService.selectById(user.getUserId());
		if(dbUser == null || dbUser.getStatus() == 2){
			return R.error("该用户已被删除，无法修改！");
		}
				
		ValidatorUtils.validateEntity(user, UpdateGroup.class);
		
		//判断机构名称是否重复
		if(sysUserService.isContainUserNameForUpdate(user.getUsername(), user.getUserId())){
			return R.error("用户名称已存在");
		}
		sysUserService.update(user);
		
		//当前用户修改的是自己的 信息
		SysUserEntity sysUserEntity = (SysUserEntity) SecurityUtils.getSubject().getPrincipal();
		if(user.getUserId() == sysUserEntity.getUserId()){
			sysUserEntity.setRealname(user.getRealname());
			sysUserEntity.setSex(user.getSex());
			sysUserEntity.setMobile(user.getMobile());
			sysUserEntity.setPathHead(user.getPathHead());
		}
		
		return R.ok();
	}
	
	/**
	 * 删除用户
	 */
	@SysLog("删除用户")
	@RequestMapping("/delete")
	@RequiresPermissions("sys:user:delete")
	public R delete(@RequestBody Long[] userIds){
		if(ArrayUtils.contains(userIds, 1L)){
			return R.error("系统管理员不能删除");
		}
		
		if(ArrayUtils.contains(userIds, getUserId())){
			return R.error("当前用户不能删除");
		}
        //逻辑删除，将status置为2
		sysUserService.updateStatus(Arrays.asList(userIds));
		//删除关联表中记录
		sysUserService.deleteUserRole(userIds);
		return R.ok();
	}
}
