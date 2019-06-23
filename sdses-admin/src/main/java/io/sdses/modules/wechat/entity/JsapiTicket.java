package io.sdses.modules.wechat.entity;

public class JsapiTicket {
    private Integer errcode;
    private String errmsg;
    private String ticket;
    private Integer expires_in;
    private Long expires_time;

    public JsapiTicket() {
    }

    public Long getExpires_time() {
        return expires_time;
    }

    public void setExpires_time(Long expires_time) {
        this.expires_time = expires_time;
    }

    public Integer getErrcode() {
        return errcode;
    }

    public void setErrcode(Integer errcode) {
        this.errcode = errcode;
    }

    public String getErrmsg() {
        return errmsg;
    }

    public void setErrmsg(String errmsg) {
        this.errmsg = errmsg;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }

    public Integer getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(Integer expires_in) {
        this.expires_in = expires_in;
    }

    @Override
    public String toString() {
        return "JsapiTicket{" +
                "errcode=" + errcode +
                ", errmsg='" + errmsg + '\'' +
                ", ticket='" + ticket + '\'' +
                ", expires_in=" + expires_in +
                ", expires_time=" + expires_time +
                '}';
    }
}
