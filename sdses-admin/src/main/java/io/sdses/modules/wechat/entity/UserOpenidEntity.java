package io.sdses.modules.wechat.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-06-28 17:53:52
 */
@TableName("user_openid")
public class UserOpenidEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	@TableId
	private String openid;
	/**
	 * 
	 */
	private String type;

	/**
	 * 设置：
	 */
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	/**
	 * 获取：
	 */
	public String getOpenid() {
		return openid;
	}
	/**
	 * 设置：
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * 获取：
	 */
	public String getType() {
		return type;
	}
}
