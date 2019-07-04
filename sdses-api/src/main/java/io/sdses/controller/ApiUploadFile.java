package io.sdses.controller;


import io.sdses.annotation.Login;
import io.sdses.common.utils.R;
import io.sdses.common.validator.ValidatorUtils;
import io.sdses.service.TokenService;
import io.sdses.service.UploadFileService;
import io.sdses.service.GetNumService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import springfox.documentation.annotations.ApiIgnore;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * 登录接口
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017-03-23 15:31
 */
@RestController
@RequestMapping("/api")
@Api(tags="文件上传")
public class ApiUploadFile {
    @Autowired
    private UploadFileService uploadFileService;


    @PostMapping("upload")
    @ApiOperation("文件上传接口")
    public R test( HttpServletRequest request,@RequestParam("file")MultipartFile[] file){

        //用户登录
        Map<String, Object> map = uploadFileService.upload(request,file);

        return R.ok(map);
    }

   
    
    

}

