package com.platform.ats.service;

import com.platform.ats.entity.application.JobApplication;
import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.notification.SysNotice;
import com.platform.ats.entity.user.SysUser;
import com.platform.ats.entity.user.UserType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 通知辅助服务类
 * 处理各种业务场景下的通知创建
 *
 * @author Administrator
 * @since 2025-12-16
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationHelperService {

    private final SysNoticeService sysNoticeService;

    /**
     * 当求职者提交的申请被处理（同意、拒绝）时创建通知
     *
     * @param application 申请信息
     */
    public void createApplicationProcessedNotice(JobApplication application) {
        if (application == null || application.getUserId() == null) {
            log.warn("申请信息为空或缺少用户ID，无法创建通知");
            return;
        }

        // 创建通知给求职者
        SysNotice notice = new SysNotice();
        notice.setUserId(application.getUserId());
        notice.setNoticeType("APPLICATION_STATUS");

        String statusDesc = "";
        switch (application.getStatus()) {
            case 2: // ACCEPTED
                statusDesc = "已接受";
                break;
            case 3: // REJECTED
                statusDesc = "已拒绝";
                break;
            default:
                statusDesc = "状态变更";
                break;
        }

        notice.setNoticeContent(String.format("您的职位申请状态已更新为：%s", statusDesc));
        notice.setSendTime(LocalDateTime.now());
        notice.setReadStatus(0); // 未读
        notice.setSendStatus(0); // 未发
        notice.setDeleteFlag(0); // 未删

        sysNoticeService.createNotice(notice);
        log.info("为用户{}创建了申请处理通知，申请ID: {}", application.getUserId(), application.getApplicationId());
    }

    /**
     * 当面试安排成功时创建通知给求职者
     *
     * @param interviewInfo 面试信息
     */
    public void createInterviewArrangedNotice(InterviewInfo interviewInfo) {
        if (interviewInfo == null || interviewInfo.getIntervieweeId() == null) {
            log.warn("面试信息为空或缺少面试者ID，无法创建通知");
            return;
        }

        // 创建通知给求职者
        SysNotice notice = new SysNotice();
        notice.setUserId(interviewInfo.getIntervieweeId());
        notice.setNoticeType("INTERVIEW_ARRANGED");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm:ss");
        String interviewTimeStr = interviewInfo.getInterviewTime() != null ?
                interviewInfo.getInterviewTime().format(formatter) : "待定";

        notice.setNoticeContent(String.format("您于%s有面试安排，请提前准备", interviewTimeStr));
        // sendTime设置为当前时间
        notice.setSendTime(LocalDateTime.now());
        notice.setReadStatus(0); // 未读
        notice.setSendStatus(0); // 未发
        notice.setDeleteFlag(0); // 未删

        sysNoticeService.createNotice(notice);
        log.info("为用户{}创建了面试安排通知，面试ID: {}", interviewInfo.getIntervieweeId(), interviewInfo.getArrangeId());
    }

    /**
     * 当面试结果公布时创建通知给求职者
     *
     * @param interviewInfo 面试信息
     */
    public void createInterviewResultNotice(InterviewInfo interviewInfo) {
        if (interviewInfo == null || interviewInfo.getIntervieweeId() == null) {
            log.warn("面试信息为空或缺少面试者ID，无法创建通知");
            return;
        }

        // 创建通知给求职者
        SysNotice notice = new SysNotice();
        notice.setUserId(interviewInfo.getIntervieweeId());
        notice.setNoticeType("INTERVIEW_RESULT");

        String resultDesc = "";
        switch (interviewInfo.getStatus()) {
            case 3: // ACCEPTED 录取
                resultDesc = "恭喜您，您已被录取";
                break;
            case 4: // REJECTED 未录取
                resultDesc = "很遗憾，您未被录取";
                break;
            default:
                resultDesc = "面试结果已更新";
                break;
        }

        notice.setNoticeContent(resultDesc);
        notice.setSendTime(LocalDateTime.now());
        notice.setReadStatus(0); // 未读
        notice.setSendStatus(0); // 未发
        notice.setDeleteFlag(0); // 未删

        sysNoticeService.createNotice(notice);
        log.info("为用户{}创建了面试结果通知，面试ID: {}", interviewInfo.getIntervieweeId(), interviewInfo.getArrangeId());
    }

    /**
     * 当HR/雇主登录时检查未处理的申请并创建通知
     *
     * @param userId 用户ID
     * @param pendingCount 未处理申请数量
     */
    public void createPendingApplicationsNotice(Long userId, int pendingCount) {
        if (userId == null) {
            log.warn("用户ID为空，无法检查未处理的申请");
            return;
        }

        if (pendingCount > 0) {
            // 创建通知给HR/雇主
            SysNotice notice = new SysNotice();
            notice.setUserId(userId);
            notice.setNoticeType("PENDING_APPLICATIONS");
            notice.setNoticeContent(String.format("您有未处理的申请%d条，请尽快处理", pendingCount));
            notice.setSendTime(LocalDateTime.now());
            notice.setReadStatus(0); // 未读
            notice.setSendStatus(0); // 未发
            notice.setDeleteFlag(0); // 未删

            sysNoticeService.createNotice(notice);
            log.info("为用户{}创建了未处理申请通知，未处理申请数量: {}", userId, pendingCount);
        }
    }

    /**
     * 当HR/雇主登录时检查即将开始的面试并创建通知
     *
     * @param userId 用户ID
     * @param upcomingInterviews 即将到来的面试列表
     */
    public void createUpcomingInterviewsNotice(Long userId, List<InterviewInfo> upcomingInterviews) {
        if (userId == null) {
            log.warn("用户ID为空，无法检查即将到来的面试");
            return;
        }

        for (InterviewInfo interview : upcomingInterviews) {
            // 创建通知给HR/雇主
            SysNotice notice = new SysNotice();
            notice.setUserId(userId);
            notice.setNoticeType("UPCOMING_INTERVIEW");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm:ss");
            String interviewTimeStr = interview.getInterviewTime() != null ?
                    interview.getInterviewTime().format(formatter) : "待定";

            notice.setNoticeContent(String.format("您于%s有面试安排，请提前准备", interviewTimeStr));
            // sendTime设置为当前时间
            notice.setSendTime(LocalDateTime.now());
            notice.setReadStatus(0); // 未读
            notice.setSendStatus(0); // 未发
            notice.setDeleteFlag(0); // 未删

            sysNoticeService.createNotice(notice);
            log.info("为用户{}创建了即将到来的面试通知，面试ID: {}", userId, interview.getArrangeId());
        }
    }

    /**
     * 当面试结束时创建通知给求职者
     *
     * @param interviewInfo 面试信息
     */
    public void createInterviewEndedNotice(InterviewInfo interviewInfo) {
        if (interviewInfo == null || interviewInfo.getIntervieweeId() == null) {
            log.warn("面试信息为空或缺少面试者ID，无法创建通知");
            return;
        }

        // 创建通知给求职者
        SysNotice notice = new SysNotice();
        notice.setUserId(interviewInfo.getIntervieweeId());
        notice.setNoticeType("INTERVIEW_ENDED");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm:ss");
        String interviewTimeStr = interviewInfo.getInterviewTime() != null ?
                interviewInfo.getInterviewTime().format(formatter) : "待定";

        notice.setNoticeContent(String.format("您于%s的面试已结束，请等待面试结果。", interviewTimeStr));
        notice.setSendTime(LocalDateTime.now());
        notice.setReadStatus(0); // 未读
        notice.setSendStatus(0); // 未发
        notice.setDeleteFlag(0); // 未删

        sysNoticeService.createNotice(notice);
        log.info("为用户{}创建了面试结束通知，面试ID: {}", interviewInfo.getIntervieweeId(), interviewInfo.getArrangeId());
    }
}