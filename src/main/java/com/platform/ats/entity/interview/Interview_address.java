package com.platform.ats.entity.interview;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("interview_address")
public class Interview_address {

    @TableId(type = IdType.AUTO)
    private Long addressId;

    @TableField("company_id")
    @NotNull(message = "企业ID不能为空")
    private Long companyId;

    @TableField("province")
    @NotNull(message = "省份不能为空")
    private String province;

    @TableField("city")
    @NotNull(message = "城市不能为空")
    private String city;

    @TableField("district")
    private String district;

    @TableField("detail_address")
    @NotNull(message = "详细地址不能为空")
    private String detailAddress;

    @TableField("address_name")
    private String addressName;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    @TableField("delete_flag")
    private Integer deleteFlag;
}
