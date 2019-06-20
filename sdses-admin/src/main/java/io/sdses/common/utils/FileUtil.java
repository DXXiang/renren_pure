package io.sdses.common.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class FileUtil {
	private static AtomicInteger FileNameBase  = new AtomicInteger();
	private static String curDate = "20171101";
	/**
     * 获取文件扩展名
     * @return
     */
    public static String ext(String filename) {
        int index = filename.lastIndexOf(".");

        if (index == -1) {
            return null;
        }
        String result = filename.substring(index + 1);
        return result;
    }
    
    /**
     * 获取文件名称
     * @return
     */
    public static String getFileName(String filename) {        
        return filename.replace("."+ext(filename), "");
    }
    
    public static String getFileNameBase() {
    	Date dt = new Date();
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
    	String strtime = sdf.format(dt);
    	String ydr = strtime.substring(1,8);
    	if (999999 == FileNameBase.get() || !(ydr.equals(curDate))) {
    		FileNameBase.set(0);
    		curDate = ydr;
    	}
    	String srandom = String.valueOf(FileNameBase.incrementAndGet());
    	for (int i = srandom.length(); i < 6; i++) {
    		srandom = "0" + srandom;
    	}
    	String FileNameBase = strtime + "_" + srandom;
    	return FileNameBase;
    }
    
    //文件名过滤非法字符
    public static String fileNameFilter(String fileName) throws PatternSyntaxException {
    	// 清除掉所有非法字符
    	String regEx="[\\s\\\\/:\\*\\?\\\"<>\\|]";
    	Pattern p = Pattern.compile(regEx);
    	Matcher m = p.matcher(fileName);
    	return m.replaceAll("").trim();
    } 
    public static String StringFilter1(String str) throws PatternSyntaxException {    	
    	String regEx="[&]";
    	Pattern p = Pattern.compile(regEx);
    	Matcher m = p.matcher(str);
    	return m.replaceAll("&amp;").trim();
    } 
    public static String StringFilter2(String str) throws PatternSyntaxException {    	
    	String regEx="[<]";
    	Pattern p = Pattern.compile(regEx);
    	Matcher m = p.matcher(str);
    	return m.replaceAll("&lt;").trim();
    } 
    public static String StringFilter3(String str) throws PatternSyntaxException {    	
    	String regEx="[>]";
    	Pattern p = Pattern.compile(regEx);
    	Matcher m = p.matcher(str);
    	return m.replaceAll("&gt;").trim();
    } 
 
    public static String StringFilter4(String str) throws PatternSyntaxException {    	
    	String regEx="[']";
    	Pattern p = Pattern.compile(regEx);
    	Matcher m = p.matcher(str);
    	return m.replaceAll("&apos;").trim();
    } 
    
    public static String StringFilter(String str){
    	String result = "";
    	result = StringFilter1(str);
    	result = StringFilter2(result);
    	result = StringFilter3(result);
    	result = StringFilter4(result);
        return result;
    }
    
}
