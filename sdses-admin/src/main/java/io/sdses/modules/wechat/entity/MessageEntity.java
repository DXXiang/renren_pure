package io.sdses.modules.wechat.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-07-01 22:39:10
 */
@TableName("message")
public class MessageEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	@TableId
	private Integer messNum;
	/**
	 * 
	 */
	private String messCont;
	/**
	 * 
	 */
	private String userName;
	/**
	 * 
	 */
	private String openid;
	/**
	 * 
	 */
	private Date deliveryTime;
	/**
	 * 
	 */
	private String sendResults;
	/**
	 * 
	 */
	private String pushResults;

	private List<String> openids;

	public List<String> getOpenids() {
		return openids;
	}

	public void setOpenids(List<String> openids) {
		this.openids = openids;
	}

	/**
	 * 设置：
	 */
	public void setMessNum(Integer messNum) {
		this.messNum = messNum;
	}
	/**
	 * 获取：
	 */
	public Integer getMessNum() {
		return messNum;
	}
	/**
	 * 设置：
	 */
	public void setMessCont(String messCont) {
		this.messCont = messCont;
	}
	/**
	 * 获取：
	 */
	public String getMessCont() {
		return messCont;
	}
	/**
	 * 设置：
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}
	/**
	 * 获取：
	 */
	public String getUserName() {
		return userName;
	}
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
	public void setDeliveryTime(Date deliveryTime) {
		this.deliveryTime = deliveryTime;
	}
	/**
	 * 获取：
	 */
	public Date getDeliveryTime() {
		return deliveryTime;
	}
	/**
	 * 设置：
	 */
	public void setSendResults(String sendResults) {
		this.sendResults = sendResults;
	}
	/**
	 * 获取：
	 */
	public String getSendResults() {
		return sendResults;
	}
	/**
	 * 设置：
	 */
	public void setPushResults(String pushResults) {
		this.pushResults = pushResults;
	}
	/**
	 * 获取：
	 */
	public String getPushResults() {
		return pushResults;
	}
}
