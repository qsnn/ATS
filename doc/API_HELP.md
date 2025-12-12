# ATS系统API帮助文档

本文档提供了ATS（招聘管理系统）的主要API接口说明和使用示例。

## 目录

- [用户管理](#用户管理)
- [职位管理](#职位管理)
- [简历管理](#简历管理)
- [职位申请管理](#职位申请管理)
- [公司信息管理](#公司信息管理)
- [面试信息管理](#面试信息管理)
- [职位收藏管理](#职位收藏管理)
- [人才库管理](#人才库管理)

## 用户管理

### 用户注册
```
POST /api/user/register
```

**请求参数**
```json
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com",
  "phone": "13800138000"
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": 10001
}
```

### 用户登录
```
POST /api/user/login
```

**请求参数**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "userId": 10001,
    "username": "testuser",
    "email": "test@example.com",
    "phone": "13800138000",
    "userType": 4,
    "userTypeDesc": "求职者",
    "createTime": "2023-01-15T09:30:00",
    "companyId": null,
    "companyName": null,
    "jobApplyCount": 0,
    "recruitmentCount": 0,
    "companyManageCount": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 获取用户信息
```
GET /api/user/{userId}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "userId": 10001,
    "username": "testuser",
    "email": "test@example.com",
    "phone": "13800138000",
    "userType": 4,
    "userTypeDesc": "求职者",
    "status": 1,
    "createTime": "2023-01-15T09:30:00",
    "companyId": null,
    "companyName": null,
    "jobApplyCount": 0,
    "recruitmentCount": 0,
    "companyManageCount": 0
  }
}
```

### 分页查询用户列表
```
GET /api/user/page?pageNum=1&pageSize=10
```

**可选查询参数**
- username: 用户名（模糊查询）
- userType: 用户类型
- status: 用户状态

**响应示例**
```json
{
  "code": 200,
  "data": {
    "records": [
      {
        "userId": 10001,
        "username": "testuser",
        "email": "test@example.com",
        "phone": "13800138000",
        "userType": 4,
        "userTypeDesc": "求职者",
        "status": 1,
        "statusDesc": "正常",
        "createTime": "2023-01-15T09:30:00",
        "updateTime": "2023-01-15T09:30:00",
        "companyId": null,
        "companyName": null,
        "hasCompanyManagePermission": false,
        "hasRecruitmentPermission": false
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1
  }
}
```

### 创建用户
```
POST /api/user
```

**请求参数**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "newuser@example.com",
  "phone": "13900139000",
  "userType": 4
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": 10002
}
```

### 更新用户
```
PUT /api/user/{userId}
```

**请求参数**
```json
{
  "userId": 10002,
  "username": "updateduser",
  "email": "updated@example.com",
  "phone": "13700137000"
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": true
}
```

### 修改密码
```
PUT /api/user/{userId}/password
```

**请求参数**
```json
{
  "oldPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": true
}
```

## 职位管理

### 获取职位列表
```
GET /api/job/info/list?current=1&size=10
```

**可选查询参数**
- jobName: 职位名称（模糊查询）
- city: 工作城市
- salaryMin: 最低薪资
- salaryMax: 最高薪资
- education: 学历要求
- workExperience: 工作经验要求
- publishStatus: 发布状态

**响应示例**
```json
{
  "records": [
    {
      "jobId": 1001,
      "companyId": 2001,
      "jobName": "Java开发工程师",
      "department": "技术部",
      "province": "北京市",
      "city": "北京",
      "district": "海淀区",
      "salaryMin": 15000,
      "salaryMax": 25000,
      "education": 2,
      "educationDesc": "本科",
      "workExperience": 3,
      "workExperienceDesc": "3-5年",
      "jobDesc": "负责Java后端开发工作",
      "publisherId": 10005,
      "publishStatus": 1,
      "publishStatusDesc": "已发布",
      "createTime": "2023-01-15T09:30:00",
      "updateTime": "2023-01-15T09:30:00",
      "companyName": "科技有限公司",
      "publisherName": "HR张"
    }
  ],
  "total": 1,
  "size": 10,
  "current": 1
}
```

### 获取职位详情
```
GET /api/job/info/{id}
```

**响应示例**
```json
{
  "jobId": 1001,
  "companyId": 2001,
  "jobName": "Java开发工程师",
  "department": "技术部",
  "province": "北京市",
  "city": "北京",
  "district": "海淀区",
  "salaryMin": 15000,
  "salaryMax": 25000,
  "education": 2,
  "educationDesc": "本科",
  "workExperience": 3,
  "workExperienceDesc": "3-5年",
  "jobDesc": "负责Java后端开发工作",
  "publisherId": 10005,
  "publishStatus": 1,
  "publishStatusDesc": "已发布",
  "createTime": "2023-01-15T09:30:00",
  "updateTime": "2023-01-15T09:30:00",
  "companyName": "科技有限公司",
  "publisherName": "HR张"
}
```

### 创建职位
```
POST /api/job/info
```

**请求参数**
```json
{
  "jobName": "前端开发工程师",
  "companyId": 2001,
  "city": "上海",
  "salaryMin": 12000,
  "salaryMax": 20000,
  "education": 2,
  "workExperience": 2,
  "jobDesc": "负责前端页面开发",
  "publisherId": 10005
}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 更新职位
```
PUT /api/job/info
```

**请求参数**
```json
{
  "jobId": 1002,
  "jobName": "高级前端开发工程师",
  "city": "上海",
  "salaryMin": 15000,
  "salaryMax": 25000,
  "education": 3,
  "workExperience": 5,
  "jobDesc": "负责复杂前端应用开发"
}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 删除职位
```
DELETE /api/job/info/{id}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 发布职位
```
PUT /api/job/info/publish/{id}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 下架职位
```
PUT /api/job/info/unpublish/{id}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

## 简历管理

### 创建简历
```
POST /api/resume
```

**请求参数**
```json
{
  "userId": 10001,
  "resumeName": "张三的简历",
  "name": "张三",
  "gender": 1,
  "age": 28,
  "education": 2,
  "workExperience": 3,
  "skill": "Java, Spring, MySQL",
  "jobIntention": "Java开发工程师",
  "phone": "13800138000",
  "email": "zhangsan@example.com"
}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "resumeId": 3001,
    "userId": 10001,
    "resumeName": "张三的简历",
    "name": "张三",
    "gender": 1,
    "genderDesc": "男",
    "age": 28,
    "education": 2,
    "workExperience": 3,
    "skill": "Java, Spring, MySQL",
    "jobIntention": "Java开发工程师",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "createTime": "2023-01-15T09:30:00",
    "updateTime": "2023-01-15T09:30:00",
    "deleteFlag": 0
  }
}
```

### 更新简历
```
PUT /api/resume
```

**请求参数**
```json
{
  "resumeId": 3001,
  "resumeName": "张三的简历",
  "name": "张三",
  "gender": 1,
  "age": 29,
  "education": 3,
  "workExperience": 5,
  "skill": "Java, Spring, MySQL, Redis",
  "jobIntention": "高级Java开发工程师",
  "phone": "13800138000",
  "email": "zhangsan@example.com"
}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "resumeId": 3001,
    "userId": 10001,
    "resumeName": "张三的简历",
    "name": "张三",
    "gender": 1,
    "genderDesc": "男",
    "age": 29,
    "education": 3,
    "workExperience": 5,
    "skill": "Java, Spring, MySQL, Redis",
    "jobIntention": "高级Java开发工程师",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "createTime": "2023-01-15T09:30:00",
    "updateTime": "2023-01-16T10:30:00",
    "deleteFlag": 0
  }
}
```

### 删除简历
```
DELETE /api/resume/{resumeId}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 获取简历详情
```
GET /api/resume/{resumeId}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "resumeId": 3001,
    "userId": 10001,
    "resumeName": "张三的简历",
    "name": "张三",
    "gender": 1,
    "genderDesc": "男",
    "age": 29,
    "education": 3,
    "workExperience": 5,
    "skill": "Java, Spring, MySQL, Redis",
    "jobIntention": "高级Java开发工程师",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "createTime": "2023-01-15T09:30:00",
    "updateTime": "2023-01-16T10:30:00",
    "deleteFlag": 0
  }
}
```

### 获取用户的所有简历
```
GET /api/resume/user/{userId}
```

**响应示例**
```json
{
  "code": 200,
  "data": [
    {
      "resumeId": 3001,
      "userId": 10001,
      "resumeName": "张三的简历",
      "name": "张三",
      "gender": 1,
      "genderDesc": "男",
      "age": 29,
      "education": 3,
      "workExperience": 5,
      "skill": "Java, Spring, MySQL, Redis",
      "jobIntention": "高级Java开发工程师",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "createTime": "2023-01-15T09:30:00",
      "updateTime": "2023-01-16T10:30:00",
      "deleteFlag": 0
    }
  ]
}
```

## 职位申请管理

### 申请职位
```
POST /api/applications
```

**请求参数**
```json
{
  "userId": 10001,
  "jobId": 1001,
  "resumeId": 3001
}
```

**响应示例**
```json
{
  "code": 200,
  "data": 4001
}
```

### 查询我的申请记录
```
GET /api/applications/my?userId=10001&current=1&size=10
```

**可选参数**
- status: 申请状态列表

**响应示例**
```json
{
  "code": 200,
  "data": {
    "records": [
      {
        "applicationId": 4001,
        "jobId": 1001,
        "jobTitle": "Java开发工程师",
        "companyId": 2001,
        "companyName": "科技有限公司",
        "resumeId": 3001,
        "status": 1,
        "statusDesc": "已申请",
        "applyTime": "2023-01-16T10:30:00",
        "publishStatus": 1,
        "publishStatusDesc": "已发布",
        "resumeSnapshot": "{\"resumeId\":3001,\"userId\":10001,\"name\":\"张三\",\"education\":\"硕士\",...}"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1
  }
}
```

### 查询公司下所有申请记录
```
GET /api/applications/company/{companyId}?current=1&size=10
```

**可选参数**
- status: 包含的状态列表
- excludeStatus: 排除的状态列表

**响应示例**
```json
{
  "code": 200,
  "data": {
    "records": [
      {
        "applicationId": 4001,
        "jobId": 1001,
        "jobTitle": "Java开发工程师",
        "userId": 10001,
        "userName": "张三",
        "phone": "13800138000",
        "email": "zhangsan@example.com",
        "resumeId": 3001,
        "resumeTitle": "张三的简历",
        "status": 1,
        "statusDesc": "已申请",
        "applyTime": "2023-01-16T10:30:00",
        "resumeSnapshot": "{\"resumeId\":3001,\"userId\":10001,\"name\":\"张三\",\"education\":\"硕士\",...}"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1
  }
}
```

### 更新申请状态
```
PUT /api/applications/{applicationId}/status
```

**请求参数**
```json
{
  "status": 2,
  "reason": "符合要求，安排面试"
}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 取消申请
```
PUT /api/applications/{applicationId}/withdraw?userId={userId}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

## 公司信息管理

### 新增公司
```
POST /api/company
```

**请求参数**
```json
{
  "companyName": "新创科技有限公司",
  "companyDesc": "一家专注于互联网技术的创新公司",
  "companyAddress": "科技园南路1001号",
  "contactPerson": "李经理",
  "contactPhone": "0755-12345678",
  "contactEmail": "contact@newtech.com",
  "creatorId": 10002
}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "companyId": 2002,
    "companyName": "新创科技有限公司",
    "companyDesc": "一家专注于互联网技术的创新公司",
    "companyAddress": "科技园南路1001号",
    "contactPerson": "李经理",
    "contactPhone": "0755-12345678",
    "contactEmail": "contact@newtech.com",
    "creatorId": 10002,
    "createTime": "2023-01-16T10:30:00",
    "updateTime": "2023-01-16T10:30:00"
  }
}
```

### 修改公司
```
PUT /api/company
```

**请求参数**
```json
{
  "companyId": 2002,
  "companyName": "新创科技有限公司",
  "companyDesc": "一家专注于软件开发的创新公司",
  "companyAddress": "科技园南路1001号",
  "contactPerson": "王经理",
  "contactPhone": "0755-87654321",
  "contactEmail": "contact@newtech.com"
}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "companyId": 2002,
    "companyName": "新创科技有限公司",
    "companyDesc": "一家专注于软件开发的创新公司",
    "companyAddress": "科技园南路1001号",
    "contactPerson": "王经理",
    "contactPhone": "0755-87654321",
    "contactEmail": "contact@newtech.com",
    "creatorId": 10002,
    "createTime": "2023-01-16T10:30:00",
    "updateTime": "2023-01-16T11:30:00"
  }
}
```

### 删除公司
```
DELETE /api/company/{companyId}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 根据ID查询公司
```
GET /api/company/{companyId}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "companyId": 2002,
    "companyName": "新创科技有限公司",
    "companyDesc": "一家专注于软件开发的创新公司",
    "companyAddress": "科技园南路1001号",
    "contactPerson": "王经理",
    "contactPhone": "0755-87654321",
    "contactEmail": "contact@newtech.com",
    "creatorId": 10002,
    "createTime": "2023-01-16T10:30:00",
    "updateTime": "2023-01-16T11:30:00"
  }
}
```

### 查询全部公司列表
```
GET /api/company/list
```

**响应示例**
```json
{
  "code": 200,
  "data": [
    {
      "companyId": 2001,
      "companyName": "科技有限公司",
      "companyDesc": "一家知名的科技公司",
      "companyAddress": "中关村大街1号",
      "contactPerson": "张总",
      "contactPhone": "010-12345678",
      "contactEmail": "contact@tech.com",
      "creatorId": 10003,
      "createTime": "2023-01-15T09:30:00",
      "updateTime": "2023-01-15T09:30:00"
    },
    {
      "companyId": 2002,
      "companyName": "新创科技有限公司",
      "companyDesc": "一家专注于软件开发的创新公司",
      "companyAddress": "科技园南路1001号",
      "contactPerson": "王经理",
      "contactPhone": "0755-87654321",
      "contactEmail": "contact@newtech.com",
      "creatorId": 10002,
      "createTime": "2023-01-16T10:30:00",
      "updateTime": "2023-01-16T11:30:00"
    }
  ]
}
```

## 面试信息管理

### 创建面试信息
```
POST /api/interview
```

**请求参数**
```json
{
  "applicationId": 4001,
  "interviewerId": 10005,
  "intervieweeId": 10001,
  "interviewTime": "2023-01-20T10:00:00",
  "interviewPlace": "会议室A",
  "status": 1
}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "arrangeId": 5001,
    "applicationId": 4001,
    "interviewerId": 10005,
    "intervieweeId": 10001,
    "createTime": "2023-01-16T11:00:00",
    "updateTime": "2023-01-16T11:00:00",
    "deleteFlag": 0,
    "intervieweeName": "张三",
    "interviewPlace": "会议室A",
    "interviewTime": "2023-01-20T10:00:00",
    "status": 1
  }
}
```

### 更新面试信息
```
PUT /api/interview
```

**请求参数**
```json
{
  "arrangeId": 5001,
  "interviewTime": "2023-01-20T14:00:00",
  "interviewPlace": "会议室B",
  "status": 1
}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "arrangeId": 5001,
    "applicationId": 4001,
    "interviewerId": 10005,
    "intervieweeId": 10001,
    "createTime": "2023-01-16T11:00:00",
    "updateTime": "2023-01-16T12:00:00",
    "deleteFlag": 0,
    "intervieweeName": "张三",
    "interviewPlace": "会议室B",
    "interviewTime": "2023-01-20T14:00:00",
    "status": 1
  }
}
```

### 删除面试信息
```
DELETE /api/interview/{arrangeId}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 根据面试官ID获取面试信息
```
GET /api/interview/interviewer/{interviewerId}
```

**响应示例**
```json
{
  "code": 200,
  "data": [
    {
      "arrangeId": 5001,
      "applicationId": 4001,
      "interviewerId": 10005,
      "intervieweeId": 10001,
      "createTime": "2023-01-16T11:00:00",
      "updateTime": "2023-01-16T12:00:00",
      "deleteFlag": 0,
      "intervieweeName": "张三",
      "interviewPlace": "会议室B",
      "interviewTime": "2023-01-20T14:00:00",
      "status": 1
    }
  ]
}
```

### 根据求职者用户ID获取面试信息
```
GET /api/interview/user/{userId}
```

**响应示例**
```json
{
  "code": 200,
  "data": [
    {
      "arrangeId": 5001,
      "applicationId": 4001,
      "jobId": 1001,
      "companyId": 2001,
      "jobName": "Java开发工程师",
      "companyName": "科技有限公司",
      "interviewerId": 10005,
      "intervieweeId": 10001,
      "interviewPlace": "会议室B",
      "interviewTime": "2023-01-20T14:00:00",
      "intervieweeName": "张三",
      "status": 1,
      "statusDesc": "准备面试",
      "publishStatus": 1,
      "publishStatusDesc": "已发布",
      "resumeId": 3001,
      "resumeSnapshot": "{\"resumeId\":3001,\"userId\":10001,\"name\":\"张三\",\"education\":\"硕士\",...}"
    }
  ]
}
```

## 职位收藏管理

### 收藏职位
```
POST /api/favorites
```

**请求参数**
```json
{
  "userId": 10001,
  "jobId": 1001
}
```

**响应示例**
```json
{
  "code": 200,
  "data": 6001
}
```

### 取消收藏
```
DELETE /api/favorites?userId=10001&jobId=1001
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 检查是否已收藏
```
GET /api/favorites/check?userId=10001&jobId=1001
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 分页查询我的收藏职位
```
GET /api/favorites/my?userId=10001&current=1&size=10
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "records": [
      {
        "favoriteId": 6001,
        "jobId": 1001,
        "userId": 10001,
        "jobTitle": "Java开发工程师",
        "companyId": 2001,
        "companyName": "科技有限公司",
        "department": "技术部",
        "publishStatus": 1,
        "publishStatusDesc": "已发布",
        "createTime": "2023-01-16T10:30:00"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1
  }
}
```

## 人才库管理

### 新增人才
```
POST /api/talent
```

**请求参数**
```json
{
  "resumeId": 3002,
  "companyId": 2001,
  "tag": "高级工程师",
  "operatorId": 10005
}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "talentId": 7001,
    "resumeId": 3002,
    "companyId": 2001,
    "tag": "高级工程师",
    "operatorId": 10005,
    "putInTime": "2023-01-16T11:00:00",
    "updateTime": "2023-01-16T11:00:00"
  }
}
```

### 修改人才
```
PUT /api/talent
```

**请求参数**
```json
{
  "talentId": 7001,
  "resumeId": 3002,
  "companyId": 2001,
  "tag": "架构师",
  "operatorId": 10005
}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "talentId": 7001,
    "resumeId": 3002,
    "companyId": 2001,
    "tag": "架构师",
    "operatorId": 10005,
    "putInTime": "2023-01-16T11:00:00",
    "updateTime": "2023-01-16T12:00:00"
  }
}
```

### 删除人才
```
DELETE /api/talent/{talentId}
```

**响应示例**
```json
{
  "code": 200,
  "data": true
}
```

### 根据ID查询人才
```
GET /api/talent/{talentId}
```

**响应示例**
```json
{
  "code": 200,
  "data": {
    "talentId": 7001,
    "resumeId": 3002,
    "companyId": 2001,
    "tag": "架构师",
    "operatorId": 10005,
    "putInTime": "2023-01-16T11:00:00",
    "updateTime": "2023-01-16T12:00:00"
  }
}
```

### 根据公司ID查询人才列表
```
GET /api/talent/company/{companyId}
```

**响应示例**
```json
{
  "code": 200,
  "data": [
    {
      "talentId": 7001,
      "resumeId": 3002,
      "companyId": 2001,
      "tag": "架构师",
      "operatorId": 10005,
      "candidateName": "李四",
      "position": "Java架构师",
      "phone": "13900139000",
      "email": "lisi@example.com",
      "putInTime": "2023-01-16T11:00:00",
      "updateTime": "2023-01-16T12:00:00"
    }
  ]
}