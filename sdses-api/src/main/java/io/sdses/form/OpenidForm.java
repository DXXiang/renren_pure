package io.sdses.form;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotBlank;

/**
 * 登录表单
 *
 * @author Mark sunlightcs@gmail.com
 * @since 3.1.0 2018-01-25
 */
@ApiModel(value = "openid表单")
public class OpenidForm {
    @ApiModelProperty(value = "openid")
    @NotBlank(message="openid不能为空")
    private String openid;

    @ApiModelProperty(value = "类型")
    @NotBlank(message="类型不能为空")
    private String type;

    public String getopenid() {
        return openid;
    }

    public void setopenid(String openid) {
        this.openid = openid;
    }

    public String gettype() {
        return type;
    }

    public void settype(String type) {
        this.type = type;
    }
}

