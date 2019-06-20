package io.sdses.modules.qxda.dao;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.Page;

import io.sdses.modules.qxda.entity.PersonChatEntity;
import io.sdses.modules.qxda.entity.PersonEntity;
import io.sdses.modules.qxda.entity.PersonTelEntity;

/**
 * 【明细表】涉案人员表
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-02 15:04:14
 */
public interface PersonDao extends BaseMapper<PersonEntity> {

	List<PersonEntity> queryPageByRole(Page<PersonEntity> page, Map<String, Object> params);

	List<PersonTelEntity> queryPersonTelByPersonId(Long personId);

	List<PersonChatEntity> queryPersonChatByPersonId(Long personId);
	
}
