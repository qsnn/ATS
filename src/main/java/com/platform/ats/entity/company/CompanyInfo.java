package com.platform.ats.entity.company;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@TableName("company_info")
public class CompanyInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "company_id", type = IdType.AUTO)
    private Long companyId;

    @TableField("company_name")
    private String companyName;

    @TableField("company_desc")
    private String companyDesc;

    @TableField("company_address")
    private String companyAddress;

    @TableField("contact_person")
    private String contactPerson;

    @TableField("contact_phone")
    private String contactPhone;

    @TableField("contact_email")
    private String contactEmail;

    @TableField("creator_id")
    private Long creatorId;


    // 只在插入时自动填充，之后不再修改
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    // 插入和更新时都自动填充
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;


    @TableField("delete_flag")
    @TableLogic
    private Integer deleteFlag;
}
