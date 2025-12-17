/**
 * 渲染公司管理视图
 * @param {HTMLElement} container - 容器元素
 * @param {Object} currentUser - 当前用户信息
 */
function renderCompaniesView(container, currentUser) {
    container.innerHTML = `
        <h2>公司管理</h2>
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <div class="search-box" style="max-width:300px;">
                    <input type="text" id="company-search" placeholder="搜索公司名称..." oninput="searchCompanies()">
                </div>
                <div>
                    <select id="company-status-filter" onchange="filterCompaniesByStatus()">
                        <option value="">全部状态</option>
                        <option value="1">启用</option>
                        <option value="0">停用</option>
                    </select>
                </div>
            </div>

            <!-- 公司状态标签页 -->
            <div class="company-status-tabs" style="margin-bottom: 15px;">
                <button class="tab-btn active" data-status="" onclick="switchCompanyStatus('')">全部</button>
                <button class="tab-btn" data-status="1" onclick="switchCompanyStatus('1')">启用</button>
                <button class="tab-btn" data-status="0" onclick="switchCompanyStatus('0')">停用</button>
            </div>

            <div id="companies-status" style="margin-bottom: 8px; color: #666;">正在加载公司数据...</div>
            
            <table class="data-table">
                <thead>
                <tr>
                    <th>公司ID</th>
                    <th>公司名称</th>
                    <th>联系人</th>
                    <th>联系电话</th>
                    <th>联系邮箱</th>
                    <th>创建时间</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="company-table-body">
                <!-- 动态加载 -->
                </tbody>
            </table>
            
            <!-- 分页控件 -->
            <div id="companies-pagination" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <div id="companies-pagination-info"></div>
                <div style="display: flex; gap: 10px;">
                    <button id="companies-prev-page" class="btn btn-sm" disabled>上一页</button>
                    <button id="companies-next-page" class="btn btn-sm">下一页</button>
                </div>
            </div>
        </div>
    `;

    // 初始化分页状态
    window.companiesPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    // 绑定分页按钮事件
    document.getElementById('companies-prev-page').addEventListener('click', () => {
        if (window.companiesPagination.current > 1) {
            window.companiesPagination.current--;
            const currentUser = Auth.getCurrentUser();
            loadCompanies(currentUser);
        }
    });

    document.getElementById('companies-next-page').addEventListener('click', () => {
        if (window.companiesPagination.current < window.companiesPagination.pages) {
            window.companiesPagination.current++;
            const currentUser = Auth.getCurrentUser();
            loadCompanies(currentUser);
        }
    });

    // 加载公司数据
    loadCompanies(currentUser);
}

/**
 * 加载公司数据
 * @param {Object} adminUser - 管理员用户信息
 */
async function loadCompanies(adminUser) {
    const tbody = document.getElementById('company-table-body');
    const statusEl = document.getElementById('companies-status');
    const paginationContainer = document.getElementById('companies-pagination');
    const paginationInfo = document.getElementById('companies-pagination-info');
    const prevBtn = document.getElementById('companies-prev-page');
    const nextBtn = document.getElementById('companies-next-page');
    
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8">正在加载公司数据...</td></tr>';
    if (statusEl) statusEl.textContent = '正在加载公司数据...';

    try {
        // 获取当前筛选条件
        const status = document.getElementById('company-status-filter')?.value || '';
        const keyword = document.getElementById('company-search')?.value || '';
        
        // 构建查询参数
        const params = new URLSearchParams();
        params.append('current', window.companiesPagination.current);
        params.append('size', window.companiesPagination.size);
        
        if (keyword) {
            params.append('companyName', keyword);
        }
        
        if (status !== '') {
            params.append('status', status);
        }
        
        const response = await Auth.authenticatedFetch(`/api/company/page?${params.toString()}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '获取公司列表失败');
        }

        const pageData = result.data;
        const companies = pageData.records || [];
        
        // 更新分页信息
        window.companiesPagination.total = pageData.total || 0;
        window.companiesPagination.pages = pageData.pages || Math.ceil((pageData.total || 0) / window.companiesPagination.size) || 0;
        
        if (!companies || companies.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">暂无公司数据</td></tr>';
            if (statusEl) statusEl.textContent = '暂无公司数据';
            if (paginationInfo) paginationInfo.textContent = '第 0 页，共 0 页';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            return;
        }

        tbody.innerHTML = companies.map(company => {
            const statusHtml = company.status === 1 ? 
                '<span class="tag tag-success">启用</span>' : 
                '<span class="tag tag-danger">停用</span>';
                
            return `
                <tr>
                    <td>${company.companyId}</td>
                    <td>${company.companyName}</td>
                    <td>${company.contactPerson || ''}</td>
                    <td>${company.contactPhone || ''}</td>
                    <td>${company.contactEmail || ''}</td>
                    <td>${company.createTime ? company.createTime.substring(0, 19).replace('T', ' ') : ''}</td>
                    <td>${statusHtml}</td>
                    <td>
                        <button class="btn btn-sm" onclick="viewCompany(${company.companyId})">查看</button>
                        ${company.status === 1 ? 
                          `<button class="btn btn-warning btn-sm" onclick="toggleCompanyStatus(${company.companyId}, 0)">停用</button>` :
                          `<button class="btn btn-success btn-sm" onclick="toggleCompanyStatus(${company.companyId}, 1)">启用</button>`}
                        <button class="btn btn-danger btn-sm" onclick="deleteCompany(${company.companyId})">删除</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        // 更新状态和分页信息
        if (statusEl) statusEl.textContent = `共 ${window.companiesPagination.total} 条公司记录`;
        if (paginationInfo) paginationInfo.textContent = `第 ${window.companiesPagination.current} 页，共 ${window.companiesPagination.pages} 页`;
        if (prevBtn) prevBtn.disabled = window.companiesPagination.current <= 1;
        if (nextBtn) nextBtn.disabled = window.companiesPagination.current >= window.companiesPagination.pages;
    } catch (e) {
        console.error('加载公司失败:', e);
        tbody.innerHTML = `<tr><td colspan="8">加载失败：${e.message}</td></tr>`;
        if (statusEl) statusEl.textContent = `加载失败：${e.message}`;
    }
}

/**
 * 搜索公司
 */
function searchCompanies() {
    // 重置到第一页
    window.companiesPagination.current = 1;
    const currentUser = Auth.getCurrentUser();
    loadCompanies(currentUser);
}

/**
 * 按状态筛选公司
 */
function filterCompaniesByStatus() {
    // 重置到第一页
    window.companiesPagination.current = 1;
    const currentUser = Auth.getCurrentUser();
    loadCompanies(currentUser);
}

/**
 * 切换公司状态标签页
 * @param {string} status - 状态
 */
function switchCompanyStatus(status) {
    // 更新激活状态
    document.querySelectorAll('.company-status-tabs .tab-btn').forEach(btn => {
        if (btn.getAttribute('data-status') === status) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 重置到第一页
    window.companiesPagination.current = 1;
    // 重新加载数据
    const currentUser = Auth.getCurrentUser();
    loadCompanies(currentUser);
}

/**
 * 查看公司详情
 * @param {number} companyId - 公司ID
 */
function viewCompany(companyId) {
    alert('查看公司 ' + companyId + ' 详情（后续实现）');
}

/**
 * 切换公司状态
 * @param {number} companyId - 公司ID
 * @param {number} status - 状态 (0=停用, 1=启用)
 */
async function toggleCompanyStatus(companyId, status) {
    if (!confirm(`确定要${status === 1 ? '启用' : '停用'}该公司吗？`)) {
        return;
    }

    try {
        const response = await Auth.authenticatedFetch(`/api/company/${companyId}/status?status=${status}`, {
            method: 'PUT'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '操作失败');
        }

        alert(`公司${status === 1 ? '启用' : '停用'}成功`);
        // 重新加载公司列表
        const currentUser = Auth.getCurrentUser();
        loadCompanies(currentUser);
    } catch (e) {
        console.error('操作失败:', e);
        alert(`操作失败：${e.message}`);
    }
}

/**
 * 删除公司
 * @param {number} companyId - 公司ID
 */
async function deleteCompany(companyId) {
    if (!confirm('确定删除公司 ' + companyId + '？此操作不可恢复！')) {
        return;
    }

    try {
        const response = await Auth.authenticatedFetch(`/api/company/${companyId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '删除失败');
        }

        alert('公司删除成功');
        // 重新加载公司列表
        const currentUser = Auth.getCurrentUser();
        loadCompanies(currentUser);
    } catch (e) {
        console.error('删除失败:', e);
        alert(`删除失败：${e.message}`);
    }
}