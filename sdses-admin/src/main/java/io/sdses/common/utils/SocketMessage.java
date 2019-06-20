package io.sdses.common.utils;

import java.util.Iterator;
import java.util.Map;

import javax.websocket.Session;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class SocketMessage extends Thread {
	private final Log log = LogFactory.getLog(this.getClass());
	private final String sendJson;
	private final String token;

	public SocketMessage(String sendJson, String token) {
		this.sendJson = sendJson;
		this.token = token;
	}
	@Override
	public void run() {
		// TODO Auto-generated method stub
		try {
			sendSocketResult(sendJson, token);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("--> WebSocket Push Exception" + sendJson
					+ " ,Exception=" + e.getMessage(), e);
		}
	}

	/**
	 * 
	 * 
	 * @throws Exception
	 */
	public void sendSocketResult(String sendJson, String token)
			throws Exception {
		if(CheckUtil.isNull(token)) {
			WebSocket carSocket = new WebSocket();
			carSocket.sendMessageAll(sendJson);
		} else {
			Map<String, Session> carWebSocketHash = WebSocket.getWebSocketHash();
			Iterator<String> iter = carWebSocketHash.keySet().iterator();
	        while (iter.hasNext()) {
	            String key = iter.next();
	    		if(key.endsWith(token)) {
	            	Session session = carWebSocketHash.get(key);
	        		if(session != null && session.isOpen()) {
	        			WebSocket carSocket = new WebSocket();
	        			carSocket.sendMessageTo(session, sendJson);
	        		}
	    		}
	        }
		}
	}
}
