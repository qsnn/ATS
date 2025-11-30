package com.platform.ats.entity.recruitment.interview;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "interview_arrange")
public class InterviewArrange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "arrange_id")
    private Long arrangeId;

    @Column(name = "delivery_id", nullable = false)
    @NotNull(message = "投递记录ID不能为空")
    private Long deliveryId;

    @Column(name = "interviewer_id", nullable = false)
    @NotNull(message = "面试官ID不能为空")
    private Long interviewerId;

    @Column(name = "interview_time", nullable = false)
    @NotNull(message = "面试时间不能为空")
    private LocalDateTime interviewTime;

    @Column(name = "interview_type", nullable = false)
    @NotNull(message = "面试形式不能为空")
    private Integer interviewType; // 1-线上 2-线下

    @Column(name = "online_meeting_software", length = 50)
    @Size(max = 50, message = "线上会议软件名称长度不能超过50个字符")
    private String onlineMeetingSoftware;

    @Column(name = "online_meeting_no", length = 50)
    @Size(max = 50, message = "线上会议号长度不能超过50个字符")
    private String onlineMeetingNo;

    @Column(name = "interview_address_id")
    private Long interviewAddressId;

    @Column(name = "remind_status")
    private Integer remindStatus = 0; // 0-未提醒 1-已提醒

    @Column(name = "create_time")
    @CreationTimestamp
    private LocalDateTime createTime;

    @Column(name = "update_time")
    @UpdateTimestamp
    private LocalDateTime updateTime;

    @Column(name = "delete_flag")
    private Integer deleteFlag = 0;


}
