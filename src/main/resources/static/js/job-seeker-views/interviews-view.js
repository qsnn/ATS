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
                        <th>面试安排</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody id="interviews-tbody"></tbody>
            </table>
            <div class="pagination" id="interviews-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="interviews-prev-page">上一页</button>
                <span class="pagination-info" id="interviews-pagination-info"></span>
                <button class="btn pagination-btn" id="interviews-next-page">下一页</button>
            </div>
        </div>
    `;

    // 初始化分页状态
    window.interviewsPagination = {
        current: 1,
        size: 20,
        total: 0,
        pages: 0
    };

    loadInterviews(currentUser);
}

async function loadInterviews(currentUser) {
    const statusEl = document.getElementById('interviews-status');
    const tbody = document.getElementById('interviews-tbody');
    const paginationContainer = document.getElementById('interviews-pagination');
    const paginationInfo = document.getElementById('interviews-pagination-info');
    const prevBtn = document.getElementById('interviews-prev-page');
    const nextBtn = document.getElementById('interviews-next-page');

    if (!tbody || !currentUser) return;

    if (statusEl) statusEl.textContent = '正在加载面试安排...';
    tbody.innerHTML = '';

    try {
        const base = window.API_BASE || '/api';
        const userId = currentUser.userId;
        if (!userId) {
            if (statusEl) statusEl.textContent = '用户信息不完整，无法加载面试安排';
            return;
        }
        
        // 获取所有面试数据
        const resp = await fetch(`${base}/interview/user/${encodeURIComponent(userId)}`);
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
        const allList = json.data || [];
        
        if (allList.length === 0) {
            if (statusEl) statusEl.textContent = '暂无面试安排。';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        // 分页处理
        const totalPages = Math.ceil(allList.length / window.interviewsPagination.size);
        const startIndex = (window.interviewsPagination.current - 1) * window.interviewsPagination.size;
        const endIndex = startIndex + window.interviewsPagination.size;
        const paginatedList = allList.slice(startIndex, endIndex);

        // 更新分页信息
        window.interviewsPagination.total = allList.length;
        window.interviewsPagination.pages = totalPages;
        
        if (statusEl) statusEl.textContent = `共 ${window.interviewsPagination.total} 条面试安排`;

        if (paginationInfo) {
            paginationInfo.textContent = `第 ${window.interviewsPagination.current} 页，共 ${window.interviewsPagination.pages} 页`;
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = window.interviewsPagination.current <= 1;
            prevBtn.onclick = () => {
                if (window.interviewsPagination.current > 1) {
                    window.interviewsPagination.current--;
                    loadInterviews(currentUser);
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = window.interviewsPagination.current >= window.interviewsPagination.pages;
            nextBtn.onclick = () => {
                if (window.interviewsPagination.current < window.interviewsPagination.pages) {
                    window.interviewsPagination.current++;
                    loadInterviews(currentUser);
                }
            };
        }

        paginatedList.forEach(item => {
            const tr = document.createElement('tr');

            const jobTd = document.createElement('td');
            jobTd.textContent = item.jobName || '';

            const companyTd = document.createElement('td');
            companyTd.textContent = item.companyName || '';

            const timeTd = document.createElement('td');
            timeTd.textContent = item.interviewIntro || '';

            const statusTd = document.createElement('td');
            statusTd.textContent = mapInterviewStatus(item.status);

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

function mapInterviewStatus(status) {
    if (!status) return '未知';
    switch (status) {
        case 'PREPARING_INTERVIEW':
            return '准备面试';
        case 'INTERVIEW_ENDED':
            return '面试结束';
        case 'ACCEPTED':
            return '录取';
        case 'REJECTED':
            return '未录取';
        default:
            return status;
    }
}