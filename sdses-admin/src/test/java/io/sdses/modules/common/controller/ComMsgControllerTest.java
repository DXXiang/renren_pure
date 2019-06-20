package io.sdses.modules.common.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import io.sdses.modules.common.service.ComMsgService;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ComMsgControllerTest {

	@Autowired
	private ComMsgService comMsgService;

	@Test
	public void test() {
		//comMsgService.msgHandler(1L, "你好", "你好中国", "1", "2019-11-11");
	}

}
