package io.sdses.modules.wechat.controller;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import io.sdses.common.validator.ValidatorUtils;
import io.sdses.modules.wechat.entity.MessageParams;
import io.sdses.modules.wechat.entity.UserOpenidEntity;
import io.sdses.modules.wechat.service.UserOpenidService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.sdses.modules.wechat.entity.MessageEntity;
import io.sdses.modules.wechat.service.MessageService;
import io.sdses.common.utils.PageUtils;
import io.sdses.common.utils.R;



/**
 * 
 *
 * @author wangxd
 * @email wangxiaodong@sdses.com
 * @date 2019-07-01 22:39:10
 */
@RestController
@RequestMapping("wechat/message")
public class MessageController {


    @Autowired
    private MessageService messageService;
    @Autowired
    private UserOpenidService userOpenidService;


//        @ResponseBody
//    @RequestMapping(value = "/insertMessages" ,method = RequestMethod.POST)
//    public int sendMessages(@RequestParam(required = false) Map<String, Object> params) {
//        List<String> openids = (List<String>) params.get("openids");
//        System.err.println(params);
//        String content = (String) params.get("content");
//        return messageService.sendMessages(openids , content);
//    }
@RequestMapping("/sendMessages")
@ResponseBody
public Object getArrayAndStringParam(@RequestBody MessageParams messageParams) {

    List<String> openids = messageParams.getOpenids();
    String content = messageParams.getMessCont();

    return messageService.sendMessages(openids , content);


}


    @RequestMapping("/getAllopenid")
    public List<UserOpenidEntity>getAllOpenId() {
        return userOpenidService.selectAllOpenId();
    }


    @RequestMapping("/getMpopenid")
    public List<UserOpenidEntity>getMpOpenId() {
        return userOpenidService.selectMpOpenId();
    }

    /**
     * 列表
     */
    @RequestMapping("/list")
    @RequiresPermissions("wechat:message:list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = messageService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{messNum}")
    @RequiresPermissions("wechat:message:info")
    public R info(@PathVariable("messNum") Integer messNum){
        MessageEntity message = messageService.selectById(messNum);

        return R.ok().put("message", message);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    @RequiresPermissions("wechat:message:save")
    public R save(@RequestBody MessageEntity message){
        messageService.insert(message);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    @RequiresPermissions("wechat:message:update")
    public R update(@RequestBody MessageEntity message){
        ValidatorUtils.validateEntity(message);
        messageService.updateAllColumnById(message);//全部更新
        
        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @RequiresPermissions("wechat:message:delete")
    public R delete(@RequestBody Integer[] messNums){
        messageService.deleteBatchIds(Arrays.asList(messNums));

        return R.ok();
    }



}
