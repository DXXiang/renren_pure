package io.sdses.modules.common.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

/**
 * 
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-04 09:02:00
 */
@TableName("com_file")
public class ComFileEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	@TableId
	private Long fileId;
	/**
	 * 关联类型
		1.系统管理-人员管理
		2.全息档案-照片
		3.全息档案-声纹
		4.全息档案-关系图谱
		5.工作通知模块
		6.个人日志模块
	 */
	private String relationType;
	/**
	 * 关联id
	 */
	private Long relationId;
	/**
	 * 上传人id
	 */
	private Long userId;
	/**
	 * 文件名
	 */
	private String name;
	/**
	 * 文件路径
	 */
	private String path;
	/**
	 * 文件类型
	 */
	private String type;
	/**
	 * 是否删除，-1:删除；0:正常
	 */
	private String delFlag;
	/**
	 * 创建时间
	 */
	private Date createTime;

	/**
	 * 设置：
	 */
	public void setFileId(Long fileId) {
		this.fileId = fileId;
	}
	/**
	 * 获取：
	 */
	public Long getFileId() {
		return fileId;
	}
	/**
	 * 设置：关联类型
1.系统管理-人员管理
2.全息档案-照片
3.全息档案-声纹
4.全息档案-关系图谱
5.工作通知模块
6.个人日志模块

	 */
	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}
	/**
	 * 获取：关联类型
1.系统管理-人员管理
2.全息档案-照片
3.全息档案-声纹
4.全息档案-关系图谱
5.工作通知模块
6.个人日志模块

	 */
	public String getRelationType() {
		return relationType;
	}
	/**
	 * 设置：关联id
	 */
	public void setRelationId(Long relationId) {
		this.relationId = relationId;
	}
	/**
	 * 获取：关联id
	 */
	public Long getRelationId() {
		return relationId;
	}
	/**
	 * 设置：上传人id
	 */
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	/**
	 * 获取：上传人id
	 */
	public Long getUserId() {
		return userId;
	}
	/**
	 * 设置：文件名
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * 获取：文件名
	 */
	public String getName() {
		return name;
	}
	/**
	 * 设置：文件路径
	 */
	public void setPath(String path) {
		this.path = path;
	}
	/**
	 * 获取：文件路径
	 */
	public String getPath() {
		return path;
	}
	/**
	 * 设置：文件类型
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * 获取：文件类型
	 */
	public String getType() {
		return type;
	}
	/**
	 * 设置：是否删除，-1:删除；0:正常
	 */
	public void setDelFlag(String delFlag) {
		this.delFlag = delFlag;
	}
	/**
	 * 获取：是否删除，-1:删除；0:正常
	 */
	public String getDelFlag() {
		return delFlag;
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
