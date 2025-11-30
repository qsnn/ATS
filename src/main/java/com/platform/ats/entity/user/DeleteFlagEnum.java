package com.platform.ats.entity.user;

import lombok.Getter;

@Getter
public enum DeleteFlagEnum {

    NOT_DELETED(0, "未删除"),
    DELETED(1, "已删除");

    private final Integer code;
    private final String desc;

    DeleteFlagEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
