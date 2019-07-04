package io.sdses.controller;


import io.sdses.annotation.Login;
import io.sdses.common.utils.R;
import io.sdses.common.validator.ValidatorUtils;
import io.sdses.form.OcrForm;
import io.sdses.form.OpenidForm;
import io.sdses.service.TokenService;
import io.sdses.service.GetNumService;
import io.sdses.service.OpenidService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;
import java.util.Map;

/**
 * 登录接口
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017-03-23 15:31
 */
@RestController
@RequestMapping("/api")
@Api(tags="openid接口")
public class ApiOpenidController {
    @Autowired
    private OpenidService openidService;

    @PostMapping("sendopenid")
    @ApiOperation("上传openid")
    public R sendopenid(@RequestBody OpenidForm form){
    	//表单校验
        ValidatorUtils.validateEntity(form);
       //用户登录
        Map<String, Object> map = openidService.login(form);

        return R.ok(map);
    }    

}

