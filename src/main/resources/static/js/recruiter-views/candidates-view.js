function renderCandidatesView(container, currentUser) {
    container.innerHTML = `
        <h2>候选人管理</h2>
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <div style="display: flex; gap: 10px;">
                    <div class="search-box" style="max-width:250px;">
                        <input type="text" id="candidate-search" placeholder="搜索候选人...">
                    </div>
                    <select id="candidate-status" onchange="filterCandidates()">
                        <option value="">所有状态</option>
                        <option value="new">新申请</option>
                        <option value="reviewed">已筛选</option>
                        <option value="interview">面试中</option>
                        <option value="offer">录用中</option>
                        <option value="rejected">已拒绝</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="exportCandidates()">导出名单</button>
            </div>

            <table class="data-table">
                <thead>
                <tr>
                    <th>姓名</th>
                    <th>申请职位</th>
                    <th>申请时间</th>
                    <th>当前状态</th>
                    <th>最新进展</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="candidates-tbody">
                    <!-- 动态加载 -->
                </tbody>
            </table>
        </div>
    `;

    loadCandidates();
}

async function loadCandidates() {
    const tbody = document.getElementById('candidates-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6">正在加载候选人数据...</td></tr>';

    try {
        // 获取当前公司的申请信息
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || !currentUser.companyId) {
            throw new Error('用户未登录或缺少公司信息');
        }
        
        const applications = await ApiService.request(`/applications/company/${currentUser.companyId}`);

        if (!applications || applications.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">暂无候选人申请</td></tr>';
            return;
        }

        tbody.innerHTML = applications.map(application => `
            <tr>
                <td>${application.applicantName || '未知'}</td>
                <td>${application.jobTitle || '未知职位'}</td>
                <td>${application.applyTime ? new Date(application.applyTime).toLocaleDateString() : '未知'}</td>
                <td><span class="tag ${getStatusClass(application.status)}">${application.status || '未知'}</span></td>
                <td>${application.latestProgress || '无'}</td>
                <td>
                    <button class="btn btn-sm" onclick="viewCandidate(${application.id})">查看</button>
                    <button class="btn btn-primary btn-sm" onclick="scheduleInterview(${application.id})">安排面试</button>
                    <button class="btn btn-sm" onclick="addToTalentPool(${application.id})">加入人才库</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('加载候选人失败:', e);
        tbody.innerHTML = '<tr><td colspan="6">加载失败，请稍后重试: ' + e.message + '</td></tr>';
    }
}

function viewCandidate(candidateId) {
    alert(`查看候选人 ${candidateId} 详情（后续实现）`);
}

function scheduleInterview(candidateId) {
    const interviewTime = prompt('请输入面试时间（YYYY-MM-DD HH:MM）：', '2024-01-25 14:00');
    if (interviewTime) {
        alert(`已为候选人 ${candidateId} 安排面试，时间：${interviewTime}（模拟操作）`);
    }
}

function addToTalentPool(candidateId) {
    const note = prompt('请输入备注（为什么加入人才库）：', '技术能力优秀，暂时没有合适职位');
    if (note) {
        alert(`候选人 ${candidateId} 已加入人才库，备注：${note}（模拟操作）`);
    }
}

function filterCandidates() {
    const status = document.getElementById('candidate-status').value;
    const keyword = document.getElementById('candidate-search').value;

    if (status || keyword) {
        alert(`筛选候选人 - 状态：${status || '全部'}，关键词：${keyword || '无'}（模拟操作）`);
    }
}

function exportCandidates() {
    alert('正在导出候选人名单...（模拟操作）');
    setTimeout(() => {
        alert('候选人名单已导出为 candidates.csv（模拟）');
    }, 1000);
}

function getStatusClass(status) {
    switch (status) {
        case '新申请':
        case 'new':
            return 'tag-warning';
        case '面试中':
        case 'interview':
            return 'tag-info';
        case '录用中':
        case 'offer':
            return 'tag-success';
        case '已拒绝':
        case 'rejected':
            return 'tag-danger';
        case '已筛选':
        case 'reviewed':
            return 'tag-primary';
        default:
            return 'tag-default';
    }
}
