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
        // 这里应该调用获取面试日程的API
        // const date = document.getElementById('schedule-date').value;
        // const resp = await fetch(`${INTERVIEW_API_BASE}?date=${date}`);

        // 模拟数据
        const schedules = [
            {
                id: 1,
                time: '10:00-11:00',
                candidate: '张三',
                position: '前端开发工程师',
                type: '技术面试',
                status: '待开始'
            },
            {
                id: 2,
                time: '14:00-15:00',
                candidate: '李四',
                position: 'Java开发工程师',
                type: 'HR面试',
                status: '已安排'
            },
            {
                id: 3,
                time: '16:00-17:00',
                candidate: '王五',
                position: 'UI设计师',
                type: '技术面试',
                status: '已完成'
            }
        ];

        tbody.innerHTML = schedules.map(schedule => `
            <tr>
                <td>${schedule.time}</td>
                <td>${schedule.candidate}</td>
                <td>${schedule.position}</td>
                <td>${schedule.type}</td>
                <td>
                    <span class="tag ${getStatusClass(schedule.status)}">
                        ${schedule.status}
                    </span>
                </td>
                <td>
                    ${schedule.status === '已完成' ?
                        `<button class="btn btn-sm" onclick="viewEvaluation(${schedule.id})">查看评价</button>` :
                        `<button class="btn btn-primary btn-sm" onclick="startInterview(${schedule.id})">开始面试</button>`
                    }
                    <button class="btn btn-sm" onclick="reschedule(${schedule.id})">改期</button>
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
