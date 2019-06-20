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

import io.sdses.modules.sys.entity.SysDeptEntity;
import io.sdses.modules.sys.entity.SysUserEntity;
import io.sdses.modules.sys.service.SysDeptService;

import org.apache.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Controller公共组件
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2016年11月9日 下午9:42:26
 */
public abstract class AbstractController {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private SysDeptService sysDeptService;
	
	protected SysUserEntity getUser() {
		SysUserEntity sysUserEntity = (SysUserEntity) SecurityUtils.getSubject().getPrincipal();
		SysDeptEntity dept = sysDeptService.selectById(sysUserEntity.getDeptId());
		sysUserEntity.setDeptName(dept.getName());
		sysUserEntity.setDeptType(dept.getType());
		return sysUserEntity;
	}

	protected Long getUserId() {
		return getUser().getUserId();
	}

	protected Long getDeptId() {
		return getUser().getDeptId();
	}
}
