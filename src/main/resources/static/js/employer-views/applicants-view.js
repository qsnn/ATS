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
        const applicants = data && data.records ? data.records : [];

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

function viewResume(resumeId) {
    alert(`查看简历 ${resumeId}（后续实现）`);
}

function scheduleInterview(applicationId) {
    const time = prompt('请输入面试时间（YYYY-MM-DD HH:MM）：', '2024-01-25 14:00');
    if (time) {
        alert(`已为申请记录 ${applicationId} 安排面试，时间：${time}`);
        // TODO: 调用 /api/interview 创建面试记录
    }
}

function addToTalentPool(applicationId) {
    const note = prompt('请输入备注（为什么加入人才库）：', '技术能力优秀，暂无合适岗位');
    if (note === null) return;

    alert(`申请记录 ${applicationId} 已加入人才库，备注：${note}`);
    // TODO: 根据 applicationId 查询简历和用户信息，调用 /api/talent 新增记录
}

function rejectApplicant(applicationId) {
    if (confirm('拒绝该申请人？')) {
        alert(`申请记录 ${applicationId} 已被拒绝`);
        // TODO: 调用更新申请状态的 API
    }
}