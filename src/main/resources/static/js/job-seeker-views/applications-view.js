function renderApplicationsView(container, currentUser) {
    container.innerHTML = `
        <div class="view applications-view active">
            <h2>我的申请</h2>
            <div id="applications-status" style="margin-bottom:8px;color:#666;">正在加载申请记录...</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>职位名称</th>
                        <th>公司</th>
                        <th>申请日期</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody id="applications-tbody"></tbody>
            </table>
        </div>
    `;

    loadApplications(currentUser);
}

async function loadApplications(currentUser) {
    const statusEl = document.getElementById('applications-status');
    const tbody = document.getElementById('applications-tbody');
    if (!tbody || !currentUser) return;

    if (statusEl) statusEl.textContent = '正在加载申请记录...';
    tbody.innerHTML = '';

    try {
        const params = new URLSearchParams({
            userId: currentUser.userId,
            current: 1,
            size: 20
        });
        const resp = await fetch(`http://124.71.101.139:10085/api/applications/my?${params.toString()}`);
        if (!resp.ok) {
            const text = await resp.text();
            if (statusEl) statusEl.textContent = `网络错误: ${resp.status} ${text}`;
            return;
        }
        const json = await resp.json();
        if (json.code !== 200) {
            if (statusEl) statusEl.textContent = json.message || '加载失败';
            return;
        }
        const page = json.data || {};
        const records = page.records || [];

        if (records.length === 0) {
            if (statusEl) statusEl.textContent = '暂无申请记录。去职位搜索页多投几份简历吧~';
            return;
        }

        if (statusEl) statusEl.textContent = `共 ${page.total || records.length} 条申请记录`;

        records.forEach(app => {
            const tr = document.createElement('tr');

            const jobTd = document.createElement('td');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = app.jobTitle || '未知职位';
            link.onclick = (e) => {
                e.preventDefault();
                if (typeof viewJobDetail === 'function' && app.jobId) {
                    viewJobDetail(app.jobId);
                } else {
                    alert('职位详情暂不可用');
                }
            };
            jobTd.appendChild(link);

            const companyTd = document.createElement('td');
            companyTd.textContent = app.companyName || '';

            const dateTd = document.createElement('td');
            const applyTime = app.applyTime || '';
            dateTd.textContent = applyTime ? applyTime.replace('T', ' ') : '';

            const statusTd = document.createElement('td');
            statusTd.textContent = mapApplicationStatus(app.status);

            tr.appendChild(jobTd);
            tr.appendChild(companyTd);
            tr.appendChild(dateTd);
            tr.appendChild(statusTd);

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('加载申请记录异常:', e);
        if (statusEl) statusEl.textContent = '请求异常，请稍后重试';
    }
}

function mapApplicationStatus(status) {
    if (!status) return '未知';
    switch (status) {
        case 'APPLIED':
            return '已投递';
        case 'SCREENING':
            return '筛选中';
        case 'INTERVIEW':
            return '面试中';
        case 'OFFER':
            return '已录用';
        case 'REJECTED':
            return '已淘汰';
        case 'WITHDRAWN':
            return '已撤回';
        default:
            return status;
    }
}