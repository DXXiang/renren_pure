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

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
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

//    /**
//     * 导出认证信息
//     * @return
//     */
//    @RequestMapping(value = "/exportToExcel", method = RequestMethod.GET)
//    public ModelAndView export(){
//        ModelAndView mv = new ModelAndView();
//        ExcelView ev = new ExcelView(exportService());
//        //文件名
//        ev.setFileName("export.xls");
//        //获取全部认证通过者信息
//        List<UserCheckresultEntity> authedList = userCheckresultService.getAuthedPersons();
////        System.err.println(authedList);
//        mv.addObject("authedList", authedList);
//        mv.setView(ev);
////        System.err.println("out");
//        return mv;
//
//    }

    /**
     * 导出认证信息
     * 使用session共享查询结果
     * @return
     */
    @RequestMapping(value = "/exportToExcel", method = RequestMethod.GET)
    public ModelAndView export(HttpSession session){
        ModelAndView mv = new ModelAndView();
        ExcelView ev = new ExcelView(exportService());
        //文件名
        ev.setFileName("export.xls");
        mv.addObject("resultList", session.getAttribute("resultList"));//从session中获取当前查询结果
        mv.setView(ev);
        return mv;

    }

    @SuppressWarnings({"unchecked"})
    private ExcelExportService exportService(){
        return (Map<String, Object> model, Workbook workbook) ->{
            List<UserCheckresultEntity> authedList = (List<UserCheckresultEntity>) model.get("resultList");
            //生成Sheet
            Sheet sheet = workbook.createSheet("认证信息");
            //加载标题
            Row title = sheet.createRow(0);
            title.createCell(0).setCellValue("姓名");
            title.createCell(1).setCellValue("身份证号码");
            title.createCell(2).setCellValue("认证结果");
            title.createCell(3).setCellValue("认证时间");

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            //遍历列表生成行
            for (int i = 0; i < authedList.size(); i++) {
                UserCheckresultEntity authed = authedList.get(i);
                int rowIndex = i + 1;
                Row row = sheet.createRow(rowIndex);
                row.createCell(0).setCellValue(authed.getIdname());
                row.createCell(1).setCellValue(authed.getIdnum());
                row.createCell(2).setCellValue(authed.getResult());
                row.createCell(3).setCellValue(simpleDateFormat.format(authed.getDate()));
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
