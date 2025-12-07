function renderScheduleView(container, currentUser) {
    container.innerHTML = `
        <h2>今日面试日程</h2>
        <div class="card">
            <div style="margin-bottom: 15px;">
                <div class="search-box" style="max-width: 300px; display: inline-block;">
                    <input type="date" id="schedule-date" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <button class="btn btn-sm" onclick="loadSchedule()">查询</button>
            </div>

            <table class="data-table">
                <thead>
                <tr>
                    <th>时间</th>
                    <th>候选人</th>
                    <th>职位</th>
                    <th>面试类型</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="schedule-tbody">
                    <!-- 动态加载 -->
                </tbody>
            </table>
        </div>
    `;

    loadSchedule();
}

async function loadSchedule() {
    const tbody = document.getElementById('schedule-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6">正在加载面试日程...</td></tr>';

    try {
        // 获取当前用户的面试安排
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || !currentUser.userId) {
            throw new Error('用户未登录');
        }
        
        const interviews = await ApiService.request(`/interview/user/${currentUser.userId}`);

        if (!interviews || interviews.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">暂无面试安排</td></tr>';
            return;
        }

        tbody.innerHTML = interviews.map(interview => `
            <tr>
                <td>${new Date(interview.interviewTime).toLocaleString()}</td>
                <td>${interview.candidateName || '未知'}</td>
                <td>${interview.jobTitle || '未知职位'}</td>
                <td>${interview.interviewType || '技术面试'}</td>
                <td>
                    <span class="tag ${getStatusClass(interview.status || '已安排')}">
                        ${interview.status || '已安排'}
                    </span>
                </td>
                <td>
                    ${interview.status === '已完成' ?
                        `<button class="btn btn-sm" onclick="viewEvaluation(${interview.id})">查看评价</button>` :
                        `<button class="btn btn-primary btn-sm" onclick="startInterview(${interview.id})">开始面试</button>`
                    }
                    <button class="btn btn-sm" onclick="reschedule(${interview.id})">改期</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('加载面试日程失败:', e);
        tbody.innerHTML = '<tr><td colspan="6">加载失败，请稍后重试</td></tr>';
    }
}

function getStatusClass(status) {
    switch(status) {
        case '待开始': return 'tag-warning';
        case '已安排': return 'tag-info';
        case '已完成': return 'tag-success';
        case '已取消': return 'tag-danger';
        default: return '';
    }
}

function startInterview(scheduleId) {
    alert(`开始面试 ${scheduleId}（后续实现）`);
    // 跳转到面试评价页面
}

function reschedule(scheduleId) {
    const newTime = prompt('请输入新的面试时间（YYYY-MM-DD HH:MM）：', '2024-01-25 14:00');
    if (newTime) {
        alert(`面试 ${scheduleId} 已改期到 ${newTime}（模拟操作）`);
    }
}

function viewEvaluation(scheduleId) {
    alert(`查看面试评价 ${scheduleId}（后续实现）`);
}
