package io.sdses.modules.qxda.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.sdses.common.annotation.SysLog;
import io.sdses.common.utils.ExportUtil;
import io.sdses.common.utils.FileUtil;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.R;
import io.sdses.modules.qxda.entity.PersonEntity;
import io.sdses.modules.qxda.service.PersonService;



/**
 * 【明细表】涉案人员表
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-02 15:04:14
 */
@RestController
@RequestMapping("qxda/person")
public class PersonController {
	
    @Autowired
    private PersonService personService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    //@RequiresPermissions("qxda:person:list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = personService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{personId}")
    //@RequiresPermissions("qxda:person:info")
    public R info(@PathVariable("personId") Long personId){
        PersonEntity person = personService.viewPerson(personId);

        return R.ok().put("person", person);
    }
    
    /**
     * 根据 身份证号 获取 全息档案
     */
    @RequestMapping("/infoByNumId/{numId}")
    public R infoByNumId(@PathVariable("numId") String numId){
        PersonEntity person = personService.viewPersonByNumId(numId);

        return R.ok().put("person", person);
    }

    /**
     * 保存
     */
    @SysLog("【全息档案】新增")
    @RequestMapping("/save")
    //@RequiresPermissions("qxda:person:save")
    public R save(@RequestBody PersonEntity person){
        personService.insertPerson(person);

        return R.ok().put("person", person);
    }

    /**
     * 修改
     */
    @SysLog("【全息档案】修改")
    @RequestMapping("/update")
    //@RequiresPermissions("qxda:person:update")
    public R update(@RequestBody PersonEntity person){
        //ValidatorUtils.validateEntity(person);
        //personService.updateAllColumnById(person);//全部更新
    	personService.updatePerson(person);		//全部更新
        
        return R.ok();
    }

    /**
     * 删除
     */
    @SysLog("【全息档案】删除")
    @RequestMapping("/delete")
    //@RequiresPermissions("qxda:person:delete")
    public R delete(@RequestBody Long[] personIds){
        personService.deletePerson(Arrays.asList(personIds));

        return R.ok();
    }
    
    /**
     * -导出
     * @param personId
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/exportToWord/{personId}")
    public R exportToWord(@PathVariable("personId") Long personId, HttpServletRequest request, HttpServletResponse response) {
        String ftlFile = "qxda.ftl";
        /** 生成word */
        try {        	
        	//文件唯一名称
            String fileOnlyName = "全息档案-编号[" + personId + "].doc";
        	ExportUtil.exportWord(request, response, personService.convertToWordData(personId), fileOnlyName, ftlFile);				
		} catch (IOException e) {
			e.printStackTrace();
			return R.error("导出失败");
		}
        return R.ok(); 
    }
    
    /**
     * -批量导出
     * @param personIds
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/batchExportToWord")
    public R batchExportToWord(@RequestParam(value = "personIdsStr") String personIdsStr, HttpServletRequest request, HttpServletResponse response) {
    	String[] personIds = personIdsStr.split(",");
    	List<Map<String, Object>> listInfo = new ArrayList<Map<String, Object>>();
    	for(String personId : personIds) {
    		Map<String, Object> dataMap = personService.convertToWordData(Long.parseLong(personId));
    		dataMap.put("fileName", "全息档案-编号[" + personId + "].doc");
    		dataMap.put("ftlTemplate", "qxda.ftl");
    		listInfo.add(dataMap);
    	}
    	//文件唯一名称
        String zipFileName = "全息档案" + FileUtil.getFileNameBase() + ".zip";
        /** 生成word */
        try {        	
        	ExportUtil.batchExportWord(request, response, listInfo, zipFileName);
		} catch (IOException e) {
			e.printStackTrace();
			return R.error("导出失败");
		}
        return R.ok(); 
    }

}
