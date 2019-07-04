package io.sdses.service;

import com.baomidou.mybatisplus.service.IService;

import io.sdses.entity.ResultEntity;
import io.sdses.entity.UserEntity;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

/**
 * 用户
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017-03-23 15:22:06
 */
public interface UploadFileService extends IService<ResultEntity> {

	String uploadFile(HttpServletRequest request,MultipartFile[] files);

	/**
	 * 用户登录
	 * @param form    登录表单
	 * @return        返回登录信息
	 */
	Map<String, Object> upload(HttpServletRequest request,MultipartFile[] files);
}
