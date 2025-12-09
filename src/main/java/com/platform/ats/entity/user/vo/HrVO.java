package com.platform.ats.entity.user.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * HR账户视图对象
 */
@Data
public class HrVO {

    private Long userId;
    private String username;
    private Integer userType;
    private String userTypeDesc;
    private Integer status;
    private String statusDesc;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    private Long companyId;
}