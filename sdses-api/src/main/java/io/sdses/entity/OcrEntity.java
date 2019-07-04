 package io.sdses.entity;

public class OcrEntity {
	/**
	 * 姓名
	 */
	private String name;
	/**
	 * 身份证号
	 */
	private String citizen_id;
	/**
	 * 人像
	 */
	private String photo;
	/**
	 * 过期判断
	 */
	private String check;
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCitizen_id() {
		return citizen_id;
	}
	public void setCitizen_id(String citizen_id) {
		this.citizen_id = citizen_id;
	}
	public String getPhoto() {
		return photo;
	}
	public void setPhoto(String photo) {
		this.photo = photo;
	}
	public String getCheck() {
		return check;
	}
	public void setCheck(String check) {
		this.check = check;
	}
	
}
