package io.sdses.controller;


import io.sdses.annotation.Login;
import io.sdses.common.utils.R;
import io.sdses.common.validator.ValidatorUtils;
import io.sdses.form.OcrForm;
import io.sdses.service.TokenService;
import io.sdses.service.OcrService;
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
@Api(tags="OCR接口")
public class ApiOcrController {
    @Autowired
    private OcrService OcrService;
    @Autowired
    private TokenService tokenService;


    @PostMapping("ocr")
    @ApiOperation("ocr识别")
    public R login(@RequestBody OcrForm form){
        //表单校验
        ValidatorUtils.validateEntity(form);

        //用户登录
        Map<String, Object> map = OcrService.login(form);

        return R.ok(map);
    }

}


