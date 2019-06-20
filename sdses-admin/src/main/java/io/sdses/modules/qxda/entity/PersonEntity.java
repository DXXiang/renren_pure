package io.sdses.modules.qxda.entity;

import java.io.Serializable;
import java.util.List;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

/**
 * 【明细表】涉案人员表
 * 
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-01-02 15:04:14
 */
@TableName("tb_person")
public class PersonEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	@TableId
	private Long personId;
	/**
	 * 
	 */
	private String name;
	/**
	 * 
	 */
	private String sex;
	/**
	 * 
	 */
	private String nation;
	/**
	 * 
	 */
	private String numId;
	/**
	 * 
	 */
	private String numPhone;
	/**
	 * 
	 */
	private String numNetwork;
	/**
	 * 
	 */
	private String placeHome;
	/**
	 * 
	 */
	private String placeActive;
	/**
	 * 现住地
	 */
	private String placeLive;
	/**
	 * 籍贯
	 */
	private String placeNative;
	/**
	 * 昵称
	 */
	private String nickname;
	/**
	 * 驾驶证
	 */
	private String driverNum;
	/**
	 * 护照号
	 */
	private String passportNum;
	/**
	 * 婚姻状况
	 */
	private String isMarried;
	/**
	 * 职业
	 */
	private String workY;
	/**
	 * 职级
	 */
	private String workJ;
	/**
	 * 职务
	 */
	private String workW;
	/**
	 * 重点人员类型
	 */
	private String personType;
	/**
	 * 重点人员性质
	 */
	private String personNature;
	/**
	 * 是否有前科人员 
	 */
	private String isSin;
	/**
	 * 所在国家
	 */
	private String country;
	/**
	 * 宗教信仰
	 */
	private String religion;
	/**
	 * 性格研判
	 */
	private String character;
	/**
	 * 涉稳标签
	 */
	private String stabilizeFlag;
	/**
	 * 涉恐类型
	 */
	private String fearType;
	/**
	 * 用户类型
	 */
	private String userType;
	/**
	 * 头像地址
	 */
	private String pathHead;
	/**
	 * 声纹地址
	 */
	private String pathVoice;
	/**
	 * 图谱地址
	 */
	private String pathAtlas;
	/**
	 * 活跃指数
	 */
	private String rlActive;
	/**
	 * 分析意见
	 */
	private String rlOpinion;
	/**
	 * 创建类型
	 */
	private String createType;
	/**
	 * 创建人id
	 */
	private Long userId;
	/**
	 * 创建部门id
	 */
	private Long deptId;
	/**
	 * 创建时间
	 */
	//private Date createTime;
	/**
	 * 是否删除
	 */
	private int delFlag;
	
	/**
	 * 通讯工具列表
	 */
	@TableField(exist = false)
	private List<PersonTelEntity> telList;
	
	/**
	 * 社交工具列表
	 */
	@TableField(exist = false)
	private List<PersonChatEntity> chatList;
	
	/**
	 * 家族关系列表
	 */
	@TableField(exist = false)
	private List<PersonPersonEntity> familyPersonList;
	
	/**
	 * 重要关系列表
	 */
	@TableField(exist = false)
	private List<PersonPersonEntity> majorPersonList;

	/**
	 * 设置：
	 */
	public void setPersonId(Long personId) {
		this.personId = personId;
	}
	/**
	 * 获取：
	 */
	public Long getPersonId() {
		return personId;
	}
	/**
	 * 设置：
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * 获取：
	 */
	public String getName() {
		return name;
	}
	/**
	 * 设置：
	 */
	public void setSex(String sex) {
		this.sex = sex;
	}
	/**
	 * 获取：
	 */
	public String getSex() {
		return sex;
	}
	/**
	 * 设置：
	 */
	public void setNation(String nation) {
		this.nation = nation;
	}
	/**
	 * 获取：
	 */
	public String getNation() {
		return nation;
	}
	/**
	 * 设置：
	 */
	public void setNumId(String numId) {
		this.numId = numId;
	}
	/**
	 * 获取：
	 */
	public String getNumId() {
		return numId;
	}
	/**
	 * 设置：
	 */
	public void setNumPhone(String numPhone) {
		this.numPhone = numPhone;
	}
	/**
	 * 获取：
	 */
	public String getNumPhone() {
		return numPhone;
	}
	/**
	 * 设置：
	 */
	public void setNumNetwork(String numNetwork) {
		this.numNetwork = numNetwork;
	}
	/**
	 * 获取：
	 */
	public String getNumNetwork() {
		return numNetwork;
	}
	/**
	 * 设置：
	 */
	public void setPlaceHome(String placeHome) {
		this.placeHome = placeHome;
	}
	/**
	 * 获取：
	 */
	public String getPlaceHome() {
		return placeHome;
	}
	/**
	 * 设置：
	 */
	public void setPlaceActive(String placeActive) {
		this.placeActive = placeActive;
	}
	/**
	 * 获取：
	 */
	public String getPlaceActive() {
		return placeActive;
	}
	/**
	 * 设置：现住地
	 */
	public void setPlaceLive(String placeLive) {
		this.placeLive = placeLive;
	}
	/**
	 * 获取：现住地
	 */
	public String getPlaceLive() {
		return placeLive;
	}
	/**
	 * 设置：籍贯
	 */
	public void setPlaceNative(String placeNative) {
		this.placeNative = placeNative;
	}
	/**
	 * 获取：籍贯
	 */
	public String getPlaceNative() {
		return placeNative;
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
	 * 设置：驾驶证
	 */
	public void setDriverNum(String driverNum) {
		this.driverNum = driverNum;
	}
	/**
	 * 获取：驾驶证
	 */
	public String getDriverNum() {
		return driverNum;
	}
	/**
	 * 设置：护照号
	 */
	public void setPassportNum(String passportNum) {
		this.passportNum = passportNum;
	}
	/**
	 * 获取：护照号
	 */
	public String getPassportNum() {
		return passportNum;
	}
	/**
	 * 设置：婚姻状况
	 */
	public void setIsMarried(String isMarried) {
		this.isMarried = isMarried;
	}
	/**
	 * 获取：婚姻状况
	 */
	public String getIsMarried() {
		return isMarried;
	}
	/**
	 * 设置：职业
	 */
	public void setWorkY(String workY) {
		this.workY = workY;
	}
	/**
	 * 获取：职业
	 */
	public String getWorkY() {
		return workY;
	}
	/**
	 * 设置：职级
	 */
	public void setWorkJ(String workJ) {
		this.workJ = workJ;
	}
	/**
	 * 获取：职级
	 */
	public String getWorkJ() {
		return workJ;
	}
	/**
	 * 设置：职务
	 */
	public void setWorkW(String workW) {
		this.workW = workW;
	}
	/**
	 * 获取：职务
	 */
	public String getWorkW() {
		return workW;
	}
	/**
	 * 设置：重点人员类型
	 */
	public void setPersonType(String personType) {
		this.personType = personType;
	}
	/**
	 * 获取：重点人员类型
	 */
	public String getPersonType() {
		return personType;
	}
	/**
	 * 设置：是否有前科人员 
	 */
	public void setIsSin(String isSin) {
		this.isSin = isSin;
	}
	/**
	 * 获取：是否有前科人员 
	 */
	public String getIsSin() {
		return isSin;
	}
	/**
	 * 设置：所在国家
	 */
	public void setCountry(String country) {
		this.country = country;
	}
	/**
	 * 获取：所在国家
	 */
	public String getCountry() {
		return country;
	}
	/**
	 * 设置：宗教信仰
	 */
	public void setReligion(String religion) {
		this.religion = religion;
	}
	/**
	 * 获取：宗教信仰
	 */
	public String getReligion() {
		return religion;
	}
	/**
	 * 设置：性格研判
	 */
	public void setCharacter(String character) {
		this.character = character;
	}
	/**
	 * 获取：性格研判
	 */
	public String getCharacter() {
		return character;
	}
	/**
	 * 设置：涉稳标签
	 */
	public void setStabilizeFlag(String stabilizeFlag) {
		this.stabilizeFlag = stabilizeFlag;
	}
	/**
	 * 获取：涉稳标签
	 */
	public String getStabilizeFlag() {
		return stabilizeFlag;
	}
	/**
	 * 设置：涉恐类型
	 */
	public void setFearType(String fearType) {
		this.fearType = fearType;
	}
	/**
	 * 获取：涉恐类型
	 */
	public String getFearType() {
		return fearType;
	}
	/**
	 * 设置：用户类型
	 */
	public void setUserType(String userType) {
		this.userType = userType;
	}
	/**
	 * 获取：用户类型
	 */
	public String getUserType() {
		return userType;
	}
	/**
	 * 设置：头像地址
	 */
	public void setPathHead(String pathHead) {
		this.pathHead = pathHead;
	}
	/**
	 * 获取：头像地址
	 */
	public String getPathHead() {
		return pathHead;
	}
	/**
	 * 设置：声纹地址
	 */
	public void setPathVoice(String pathVoice) {
		this.pathVoice = pathVoice;
	}
	/**
	 * 获取：声纹地址
	 */
	public String getPathVoice() {
		return pathVoice;
	}
	/**
	 * 设置：图谱地址
	 */
	public void setPathAtlas(String pathAtlas) {
		this.pathAtlas = pathAtlas;
	}
	/**
	 * 获取：图谱地址
	 */
	public String getPathAtlas() {
		return pathAtlas;
	}
	/**
	 * 设置：活跃指数
	 */
	public void setRlActive(String rlActive) {
		this.rlActive = rlActive;
	}
	/**
	 * 获取：活跃指数
	 */
	public String getRlActive() {
		return rlActive;
	}
	/**
	 * 设置：分析意见
	 */
	public void setRlOpinion(String rlOpinion) {
		this.rlOpinion = rlOpinion;
	}
	/**
	 * 获取：分析意见
	 */
	public String getRlOpinion() {
		return rlOpinion;
	}
	/**
	 * 设置：创建类型
	 */
	public void setCreateType(String createType) {
		this.createType = createType;
	}
	/**
	 * 获取：创建类型
	 */
	public String getCreateType() {
		return createType;
	}
	/**
	 * 设置：创建人id
	 */
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	/**
	 * 获取：创建人id
	 */
	public Long getUserId() {
		return userId;
	}
	/**
	 * 设置：创建部门id
	 */
	public void setDeptId(Long deptId) {
		this.deptId = deptId;
	}
	/**
	 * 获取：创建部门id
	 */
	public Long getDeptId() {
		return deptId;
	}
	/**
	 * 设置：是否删除
	 */
	public void setDelFlag(int delFlag) {
		this.delFlag = delFlag;
	}
	/**
	 * 获取：是否删除
	 */
	public int getDelFlag() {
		return delFlag;
	}
	public List<PersonTelEntity> getTelList() {
		return telList;
	}
	public void setTelList(List<PersonTelEntity> telList) {
		this.telList = telList;
	}
	public List<PersonChatEntity> getChatList() {
		return chatList;
	}
	public void setChatList(List<PersonChatEntity> chatList) {
		this.chatList = chatList;
	}
	public List<PersonPersonEntity> getFamilyPersonList() {
		return familyPersonList;
	}
	public void setFamilyPersonList(List<PersonPersonEntity> familyPersonList) {
		this.familyPersonList = familyPersonList;
	}
	public List<PersonPersonEntity> getMajorPersonList() {
		return majorPersonList;
	}
	public void setMajorPersonList(List<PersonPersonEntity> majorPersonList) {
		this.majorPersonList = majorPersonList;
	}
	public String getPersonNature() {
		return personNature;
	}
	public void setPersonNature(String personNature) {
		this.personNature = personNature;
	}
}
