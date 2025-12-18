package com.platform.ats.entity.user;

import lombok.Getter;

/**
 * 用户类型枚举
 * 
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Getter
public enum UserType {
    /**
     * 平台管理员
     */
    PLATFORM_ADMIN(1, "平台管理员"),
    
    /**
     * 企业管理员
     */
    COMPANY_ADMIN(2, "企业管理员"),
    
    /**
     * HR
     */
    HR(3, "HR"),
    
    /**
     * 求职者
     */
    JOB_SEEKER(4, "求职者");

    /**
     * 类型码
     */
    private final Integer code;
    
    /**
     * 类型描述
     */
    private final String desc;

    /**
     * 构造函数
     * 
     * @param code 类型码
     * @param desc 类型描述
     */
    UserType(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    /**
     * 根据类型码获取对应的枚举值
     * 
     * @param code 类型码
     * @return 对应的UserType枚举值，如果没有找到则返回null
     */
    public static UserType getByCode(Integer code) {
        for (UserType type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        return null;
    }
}
