package com.platform.ats.entity.interview.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;


@Data
public class ArrangeVO {

    private Long deliveryId;

    private Long interviewerId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime interviewTime;

    private Integer interviewType;

    private String onlineMeetingSoftware;

    private String onlineMeetingNo;

    private Long interviewAddressId;

    private Integer remindStatus;

    private Integer deleteFlag;
}
