/**
 * 渲染日志管理视图
 * @param {HTMLElement} container - 容器元素
 * @param {Object} currentUser - 当前用户信息
 */
function renderLogsView(container, currentUser) {
    container.innerHTML = `
        <h2>日志管理</h2>
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <div class="search-box" style="max-width:300px;">
                    <input type="text" id="log-search" placeholder="按用户ID、IP、模块、内容搜索..." oninput="searchLogs()">
                </div>
            </div>

            <!-- 日志类型标签页 -->
            <div class="log-type-tabs" style="margin-bottom: 15px;">
                <button class="tab-btn active" data-type="" onclick="switchLogType('')">全部日志</button>
                <button class="tab-btn" data-type="error" onclick="switchLogType('error')">错误日志</button>
                <button class="tab-btn" data-type="normal" onclick="switchLogType('normal')">正常日志</button>
            </div>

            <div id="logs-status" style="margin-bottom: 8px; color: #666;">正在加载日志数据...</div>
            
            <table class="data-table">
                <thead>
                <tr>
                    <th>日志ID</th>
                    <th>用户ID</th>
                    <th>操作人</th>
                    <th>操作模块</th>
                    <th>操作类型</th>
                    <th>操作内容</th>
                    <th>IP地址</th>
                    <th>操作时间</th>
                    <th>结果</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="log-table-body">
                <!-- 动态加载 -->
                </tbody>
            </table>
            
            <!-- 分页控件 -->
            <div id="logs-pagination" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <div id="logs-pagination-info"></div>
                <div style="display: flex; gap: 10px;">
                    <button id="logs-prev-page" class="btn btn-sm" disabled>上一页</button>
                    <button id="logs-next-page" class="btn btn-sm">下一页</button>
                </div>
            </div>
        </div>
        
        <!-- 日志详情模态框 -->
        <div id="log-detail-modal" class="modal" style="display:none;">
            <div class="modal-content" style="width: 700px;">
                <span class="close" onclick="closeLogDetailModal()">&times;</span>
                <h2>日志详情</h2>
                <div id="log-detail-content"></div>
            </div>
        </div>
    `;

    // 初始化分页状态
    window.logsPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    // 绑定分页按钮事件
    document.getElementById('logs-prev-page').addEventListener('click', () => {
        if (window.logsPagination.current > 1) {
            window.logsPagination.current--;
            const currentUser = Auth.getCurrentUser();
            loadLogs(currentUser);
        }
    });

    document.getElementById('logs-next-page').addEventListener('click', () => {
        if (window.logsPagination.current < window.logsPagination.pages) {
            window.logsPagination.current++;
            const currentUser = Auth.getCurrentUser();
            loadLogs(currentUser);
        }
    });

    // 加载日志数据
    loadLogs(currentUser);
}

/**
 * 加载日志数据
 * @param {Object} adminUser - 管理员用户信息
 */
async function loadLogs(adminUser) {
    const tbody = document.getElementById('log-table-body');
    const statusEl = document.getElementById('logs-status');
    const paginationContainer = document.getElementById('logs-pagination');
    const paginationInfo = document.getElementById('logs-pagination-info');
    const prevBtn = document.getElementById('logs-prev-page');
    const nextBtn = document.getElementById('logs-next-page');
    
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="9">正在加载日志数据...</td></tr>';
    if (statusEl) statusEl.textContent = '正在加载日志数据...';

    try {
        // 获取当前筛选条件
        const logType = document.querySelector('.log-type-tabs .tab-btn.active')?.getAttribute('data-type') || '';
        const keyword = document.getElementById('log-search')?.value || '';
        
        // 构建查询参数
        const params = new URLSearchParams();
        params.append('current', window.logsPagination.current);
        params.append('size', window.logsPagination.size);
        
        // 根据日志类型添加筛选条件
        if (logType === 'error') {
            // 错误日志：operation_result为0
            params.append('operationResult', '0');
        } else if (logType === 'normal') {
            // 正常日志：operation_result为1
            params.append('operationResult', '1');
        }
        
        // 检查是否是纯数字，如果是则按用户ID搜索
        if (/^\d+$/.test(keyword)) {
            params.append('userId', keyword);
        } else if (keyword) {
            // 否则按IP、模块、内容搜索
            params.append('ipAddress', keyword);
            params.append('operationModule', keyword);
            params.append('operationContent', keyword);
        }
        
        const response = await Auth.authenticatedFetch(`/api/logs/page?${params.toString()}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.code !== 200) {
            throw new Error(result.message || '获取日志列表失败');
        }

        const pageData = result.data;
        const logs = pageData.records || [];
        
        // 更新分页信息
        window.logsPagination.total = pageData.total || 0;
        window.logsPagination.pages = pageData.pages || Math.ceil((pageData.total || 0) / window.logsPagination.size) || 0;
        
        if (!logs || logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9">暂无日志数据</td></tr>';
            if (statusEl) statusEl.textContent = '暂无日志数据';
            if (paginationInfo) paginationInfo.textContent = '第 0 页，共 0 页';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            return;
        }

        tbody.innerHTML = logs.map(log => {
            const resultHtml = log.operationResult === 1 ? 
                '<span class="tag tag-success">成功</span>' : 
                '<span class="tag tag-danger">失败</span>';
            
            return `
                <tr>
                    <td>${log.logId}</td>
                    <td>${log.userId || ''}</td>
                    <td>${log.username || ''}</td>
                    <td>${log.operationModule || ''}</td>
                    <td>${log.operationType || ''}</td>
                    <td>${log.operationContent || ''}</td>
                    <td>${log.ipAddress || ''}</td>
                    <td>${log.operationTime ? log.operationTime.substring(0, 19).replace('T', ' ') : ''}</td>
                    <td>${resultHtml}</td>
                    <td><button class="btn btn-sm" onclick="viewLogDetail(${log.logId})">查看</button></td>
                </tr>
            `;
        }).join('');
        
        // 更新状态和分页信息
        if (statusEl) statusEl.textContent = `共 ${window.logsPagination.total} 条日志记录`;
        if (paginationInfo) paginationInfo.textContent = `第 ${window.logsPagination.current} 页，共 ${window.logsPagination.pages} 页`;
        if (prevBtn) prevBtn.disabled = window.logsPagination.current <= 1;
        if (nextBtn) nextBtn.disabled = window.logsPagination.current >= window.logsPagination.pages;
    } catch (e) {
        console.error('加载日志失败:', e);
        tbody.innerHTML = `<tr><td colspan="9">加载失败：${e.message}</td></tr>`;
        if (statusEl) statusEl.textContent = `加载失败：${e.message}`;
    }
}

/**
 * 搜索日志
 */
function searchLogs() {
    // 重置到第一页
    window.logsPagination.current = 1;
    const currentUser = Auth.getCurrentUser();
    loadLogs(currentUser);
}

/**
 * 切换日志类型标签页
 * @param {string} type - 日志类型
 */
function switchLogType(type) {
    // 更新激活状态
    document.querySelectorAll('.log-type-tabs .tab-btn').forEach(btn => {
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 重置到第一页
    window.logsPagination.current = 1;
    // 重新加载数据
    const currentUser = Auth.getCurrentUser();
    loadLogs(currentUser);
}

/**
 * 查看日志详情
 * @param {number} logId - 日志ID
 */
async function viewLogDetail(logId) {
    try {
        const response = await Auth.authenticatedFetch(`/api/logs/${logId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.code !== 200) {
            throw new Error(result.message || '获取日志详情失败');
        }

        const log = result.data;
        if (!log) {
            throw new Error('未找到日志信息');
        }

        // 显示日志详情
        showLogDetailModal(log);
    } catch (e) {
        console.error('获取日志详情失败:', e);
        alert(`获取日志详情失败：${e.message}`);
    }
}

/**
 * 显示日志详情模态框
 * @param {Object} log - 日志信息
 */
function showLogDetailModal(log) {
    const resultHtml = log.operationResult === 1 ? 
        '<span class="tag tag-success">成功</span>' : 
        '<span class="tag tag-danger">失败</span>';
        
    const detailHtml = `
        <div class="form-group">
            <label>日志ID:</label>
            <div class="readonly-field">${log.logId}</div>
        </div>
        <div class="form-group">
            <label>用户ID:</label>
            <div class="readonly-field">${log.userId || ''}</div>
        </div>
        <div class="form-group">
            <label>操作人:</label>
            <div class="readonly-field">${log.username || ''}</div>
        </div>
        <div class="form-group">
            <label>操作模块:</label>
            <div class="readonly-field">${log.operationModule || ''}</div>
        </div>
        <div class="form-group">
            <label>操作类型:</label>
            <div class="readonly-field">${log.operationType || ''}</div>
        </div>
        <div class="form-group">
            <label>操作内容:</label>
            <div class="readonly-field">${log.operationContent || ''}</div>
        </div>
        <div class="form-group">
            <label>请求URI:</label>
            <div class="readonly-field">${log.requestUri || ''}</div>
        </div>
        <div class="form-group">
            <label>请求方法:</label>
            <div class="readonly-field">${log.requestMethod || ''}</div>
        </div>
        <div class="form-group">
            <label>请求参数:</label>
            <div class="readonly-field" style="word-break: break-all; white-space: pre-wrap;">${log.requestParams || ''}</div>
        </div>
        <div class="form-group">
            <label>IP地址:</label>
            <div class="readonly-field">${log.ipAddress || ''}</div>
        </div>
        <div class="form-group">
            <label>用户代理:</label>
            <div class="readonly-field" style="word-break: break-all;">${log.userAgent || ''}</div>
        </div>
        <div class="form-group">
            <label>操作时间:</label>
            <div class="readonly-field">${log.operationTime ? log.operationTime.substring(0, 19).replace('T', ' ') : ''}</div>
        </div>
        <div class="form-group">
            <label>操作结果:</label>
            <div class="readonly-field">${resultHtml}</div>
        </div>
        <div class="form-group">
            <label>耗时(毫秒):</label>
            <div class="readonly-field">${log.costTime || ''}</div>
        </div>
        ${log.errorMsg ? `
        <div class="form-group">
            <label>错误信息:</label>
            <div class="readonly-field" style="color: #e53e3e;">${log.errorMsg || ''}</div>
        </div>` : ''}
    `;

    document.getElementById('log-detail-content').innerHTML = detailHtml;
    document.getElementById('log-detail-modal').style.display = 'block';
}

/**
 * 关闭日志详情模态框
 */
function closeLogDetailModal() {
    document.getElementById('log-detail-modal').style.display = 'none';
}