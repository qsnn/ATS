function renderApplicantsView(container, currentUser) {
    container.innerHTML = `
        <h2>职位申请人</h2>
        <div class="card">
            <div class="applicant-list" id="applicant-list">
                <!-- 动态加载 -->
            </div>
        </div>
    `;

    loadApplicants(currentUser);
}

async function loadApplicants(user) {
    const list = document.getElementById('applicant-list');
    if (!list) return;

    list.innerHTML = '<p>正在加载申请人...</p>';

    try {
        const params = new URLSearchParams({ current: 1, size: 20 });
        const resp = await fetch(`/api/applications/company/${encodeURIComponent(user.companyId)}?${params.toString()}`);

        if (!resp.ok) {
            const text = await resp.text();
            list.innerHTML = `<p>网络错误: ${resp.status} ${text}</p>`;
            return;
        }

        const json = await resp.json();
        const data = (json && typeof json === 'object' && 'code' in json)
            ? (json.code === 200 ? json.data : null)
            : json;
        const allApplicants = data && data.records ? data.records : [];

        // 需求：Employer 拒绝申请后，该申请不再出现在申请人管理列表中
        const applicants = allApplicants.filter(app => app.status !== 'REJECTED');

        if (!applicants.length) {
            list.innerHTML = '<p>暂无申请人。</p>';
            return;
        }

        list.innerHTML = applicants.map(app => `
            <div class="applicant-item">
                <div class="applicant-info">
                    <h4>${app.userName || ''}</h4>
                    <p>申请职位：${app.jobTitle || ''}</p>
                    <p>申请时间：${app.applyTime || ''}</p>
                </div>
                <div class="applicant-actions">
                    <button class="btn btn-primary" onclick="viewResume(${app.resumeId})">查看简历</button>
                    <button class="btn btn-success" onclick="scheduleInterview(${app.applicationId})">安排面试</button>
                    <button class="btn" onclick="addToTalentPool(${app.applicationId})">加入人才库</button>
                    <button class="btn btn-danger" onclick="rejectApplicant(${app.applicationId})">拒绝</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('加载申请人失败:', e);
        list.innerHTML = '<p>加载失败</p>';
    }
}

async function viewResume(resumeId) {
    if (!resumeId) {
        alert('无法查看简历：缺少简历ID');
        return;
    }

    try {
        const data = await ApiService.request(`/resume/${encodeURIComponent(resumeId)}`);
        if (!data) {
            alert('未找到简历信息');
            return;
        }

        // 当前后端返回字段：realName, age, education, jobIntention, workExperience, workHistory, skill, createTime, updateTime 等
        // 先用现有字段对齐展示，后续如后端补充 phone/email/projectExperience/selfEvaluation 再扩展
        const detailLines = [];
        detailLines.push(`姓名：${data.realName || ''}`);
        if (data.age != null) {
            detailLines.push(`年龄：${data.age}`);
        }
        if (data.genderDesc) {
            detailLines.push(`性别：${data.genderDesc}`);
        }
        detailLines.push(`学历：${data.education || ''}`);
        if (data.jobIntention) {
            detailLines.push(`求职意向：${data.jobIntention}`);
        }
        if (data.workHistory || data.workExperience) {
            detailLines.push(`工作经历：${data.workHistory || data.workExperience}`);
        }
        if (data.educationHistory) {
            detailLines.push(`教育经历：${data.educationHistory}`);
        }
        if (data.skill) {
            detailLines.push(`技能：${data.skill}`);
        }
        if (data.resumeName) {
            detailLines.push(`简历名称：${data.resumeName}`);
        }
        if (data.createTime) {
            detailLines.push(`创建时间：${data.createTime}`);
        }
        if (data.updateTime) {
            detailLines.push(`更新时间：${data.updateTime}`);
        }

        const detailHtml = '\n' + detailLines.join('\n');
        alert(`简历详情：\n\n${detailHtml}`);
    } catch (e) {
        console.error('查看简历失败:', e);
        // ApiService 已经弹出错误提示
    }
}

async function scheduleInterview(applicationId) {
    if (!applicationId) {
        alert('无法安排面试：缺少申请ID');
        return;
    }

    const interviewIntro = prompt('请输入面试安排说明（时间、地点等）：', '请于 2024-01-25 14:00 到公司现场参加面试');
    if (interviewIntro === null || interviewIntro.trim() === '') {
        return;
    }

    const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
    if (!currentUser || !currentUser.userId || !currentUser.companyId) {
        alert('未登录或用户信息缺失，无法安排面试');
        return;
    }

    try {
        // 通过公司申请列表找到当前申请记录，以获取求职者姓名
        const params = new URLSearchParams({ current: 1, size: 100 });
        const data = await ApiService.request(`/applications/company/${encodeURIComponent(currentUser.companyId)}?${params.toString()}`);
        const applicants = data && data.records ? data.records : [];
        const app = applicants.find(a => a.applicationId === applicationId);
        if (!app) {
            alert('未找到对应的申请记录，无法安排面试');
            return;
        }

        const intervieweeName = app.userName || app.realName || '';

        const payload = {
            deliveryId: applicationId,
            interviewerId: currentUser.userId,
            interviewIntro: interviewIntro.trim(),
            intervieweeName: intervieweeName
        };

        await ApiService.request('/interview', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        alert('面试安排已创建');
        loadApplicants(currentUser);
    } catch (e) {
        console.error('安排面试失败:', e);
    }
}

async function addToTalentPool(applicationId) {
    if (!applicationId) {
        alert('无法加入人才库：缺少申请ID');
        return;
    }

    const note = prompt('请输入备注（为什么加入人才库）：', '技术能力优秀，暂时没有合适岗位');
    if (note === null) return;

    const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
    if (!currentUser || !currentUser.companyId || !currentUser.userId) {
        alert('当前账号未关联公司或用户信息不完整，无法加入人才库');
        return;
    }

    try {
        const params = new URLSearchParams({
            current: 1,
            size: 100
        });
        const data = await ApiService.request(`/applications/company/${encodeURIComponent(currentUser.companyId)}?${params.toString()}`);
        const applicants = data && data.records ? data.records : [];
        const app = applicants.find(a => a.applicationId === applicationId);
        if (!app) {
            alert('未找到对应的申请记录，无法加入人才库');
            return;
        }

        // 按数据库结构，只需要 resumeId, companyId, operatorId, tag
        const talentPayload = {
            resumeId: app.resumeId,
            companyId: currentUser.companyId,
            operatorId: currentUser.userId,
            tag: note || ''
        };

        await ApiService.addTalent(talentPayload);
        alert('已加入人才库');
    } catch (e) {
        console.error('加入人才库失败:', e);
    }
}

async function rejectApplicant(applicationId) {
    if (!applicationId) {
        alert('无法拒绝：缺少申请ID');
        return;
    }
    if (!confirm('确定要拒绝该申请人吗？')) {
        return;
    }

    const reason = prompt('可以填写拒绝原因（选填）：', '简历与岗位要求不匹配');

    try {
        await ApiService.request(`/applications/${encodeURIComponent(applicationId)}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'REJECTED', reason: reason || '' })
        });
        alert('已拒绝该申请人');
        const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
        if (currentUser) {
            loadApplicants(currentUser);
        }
    } catch (e) {
        console.error('拒绝申请失败:', e);
    }
}