package io.sdses.modules.qxda.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.service.IService;

import io.sdses.common.utils.PageUtils;
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
public interface PersonService extends IService<PersonEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
	/**
	  *  新增
	 * @param personEntity
	 */
	void insertPerson(PersonEntity person);
	
	/**
	 * 更新
	 * @param person
	 */
	void updatePerson(PersonEntity person);
	
	/**
	 * 删除
	 * @param asList
	 */
	void deletePerson(List<Long> asList);

	/**
	 * 查询
	 * @param personId
	 * @return
	 */
	PersonEntity viewPerson(Long personId);
	
	/**
	 * 查询（根据身份证号）
	 * @param numId
	 * @return
	 */
	PersonEntity viewPersonByNumId(String numId);
	
	/**
	 * 获取通讯工具列表
	 * @param personId
	 * @return
	 */
	List<PersonTelEntity> queryPersonTelByPersonId(Long personId);
	
	/**
	 * 获取社交工具列表
	 * @param personId
	 * @return
	 */
	List<PersonChatEntity> queryPersonChatByPersonId(Long personId);
	
	/**
	 * 转换为 word需要的 数据
	 * @param personId
	 * @return
	 */
	Map<String, Object> convertToWordData(Long personId);
}

