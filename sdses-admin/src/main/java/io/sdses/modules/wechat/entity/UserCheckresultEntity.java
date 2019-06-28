package io.sdses.modules.wechat.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-06-28 17:53:52
 */
@TableName("user_checkResult")
public class UserCheckresultEntity implements Serializable ,Comparable<UserCheckresultEntity>{
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

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		UserCheckresultEntity that = (UserCheckresultEntity) o;
		return Objects.equals(openid, that.openid) &&
				Objects.equals(idname, that.idname) &&
				Objects.equals(idnum, that.idnum) &&
				Objects.equals(id, that.id) &&
				Objects.equals(picture, that.picture) &&
				Objects.equals(result, that.result) &&
				Objects.equals(failReason, that.failReason);
	}

	@Override
	public int hashCode() {
		return Objects.hash(openid, idname, idnum, id, picture, result, failReason);
	}


	@Override
	public int compareTo(UserCheckresultEntity o) {
		if (this.getId() - o.getId() > 0) return 1;
		else if(this.getId() - o.getId() < 0) return -1;
		else return 0;
	}
}
