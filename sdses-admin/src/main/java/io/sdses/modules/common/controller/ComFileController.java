package io.sdses.modules.common.controller;

import java.io.File;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import io.sdses.common.utils.FileUtil;
import io.sdses.common.utils.R;
import io.sdses.common.utils.UploadUtil;
import io.sdses.modules.common.entity.ComFileEntity;
import io.sdses.modules.common.service.ComFileService;
import io.sdses.modules.sys.shiro.ShiroUtils;



/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-04 09:02:00
 */
@RestController
@RequestMapping("common/comfile")
public class ComFileController {
    @Autowired
    private ComFileService comFileService;
    
    @Value("${file.uploadFolder}")
    private String uploadFolder;
    @Value("${file.staticAccessPath}")
    private String staticAccessPath;
    @Value("${file.uploadPath}")
    private String uploadPath;
    
    @Value("${comFile.qbfxFile_1}")
    private String path1;
    @Value("${comFile.qbfxFile_2}")
    private String path2;
    @Value("${comFile.qbfxFile_3}")
    private String path3;
    @Value("${comFile.qbfxFile_4}")
    private String path4;
    @Value("${comFile.qbfxFile_5}")
    private String path5;
    @Value("${comFile.qbfxFile_6}")
    private String path6;

    /*
     * 处理文件上传    
     * 1.	系统管理-人员管理
     * 2.	全息档案-照片
     * 3.	全息档案-声纹
     * 4.	全息档案-关系图谱
     * 5.	工作通知模块
     * 6.	个人日志模块
     */
    
    @RequestMapping(value="/uploadFile/{type}", method = RequestMethod.POST)   
    public R uploadImage(HttpServletRequest request, HttpServletResponse response, @PathVariable("type") String type) {             
    	CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
    	
    	ComFileEntity comFileEntity = new ComFileEntity();
    	if(commonsMultipartResolver.isMultipart(request)){
    		MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest)request;
    		List<MultipartFile> fileList = multipartHttpServletRequest.getFiles("files");
    		for(MultipartFile file : fileList){
            	String contentType = file.getContentType();   //文件类型       
            	String fileName = file.getOriginalFilename();  //文件名字  
            	
                //获取文件扩展名            
                String extname = FilenameUtils.getExtension(fileName);
                //文件唯一名称
                String fileOnlyName = fileName.replace("."+extname, "") + "_"+FileUtil.getFileNameBase() + "." +extname;

            	//文件存放路径       
            	String filePath = uploadPath + getPath(type);
            	File f = new File(filePath);
            	if  (!f.exists()  && !f.isDirectory()) {       
            		f.mkdir();    
            	}

            	//调用文件处理类FileUtil，处理文件，将文件写入指定位置       
            	try {            
            		UploadUtil.uploadFile(file.getBytes(), filePath, fileOnlyName);        
            	} catch (Exception e) {          
            		return R.error("上传失败");
            	} 
            	comFileEntity.setName(fileName);
            	comFileEntity.setType(contentType);
            	comFileEntity.setRelationType(type);
            	comFileEntity.setPath(staticAccessPath.substring(1, staticAccessPath.length()).replace("**", "") + getPath(type) + fileOnlyName);
            	comFileEntity.setUserId(ShiroUtils.getUserId());
            	comFileEntity.setDelFlag("0");
            	DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss");
            	Date currentTime = null;
				try {
					currentTime = df.parse(df.format(new Date()));
				} catch (ParseException e) {
					e.printStackTrace();
				}
            	comFileEntity.setCreateTime(currentTime);
            	comFileService.insert(comFileEntity);
            	break;
            }
    	}
    	return R.ok().put("file", comFileEntity);
    }
    
    /**
     * 根据类型获取地址
     * @param type
     * @return
     */
    private String getPath(String type){
    	switch (type) {
		case "1":
			return path1;
		case "2":
			return path2;
		case "3":
			return path3;
		case "4":
			return path4;
		case "5":
			return path5;
		case "6":
			return path6;
		default:
			return "";
		}
    }

}
