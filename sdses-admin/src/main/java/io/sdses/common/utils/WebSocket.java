package io.sdses.common.utils;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;

import net.sf.json.JSONException;


@ServerEndpoint("/websocket/{token}")
@Component
public class WebSocket {
	static Log log = LogFactory.getLog(WebSocket.class);
	// concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
	// 若要实现服务端与单一客户端通信的话，可以使用Map来存放，其中Key可以为用户标识
    private static Map<String, Session> webSocketHash = new ConcurrentHashMap<String, Session>();
	private Session session;
	
	@OnOpen
	public void onOpen(@PathParam("token") String token, Session session)
			throws IOException {
		log.info("开始连接请求("+token+")===>："+getOnlineCount());
		this.session = session;
		this.session.setMaxIdleTimeout(24 * 60 * 60 * 1000);
		this.session.setMaxTextMessageBufferSize(10*1024*1024);
		webSocketHash.put(token, this.session);
		log.info("已连接,当前连接个数为："+getOnlineCount());
	}

	@OnClose
	public void onClose() throws IOException {
       try {
            Iterator<String> iter = webSocketHash.keySet().iterator();
            while (iter.hasNext()) {
                String key = iter.next();
                if (webSocketHash.get(key).equals(session)) {
                	webSocketHash.remove(key);
                	log.info("已关闭,当前连接个数为："+getOnlineCount());
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(" --> Close Connection Exception=" + e.getMessage());
        }
	}

	@OnMessage
	public void onMessage(String message) throws IOException, JSONException {
		log.info("接收到的消息为："+message+",当前连接数===>"+getOnlineCount());
	}

	@OnError
	public void onError(Session session, Throwable error) {
		error.printStackTrace();
	}

	public synchronized void  sendMessageTo(Session session, String message) throws IOException {
//		 session.getBasicRemote().sendText(message);
		try {
			session.getAsyncRemote().sendText(message);	
		} catch(Exception e) {
			log.error(e,e);
			Iterator<String> iter = webSocketHash.keySet().iterator();
	        while (iter.hasNext()) {
	        	String key = iter.next();
	            if (webSocketHash.get(key).equals(session)) {
	            	webSocketHash.remove(key);
	                log.info("Session发送异常，关闭,当前连接个数为："+getOnlineCount());
	                break;
	            }
	        }
	        session.close();
		}
		
	}
	public synchronized void sendMessageAll(String message) throws IOException {  
		for (Session session : webSocketHash.values()) {  
			session.getAsyncRemote().sendText(message);  
		}  
	} 
	public static synchronized int getOnlineCount() {
		return webSocketHash.size();
	}

	public Session getSession() {
		return session;
	}

	public void setSession(Session session) {
		this.session = session;
	}

	public static Map<String, Session> getWebSocketHash() {
		return webSocketHash;
	}
}
