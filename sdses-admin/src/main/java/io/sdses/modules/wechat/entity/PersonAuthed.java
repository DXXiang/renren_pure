package io.sdses.modules.wechat.entity;

public class PersonAuthed {
    private Long id;
    private String name;
    private String cardId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCardId() {
        return cardId;
    }

    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

    public PersonAuthed(Long id, String name, String cardId) {
        this.id = id;
        this.name = name;
        this.cardId = cardId;
    }

    public PersonAuthed() {
    }
}
