package com.platform.ats.entity.user;

import lombok.Getter;

@Getter
public enum UserTypeEnum {
    PLATFORM_ADMIN(1, "平台管理员"),
    COMPANY_ADMIN(2, "企业管理员"),
    HR(3, "HR"),
    JOB_SEEKER(4, "求职者");

    private final Integer code;
    private final String desc;

    UserTypeEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public static UserTypeEnum getByCode(Integer code) {
        for (UserTypeEnum value : values()) {
            if (value.getCode().equals(code)) {
                return value;
            }
        }
        return null;
    }
}