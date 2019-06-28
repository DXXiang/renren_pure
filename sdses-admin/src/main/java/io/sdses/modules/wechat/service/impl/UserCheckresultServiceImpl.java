package io.sdses.modules.wechat.service.impl;

import io.sdses.modules.wechat.entity.PersonAuthed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.Query;

import io.sdses.modules.wechat.dao.UserCheckresultDao;
import io.sdses.modules.wechat.entity.UserCheckresultEntity;
import io.sdses.modules.wechat.service.UserCheckresultService;


@Service("userCheckresultService")
public class UserCheckresultServiceImpl extends ServiceImpl<UserCheckresultDao, UserCheckresultEntity> implements UserCheckresultService {

    @Autowired
    private UserCheckresultDao userCheckresultDao = null;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Page<UserCheckresultEntity> page = this.selectPage(
                new Query<UserCheckresultEntity>(params).getPage(),
                new EntityWrapper<UserCheckresultEntity>()
        );

        return new PageUtils(page);
    }

    @Override
    public List<PersonAuthed> getAuthedPersons() {
        List<UserCheckresultEntity> fullMessageAuthedPersons = userCheckresultDao.selectAuthedPersons();
        Set<UserCheckresultEntity> set = new TreeSet<>(fullMessageAuthedPersons); // 排序和去重
        List<PersonAuthed> result = new ArrayList<>();
        for (UserCheckresultEntity userCheckresultEntity : set) {
            PersonAuthed personAuthed = new PersonAuthed(userCheckresultEntity.getId(),
                    userCheckresultEntity.getIdname(),
                    userCheckresultEntity.getIdnum());
            result.add(personAuthed);
        }
        return result;
    }

    @Override
    public List<UserCheckresultEntity> getAllPersons() {
        return userCheckresultDao.selectAllPersons();
    }

}
