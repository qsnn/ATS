/**
 * 招聘系统 - 数据模拟模块
 * 提供模拟数据供前端展示使用
 */

const MockData = {
    // 职位数据
    jobs: [
        {
            id: 1,
            title: '前端开发工程师',
            company: '某科技公司',
            location: '北京',
            salary: '¥20K-35K',
            experience: '3-5年',
            education: '本科及以上',
            department: '技术部',
            description: '负责公司产品前端开发，参与需求评审和技术方案设计。',
            requirements: '熟悉React/Vue，了解Webpack，有良好的代码规范。',
            tags: ['React', 'Vue', 'JavaScript', 'HTML5', 'CSS3'],
            postTime: '2024-01-15',
            status: '招聘中',
            applicants: 15
        },
        {
            id: 2,
            title: 'Java后端工程师',
            company: '某互联网公司',
            location: '上海',
            salary: '¥25K-40K',
            experience: '5年以上',
            education: '本科及以上',
            department: '技术部',
            description: '负责后端系统架构设计，高性能高并发系统开发。',
            requirements: '精通Java/Spring，熟悉MySQL/Redis，有微服务经验。',
            tags: ['Java', 'Spring', 'MySQL', '微服务', 'Redis'],
            postTime: '2024-01-18',
            status: '招聘中',
            applicants: 8
        },
        {
            id: 3,
            title: 'UI设计师',
            company: '某设计公司',
            location: '深圳',
            salary: '¥15K-25K',
            experience: '2-4年',
            education: '大专及以上',
            department: '设计部',
            description: '负责公司产品和营销活动视觉设计。',
            requirements: '熟练使用Sketch/Figma，有完整的项目设计经验。',
            tags: ['UI设计', 'Sketch', 'Figma', 'Photoshop'],
            postTime: '2024-01-10',
            status: '已关闭',
            applicants: 23
        }
    ],

    // 申请人数据
    applicants: [
        {
            id: 1,
            name: '张三',
            jobId: 1,
            jobTitle: '前端开发工程师',
            phone: '138****5678',
            email: 'zhangsan@email.com',
            applyTime: '2024-01-16 14:30',
            status: '待处理',
            education: '本科',
            experience: '3年',
            resume: '前端开发工程师，熟悉React技术栈，有多个项目经验...'
        },
        {
            id: 2,
            name: '李四',
            jobId: 2,
            jobTitle: 'Java后端工程师',
            phone: '139****1234',
            email: 'lisi@email.com',
            applyTime: '2024-01-17 09:15',
            status: '待处理',
            education: '硕士',
            experience: '5年',
            resume: 'Java后端开发专家，精通微服务架构，熟悉分布式系统...'
        },
        {
            id: 3,
            name: '王五',
            jobId: 1,
            jobTitle: '前端开发工程师',
            phone: '136****9876',
            email: 'wangwu@email.com',
            applyTime: '2024-01-15 11:20',
            status: '面试中',
            education: '本科',
            experience: '4年',
            resume: '资深前端工程师，熟悉Vue生态，有大型项目开发经验...'
        }
    ],

    // 面试安排
    interviews: [
        {
            id: 1,
            applicantId: 3,
            applicantName: '王五',
            jobTitle: '前端开发工程师',
            interviewTime: '2024-01-20 14:00',
            interviewer: '张面试官',
            status: '已安排',
            result: ''
        }
    ],

    // 系统用户
    users: [
        {
            id: 1,
            username: 'jobseeker001',
            name: '张三',
            role: 'job-seeker',
            email: 'jobseeker@test.com',
            registerTime: '2024-01-01',
            status: '正常'
        },
        {
            id: 2,
            username: 'employer001',
            name: '企业管理员001',
            role: 'employer',
            email: 'employer@test.com',
            registerTime: '2024-01-05',
            status: '正常'
        },
        {
            id: 3,
            username: 'interviewer001',
            name: '张面试官',
            role: 'interviewer',
            email: 'interviewer@test.com',
            registerTime: '2024-01-10',
            status: '正常'
        },
        {
            id: 4,
            username: 'admin001',
            name: '系统管理员',
            role: 'admin',
            email: 'admin@test.com',
            registerTime: '2024-01-01',
            status: '正常'
        }
    ],

    // 统计数据
    statistics: {
        totalJobs: 156,
        totalApplications: 320,
        totalInterviews: 45,
        totalUsers: 89
    },

    // 获取职位列表
    getJobs: function(filters = {}) {
        let filteredJobs = [...this.jobs];

        // 应用筛选条件
        if (filters.location) {
            filteredJobs = filteredJobs.filter(job => job.location === filters.location);
        }

        if (filters.salary) {
            filteredJobs = filteredJobs.filter(job => {
                const [min, max] = job.salary.replace('¥', '').split('-').map(s => parseFloat(s));
                return min >= filters.salary.min && max <= filters.salary.max;
            });
        }

        if (filters.status) {
            filteredJobs = filteredJobs.filter(job => job.status === filters.status);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredJobs = filteredJobs.filter(job =>
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm)
            );
        }

        return filteredJobs;
    },

    // 获取申请人列表
    getApplicants: function(jobId = null, status = null) {
        let filteredApplicants = [...this.applicants];

        if (jobId) {
            filteredApplicants = filteredApplicants.filter(applicant => applicant.jobId === jobId);
        }

        if (status) {
            filteredApplicants = filteredApplicants.filter(applicant => applicant.status === status);
        }

        return filteredApplicants;
    },

    // 获取面试安排
    getInterviews: function(date = null, status = null) {
        let filteredInterviews = [...this.interviews];

        if (date) {
            filteredInterviews = filteredInterviews.filter(interview =>
                interview.interviewTime.startsWith(date)
            );
        }

        if (status) {
            filteredInterviews = filteredInterviews.filter(interview => interview.status === status);
        }

        return filteredInterviews;
    },

    // 获取用户列表
    getUsers: function(role = null, status = null) {
        let filteredUsers = [...this.users];

        if (role) {
            filteredUsers = filteredUsers.filter(user => user.role === role);
        }

        if (status) {
            filteredUsers = filteredUsers.filter(user => user.status === status);
        }

        return filteredUsers;
    },

    // 申请职位
    applyJob: function(jobId, applicantInfo) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) {
            return { success: false, message: '职位不存在' };
        }

        const newApplicant = {
            id: this.applicants.length + 1,
            jobId: jobId,
            jobTitle: job.title,
            name: applicantInfo.name,
            phone: applicantInfo.phone,
            email: applicantInfo.email,
            applyTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
            status: '待处理',
            education: applicantInfo.education,
            experience: applicantInfo.experience,
            resume: applicantInfo.resume
        };

        this.applicants.push(newApplicant);
        job.applicants++;

        return { success: true, message: '申请成功', applicant: newApplicant };
    },

    // 更新申请人状态
    updateApplicantStatus: function(applicantId, newStatus) {
        const applicant = this.applicants.find(a => a.id === applicantId);
        if (!applicant) {
            return { success: false, message: '申请人不存在' };
        }

        applicant.status = newStatus;

        // 如果是安排面试状态，创建面试安排
        if (newStatus === '面试中') {
            const newInterview = {
                id: this.interviews.length + 1,
                applicantId: applicantId,
                applicantName: applicant.name,
                jobTitle: applicant.jobTitle,
                interviewTime: '',
                interviewer: '',
                status: '待安排',
                result: ''
            };

            this.interviews.push(newInterview);
        }

        return { success: true, message: '状态更新成功' };
    },

    // 安排面试
    scheduleInterview: function(applicantId, interviewInfo) {
        const interview = this.interviews.find(i => i.applicantId === applicantId);
        if (!interview) {
            return { success: false, message: '未找到对应的面试安排' };
        }

        interview.interviewTime = interviewInfo.time;
        interview.interviewer = interviewInfo.interviewer;
        interview.status = '已安排';

        return { success: true, message: '面试安排成功' };
    },

    // 更新用户状态
    updateUserStatus: function(userId, newStatus) {
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        user.status = newStatus;
        return { success: true, message: '用户状态更新成功' };
    },

    // 获取统计数据
    getStatistics: function() {
        return {
            ...this.statistics,
            todayJobs: this.jobs.length,
            todayApplications: this.applicants.length,
            pendingReviews: this.applicants.filter(a => a.status === '待处理').length
        };
    },

    // 模拟API延迟
    simulateDelay: function(delay = 500) {
        return new Promise(resolve => setTimeout(resolve, delay));
    },

    // 异步获取职位列表
    async getJobsAsync(filters = {}) {
        await this.simulateDelay(300);
        return this.getJobs(filters);
    },

    // 异步获取申请人列表
    async getApplicantsAsync(jobId = null, status = null) {
        await this.simulateDelay(300);
        return this.getApplicants(jobId, status);
    },

    // 异步获取面试安排
    async getInterviewsAsync(date = null, status = null) {
        await this.simulateDelay(300);
        return this.getInterviews(date, status);
    },

    // 异步获取用户列表
    async getUsersAsync(role = null, status = null) {
        await this.simulateDelay(300);
        return this.getUsers(role, status);
    }
};

// 导出到全局作用域
window.MockData = MockData;

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
}
// 在 MockData 对象中添加（放在其他数据后面）

// 人才库数据
talentPool: [
    {
        id: 1,
        name: '王明',
        position: '前端开发工程师',
        experience: '4年',
        education: '本科',
        skills: ['React', 'Vue', 'TypeScript', 'Node.js'],
        phone: '138****1234',
        email: 'wangming@email.com',
        source: '未录取',
        sourceJob: '前端开发工程师',
        addedDate: '2024-01-10',
        note: '技术能力优秀，但薪资要求较高，可保持联系',
        status: 'active'
    },
    {
        id: 2,
        name: '李娜',
        position: 'UI设计师',
        experience: '3年',
        education: '硕士',
        skills: ['Figma', 'Sketch', 'Photoshop', '动效设计'],
        phone: '139****5678',
        email: 'lina@email.com',
        source: '主动添加',
        sourceJob: 'UI设计师',
        addedDate: '2024-01-15',
        note: '设计风格符合公司产品，但已有合适人选',
        status: 'active'
    },
    {
        id: 3,
        name: '张强',
        position: 'Java后端工程师',
        experience: '5年',
        education: '本科',
        skills: ['Java', 'Spring', 'MySQL', 'Redis', '微服务'],
        phone: '136****9012',
        email: 'zhangqiang@email.com',
        source: '面试淘汰',
        sourceJob: 'Java开发工程师',
        addedDate: '2024-01-18',
        note: '技术扎实，但沟通能力需要提升',
        status: 'active'
    }
],

// 获取人才库数据
getTalentPool: function(filter = {}) {
    let filteredTalent = [...this.talentPool];

    if (filter.skills) {
        filteredTalent = filteredTalent.filter(talent =>
            talent.skills.some(skill => skill.toLowerCase().includes(filter.skills.toLowerCase()))
        );
    }

    if (filter.position) {
        filteredTalent = filteredTalent.filter(talent =>
            talent.position.toLowerCase().includes(filter.position.toLowerCase())
        );
    }

    if (filter.status) {
        filteredTalent = filteredTalent.filter(talent => talent.status === filter.status);
    }

    return filteredTalent;
},

// 添加人才到人才库
addToTalentPool: function(talentData) {
    const newTalent = {
        id: this.talentPool.length + 1,
        ...talentData,
        addedDate: new Date().toISOString().slice(0, 10),
        status: 'active'
    };

    this.talentPool.push(newTalent);
    return { success: true, talent: newTalent };
},

// 从人才库移除人才
removeFromTalentPool: function(talentId) {
    const index = this.talentPool.findIndex(talent => talent.id === talentId);
    if (index !== -1) {
        this.talentPool.splice(index, 1);
        return { success: true };
    }
    return { success: false, message: '人才不存在' };
},

// 更新人才信息
updateTalent: function(talentId, updates) {
    const talent = this.talentPool.find(t => t.id === talentId);
    if (!talent) {
        return { success: false, message: '人才不存在' };
    }

    Object.assign(talent, updates);
    return { success: true, talent };
},

// 异步获取人才库
async getTalentPoolAsync(filter = {}) {
    await this.simulateDelay(300);
    return this.getTalentPool(filter);
}