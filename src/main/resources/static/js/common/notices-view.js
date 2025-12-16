/**
 * 通用消息通知视图模块
 */

/**
 * 渲染消息通知视图
 * @param {HTMLElement} container - 容器元素
 * @param {object} currentUser - 当前用户信息
 */
async function renderNoticesView(container, currentUser) {
    container.innerHTML = `
        <div class="view notices-view active">
            <h2>消息与通知</h2>
            
            <!-- 标签页 -->
            <div class="status-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                <button class="tab-btn active" data-status="unread" style="padding: 8px 16px; border: none; background-color: #4f46e5; color: #fff; cursor: pointer; border-radius: 4px;">未读</button>
                <button class="tab-btn" data-status="read" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">已读</button>
            </div>
            
            <div id="notices-status" style="margin-bottom:8px;color:#666;">正在加载通知...</div>
            <table class="table" style="width: 100%; table-layout: fixed;">
                <thead>
                    <tr>
                        <th style="width: 15%; text-align: center;">消息类别</th>
                        <th style="width: 45%; text-align: left;">消息内容</th>
                        <th style="width: 20%; text-align: center;">发送时间</th>
                        <th style="width: 20%; text-align: center;">操作</th>
                    </tr>
                </thead>
                <tbody id="notices-tbody"></tbody>
            </table>
            <div class="pagination" id="notices-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="notices-prev-page">上一页</button>
                <span class="pagination-info" id="notices-pagination-info"></span>
                <button class="btn pagination-btn" id="notices-next-page">下一页</button>
            </div>
            
            <!-- 详情模态框 -->
            <div id="notice-detail-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000;">
                <div style="background-color: white; margin: 10% auto; padding: 20px; border-radius: 5px; width: 80%; max-width: 600px;">
                    <span id="close-modal" style="float: right; cursor: pointer; font-size: 24px;">&times;</span>
                    <h3>通知详情</h3>
                    <div id="notice-detail-content"></div>
                </div>
            </div>
        </div>
    `;

    // 初始化分页状态
    window.noticesPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    // 绑定标签页切换事件
    const tabButtons = container.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新激活状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新按钮样式
            tabButtons.forEach(btn => {
                btn.style.backgroundColor = '#f3f4f6';
                btn.style.color = '#000';
            });
            button.style.backgroundColor = '#4f46e5';
            button.style.color = '#fff';
            
            // 加载对应状态的数据
            const status = button.getAttribute('data-status');
            // 重置分页到第一页
            window.noticesPagination = {
                current: 1,
                size: 10,
                total: 0,
                pages: 0
            };
            loadNotices(currentUser, status);
        });
    });

    // 绑定分页事件
    const prevBtn = container.querySelector('#notices-prev-page');
    const nextBtn = container.querySelector('#notices-next-page');
    
    prevBtn.addEventListener('click', () => {
        if (window.noticesPagination.current > 1) {
            window.noticesPagination.current--;
            const activeTab = container.querySelector('.tab-btn.active');
            const status = activeTab.getAttribute('data-status');
            loadNotices(currentUser, status);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (window.noticesPagination.current < window.noticesPagination.pages) {
            window.noticesPagination.current++;
            const activeTab = container.querySelector('.tab-btn.active');
            const status = activeTab.getAttribute('data-status');
            loadNotices(currentUser, status);
        }
    });

    // 绑定模态框关闭事件
    const modal = container.querySelector('#notice-detail-modal');
    const closeModal = container.querySelector('#close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 默认加载未读通知
    loadNotices(currentUser, 'unread');
    
    // 点击模态框外部区域关闭模态框
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * 加载通知列表
 * @param {object} currentUser - 当前用户
 * @param {string} status - 状态 (unread/read)
 */
async function loadNotices(currentUser, status) {
    const statusEl = document.getElementById('notices-status');
    const tbody = document.getElementById('notices-tbody');
    const paginationInfo = document.getElementById('notices-pagination-info');
    const prevBtn = document.getElementById('notices-prev-page');
    const nextBtn = document.getElementById('notices-next-page');

    if (!tbody) return;

    if (statusEl) statusEl.textContent = '正在加载通知...';
    tbody.innerHTML = '';

    try {
        // 构建查询参数
        const params = new URLSearchParams({
            pageNum: window.noticesPagination.current,
            pageSize: window.noticesPagination.size
        });

        // 根据状态确定API端点
        let url;
        if (status === 'unread') {
            // 获取未读通知
            url = buildNoticesUrl(`/user/${currentUser.userId}/page?${params.toString()}`);
        } else {
            // 获取已读通知
            url = buildNoticesUrl(`/user/${currentUser.userId}/page?${params.toString()}`);
        }

        const resp = await Auth.authenticatedFetch(url);
        if (!resp.ok) {
            const text = await resp.text();
            if (statusEl) statusEl.textContent = `网络错误: ${resp.status} ${text}`;
            return;
        }

        const json = await resp.json();
        const page = json.data;

        if (!page || !Array.isArray(page.records)) {
            if (statusEl) statusEl.textContent = '暂无通知';
            return;
        }

        const notices = page.records.filter(notice => {
            // 根据标签页筛选已读/未读
            if (status === 'unread') {
                return notice.readStatus === 0;
            } else {
                return notice.readStatus === 1;
            }
        });

        if (notices.length === 0) {
            if (statusEl) statusEl.textContent = '暂无通知';
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">暂无通知</td></tr>`;
            return;
        }

        // 更新分页信息
        window.noticesPagination.total = page.total;
        window.noticesPagination.pages = page.pages;
        if (paginationInfo) {
            paginationInfo.textContent = `第 ${page.current} 页，共 ${page.pages} 页，共 ${page.total} 条`;
        }

        // 更新按钮状态
        if (prevBtn) prevBtn.disabled = page.current <= 1;
        if (nextBtn) nextBtn.disabled = page.current >= page.pages;

        // 渲染通知列表
        tbody.innerHTML = notices.map(notice => {
            // 截取预览内容
            const previewContent = notice.noticeContent.length > 30 ? 
                notice.noticeContent.substring(0, 30) + '...' : 
                notice.noticeContent;
                
            return `
                <tr>
                    <td style="text-align: center;">${getNoticeTypeText(notice.noticeType)}</td>
                    <td style="text-align: left;">${previewContent}</td>
                    <td style="text-align: center;">${formatDateTime(notice.sendTime)}</td>
                    <td style="text-align: center;">
                        <button class="btn detail-btn" data-id="${notice.noticeId}" style="margin-right: 5px;">查看详情</button>
                        <button class="btn delete-btn" data-id="${notice.noticeId}">删除</button>
                    </td>
                </tr>
            `;
        }).join('');

        // 绑定查看详情事件
        const detailButtons = tbody.querySelectorAll('.detail-btn');
        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const noticeId = button.getAttribute('data-id');
                showNoticeDetail(noticeId, currentUser);
            });
        });

        // 绑定删除事件
        const deleteButtons = tbody.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const noticeId = button.getAttribute('data-id');
                await deleteNotice(noticeId, currentUser);
            });
        });

        if (statusEl) statusEl.textContent = '';
    } catch (e) {
        console.error('加载通知异常:', e);
        if (statusEl) statusEl.textContent = '加载通知异常，请稍后重试';
    }
}

/**
 * 显示通知详情
 * @param {string} noticeId - 通知ID
 * @param {object} currentUser - 当前用户
 */
async function showNoticeDetail(noticeId, currentUser) {
    try {
        const url = buildNoticesUrl(`/${noticeId}`);
        const resp = await Auth.authenticatedFetch(url);
        if (!resp.ok) {
            alert('获取通知详情失败');
            return;
        }

        const json = await resp.json();
        const notice = json.data;

        if (!notice) {
            alert('通知不存在');
            return;
        }

        // 更新为已读状态
        await updateReadStatus(noticeId, 1, currentUser);

        // 显示详情
        const modal = document.getElementById('notice-detail-modal');
        const detailContent = document.getElementById('notice-detail-content');
        
        detailContent.innerHTML = `
            <p><strong>通知ID:</strong> ${notice.noticeId}</p>
            <p><strong>消息类别:</strong> ${getNoticeTypeText(notice.noticeType)}</p>
            <p><strong>发送时间:</strong> ${formatDateTime(notice.sendTime)}</p>
            <p><strong>消息内容:</strong></p>
            <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${notice.noticeContent}</div>
        `;
        
        modal.style.display = 'block';
    } catch (e) {
        console.error('查看通知详情异常:', e);
        alert('查看通知详情异常，请稍后重试');
    }
}

/**
 * 更新通知阅读状态
 * @param {string} noticeId - 通知ID
 * @param {number} readStatus - 阅读状态 (0-未读, 1-已读)
 * @param {object} currentUser - 当前用户
 */
async function updateReadStatus(noticeId, readStatus, currentUser) {
    try {
        const url = buildNoticesUrl(`/${noticeId}/read-status?readStatus=${readStatus}`);
        const resp = await Auth.authenticatedFetch(url, {
            method: 'PUT'
        });
        
        if (!resp.ok) {
            console.error('更新阅读状态失败');
            return;
        }
        
        // 刷新当前页面
        const activeTab = document.querySelector('.tab-btn.active');
        const status = activeTab ? activeTab.getAttribute('data-status') : 'unread';
        loadNotices(currentUser, status);
        
        // 更新未读数量
        updateUnreadCount(currentUser);
    } catch (e) {
        console.error('更新阅读状态异常:', e);
    }
}

/**
 * 删除通知
 * @param {string} noticeId - 通知ID
 * @param {object} currentUser - 当前用户
 */
async function deleteNotice(noticeId, currentUser) {
    if (!confirm('确定要删除这条通知吗？')) {
        return;
    }
    
    try {
        const url = buildNoticesUrl(`/${noticeId}`);
        const resp = await Auth.authenticatedFetch(url, {
            method: 'DELETE'
        });
        
        if (!resp.ok) {
            alert('删除通知失败');
            return;
        }
        
        const json = await resp.json();
        if (json.code !== 200) {
            alert(json.message || '删除通知失败');
            return;
        }
        
        alert('删除成功');
        
        // 刷新当前页面
        const activeTab = document.querySelector('.tab-btn.active');
        const status = activeTab ? activeTab.getAttribute('data-status') : 'unread';
        loadNotices(currentUser, status);
        
        // 更新未读数量
        updateUnreadCount(currentUser);
    } catch (e) {
        console.error('删除通知异常:', e);
        alert('删除通知异常，请稍后重试');
    }
}

/**
 * 更新未读通知数量显示
 * @param {object} currentUser - 当前用户
 */
async function updateUnreadCount(currentUser) {
    try {
        const url = buildNoticesUrl(`/user/${currentUser.userId}/unread-count`);
        const resp = await Auth.authenticatedFetch(url);
        if (!resp.ok) {
            return;
        }
        
        const json = await resp.json();
        const count = json.data || 0;
        
        // 更新侧边栏红点
        let noticeBadge;
        // 根据不同的用户类型查找红点元素
        if (document.querySelector('[data-view="notices"]')) {
            // 求职者界面
            noticeBadge = document.querySelector('[data-view="notices"] .badge');
        } else if (document.querySelector('[data-tab="notices"]')) {
            // 企业用户界面
            noticeBadge = document.querySelector('[data-tab="notices"] .badge');
        }
        
        if (noticeBadge) {
            if (count > 0) {
                noticeBadge.textContent = count;
                noticeBadge.style.display = 'inline';
            } else {
                noticeBadge.style.display = 'none';
            }
        }
    } catch (e) {
        console.error('更新未读数量异常:', e);
    }
}

/**
 * 构建通知API URL
 * @param {string} path - API路径
 * @returns {string} 完整URL
 */
function buildNoticesUrl(path = '') {
    const basePath = '/api/notices';
    // 确保路径正确拼接
    return path ? `${basePath}${path.startsWith('/') ? path : '/' + path}` : basePath;
}

/**
 * 获取通知类型文本
 * @param {string} type - 通知类型
 * @returns {string} 类型文本
 */
function getNoticeTypeText(type) {
    const typeMap = {
        'APPLICATION_STATUS': '申请状态',
        'INTERVIEW_ARRANGED': '面试安排',
        'INTERVIEW_RESULT': '面试结果',
        'PENDING_APPLICATIONS': '待处理申请',
        'UPCOMING_INTERVIEW': '即将到来的面试'
    };
    return typeMap[type] || type;
}

/**
 * 格式化日期时间
 * @param {string} dateTime - 日期时间字符串
 * @returns {string} 格式化后的日期时间
 */
function formatDateTime(dateTime) {
    if (!dateTime) return '';
    return dateTime.replace('T', ' ').substring(0, 19);
}