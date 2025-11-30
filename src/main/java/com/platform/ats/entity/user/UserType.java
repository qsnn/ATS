package com.platform.ats.entity.user;

import lombok.Getter;

/**
 * 用户类型枚举
 */
@Getter
public enum UserType {
    PLATFORM_ADMIN(1, "平台管理员"),
    COMPANY_ADMIN(2, "企业管理员"),
    HR(3, "HR"),
    JOB_SEEKER(4, "求职者");

    private final Integer code;
    private final String desc;

    UserType(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public static UserType getByCode(Integer code) {
        for (UserType type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        return null;
    }
}
