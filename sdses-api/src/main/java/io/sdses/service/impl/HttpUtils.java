package io.sdses.service.impl;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

public class HttpUtils {
	public static String sendPost(String url, String params,
			Map<String, String> headers) {
		StringBuilder buf = new StringBuilder();
		Set<Entry<String, String>> entrys = null;
		BufferedReader in = null;
		PrintWriter out = null;
		String result = "";
		// 如果是GET请求，则请求参数在URL中
		try {
			if (params != null && !params.equals("")) {
				buf.append(params);
			}
			URL realUrl = new URL(url);
			// 打开和URL之间的连接
			HttpURLConnection conn = (HttpURLConnection) realUrl
					.openConnection();
			conn.setRequestMethod("POST");
			// 设置请求头
			if (headers != null && !headers.isEmpty()) {
				entrys = headers.entrySet();
				for (Map.Entry<String, String> entry : entrys) {
					conn.setRequestProperty(entry.getKey(), entry.getValue());
				}
			}
			// 发送POST请求必须设置如下两行
			conn.setDoOutput(true);
			conn.setDoInput(true);
			// 获取URLConnection对象对应的输出流
			out = new PrintWriter(conn.getOutputStream());
			// 发送请求参数
			System.out.println("请求参数为====>"+buf.toString());
			out.print(buf);
			// flush输出流的缓冲
			out.flush();
			// 定义BufferedReader输入流来读取URL的响应
			conn.getResponseCode(); // 为了发送成功
			in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		} catch (Exception e) {
			System.out.println("发送 Post 请求出现异常！" + e);
			e.printStackTrace();
			throw new RuntimeException();
		}
		// 使用finally块来关闭输出流、输入流
		finally {
			try {
				if (out != null) {
					out.close();
				}
				if (in != null) {
					in.close();
				}
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return result;
	}
	    /**
	     * 向指定 URL 发送POST方法的请求
	     * 
	     * @param url
	     *            发送请求的 URL
	     * @param param
	     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	     * @return 所代表远程资源的响应结果
	     */
	    public static String sendPost(String url, String param) {
	    	OutputStreamWriter out = null;
	        BufferedReader in = null;
	        String result = "";
	        try {
	            URL realUrl = new URL(url);
	            // 打开和URL之间的连接
	            HttpURLConnection conn = (HttpURLConnection ) realUrl.openConnection();
	            // 设置通用的请求属性
	            conn.setRequestProperty("accept", "*/*");
	            conn.setRequestProperty("connection", "Keep-Alive");
	            conn.setRequestProperty("Content-Type","application/json; charset=UTF-8");
	            conn.setRequestProperty("Accept-Charset", "UTF-8");
	 
//	            conn.setRequestProperty("user-agent",
//	                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
	            // 发送POST请求必须设置如下两行
	            conn.setDoOutput(true);
	            conn.setDoInput(true);
	            // 获取URLConnection对象对应的输出流
	            out = new OutputStreamWriter(conn  
	                     .getOutputStream(), "UTF-8"); 
	 
	            out.write(param);
	            // flush输出流的缓冲
	            out.flush();
	            // 定义BufferedReader输入流来读取URL的响应
	            conn.getResponseCode();
	          
	            in = new BufferedReader(
	                    new InputStreamReader(conn.getInputStream(),"utf-8"));
	           
	            String line;
	            while ((line = in.readLine()) != null) {
	                result += line;
	            }
	        } catch (Exception e) {
	            System.out.println("发送 POST 请求出现异常！"+e);
	            e.printStackTrace();
	        }
	        //使用finally块来关闭输出流、输入流
	        finally{
	            try{
	                if(out!=null){
	                    out.close();
	                }
	                if(in!=null){
	                    in.close();
	                }
	            }
	            catch(IOException ex){
	                ex.printStackTrace();
	            }
	        }
	        return result;
	  }    
}

