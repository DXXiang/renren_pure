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
@TableName("tb_person_chat")
public class PersonChatEntity implements Serializable {
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
	 * 类型
	 */
	private String type;
	/**
	 * 昵称
	 */
	private String nickname;
	/**
	 * 号码
	 */
	private String num;
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
	 * 设置：类型
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * 获取：类型
	 */
	public String getType() {
		return type;
	}
	/**
	 * 设置：昵称
	 */
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	/**
	 * 获取：昵称
	 */
	public String getNickname() {
		return nickname;
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
