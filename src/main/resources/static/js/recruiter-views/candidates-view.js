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
        // 这里应该调用获取候选人的API
        // const resp = await fetch(`${APPLICATION_API_BASE}/recruiter/${currentUser.userId}`);

        // 模拟数据
        const candidates = [
            {
                id: 1,
                name: '张三',
                position: '前端开发工程师',
                applyTime: '2024-01-20',
                status: '面试中',
                progress: '二面通过',
                statusClass: 'tag-info'
            },
            {
                id: 2,
                name: '李四',
                position: 'Java开发工程师',
                applyTime: '2024-01-19',
                status: '新申请',
                progress: '等待筛选',
                statusClass: 'tag-warning'
            },
            {
                id: 3,
                name: '王五',
                position: 'UI设计师',
                applyTime: '2024-01-18',
                status: '录用中',
                progress: 'Offer已发',
                statusClass: 'tag-success'
            }
        ];

        tbody.innerHTML = candidates.map(candidate => `
            <tr>
                <td>${candidate.name}</td>
                <td>${candidate.position}</td>
                <td>${candidate.applyTime}</td>
                <td><span class="tag ${candidate.statusClass}">${candidate.status}</span></td>
                <td>${candidate.progress}</td>
                <td>
                    <button class="btn btn-sm" onclick="viewCandidate(${candidate.id})">查看</button>
                    <button class="btn btn-primary btn-sm" onclick="scheduleInterview(${candidate.id})">安排面试</button>
                    <button class="btn btn-sm" onclick="addToTalentPool(${candidate.id})">加入人才库</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('加载候选人失败:', e);
        tbody.innerHTML = '<tr><td colspan="6">加载失败，请稍后重试</td></tr>';
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
