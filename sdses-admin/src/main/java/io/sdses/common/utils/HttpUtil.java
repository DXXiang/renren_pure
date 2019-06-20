package io.sdses.common.utils;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class HttpUtil {

	/**
	 * 接口调用 GET
	 */
	public static String httpURLConectionGET(String urlStr) {
		try {
			URL url = new URL(urlStr); // 把字符串转换为URL请求地址
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();// 打开连接
			connection.connect();// 连接会话
			// 获取输入流
			BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
			String line;
			StringBuilder sb = new StringBuilder();
			while ((line = br.readLine()) != null) {// 循环读取流
				sb.append(line);
			}
			br.close();// 关闭流
			connection.disconnect();// 断开连接
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return "ERROR";
		}
	}

	/**
	 * 接口调用 POST
	 */
	public static String httpURLConnectionPOST(String urlStr) {
		try {
			URL url = new URL(urlStr);
			// 将url 以 open方法返回的urlConnection 连接强转为HttpURLConnection连接
			// (标识一个url所引用的远程对象连接)
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();// 此时cnnection只是为一个连接对象,待连接中
			// 设置连接输出流为true,默认false (post 请求是以流的方式隐式的传递参数)
			connection.setDoOutput(true);
			// 设置连接输入流为true
			connection.setDoInput(true);
			// 设置请求方式为post
			connection.setRequestMethod("POST");
			// post请求缓存设为false
			connection.setUseCaches(false);
			// 设置该HttpURLConnection实例是否自动执行重定向
			connection.setInstanceFollowRedirects(true);
			// 设置请求头里面的各个属性 (以下为设置内容的类型,设置为经过urlEncoded编码过的from参数)
			// application/x-javascript text/xml->xml数据
			// application/x-javascript->json对象
			// application/x-www-form-urlencoded->表单数据
			// ;charset=utf-8 必须要，不然妙兜那边会出现乱码【★★★★★】
			connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
			// 建立连接
			// (请求未开始,直到connection.getInputStream()方法调用时才发起,以上各个参数设置需在此方法之前进行)
			connection.connect();
			// 创建输入输出流,用于往连接里面输出携带的参数,(输出内容为?后面的内容)
			DataOutputStream dataout = new DataOutputStream(connection.getOutputStream());
			String app_key = "app_key=" + URLEncoder.encode("4f7bf8c8260124e6e9c6bf094951a111", "utf-8"); // 已修改【改为错误数据，以免信息泄露】
			String agt_num = "&agt_num=" + URLEncoder.encode("10111", "utf-8"); // 已修改【改为错误数据，以免信息泄露】
			String pid = "&pid=" + URLEncoder.encode("BLZXA150401111", "utf-8"); // 已修改【改为错误数据，以免信息泄露】
			String departid = "&departid=" + URLEncoder.encode("10007111", "utf-8"); // 已修改【改为错误数据，以免信息泄露】
			String install_lock_name = "&install_lock_name=" + URLEncoder.encode("南天大门", "utf-8");
			String install_address = "&install_address=" + URLEncoder.encode("北京育新", "utf-8");
			String install_gps = "&install_gps=" + URLEncoder.encode("116.350888,40.011001", "utf-8");
			String install_work = "&install_work=" + URLEncoder.encode("小李", "utf-8");
			String install_telete = "&install_telete=" + URLEncoder.encode("13000000000", "utf-8");
			String intall_comm = "&intall_comm=" + URLEncoder.encode("一切正常", "utf-8");
			// 格式 parm = aaa=111&bbb=222&ccc=333&ddd=444
			String parm = app_key + agt_num + pid + departid + install_lock_name + install_address + install_gps
					+ install_work + install_telete + intall_comm;
			// 将参数输出到连接
			dataout.writeBytes(parm);
			// 输出完成后刷新并关闭流
			dataout.flush();
			dataout.close(); // 重要且易忽略步骤 (关闭流,切记!)
			// System.out.println(connection.getResponseCode());
			// 连接发起请求,处理服务器响应 (从连接获取到输入流并包装为bufferedReader)
			BufferedReader bf = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
			String line;
			StringBuilder sb = new StringBuilder(); // 用来存储响应数据
			// 循环读取流,若不到结尾处
			while ((line = bf.readLine()) != null) {
				// sb.append(bf.readLine());
				sb.append(line).append(System.getProperty("line.separator"));
			}
			bf.close(); // 重要且易忽略步骤 (关闭流,切记!)
			connection.disconnect(); // 销毁连接
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return "ERROR";
		}
	}

	/*public static void main(String[] args) {
		httpURLConectionGET();
		// httpURLConnectionPOST();
	}*/
}
