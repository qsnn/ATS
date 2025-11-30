package com.platform.ats.entity.user;

/**
 * 账号状态枚举
 */
public enum UserStatus {
    DISABLED(0, "禁用"),
    NORMAL(1, "正常"),
    TO_BE_COMPLETED(2, "待完善");

    private final Integer code;
    private final String desc;

    UserStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public Integer getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static UserStatus getByCode(Integer code) {
        for (UserStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
}
