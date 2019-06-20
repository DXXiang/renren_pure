package io.sdses.common.utils;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import freemarker.template.Configuration;
import freemarker.template.Template;

@RestController
@RequestMapping("qbfx/ExportUtil")
public class ExportUtil {
	private static Configuration configuration = null;  
	
    //利用ExportToWordUtil的类加载器动态获得模板文件的位置  
//  private static final String templateFolder = "/target/classes/templates/exportTemplates";  
	
 
   
  
    /**
     * 导出word文档
     */
    public static void exportWord(HttpServletRequest request, HttpServletResponse response, Map map, String fileName, String ftlFile) throws IOException {  
    	configuration = new Configuration();  
        configuration.setDefaultEncoding("utf-8");  
// 		configuration.setDirectoryForTemplateLoading(ResourceUtils.getFile("classpath:templates/exportTemplates")); 
        configuration.setClassForTemplateLoading(ExportUtil.class, "/templates/exportTemplates");
        
    	Template freemarkerTemplate = configuration.getTemplate(ftlFile);  
        File file = null;  
        InputStream fin = null;  
        ServletOutputStream out = null;  
        try {  
            // 调用工具类的createDoc方法生成Word文档  
            file = createDoc(map, freemarkerTemplate, FileUtil.fileNameFilter(fileName));  
            fin = new FileInputStream(file);  
           
            response.setCharacterEncoding("utf-8");  
            response.setContentType("application/json");          
//          response.setHeader("Content-Disposition", "attachment;filename="  
//                  .concat(String.valueOf(URLEncoder.encode(fileName, "UTF-8"))));  
            //解决中文文档名称导出乱码
            String uncodeName=URLDecoder.decode(FileUtil.fileNameFilter(fileName),"UTF-8");
            String uncodeFileName = new String(uncodeName.getBytes("UTF-8"), "iso-8859-1");
            response.setHeader("Content-Disposition", "attachment;filename=".concat(String.valueOf(uncodeFileName)));
            
            out = response.getOutputStream();  
            byte[] buffer = new byte[512];  // 缓冲区  
            int bytesToRead = -1;  
            // 通过循环将读入的Word文件的内容输出到浏览器中  
            while((bytesToRead = fin.read(buffer)) != -1) {  
                out.write(buffer, 0, bytesToRead);  
            }  
        } finally {  
            if(fin != null) fin.close();  
            if(out != null) out.close();  
            if(file != null) file.delete(); // 删除临时文件  
        }  
    }  
    
    /**
     * 批量导出word文档，压缩成zip文件
     */ 
    public static void batchExportWord(HttpServletRequest request, HttpServletResponse response, List list, String zipFileName) throws IOException {  
    	configuration = new Configuration();  
        configuration.setDefaultEncoding("utf-8");  
// 		configuration.setDirectoryForTemplateLoading(ResourceUtils.getFile("classpath:templates/exportTemplates")); 
        configuration.setClassForTemplateLoading(ExportUtil.class, "/templates/exportTemplates");
 
        File file = null;          
        ServletOutputStream out = null;  
        try {  
            // 调用工具类的createDoc方法生成Word文档  
            file = createZip(list, zipFileName);    
            downloadZip(file, response);
        } finally {               
            if(out != null) out.close();  
            if(file != null) file.delete(); // 删除临时文件  
        }  
    }  
    
    /**
     * 根据模板生成Doc文档
     * @param dataMap (word页面需要的数据)
     * @param template (模板文件)
     * @param fileName (要导出文件名称)
     */ 
    private static File createDoc(Map<?, ?> dataMap, Template template, String fileName) {  
        
        File f = new File(File.separator+fileName);  
        Template t = template;  
        try {  
            // 这个地方不能使用FileWriter因为需要指定编码类型否则生成的Word文档会因为有无法识别的编码而无法打开  
            Writer w = new OutputStreamWriter(new FileOutputStream(f), "utf-8");  
            t.process(dataMap, w);  
            w.close();  
        } catch (Exception ex) {  
            ex.printStackTrace();  
            throw new RuntimeException(ex);  
        }  
        return f;  
    }  
    /**
     * 根据模板生成word文档，压缩成zip文件
     * @param list (word页面需要的数据)
     * @param templateName (模板文件名称)
     * @param zipFileName (要导出Zip文件名称)
     * @param wordFileName (要导出word文件名称)
     */ 
	private static File createZip(List list, String zipFileName) {
		File zipFile = new File(File.separator + zipFileName);
		Template template = null;
		List<File> fileList = new ArrayList<File>();
		try {
			for (int i = 0; i < list.size(); i++) {
				Map<?, ?> map = (Map<?, ?>) list.get(i);
				String fileName = (String) map.get("fileName");
				String ftlFile = (String) map.get("ftlTemplate");
				template = configuration.getTemplate(ftlFile);  
				File wordFile = new File(FileUtil.fileNameFilter(fileName) + ".doc");
				// 这个地方不能使用FileWriter因为需要指定编码类型否则生成的Word文档会因为有无法识别的编码而无法打开
				Writer w = new OutputStreamWriter(new FileOutputStream(wordFile), "utf-8");
				template.process(list.get(i), w);
				fileList.add(wordFile);
				w.close();
			}

			// 创建文件输出流
			FileOutputStream fileOutputStream = new FileOutputStream(zipFile);
			// ZipOutputStream输出流转换
			ZipOutputStream zipOutputStream = new ZipOutputStream(fileOutputStream);
			// 接收文件集合、压缩流
			zipFileAll(fileList, zipOutputStream);
			zipOutputStream.close();
			fileOutputStream.close();
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new RuntimeException(ex);
		}
		return zipFile;
	}
    
	/**
     * 把接收的全部文件打成压缩包 
     *
     * @param files (文件集合)
     * @param outputStream (压缩流、输出)
     */ 
	private static void zipFileAll(List files, ZipOutputStream outputStream) { 
		for (Object file1 : files) { 			
			File file = (File) file1;			
			zipFile(file, outputStream); } 
	} 
	/**
     * 根据输入的文件与输出流对文件进行打包
     *
     * @param file (单个文件对象)
     * @param outputStream (压缩流、输出)
     */ 
     private static void zipFile(File file, ZipOutputStream outputStream) { 
    	 try { 
    		 if (file.exists()) { 
    			 if (file.isFile()) { 
    				 FileInputStream IN = new FileInputStream(file); 
                     BufferedInputStream bins = new BufferedInputStream(IN, 1024); // 将文件名写入压缩文件中 
    			     ZipEntry entry = new ZipEntry(FileUtil.getFileName(file.getName())+ "_" + FileUtil.getFileNameBase()+"."+FileUtil.ext(file.getName())); 
    			     outputStream.putNextEntry(entry); // 向压缩文件中输出数据   
    			     int nNumber; 
    			     byte[] buffer = new byte[1024]; 
    			     while ((nNumber = bins.read(buffer)) != -1) { 
    			    	 outputStream.write(buffer, 0, nNumber); 
    			     }
    			     outputStream.flush(); 
        			 bins.close(); 
        			 IN.close(); 
    			 } else { 
        			 File[] files = file.listFiles(); 
        			 for (File file1 : files) { 
        				 zipFile(file1, outputStream); 
        			 } 
        		 } 
    			 file.delete();
    		 } 
    	} catch (Exception e) { 
    		e.printStackTrace(); 
    	} 
    	
     }
    /**
     * 下载文件,支持跨域
     * @param file (要下载的文件)
     * @param response
     */ 
     private static void downloadZip(File file, HttpServletResponse response) { 
    	 try { 
    		 // 以流的形式下载文件。 
    		 InputStream fis = new BufferedInputStream(new FileInputStream(file.getPath())); 
    		 byte[] buffer = new byte[fis.available()]; 
    		 fis.read(buffer); fis.close(); response.reset(); 
    		 OutputStream toClient = new BufferedOutputStream(response.getOutputStream()); 
    		 response.setContentType("application/json"); 
 //   		 response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8")); 
             //解决中文文档名称导出乱码
             String uncodeName=URLDecoder.decode(file.getName(),"UTF-8");
             String uncodeFileName = new String(uncodeName.getBytes("UTF-8"), "iso-8859-1");
             response.setHeader("Content-Disposition", "attachment;filename=".concat(String.valueOf(uncodeFileName)));

    		 toClient.write(buffer); toClient.flush(); toClient.close(); 
    	 } catch (IOException ex) { 
    		 ex.printStackTrace(); 
    	 } finally { 
    		 try { 
    			 File f = new File(file.getPath()); 
    			 f.delete(); 
    		 } catch (Exception e) { 
    			 e.printStackTrace(); 
    		 } 
    	 } 
    }

 
}
