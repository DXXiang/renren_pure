package io.sdses.common.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * 固定的字典值
 * 
 * @author wangxd
 *
 */
public class ConstantMap {
	// 婚姻状况
	public static final Map<String, String> isMarriedMap = new HashMap<String, String>() {
		{
			put("0", "未婚");
			put("1", "已婚");
		}
	};
	// 是否有前科
	public static final Map<String, String> isSinMap = new HashMap<String, String>() {
		{
			put("0", "否");
			put("1", "是");
		}
	};
	// 人员类型
	public static final Map<String, String> userTypeMap = new HashMap<String, String>() {
		{
			put("1", "发送人员");
			put("2", "接收人员");
			put("3", "涉线人员");
		}
	};
	// 人员类型
	public static final Map<String, String> activeMap = new HashMap<String, String>() {
		{
			put("1", "高");
			put("2", "中");
			put("3", "低");
		}
	};
	
}
