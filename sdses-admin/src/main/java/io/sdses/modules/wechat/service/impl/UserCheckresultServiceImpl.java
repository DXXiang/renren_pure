package io.sdses.modules.wechat.service.impl;

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

//    @Override
//    public PageUtils queryPage(Map<String, Object> params) {
//        Page<UserCheckresultEntity> page = this.selectPage(
//                new Query<UserCheckresultEntity>(params).getPage(),
//                new EntityWrapper<UserCheckresultEntity>()
//        );
//
//        return new PageUtils(page);
//    }

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        Query<UserCheckresultEntity> query = new Query<>(params);

        Page<UserCheckresultEntity> page = new Page<>(query.getCurrPage(),query.getLimit());
        List<UserCheckresultEntity> userCheckresultEntityList = userCheckresultDao.queryPageByRole(page, params);
        return new PageUtils(page.setRecords(userCheckresultEntityList));
    }

    /**
     * 取通过者列表，并且去重以及根据id做排序
     * @return
     */
    @Override
    public List<UserCheckresultEntity> getAuthedPersons() {
        List<UserCheckresultEntity> fullMessageAuthedPersons = userCheckresultDao.selectAuthedPersons();
        Set<UserCheckresultEntity> set = new TreeSet<>(fullMessageAuthedPersons); // 排序和去重
        return new ArrayList<>(set);
    }


    @Override
    public List<UserCheckresultEntity> getAllPersons() {
        return userCheckresultDao.selectAllPersons();
    }
}
