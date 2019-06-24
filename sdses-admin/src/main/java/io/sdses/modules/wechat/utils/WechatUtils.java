package io.sdses.modules.wechat.utils;

import org.apache.commons.lang.RandomStringUtils;

public class WechatUtils {
    public static String getNoncestr(){
        return RandomStringUtils.randomAlphanumeric(16);
    }
}
