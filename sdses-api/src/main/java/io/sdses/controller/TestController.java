package io.sdses.controller;


//import io.sdses.common.utils.R;
//import io.sdses.common.validator.ValidatorUtils;
//import io.sdses.entity.TestEntity;
//import io.sdses.entity.UserEntity;
//import io.sdses.form.RegisterForm;
//import io.sdses.service.TestService;
//import io.sdses.service.TokenService;
//import io.sdses.service.UserService;
//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiOperation;
//import org.apache.commons.codec.digest.DigestUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.Date;
//
///**
// * 注册接口
// * @author chenshun
// * @email sunlightcs@gmail.com
// * @date 2017-03-26 17:27
// */
//@Controller
//@RequestMapping("/api2")
//@Api(tags="测试接口1")
//public class TestController {
//	@Autowired
//    private TestService testService;
//
//    @PostMapping("test")
//    @ApiOperation("获取用户ID")
//    public String test(){
//
//        TestEntity user = new TestEntity();
//        user.setIdname("ybk");
//        user.setIdnum("132");
//        user.setOpenid("46");
//        testService.insert(user);
//       
//
//        return "sucesss";
//    }
//}
