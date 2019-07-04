package io.sdses.controller;


import io.sdses.annotation.Login;
import io.sdses.common.utils.R;
import io.sdses.common.validator.ValidatorUtils;
import io.sdses.service.TokenService;
import io.sdses.service.GetNumService;
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
@Api(tags="随机数接口")
public class ApiGetNumController {
    @Autowired
    private GetNumService GetNumService;

    @PostMapping("getnum")
    @ApiOperation("随机数获取")
    public R GetNum(){
       //用户登录
        Map<String, Object> map = GetNumService.getresult();

        return R.ok(map);
    }    

}

