function renderJobManageView(container, currentUser) {
    container.innerHTML = `
        <h2>发布的职位</h2>
        <div class="card">
            <table class="data-table">
                <thead>
                <tr>
                    <th>职位名称</th>
                    <th>薪资范围</th>
                    <th>工作地点</th>
                    <th>申请人数</th>
                    <th>发布时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="job-manage-tbody">
                    <!-- 动态加载 -->
                </tbody>
            </table>
        </div>
    `;

    // 加载职位数据
    loadJobList(currentUser);
}

async function loadJobList(user) {
    const tbody = document.getElementById('job-manage-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6">正在加载...</td></tr>';

    try {
        // 这里替换为实际的职位列表API
        // const resp = await fetch(`http://xxx/api/job/employer/${user.userId}`);
        // const data = await resp.json();

        // 模拟数据
        const jobs = [
            {
                id: 1,
                title: '前端开发工程师',
                salary: '¥20K-35K',
                location: '北京',
                applicants: 15,
                postTime: '2024-01-15'
            }
        ];

        tbody.innerHTML = jobs.map(job => `
            <tr>
                <td>${job.title}</td>
                <td>${job.salary}</td>
                <td>${job.location}</td>
                <td>${job.applicants}</td>
                <td>${job.postTime}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="viewApplicants(${job.id})">查看申请人</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">删除</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('加载职位失败:', e);
        tbody.innerHTML = '<tr><td colspan="6">加载失败，请稍后重试</td></tr>';
    }
}

function viewApplicants(jobId) {
    alert(`查看职位 ${jobId} 的申请人（后续实现）`);
    // 可以切换到申请人标签页并筛选
}

function deleteJob(jobId) {
    if (confirm('确定要删除这个职位吗？')) {
        alert(`删除职位 ${jobId}（模拟操作）`);
        // 调用删除API
    }
}