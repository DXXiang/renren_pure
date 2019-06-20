package io.sdses.modules.qxda.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-02 15:04:13
 */
@TableName("tb_person_tel")
public class PersonTelEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	@TableId
	private Long id;
	/**
	 * 关联用户ID
	 */
	private Long personId;
	/**
	 * 号码
	 */
	private String num;
	/**
	 * 机主
	 */
	private String owner;
	/**
	 * 持机人
	 */
	private String user;
	/**
	 * 创建时间
	 */
	private Date createTime;

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
	 * 设置：关联用户ID
	 */
	public void setPersonId(Long personId) {
		this.personId = personId;
	}
	/**
	 * 获取：关联用户ID
	 */
	public Long getPersonId() {
		return personId;
	}
	/**
	 * 设置：号码
	 */
	public void setNum(String num) {
		this.num = num;
	}
	/**
	 * 获取：号码
	 */
	public String getNum() {
		return num;
	}
	/**
	 * 设置：机主
	 */
	public void setOwner(String owner) {
		this.owner = owner;
	}
	/**
	 * 获取：机主
	 */
	public String getOwner() {
		return owner;
	}
	/**
	 * 设置：持机人
	 */
	public void setUser(String user) {
		this.user = user;
	}
	/**
	 * 获取：持机人
	 */
	public String getUser() {
		return user;
	}
	/**
	 * 设置：创建时间
	 */
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	/**
	 * 获取：创建时间
	 */
	public Date getCreateTime() {
		return createTime;
	}
}
