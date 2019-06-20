package io.sdses.modules.common.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2018-12-29 10:49:38
 */
@TableName("com_msg")
public class ComMsgEntity implements Serializable, Cloneable{
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	@TableId
	private Long msgId;
	/**
	 * 
	 */
	private Long relationId;
	/**
	 * 
	 */
	private Long receivedUserId;
	/**
	 * 
	 */
	private String title;
	/**
	 * 
	 */
	private String content;
	/**
	 * 
	 */
	private String url;
	/**
	 * 
	 */
	private Date msgTime;
	/**
	 * 
	 */
	private String type;
	/**
	 * 
	 */
	private String isRead;
	/**
	 * 
	 */
	private String uuid;
	/**
	 * 
	 */
	private Date createTime;
	
	/**
	 * 更新 0：否；1：是
	 */
	@TableField(exist = false)
	private String isUpdate;
	/**
	 * 延时提醒 0：否；1：是
	 */
	@TableField(exist = false)
	private int isDelay;

	/**
	 * 设置：
	 */
	public void setMsgId(Long msgId) {
		this.msgId = msgId;
	}
	/**
	 * 获取：
	 */
	public Long getMsgId() {
		return msgId;
	}
	/**
	 * 设置：
	 */
	public void setReceivedUserId(Long receivedUserId) {
		this.receivedUserId = receivedUserId;
	}
	/**
	 * 获取：
	 */
	public Long getReceivedUserId() {
		return receivedUserId;
	}
	/**
	 * 设置：
	 */
	public void setContent(String content) {
		this.content = content;
	}
	/**
	 * 获取：
	 */
	public String getContent() {
		return content;
	}
	/**
	 * 设置：
	 */
	public void setMsgTime(Date msgTime) {
		this.msgTime = msgTime;
	}
	/**
	 * 获取：
	 */
	public Date getMsgTime() {
		return msgTime;
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
	/**
	 * 设置：
	 */
	public void setIsRead(String isRead) {
		this.isRead = isRead;
	}
	/**
	 * 获取：
	 */
	public String getIsRead() {
		return isRead;
	}
	/**
	 * 设置：
	 */
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	/**
	 * 获取：
	 */
	public Date getCreateTime() {
		return createTime;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getIsUpdate() {
		return isUpdate;
	}
	public void setIsUpdate(String isUpdate) {
		this.isUpdate = isUpdate;
	}
	public Long getRelationId() {
		return relationId;
	}
	public void setRelationId(Long relationId) {
		this.relationId = relationId;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	public ComMsgEntity clone() {
		ComMsgEntity o = null;
		try {
			o = (ComMsgEntity) super.clone();
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		return o;
	}
	public int getIsDelay() {
		return isDelay;
	}
	public void setIsDelay(int isDelay) {
		this.isDelay = isDelay;
	}
}
