package io.sdses.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;

import java.io.Serializable;
import java.util.Date;

import javax.annotation.Generated;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-06-28 08:21:49
 */
@TableName("user_checkResult")
public class ResultEntity implements Serializable {
	private static final long serialVersionUID = 1L;
	@TableId
	private Long id;
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
	 * 
	 */
	private Date date;

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
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	public void setDate(Date date) {
		this.date = date;
	}
	/**
	 * 获取：
	 */
	public Date getDate() {
		return date;
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
