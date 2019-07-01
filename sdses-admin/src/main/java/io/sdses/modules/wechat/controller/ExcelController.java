package io.sdses.modules.wechat.controller;

import io.sdses.modules.wechat.entity.UserCheckresultEntity;
import io.sdses.modules.wechat.service.ExcelExportService;
import io.sdses.modules.wechat.service.UserCheckresultService;
import io.sdses.modules.wechat.view.ExcelView;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;

/**
 * @author 董翔祥
 */
@Controller
@RequestMapping("wechat/export")
public class ExcelController {
    @Autowired
    private UserCheckresultService userCheckresultService;

    /**
     * 导出认证通过者
     * @return
     */
    @RequestMapping(value = "/exportToExcel", method = RequestMethod.GET)
    public ModelAndView export(){
        ModelAndView mv = new ModelAndView();
        ExcelView ev = new ExcelView(exportService());
        //文件名
        ev.setFileName("export.xls");
        //获取全部认证通过者信息
        List<UserCheckresultEntity> authedList = userCheckresultService.getAuthedPersons();
//        System.err.println(authedList);
        mv.addObject("authedList", authedList);
        mv.setView(ev);
//        System.err.println("out");
        return mv;

    }

    @SuppressWarnings({"unchecked"})
    private ExcelExportService exportService(){
        return (Map<String, Object> model, Workbook workbook) ->{
            List<UserCheckresultEntity> authedList = (List<UserCheckresultEntity>) model.get("authedList");
            //生成Sheet
            Sheet sheet = workbook.createSheet("认证通过");
            //加载标题
            Row title = sheet.createRow(0);
            title.createCell(0).setCellValue("编号");
            title.createCell(1).setCellValue("姓名");
            title.createCell(2).setCellValue("身份证号码");
            //遍历列表生成行
            for (int i = 0; i < authedList.size(); i++) {
                UserCheckresultEntity authed = authedList.get(i);
                int rowIndex = i + 1;
                Row row = sheet.createRow(rowIndex);
                row.createCell(0).setCellValue(authed.getId());
                row.createCell(1).setCellValue(authed.getIdname());
                row.createCell(2).setCellValue(authed.getIdnum());
            }
        };
    }

    /**
     * 获取全部结果，测试用
     * @return
     */
    @RequestMapping("/getAll")
    @ResponseBody
    public List<UserCheckresultEntity> getAll(){
        return userCheckresultService.getAllPersons();
    }
}
