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
@TableName("user_checkResult")
public class UserCheckresultEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	private String openid;
	/**
	 * 
	 */
	private String idname;
	/**
	 * 
	 */
	private String idnum;
	/**
	 * 
	 */
	@TableId
	private Long id;
	/**
	 * 
	 */
	private String picture;
	/**
	 * 
	 */
	private String result;
	/**
	 * 
	 */
	private String failReason;

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
	public void setIdname(String idname) {
		this.idname = idname;
	}
	/**
	 * 获取：
	 */
	public String getIdname() {
		return idname;
	}
	/**
	 * 设置：
	 */
	public void setIdnum(String idnum) {
		this.idnum = idnum;
	}
	/**
	 * 获取：
	 */
	public String getIdnum() {
		return idnum;
	}
	/**
	 * 设置：
	 */
	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * 获取：
	 */
	public Long getId() {
		return id;
	}
	/**
	 * 设置：
	 */
	public void setPicture(String picture) {
		this.picture = picture;
	}
	/**
	 * 获取：
	 */
	public String getPicture() {
		return picture;
	}
	/**
	 * 设置：
	 */
	public void setResult(String result) {
		this.result = result;
	}
	/**
	 * 获取：
	 */
	public String getResult() {
		return result;
	}
	/**
	 * 设置：
	 */
	public void setFailReason(String failReason) {
		this.failReason = failReason;
	}
	/**
	 * 获取：
	 */
	public String getFailReason() {
		return failReason;
	}
}
