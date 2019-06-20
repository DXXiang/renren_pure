package io.sdses.modules.qxda.entity;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-02 15:04:12
 */
@TableName("tb_person_person")
public class PersonPersonEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	@TableId
	private Long id;
	/**
	 * 用户ID
	 */
	private Long personId;
	/**
	 * 关联用户ID
	 */
	private Long relationPersonId;
	/**
	 * 关联类型，1:家族关系；2:重要关系；3:网络关系
	 */
	private String relationType;
	/**
	 * 关系
	 */
	private String relationName;
	/**
	 * 关系亲密度
	 */
	private String intimacy;
	/**
	 * 创建时间
	 */
	private Date createTime;
	/**
	 * 是否删除，-1：已删除；0：正常
	 */
	private String delFlag;
	
	/**
	 * 姓名
	 */
	@TableField(exist = false)
	private String name;
	
	/**
	 * 性别
	 */
	@TableField(exist = false)
	private String sex;
	
	/**
	 * 族别
	 */
	@TableField(exist = false)
	private String nation;
	
	/**
	 * 身份证号
	 */
	@TableField(exist = false)
	private String numId;

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
	 * 设置：关联类型，1:家族关系；2:重要关系；3:网络关系
	 */
	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}
	/**
	 * 获取：关联类型，1:家族关系；2:重要关系；3:网络关系
	 */
	public String getRelationType() {
		return relationType;
	}
	/**
	 * 设置：关系
	 */
	public void setRelationName(String relationName) {
		this.relationName = relationName;
	}
	/**
	 * 获取：关系
	 */
	public String getRelationName() {
		return relationName;
	}
	/**
	 * 设置：关系亲密度
	 */
	public void setIntimacy(String intimacy) {
		this.intimacy = intimacy;
	}
	/**
	 * 获取：关系亲密度
	 */
	public String getIntimacy() {
		return intimacy;
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
	/**
	 * 设置：是否删除，-1：已删除；0：正常
	 */
	public void setDelFlag(String delFlag) {
		this.delFlag = delFlag;
	}
	/**
	 * 获取：是否删除，-1：已删除；0：正常
	 */
	public String getDelFlag() {
		return delFlag;
	}
	public Long getRelationPersonId() {
		return relationPersonId;
	}
	public void setRelationPersonId(Long relationPersonId) {
		this.relationPersonId = relationPersonId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}
	public String getNumId() {
		return numId;
	}
	public void setNumId(String numId) {
		this.numId = numId;
	}
}
