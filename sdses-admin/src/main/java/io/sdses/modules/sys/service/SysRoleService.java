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

package io.sdses.modules.sys.service;


import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.service.IService;

import io.sdses.common.utils.PageUtils;
import io.sdses.modules.sys.entity.SysRoleEntity;


/**
 * 角色
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2016年9月18日 上午9:42:52
 */
public interface SysRoleService extends IService<SysRoleEntity> {

	PageUtils queryPage(Map<String, Object> params);

	void save(SysRoleEntity role);

	void update(SysRoleEntity role);
	
	void deleteBatch(Long[] roleIds);
	
	boolean isContainRoleNameForSave(SysRoleEntity role);
	
	boolean isContainRoleNameForUpdate(SysRoleEntity role);
	
	public List<SysRoleEntity> queryRoleListByDept(Long deptID);

}
