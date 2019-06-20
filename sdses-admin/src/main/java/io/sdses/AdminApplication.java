package io.sdses;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;


@SpringBootApplication
@MapperScan(basePackages = {"io.sdses.modules.*.dao"})
public class AdminApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(AdminApplication.class, args);
	}

	/**
	 * 该方法的作用是可以把项目打包成war包
     * 如此配置打包后可以用tomcat下使用
     * @param application
     * @return
     */
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(AdminApplication.class);
	}
}
