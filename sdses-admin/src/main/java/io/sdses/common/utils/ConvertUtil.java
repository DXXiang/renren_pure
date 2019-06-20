package io.sdses.common.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import org.apache.tomcat.util.codec.binary.Base64;


/**
 * 类型转换工具类
 * 
 * @author wangxd
 *
 */
public class ConvertUtil {
	/**
	 * 获取利用反射获取类里面的值和名称
	 *
	 * @param obj
	 * @return
	 * @throws IllegalAccessException
	 */
	public static Map<String, Object> objectToMap(Object obj) throws IllegalAccessException {
		Map<String, Object> map = new HashMap<>();
		Class<?> clazz = obj.getClass();
		System.out.println(clazz);
		for (Field field : clazz.getDeclaredFields()) {
			field.setAccessible(true);
			String fieldName = field.getName();
			Object value = field.get(obj);
			if (value == null) {
				value = "";
			}
			map.put(fieldName, value);
		}
		return map;
	}

	/**
	 * 图片转base64
	 * 	 * @param imgname
	 * @return
	 * @throws IOException
	 */
	public static String imageToBase64(String imgname) throws IOException {
		InputStream in = null;
		byte[] data = null;
		try {
			in = new FileInputStream(imgname);
			data = new byte[in.available()];
			in.read(data);
			in.close();
		} catch (IOException e) {
			throw e;
		} finally {
			if (in != null)
				in.close();
		}
		return data != null ? Base64.encodeBase64String(data) : "";
	}

}
