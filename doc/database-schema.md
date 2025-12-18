# 数据库表结构说明

## 1. sys_user（系统用户表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| user_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 用户ID |
| username | VARCHAR | NOT NULL | 登录账号 |
| password | VARCHAR | NOT NULL | 密码 |
| phone | VARCHAR |  | 手机号 |
| email | VARCHAR |  | 邮箱 |
| user_type | INT |  | 用户类型：1-平台管理员 2-企业管理员 3-HR 4-求职者 |
| status | INT |  | 账号状态：0-禁用 1-正常 2-待完善 |
| create_time | DATETIME |  | 创建时间 |
| update_time | DATETIME |  | 更新时间 |
| delete_flag | INT | DEFAULT 0 | 删除标记：0-未删 1-已删 |
| company_id | BIGINT |  | 所属企业ID |

**关联关系：**
- company_id 外键关联 company_info.company_id

## 2. company_info（公司信息表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| company_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 公司ID |
| company_name | VARCHAR | NOT NULL | 公司名称 |
| company_desc | TEXT |  | 公司描述 |
| company_address | VARCHAR |  | 公司地址 |
| contact_person | VARCHAR |  | 联系人 |
| contact_phone | VARCHAR |  | 联系电话 |
| contact_email | VARCHAR |  | 联系邮箱 |
| creator_id | BIGINT |  | 创建人ID |
| create_time | DATETIME |  | 创建时间 |
| update_time | DATETIME |  | 更新时间 |
| delete_flag | INT | DEFAULT 0 | 删除标记：0-未删 1-已删 |

**关联关系：**
- creator_id 外键关联 sys_user.user_id

## 3. job_info（职位信息表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| job_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 职位ID |
| company_id | BIGINT | NOT NULL | 公司ID |
| job_name | VARCHAR | NOT NULL | 职位名称 |
| department | VARCHAR |  | 部门 |
| province | VARCHAR |  | 省份 |
| city | VARCHAR |  | 城市 |
| district | VARCHAR |  | 区域 |
| salary_min | DECIMAL |  | 最低薪资 |
| salary_max | DECIMAL |  | 最高薪资 |
| education | INT |  | 学历要求 |
| work_experience | INT |  | 工作经验要求 |
| job_desc | TEXT |  | 职位描述 |
| publisher_id | BIGINT |  | 发布人ID |
| publish_status | INT | DEFAULT 0 | 发布状态：0-草稿 1-已发布 2-已下架 |
| create_time | DATETIME |  | 创建时间 |
| update_time | DATETIME |  | 更新时间 |
| delete_flag | INT | DEFAULT 0 | 删除标记：0-未删 1-已删 |

**关联关系：**
- company_id 外键关联 company_info.company_id
- publisher_id 外键关联 sys_user.user_id

## 4. job_application（职位申请表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| application_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 申请ID |
| user_id | BIGINT | NOT NULL | 用户ID |
| jobId | BIGINT | NOT NULL | 职位ID |
| resume_id | BIGINT | NOT NULL | 简历ID |
| status | INT | DEFAULT 1 | 申请状态：1-APPLIED(已申请), 2-ACCEPTED(已接受), 3-REJECTED(已拒绝), 4-WITHDRAWN(已撤销) |
| apply_time | DATETIME |  | 申请时间 |
| update_time | DATETIME |  | 更新时间 |
| resume_snapshot | TEXT |  | 简历快照（包含所有简历信息） |
| delete_flag | INT | DEFAULT 0 | 删除标记：0-未删 1-已删 |

**关联关系：**
- user_id 外键关联 sys_user.user_id
- job_id 外键关联 job_info.job_id
- resume_id 外键关联 resume_info.resume_id

## 5. resume_info（简历信息表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| resume_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 简历ID |
| user_id | BIGINT | NOT NULL | 用户ID |
| resume_name | VARCHAR |  | 简历名称 |
| name | VARCHAR |  | 姓名 |
| gender | INT |  | 性别：1-男 2-女 |
| age | INT |  | 年龄 |
| education | INT |  | 学历 |
| work_experience | INT |  | 工作经验 |
| skill | TEXT |  | 技能 |
| job_intention | VARCHAR |  | 求职意向 |
| phone | VARCHAR |  | 电话 |
| email | VARCHAR |  | 邮箱 |
| create_time | DATETIME |  | 创建时间 |
| update_time | DATETIME |  | 更新时间 |
| delete_flag | INT | DEFAULT 0 | 删除标记 |

**关联关系：**
- user_id 外键关联 sys_user.user_id

## 6. interview_info（面试信息表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| arrange_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 面试安排ID |
| application_id | BIGINT | NOT NULL | 申请ID |
| interviewer_id | BIGINT | NOT NULL | 面试官ID |
| interviewee_id | BIGINT | NOT NULL | 面试者ID |
| create_time | DATETIME |  | 创建时间 |
| update_time | DATETIME |  | 更新时间 |
| delete_flag | INT | DEFAULT 0 | 删除标记 |
| interviewee_name | VARCHAR |  | 面试者姓名 |
| interview_place | VARCHAR |  | 面试地点 |
| interview_time | DATETIME |  | 面试时间 |
| status | INT |  | 面试状态：1-PREPARING_INTERVIEW(准备面试) 2-INTERVIEW_ENDED(面试结束) 3-ACCEPTED(录取) 4-REJECTED(未录取) |

**关联关系：**
- application_id 外键关联 job_application.application_id
- interviewer_id 外键关联 sys_user.user_id
- interviewee_id 外键关联 sys_user.user_id

## 7. job_favorite（职位收藏表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| favorite_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 收藏ID |
| user_id | BIGINT | NOT NULL | 用户ID |
| job_id | BIGINT | NOT NULL | 职位ID |
| create_time | DATETIME |  | 创建时间 |
| update_time | DATETIME |  | 更新时间 |
| delete_flag | INT | DEFAULT 0 | 删除标记：0-未删 1-已删 |

**关联关系：**
- user_id 外键关联 sys_user.user_id
- job_id 外键关联 job_info.job_id

## 8. talent_pool（人才库表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| talent_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 人才ID |
| resume_id | BIGINT | NOT NULL | 简历ID |
| company_id | BIGINT | NOT NULL | 公司ID |
| tag | VARCHAR |  | 简要标签/备注 |
| put_in_time | DATETIME |  | 录入时间 |
| operator_id | BIGINT | NOT NULL | 操作人ID（企业端当前登录用户） |
| update_time | DATETIME |  | 更新时间 |
| delete_flag | INT | DEFAULT 0 | 删除标记：0-未删 1-已删 |

**关联关系：**
- resume_id 外键关联 resume_info.resume_id
- company_id 外键关联 company_info.company_id
- operator_id 外键关联 sys_user.user_id

## 9. sys_notice（系统通知表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| notice_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 通知ID |
| user_id | BIGINT | NOT NULL | 接收用户ID |
| notice_type | VARCHAR |  | 通知类型（如：简历投递成功、面试通知） |
| notice_content | TEXT |  | 通知内容 |
| send_time | DATETIME |  | 发送时间 |
| read_status | INT | DEFAULT 0 | 阅读状态：0-未读 1-已读 |
| send_status | INT | DEFAULT 0 | 发送状态：0-未发 1-已发 |
| delete_flag | INT | DEFAULT 0 | 删除标记：0-未删 1-已删 |

**关联关系：**
- user_id 外键关联 sys_user.user_id

## 10. sys_operation_log（系统操作日志表）

| 字段名 | 类型 | 限制条件 | 描述 |
|--------|------|----------|------|
| log_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 日志ID |
| user_id | BIGINT |  | 操作人ID |
| username | VARCHAR |  | 操作人用户名 |
| operation_module | VARCHAR |  | 操作模块（如：用户管理、职位发布） |
| operation_type | VARCHAR |  | 操作类型（如：新增、修改、删除） |
| operation_content | TEXT |  | 操作内容（如：修改用户状态为禁用） |
| request_uri | VARCHAR |  | 请求URI |
| request_method | VARCHAR |  | 请求方法（GET/POST/PUT/DELETE等） |
| request_params | TEXT |  | 请求参数 |
| operation_time | DATETIME |  | 操作时间 |
| ip_address | VARCHAR |  | 操作IP地址 |
| user_agent | TEXT |  | 用户代理 |
| operation_result | INT |  | 操作结果：0-失败 1-成功 |
| cost_time | INT |  | 耗时（毫秒） |
| error_msg | TEXT |  | 错误信息（失败时填写） |
| delete_flag | INT | DEFAULT 0 | 删除标记：0-未删 1-已删 |

**关联关系：**
- user_id 外键关联 sys_user.user_id