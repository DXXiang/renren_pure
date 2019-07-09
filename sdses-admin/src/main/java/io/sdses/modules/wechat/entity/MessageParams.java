package io.sdses.modules.wechat.entity;

import java.util.Date;
import java.util.List;

public class MessageParams {


    private String messCont;
    private List<String> openids;

    public String getMessCont() {
        return messCont;
    }

    public void setMessCont(String messCont) {
        this.messCont = messCont;
    }

    public List<String> getOpenids() {
        return openids;
    }

    public void setOpenids(List<String> openids) {
        this.openids = openids;
    }
}
