package io.sdses.modules.wechat.entity;

public class AccessToken {
    private String access_token;
    private Integer expires_in;
    private Long expires_time;

    public Long getExpires_time() {
        return expires_time;
    }

    public void setExpires_time(Long expires_time) {
        this.expires_time = expires_time;
    }

    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public Integer getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(Integer expires_in) {
        this.expires_in = expires_in;
    }

    public AccessToken() {
    }

    public AccessToken(String access_token, Integer expires_in, Long expires_time) {
        this.access_token = access_token;
        this.expires_in = expires_in;
        this.expires_time = expires_time;
    }

    @Override
    public String toString() {
        return "AccessToken{" +
                "access_token='" + access_token + '\'' +
                ", expires_in=" + expires_in +
                ", expires_time=" + expires_time +
                '}';
    }
}
