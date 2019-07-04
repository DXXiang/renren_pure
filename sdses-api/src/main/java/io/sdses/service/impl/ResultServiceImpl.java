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

package io.sdses.service.impl;


import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.dao.UserCheckresultDao;
import io.sdses.entity.ResultEntity;
import io.sdses.service.ResultService;

@Service("testService")
public class ResultServiceImpl extends ServiceImpl<UserCheckresultDao, ResultEntity> implements ResultService {
	@Override
	public String createTest(ResultEntity testEntity) {
		//保存或更新用户token
		System.out.println(testEntity.getIdname());
		System.out.println(testEntity);
		insertOrUpdate(testEntity);
	
		return "============================";
	}

}
