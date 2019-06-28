package io.sdses.modules.wechat.controller;

import io.sdses.modules.wechat.entity.PersonAuthed;
import io.sdses.modules.wechat.entity.UserCheckresultEntity;
import io.sdses.modules.wechat.service.ExcelExportService;
import io.sdses.modules.wechat.service.UserCheckresultService;
import io.sdses.modules.wechat.view.ExcelView;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

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
        List<PersonAuthed> authedList = userCheckresultService.getAuthedPersons();
        System.err.println(authedList);
        mv.addObject("authedList", authedList);
        mv.setView(ev);
        System.err.println("out");
        return mv;

    }

//    /**
//     * 导出认证通过者
//     * @return
//     */
//    @RequestMapping(value = "/exportToExcel", method = RequestMethod.GET)
//    public String export(HttpServletResponse response) throws IOException {
//        List<PersonAuthed> authedList = userCheckresultService.getAuthedPersons();
//        response.setHeader("Content-Disposition","attachment; filename="+new String(("清单").getBytes("utf-8"),"ISO-8859-1")+".xls");
//        OutputStream out = response.getOutputStream();
//        exportMatrixLeaderSheet(out, authedList);
//        System.err.println("out");
//        return null;
//
//    }
//    private void exportMatrixLeaderSheet(OutputStream out, List<PersonAuthed> list) {
//        HSSFWorkbook workbook = new HSSFWorkbook(); // 声明一个工作薄
//        HSSFSheet sheet = workbook.createSheet("认证通过");  // 生成一个表格
//        sheet.setDefaultColumnWidth(20);// 设置表格默认列宽度为30个字节
//        HSSFRow title = sheet.createRow(0);
//        title.createCell(0).setCellValue("编号");
//        title.createCell(1).setCellValue("姓名");
//        title.createCell(2).setCellValue("身份证号码");
//        for (int i = 0; i < list.size(); i++) {
//            HSSFRow row = sheet.createRow(i + 1);
//            PersonAuthed authed = list.get(i);
//            row.createCell(0).setCellValue(authed.getId());
//            row.createCell(1).setCellValue(authed.getName());
//            row.createCell(2).setCellValue(authed.getCardId());
//        }
//        try {
//            workbook.write(out);
//            System.err.println("go");
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
    @SuppressWarnings({"unchecked"})
    private ExcelExportService exportService(){
        return (Map<String, Object> model, Workbook workbook) ->{
            List<PersonAuthed> authedList = (List<PersonAuthed>) model.get("authedList");
            //生成Sheet
            Sheet sheet = workbook.createSheet("认证通过");
            //加载标题
            Row title = sheet.createRow(0);
            title.createCell(0).setCellValue("编号");
            title.createCell(1).setCellValue("姓名");
            title.createCell(2).setCellValue("身份证号码");
            //遍历列表生成行
            for (int i = 0; i < authedList.size(); i++) {
                PersonAuthed authed = authedList.get(i);
                int rowIndex = i + 1;
                Row row = sheet.createRow(rowIndex);
                row.createCell(0).setCellValue(authed.getId());
                row.createCell(1).setCellValue(authed.getName());
                row.createCell(2).setCellValue(authed.getCardId());
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
