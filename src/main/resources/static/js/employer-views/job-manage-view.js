function renderJobManageView(container, currentUser) {
    container.innerHTML = `
        <h2>已发布职位</h2>
        <div class="card">
            <table class="data-table">
                <thead>
                <tr>
                    <th>职位名称</th>
                    <th>薪资范围</th>
                    <th>工作地点</th>
                    <th>发布状态</th>
                    <th>更新时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="job-manage-tbody"></tbody>
            </table>
        </div>
    `;

    loadJobList(currentUser);
}

async function loadJobList(user) {
    const tbody = document.getElementById('job-manage-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6">正在加载...</td></tr>';

    try {
        const params = new URLSearchParams({
            current: 1,
            size: 50
        });
        const resp = await fetch(`${JOB_API_BASE}/list?${params.toString()}`);
        if (!resp.ok) {
            const text = await resp.text();
            tbody.innerHTML = `<tr><td colspan="6">网络错误: ${resp.status} ${text}</td></tr>`;
            return;
        }
        const page = await resp.json();
        const jobs = (page && page.records) ? page.records : [];

        if (!jobs.length) {
            tbody.innerHTML = '<tr><td colspan="6">暂无职位，请先发布职位。</td></tr>';
            return;
        }

        tbody.innerHTML = jobs.map(job => {
            const min = job.salaryMin || 0;
            const max = job.salaryMax || 0;
            const salary = min && max ? `${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K` : '-';
            const statusText = job.publishStatus === 1 ? '已发布' : '未发布';
            const updateTime = job.updateTime ? String(job.updateTime).replace('T', ' ') : '';
            
            // 构造完整地址显示
            let location = '';
            if (job.province) location += job.province;
            if (job.city) location += job.city;
            if (job.district) location += job.district;
            
            return `
                <tr>
                    <td>${job.jobName || ''}</td>
                    <td>${salary}</td>
                    <td>${location || ''}</td>
                    <td>${statusText}</td>
                    <td>${updateTime}</td>
                    <td>
                        <button class="btn btn-sm" onclick="togglePublish(${job.jobId}, ${job.publishStatus === 1})">${job.publishStatus === 1 ? '下架' : '发布'}</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.jobId})">删除</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (e) {
        console.error('加载职位失败:', e);
        tbody.innerHTML = '<tr><td colspan="6">加载失败，请稍后重试</td></tr>';
    }
}

async function togglePublish(jobId, isPublished) {
    const url = isPublished ? `${JOB_API_BASE}/unpublish/${jobId}` : `${JOB_API_BASE}/publish/${jobId}`;
    try {
        const resp = await fetch(url, { method: 'PUT' });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const ok = await resp.json();
        if (!ok) {
            alert('操作失败');
            return;
        }
        alert(isPublished ? '职位已下架' : '职位已发布');
        loadJobList(Auth.getCurrentUser());
    } catch (e) {
        console.error('更新发布状态失败:', e);
        alert('操作失败，请稍后重试');
    }
}

async function deleteJob(jobId) {
    if (!confirm('确定要删除这个职位吗？')) return;
    try {
        const resp = await fetch(`${JOB_API_BASE}/${jobId}`, { method: 'DELETE' });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const ok = await resp.json();
        if (!ok) {
            alert('删除失败');
            return;
        }
        alert('职位已删除');
        loadJobList(Auth.getCurrentUser());
    } catch (e) {
        console.error('删除职位失败:', e);
        alert('删除失败，请稍后重试');
    }
}