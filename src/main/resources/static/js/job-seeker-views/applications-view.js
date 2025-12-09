function renderApplicationsView(container, currentUser) {
    container.innerHTML = `
        <div class="view applications-view active">
            <h2>我的申请</h2>
            <!-- 添加状态筛选标签 -->
            <div class="status-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                <button class="tab-btn active" data-status="">全部</button>
                <button class="tab-btn" data-status="APPLIED">申请中</button>
                <button class="tab-btn" data-status="ACCEPTED">申请成功</button>
                <button class="tab-btn" data-status="REJECTED">被驳回</button>
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
            <div class="pagination" id="applications-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="applications-prev-page">上一页</button>
                <span class="pagination-info" id="applications-pagination-info"></span>
                <button class="btn pagination-btn" id="applications-next-page">下一页</button>
            </div>
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
            // 重置分页到第一页
            window.applicationsPagination = {
                current: 1,
                size: 20,
                total: 0,
                pages: 0
            };
            loadApplications(currentUser, status);
        });
    });

    // 初始化分页状态
    window.applicationsPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    loadApplications(currentUser);
}

async function loadApplications(currentUser, status = '') {
    const statusEl = document.getElementById('applications-status');
    const tbody = document.getElementById('applications-tbody');
    const paginationContainer = document.getElementById('applications-pagination');
    const paginationInfo = document.getElementById('applications-pagination-info');
    const prevBtn = document.getElementById('applications-prev-page');
    const nextBtn = document.getElementById('applications-next-page');

    if (!tbody || !currentUser) return;

    if (statusEl) statusEl.textContent = '正在加载申请记录...';
    tbody.innerHTML = '';

    try {
        const params = new URLSearchParams({
            userId: currentUser.userId,
            current: window.applicationsPagination.current,
            size: window.applicationsPagination.size
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
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        // 更新分页信息
        window.applicationsPagination.total = page.total || 0;
        window.applicationsPagination.pages = page.pages || Math.ceil((page.total || 0) / window.applicationsPagination.size) || 0;
        
        if (statusEl) statusEl.textContent = `共 ${window.applicationsPagination.total} 条申请记录`;

        if (paginationInfo) {
            paginationInfo.textContent = `第 ${window.applicationsPagination.current} 页，共 ${window.applicationsPagination.pages} 页`;
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = window.applicationsPagination.current <= 1;
            prevBtn.onclick = () => {
                if (window.applicationsPagination.current > 1) {
                    window.applicationsPagination.current--;
                    loadApplications(currentUser, status);
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = window.applicationsPagination.current >= window.applicationsPagination.pages;
            nextBtn.onclick = () => {
                if (window.applicationsPagination.current < window.applicationsPagination.pages) {
                    window.applicationsPagination.current++;
                    loadApplications(currentUser, status);
                }
            };
        }

        records.forEach(app => {
            const tr = document.createElement('tr');

            const jobTd = document.createElement('td');
            const link = document.createElement('a');
            link.href = '#';
            
            // 检查职位是否已下架或已删除
            let jobText = app.jobTitle || '未知职位';
            if (app.publishStatus === 2) {
                jobText += ' [已下架]';
            } else if (app.publishStatus === null) {
                jobText += ' [已删除]';
            }
            
            link.textContent = jobText;
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
            
            // 如果职位已下架或已删除，在公司名旁边也加上标记
            if (app.publishStatus === 2) {
                companyTd.innerHTML = (app.companyName || '') + ' <span style="color: #ff4d4f;">[已下架]</span>';
            } else if (app.publishStatus === null) {
                companyTd.innerHTML = (app.companyName || '') + ' <span style="color: #ff4d4f;">[已删除]</span>';
            }

            const dateTd = document.createElement('td');
            const applyTime = app.applyTime || '';
            dateTd.textContent = applyTime ? applyTime.replace('T', ' ') : '';

            const statusTd = document.createElement('td');
            statusTd.textContent = mapApplicationStatus(app.status);

            const actionTd = document.createElement('td');
            // 根据状态决定是否显示取消申请按钮
            if (['APPLIED'].includes(app.status)) {
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
            return '申请中';
        case 'ACCEPTED':
            return '申请成功';
        case 'REJECTED':
            return '被驳回';
        case 'WITHDRAWN':
            return '已撤回';
        default:
            return status;
    }
}