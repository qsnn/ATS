package com.platform.ats.entity.company;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.io.Serial;

/**
 * 公司信息实体类
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("company_info")
public class CompanyInfo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 公司ID，主键自增
     */
    @TableId(value = "company_id", type = IdType.AUTO)
    private Long companyId;

    /**
     * 公司名称
     */
    @TableField("company_name")
    private String companyName;

    /**
     * 公司描述
     */
    @TableField("company_desc")
    private String companyDesc;

    /**
     * 公司地址
     */
    @TableField("company_address")
    private String companyAddress;

    /**
     * 联系人
     */
    @TableField("contact_person")
    private String contactPerson;

    /**
     * 联系电话
     */
    @TableField("contact_phone")
    private String contactPhone;

    /**
     * 联系邮箱
     */
    @TableField("contact_email")
    private String contactEmail;

    /**
     * 创建人ID
     */
    @TableField("creator_id")
    private Long creatorId;

    /**
     * 创建时间，只在插入时自动填充
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间，插入和更新时都自动填充
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    /**
     * 删除标记：0-未删 1-已删
     */
    @TableField("delete_flag")
    @TableLogic
    private Integer deleteFlag;
    
    // 删除了status字段相关代码
}