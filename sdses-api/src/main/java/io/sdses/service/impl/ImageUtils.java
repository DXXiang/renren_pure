package io.sdses.service.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;
import sun.misc.BASE64Decoder;



public class ImageUtils {
	 /**
     * 将本地图片进行Base64位编码
     * @param imgUrl
     * @return
     */
    
    /**
     * 将Base64位编码的图片进行解码，并保存到指定目录
     * 
     * @param base64
     *            base64编码的图片信息
     * @return
     */
    public static String decodeBase64ToImage(String base64, String path,
            String imgName) {
        try {
        	imgName = imgName + ".jpg";
            FileOutputStream write = new FileOutputStream(new File(path
                    + imgName));
            BASE64Decoder decoder = new BASE64Decoder();
            byte[] decodeBytes = decoder.decodeBuffer(base64);
            write.write(decodeBytes);
            write.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return path + imgName;
    }
    
}

