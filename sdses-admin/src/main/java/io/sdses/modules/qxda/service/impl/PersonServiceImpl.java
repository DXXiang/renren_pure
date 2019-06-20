package io.sdses.modules.qxda.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import io.sdses.common.utils.ConstantMap;
import io.sdses.common.utils.ConvertUtil;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;
import io.sdses.modules.qxda.dao.PersonDao;
import io.sdses.modules.qxda.entity.PersonChatEntity;
import io.sdses.modules.qxda.entity.PersonEntity;
import io.sdses.modules.qxda.entity.PersonPersonEntity;
import io.sdses.modules.qxda.entity.PersonTelEntity;
import io.sdses.modules.qxda.service.PersonChatService;
import io.sdses.modules.qxda.service.PersonPersonService;
import io.sdses.modules.qxda.service.PersonService;
import io.sdses.modules.qxda.service.PersonTelService;
import io.sdses.modules.sys.entity.SysDictEntity;
import io.sdses.modules.sys.service.SysDictService;


@Service("personService")
public class PersonServiceImpl extends ServiceImpl<PersonDao, PersonEntity> implements PersonService {
	
	@Value("${file.uploadPath}")
	private String uploadPath;
	
	@Autowired
	private PersonDao personDao;
	
	@Autowired
	private PersonTelService personTelService;
	
	@Autowired
	private PersonChatService personChatService;
	
	@Autowired
	private PersonPersonService personPersonService;

    @Autowired
    private SysDictService sysDictService;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
		/*
		 * Page<PersonEntity> page = this.selectPage( new
		 * Query<PersonEntity>(params).getPage(), new EntityWrapper<PersonEntity>() );
		 */
    	Query<PersonEntity> query = new Query<PersonEntity>(params);
		
		String sidx;		//排序字段
		boolean isAsc;		//是否升序
    	Page<PersonEntity> page;
		if(params.get("sidx") == null || params.get("sidx").equals("")){
			params.put("orderByType", 0);
			page = new Page<>(query.getCurrPage(),query.getLimit());// 当前页，总条数 构造 page 对象
		} else {
			sidx = (String) params.get("sidx");
			isAsc = params.get("order").equals("asc") ? true : false;
			params.put("orderByType", 1);
			page = new Page<>(query.getCurrPage(),query.getLimit(),sidx, isAsc);// 当前页，总条数 构造 page 对象
		}
		List<PersonEntity> personList = personDao.queryPageByRole(page, params);

        return new PageUtils(page.setRecords(personList));
    }

	@Override
	public void insertPerson(PersonEntity person) {
		//1、插入主表
		this.insert(person);
		//2、插入通讯工具
		if(person.getTelList() != null && !person.getTelList().isEmpty()) {
			person.getTelList().forEach(p->p.setPersonId(person.getPersonId()));
			personTelService.insertBatch(person.getTelList());
		}
		//3、插入社交工具
		if(person.getChatList() != null && !person.getChatList().isEmpty()) {
			person.getChatList().forEach(p->p.setPersonId(person.getPersonId()));
			personChatService.insertBatch(person.getChatList());
		}
		//4、插入家族关系
		if(person.getFamilyPersonList() != null && !person.getFamilyPersonList().isEmpty()) {
			person.getFamilyPersonList().forEach(p->p.setPersonId(person.getPersonId()));
			personPersonService.insertBatch(person.getFamilyPersonList());
		}
		//5、插入重要关系
		if(person.getMajorPersonList() != null && !person.getMajorPersonList().isEmpty()) {
			person.getMajorPersonList().forEach(p->p.setPersonId(person.getPersonId()));
			personPersonService.insertBatch(person.getMajorPersonList());
		}
	}
	
	@Override
	public void updatePerson(PersonEntity person) {
		//1、更新主表
		this.updateAllColumnById(person);
		//2、更新通讯工具（先删后插）
		personTelService.delete(new EntityWrapper<PersonTelEntity>().eq("person_id", person.getPersonId()));
		if(person.getTelList() != null && !person.getTelList().isEmpty()) {
			person.getTelList().forEach(p->p.setPersonId(person.getPersonId()));
			personTelService.insertBatch(person.getTelList());
		}
		//3、更新社交工具（先删后插）
		personChatService.delete(new EntityWrapper<PersonChatEntity>().eq("person_id", person.getPersonId()));
		if(person.getChatList() != null && !person.getChatList().isEmpty()) {
			person.getChatList().forEach(p->p.setPersonId(person.getPersonId()));
			personChatService.insertBatch(person.getChatList());
		}
		//4、更新关系（先删后插）
			//1、删除关系数据
		personPersonService.delete(new EntityWrapper<PersonPersonEntity>().eq("person_id", person.getPersonId()));
			//2、插入家族关系
		if(person.getFamilyPersonList() != null && !person.getFamilyPersonList().isEmpty()) {
			person.getFamilyPersonList().forEach(p->p.setPersonId(person.getPersonId()));
			personPersonService.insertBatch(person.getFamilyPersonList());
		}
			//3、插入重要关系
		if(person.getMajorPersonList() != null && !person.getMajorPersonList().isEmpty()) {
			person.getMajorPersonList().forEach(p->p.setPersonId(person.getPersonId()));
			personPersonService.insertBatch(person.getMajorPersonList());
		}
	}
	
	@Override
	public void deletePerson(List<Long> personIds) {
		PersonEntity entity = new PersonEntity();
		entity.setDelFlag(-1);
		this.update(entity, new EntityWrapper<PersonEntity>().in("person_id", personIds));
	}

	@Override
	public PersonEntity viewPerson(Long personId) {
		PersonEntity personEntity = this.selectById(personId);
		personEntity.setTelList(this.queryPersonTelByPersonId(personId));
		personEntity.setChatList(this.queryPersonChatByPersonId(personId));
		//家族关系
		List<PersonPersonEntity> familyPersonList = personPersonService
				.selectList(new EntityWrapper<PersonPersonEntity>().eq("person_id", personId).eq("relation_type", 1));
		for(PersonPersonEntity entity : familyPersonList) {
			PersonEntity relationPersonEntity = this.selectById(entity.getRelationPersonId());
			entity.setName(relationPersonEntity.getName());
			entity.setSex(relationPersonEntity.getSex());
			entity.setNation(relationPersonEntity.getNation());
			entity.setNumId(relationPersonEntity.getNumId());
		}
		personEntity.setFamilyPersonList(familyPersonList);
		
		//重要关系
		List<PersonPersonEntity> majorPersonEntityList = personPersonService
				.selectList(new EntityWrapper<PersonPersonEntity>().eq("person_id", personId).eq("relation_type", 2));
		for(PersonPersonEntity entity : majorPersonEntityList) {
			PersonEntity relationPersonEntity = this.selectById(entity.getRelationPersonId());
			entity.setName(relationPersonEntity.getName());
			entity.setSex(relationPersonEntity.getSex());
			entity.setNation(relationPersonEntity.getNation());
			entity.setNumId(relationPersonEntity.getNumId());
		}
		personEntity.setMajorPersonList(majorPersonEntityList);
		return personEntity;
	}
	

	@Override
	public PersonEntity viewPersonByNumId(String numId) {
		PersonEntity personEntity = this.selectOne(new EntityWrapper<PersonEntity>().eq("num_id", numId).eq("del_flag", "0"));
		if(personEntity != null) {
			personEntity.setTelList(this.queryPersonTelByPersonId(personEntity.getPersonId()));
			personEntity.setChatList(this.queryPersonChatByPersonId(personEntity.getPersonId()));
		}
		return personEntity;
	}

	@Override
	public List<PersonTelEntity> queryPersonTelByPersonId(Long personId) {
		return personDao.queryPersonTelByPersonId(personId);
	}

	@Override
	public List<PersonChatEntity> queryPersonChatByPersonId(Long personId) {
		return personDao.queryPersonChatByPersonId(personId);
	}

	@Override
	public Map<String, Object> convertToWordData(Long personId) {
		PersonEntity entity = this.viewPerson(personId);
   	 
        //格式化数据
        //性别
        Map<String, String> sexMap = new HashMap<String, String>();
        List<SysDictEntity> sexList = sysDictService.selectList(new EntityWrapper<SysDictEntity>().eq("type", "sex"));
        for(SysDictEntity sex : sexList) {
        	sexMap.put(sex.getCode(), sex.getValue());
        }
        //重点人员类型
        Map<String, String> keyPersonTypeMap = new HashMap<String, String>();
        List<SysDictEntity> keyPersonTypeList = sysDictService.selectList(new EntityWrapper<SysDictEntity>().eq("type", "keyPersonType"));
        for(SysDictEntity keyPersonType : keyPersonTypeList) {
        	keyPersonTypeMap.put(keyPersonType.getCode(), keyPersonType.getValue());
        }
        //宗教信仰
        Map<String, String> religionMap = new HashMap<String, String>();
        List<SysDictEntity> religionList = sysDictService.selectList(new EntityWrapper<SysDictEntity>().eq("type", "religion"));
        for(SysDictEntity religion : religionList) {
        	religionMap.put(religion.getCode(), religion.getValue());
        }
        //涉恐类型
        Map<String, String> fearTypeMap = new HashMap<String, String>();
        List<SysDictEntity> fearTypeList = sysDictService.selectList(new EntityWrapper<SysDictEntity>().eq("type", "fearType"));
        for(SysDictEntity fearType : fearTypeList) {
        	fearTypeMap.put(fearType.getCode(), fearType.getValue());
        }
        //社交工具
        Map<String, String> chatTypeMap = new HashMap<String, String>();
        List<SysDictEntity> chatTypeList = sysDictService.selectList(new EntityWrapper<SysDictEntity>().eq("type", "chatType"));
        for(SysDictEntity chatType : chatTypeList) {
        	chatTypeMap.put(chatType.getCode(), chatType.getValue());
        }
        //1、性别
        entity.setSex(sexMap.get(entity.getSex()));
        //2、婚姻状况
        entity.setIsMarried(ConstantMap.isMarriedMap.get(entity.getIsMarried()));
        //3、重点人员类型
        entity.setPersonType(keyPersonTypeMap.get(entity.getPersonType()));
        //4、宗教信仰
        entity.setReligion(religionMap.get(entity.getReligion()));
        //5、涉恐类型
        entity.setFearType(fearTypeMap.get(entity.getFearType()));
        //6、人员类型
        entity.setUserType(ConstantMap.userTypeMap.get(entity.getUserType()));
        //7、是否有前科
        entity.setIsSin(ConstantMap.isSinMap.get(entity.getIsSin()));
        //8、社交工具 - 类型
        entity.getChatList().forEach(c->c.setType(chatTypeMap.get(c.getType())));
        //9、家族关系 - 性别
        entity.getFamilyPersonList().forEach(f->f.setSex(sexMap.get(f.getSex())));
        //10、重要关系 - 性别
        entity.getMajorPersonList().forEach(m->m.setSex(sexMap.get(m.getSex())));
        
        Map<String, Object> dataMap = new HashMap<String, Object>();
        try {
        	if(StringUtils.isNotBlank(entity.getPathHead())) {
				String filePath = uploadPath + entity.getPathHead().replace("../../uploadFile/", "");
				// 图片转base64
            	entity.setPathHead(ConvertUtil.imageToBase64(filePath));
        	}
			dataMap = ConvertUtil.objectToMap(entity);
		} catch (IllegalAccessException e1) {
			e1.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
        return dataMap;
	}

}
