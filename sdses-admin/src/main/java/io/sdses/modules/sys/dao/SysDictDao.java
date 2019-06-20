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

package io.sdses.modules.sys.dao;

import io.sdses.modules.sys.entity.SysDictEntity;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * 数据字典
 *
 * @author Mark sunlightcs@gmail.com
 * @since 3.1.0 2018-01-27
 */
public interface SysDictDao extends BaseMapper<SysDictEntity> {
	String queryIntelligenceType(String code);
	String queryOpinion(String code);
	/**
	 * 查询机构名称是否重复
	 * @param deptName  部门名称
	 */
	List<Long> isContainDictForSave(@Param("type") String type, @Param("code")String code);
	/**
     * 查询机构名称是否重复
	 * @param deptName  部门名称
	 * @param deptID  部门ID
	 */
	List<Long> isContainDictForUpdate(@Param("type") String type, @Param("code")String code, @Param("id")Long id);
	String queryCallType(String value);
	String queryRegion(String value);
	String queryCallLanguage(String value);
	String queryIsPlatform(String value);
	
	public String queryIntelligencePlace(String code);
	
	public String queryDoneType(String code);

}
