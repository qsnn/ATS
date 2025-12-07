// language: javascript
function renderInterviewsView(container, currentUser) {
    container.innerHTML = `
        <div class="view interviews-view active">
            <h2>面试安排</h2>
            <div id="interviews-status" style="margin-bottom:8px;color:#666;">正在加载面试安排...</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>职位名称</th>
                        <th>公司</th>
                        <th>面试时间</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody id="interviews-tbody"></tbody>
            </table>
        </div>
    `;

    loadInterviews(currentUser);
}

async function loadInterviews(currentUser) {
    const statusEl = document.getElementById('interviews-status');
    const tbody = document.getElementById('interviews-tbody');
    if (!tbody || !currentUser) return;

    if (statusEl) statusEl.textContent = '正在加载面试安排...';
    tbody.innerHTML = '';

    try {
        const base = window.API_BASE || '/api';
        const name = currentUser.realName || currentUser.username || '';
        const resp = await fetch(`${base}/interview/name/${encodeURIComponent(name)}`);
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
        const list = json.data || [];
        if (list.length === 0) {
            if (statusEl) statusEl.textContent = '暂无面试安排。';
            return;
        }

        if (statusEl) statusEl.textContent = `共 ${list.length} 条面试安排`;

        list.forEach(item => {
            const tr = document.createElement('tr');

            const jobTd = document.createElement('td');
            jobTd.textContent = item.jobName || '';

            const companyTd = document.createElement('td');
            companyTd.textContent = item.companyName || '';

            const timeTd = document.createElement('td');
            const t = item.interviewTime || '';
            timeTd.textContent = t ? t.replace('T', ' ') : '';

            const statusTd = document.createElement('td');
            statusTd.textContent = item.status || '';

            tr.appendChild(jobTd);
            tr.appendChild(companyTd);
            tr.appendChild(timeTd);
            tr.appendChild(statusTd);

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('加载面试安排异常:', e);
        if (statusEl) statusEl.textContent = '请求异常，请稍后重试';
    }
}