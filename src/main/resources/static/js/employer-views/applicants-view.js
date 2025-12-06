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
        // 这里替换为实际的申请人API
        // const resp = await fetch(`http://xxx/api/application/employer/${user.userId}`);

        // 模拟数据
        const applicants = [
            {
                id: 1,
                name: '张三',
                jobTitle: '前端开发工程师',
                applyTime: '2024-01-16',
                resumeId: 101
            }
        ];

        list.innerHTML = applicants.map(app => `
            <div class="applicant-item">
                <div class="applicant-info">
                    <h4>${app.name}</h4>
                    <p>申请职位：${app.jobTitle}</p>
                    <p>申请时间：${app.applyTime}</p>
                </div>
                <div class="applicant-actions">
                    <button class="btn btn-primary" onclick="viewResume(${app.resumeId})">查看简历</button>
                    <button class="btn btn-success" onclick="scheduleInterview(${app.id})">安排面试</button>
                    <button class="btn" onclick="addToTalentPool(${app.id})">加入人才库</button>
                    <button class="btn btn-danger" onclick="rejectApplicant(${app.id})">拒绝</button>
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

function scheduleInterview(applicantId) {
    const time = prompt('请输入面试时间（YYYY-MM-DD HH:MM）：', '2024-01-25 14:00');
    if (time) {
        alert(`已为申请人 ${applicantId} 安排面试，时间：${time}`);
    }
}

function addToTalentPool(applicantId) {
    const note = prompt('请输入备注（为什么加入人才库）：', '技术能力优秀，暂时没有合适职位');
    if (note === null) return;

    alert(`申请人 ${applicantId} 已加入人才库，备注：${note}`);
    // 调用人才库API
}

function rejectApplicant(applicantId) {
    if (confirm('拒绝该申请人？')) {
        alert(`申请人 ${applicantId} 已被拒绝`);
        // 调用拒绝API
    }
}