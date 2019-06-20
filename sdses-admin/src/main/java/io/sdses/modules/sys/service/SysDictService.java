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
import io.sdses.modules.sys.entity.SysDictEntity;

/**
 * 数据字典
 *
 * @author Mark sunlightcs@gmail.com
 * @since 3.1.0 2018-01-27
 */
public interface SysDictService extends IService<SysDictEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
    List<SysDictEntity> queryAllByType(String type);
    
    Map<String, List<SysDictEntity>> queryAll();
    
	boolean isContainDictForSave(String type, String code);
	
	boolean isContainDictForUpdate(String type, String code, Long id);
	
	public String queryCallType(String value);
	
	public String queryRegion(String value);
	
	public String queryCallLanguage(String value);
	
	public String queryIsPlatform(String value);
	
	public String queryCodeByValType(String value,String type);
	
    public String queryIntelligenceType(String code);
	
	public String queryIntelligencePlace(String code);
	
	public String queryDoneType(String code);

}

