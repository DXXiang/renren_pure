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
@ApiModel(value = "ocr表单")
public class OcrForm {
    @ApiModelProperty(value = "照片")
    @NotBlank(message="照片不能为空")
    private String photo;

    @ApiModelProperty(value = "类型")
    @NotBlank(message="类型不能为空")
    private String type;

    public String getphoto() {
        return photo;
    }

    public void setphoto(String photo) {
        this.photo = photo;
    }

    public String gettype() {
        return type;
    }

    public void settype(String type) {
        this.type = type;
    }
}

