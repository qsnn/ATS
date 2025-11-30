package com.platform.ats.entity.user;


import lombok.Getter;

@Getter
public enum AuditStatusEnum {

    PENDING(0, "待审核"),
    APPROVED(1, "审核通过"),
    REJECTED(2, "审核不通过");

    private final Integer code;
    private final String desc;

    AuditStatusEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public static AuditStatusEnum getByCode(Integer code) {
        for (AuditStatusEnum status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
}
