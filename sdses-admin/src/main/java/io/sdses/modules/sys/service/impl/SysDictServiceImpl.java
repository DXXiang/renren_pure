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

package io.sdses.modules.sys.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;
import io.sdses.modules.sys.dao.SysDictDao;
import io.sdses.modules.sys.entity.SysDictEntity;
import io.sdses.modules.sys.service.SysDictService;

@Service("sysDictService")
public class SysDictServiceImpl extends ServiceImpl<SysDictDao, SysDictEntity> implements SysDictService {
	@Autowired
	private SysDictDao sysDictDao;

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		String name = (String) params.get("name");

		Page<SysDictEntity> page = this.selectPage(new Query<SysDictEntity>(params).getPage(),
				new EntityWrapper<SysDictEntity>().like(StringUtils.isNotBlank(name), "name", name)
                    .orderBy("type", true)
                    .orderBy("orderNum", true)
        );

        return new PageUtils(page);
    }

	@Override
	public List<SysDictEntity> queryAllByType(String type) {
		return this.selectList(new EntityWrapper<SysDictEntity>()
                .eq(StringUtils.isNotBlank(type),"type", type).orderBy("code + 0"));
	}
	
	@Override
	public Map<String, List<SysDictEntity>> queryAll() {

		Map<String, List<SysDictEntity>> dictListMap = new HashMap<String, List<SysDictEntity>>();
		List<SysDictEntity> allDictList = this.selectList(new EntityWrapper<SysDictEntity>().orderBy("code + 0"));
		for (SysDictEntity entity : allDictList) {
			List<SysDictEntity> dictList = dictListMap.get(entity.getType());
			if (dictList == null) {
				dictList = new ArrayList<SysDictEntity>();
				dictListMap.put(entity.getType(), dictList);
			}
			dictList.add(entity);
		}
		return dictListMap;
	}

	public String queryIntelligenceType(String code) {
		return sysDictDao.queryIntelligenceType(code);
		
	}
	
	public String queryCallType(String value) {
		return sysDictDao.queryCallType(value);
		
	}
	
	public String queryRegion(String value) {
		return sysDictDao.queryRegion(value);
		
	}
	
	public String queryCallLanguage(String value) {
		return sysDictDao.queryCallLanguage(value);
		
	}
	
	public String queryIsPlatform(String value) {
		return sysDictDao.queryIsPlatform(value);
		
	}
	

	public String queryOpinion(String code) {
		return sysDictDao.queryOpinion(code);
		
	}
	public boolean isContainDictForSave(String type, String code){
		List<Long> userList = baseMapper.isContainDictForSave(type, code);
		if(userList.size()<=0){
			return false;
		}
		return true;
	}
	
	public boolean isContainDictForUpdate(String type, String code, Long id){
		List<Long> userList = baseMapper.isContainDictForUpdate(type, code, id);
		if(userList.size()<=0){
			return false;
		}
		return true;
	}

	@Override
	public String queryCodeByValType(String value,String type) {
		List<SysDictEntity> sysDictEntities = this.selectList(new EntityWrapper<SysDictEntity>()
                .eq(StringUtils.isNotBlank(type),"type", type)
                .eq(StringUtils.isNotBlank(value),"value", value));
		return (sysDictEntities.size()<=0?new SysDictEntity():sysDictEntities.get(0)).getCode();
	}
	
	public String queryIntelligencePlace(String code){
		return sysDictDao.queryIntelligencePlace(code);
	}
	
	public String queryDoneType(String code){
		return sysDictDao.queryDoneType(code);
	}

}