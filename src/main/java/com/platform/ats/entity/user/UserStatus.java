package com.platform.ats.entity.user;

import lombok.Getter;

/**
 * 账号状态枚举
 * 
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Getter
public enum UserStatus {
    /**
     * 禁用状态
     */
    DISABLED(0, "禁用"),
    
    /**
     * 正常状态
     */
    NORMAL(1, "正常"),
    
    /**
     * 待完善状态
     */
    TO_BE_COMPLETED(2, "待完善");

    /**
     * 状态码
     */
    private final Integer code;
    
    /**
     * 状态描述
     */
    private final String desc;

    /**
     * 构造函数
     * 
     * @param code 状态码
     * @param desc 状态描述
     */
    UserStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    /**
     * 根据状态码获取对应的枚举值
     * 
     * @param code 状态码
     * @return 对应的UserStatus枚举值，如果没有找到则返回null
     */
    public static UserStatus getByCode(Integer code) {
        for (UserStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
}
