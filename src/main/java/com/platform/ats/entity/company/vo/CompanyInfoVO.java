package com.platform.ats.entity.company.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanyInfoVO {

    private Long companyId;

    private String companyName;

    private String companyDesc;

    private String companyAddress;

    private String contactPerson;

    private String contactPhone;

    private String contactEmail;

    private Long creatorId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}