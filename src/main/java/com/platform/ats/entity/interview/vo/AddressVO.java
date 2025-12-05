package com.platform.ats.entity.interview.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AddressVO {

    private Long addressId;

    private Long companyId;

    private String province;

    private String city;

    private String district;

    private String detailAddress;

    private String addressName;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    private Integer deleteFlag;
}
