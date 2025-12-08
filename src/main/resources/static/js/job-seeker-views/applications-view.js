function renderApplicationsView(container, currentUser) {
    container.innerHTML = `
        <div class="view applications-view active">
            <h2>我的申请</h2>
            <!-- 添加状态筛选标签 -->
            <div class="status-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                <button class="tab-btn active" data-status="">全部</button>
                <button class="tab-btn" data-status="APPLIED">申请中</button>
                <button class="tab-btn" data-status="OFFER">申请成功</button>
                <button class="tab-btn" data-status="REJECTED">申请失败</button>
                <button class="tab-btn" data-status="WITHDRAWN">已撤回</button>
            </div>
            <div id="applications-status" style="margin-bottom:8px;color:#666;">正在加载申请记录...</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>职位名称</th>
                        <th>公司</th>
                        <th>申请日期</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="applications-tbody"></tbody>
            </table>
        </div>
    `;

    // 添加标签页点击事件监听
    const tabButtons = container.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新激活状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 加载对应状态的数据
            const status = button.getAttribute('data-status');
            loadApplications(currentUser, status);
        });
    });

    loadApplications(currentUser);
}

async function loadApplications(currentUser, status = '') {
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
        
        // 如果指定了状态，则添加到参数中
        if (status) {
            params.append('status', status);
        }
        
        const base = window.API_BASE || '/api';
        const resp = await fetch(`${base}/applications/my?${params.toString()}`);
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

            const actionTd = document.createElement('td');
            if (app.status === 'APPLIED' || app.status === 'SCREENING') {
                const cancelButton = document.createElement('button');
                cancelButton.className = 'btn btn-danger btn-sm';
                cancelButton.textContent = '取消申请';
                cancelButton.onclick = () => withdrawApplication(app.applicationId, currentUser.userId);
                actionTd.appendChild(cancelButton);
            }

            tr.appendChild(jobTd);
            tr.appendChild(companyTd);
            tr.appendChild(dateTd);
            tr.appendChild(statusTd);
            tr.appendChild(actionTd);

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

async function withdrawApplication(applicationId, userId) {
    if (!confirm('确定要取消此申请吗？')) {
        return;
    }
    
    try {
        const base = window.API_BASE || '/api';
        const resp = await fetch(`${base}/applications/${applicationId}/withdraw?userId=${userId}`, {
            method: 'PUT'
        });
        
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        
        const json = await resp.json();
        if (json.code !== 200 || !json.data) {
            alert(json.message || '取消申请失败');
            return;
        }
        
        alert('申请已取消');
        // 重新加载申请列表
        const currentUser = window.Auth && Auth.getCurrentUser ? Auth.getCurrentUser() : null;
        if (currentUser) {
            // 获取当前激活的标签页状态
            const activeTab = document.querySelector('.tab-btn.active');
            const currentStatus = activeTab ? activeTab.getAttribute('data-status') : '';
            loadApplications(currentUser, currentStatus);
        }
    } catch (e) {
        console.error('取消申请异常:', e);
        alert('请求异常，请稍后重试');
    }
}