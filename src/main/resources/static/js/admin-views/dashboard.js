const USER_API_BASE = '/api/user';

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = Auth.getCurrentUser();

    // 验证管理员权限
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // 只有管理员可以访问
    if (currentUser.role !== 'admin') {
        alert('您不是管理员，无法访问此页面');
        window.location.href = 'login.html';
        return;
    }

    // 更新欢迎语
    const greeting = document.getElementById('user-greeting');
    if (greeting) {
        greeting.textContent = '欢迎，' + (currentUser.username || '平台管理员');
    }

    // 侧边栏导航事件绑定
    document.querySelectorAll('.sidebar-nav a[data-tab]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // 移除所有激活状态
            document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
            // 激活当前项
            this.classList.add('active');
            
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName, currentUser);
        });
    });

    // 默认显示第一个标签页
    switchTab('users', currentUser);
});

function handleLogout() {
    Auth.logout();
    window.location.href = 'index.html';
}

/**
 * 标签页切换
 * @param {string} tabName
 * @param {object} currentUser
 */
function switchTab(tabName, currentUser = Auth.getCurrentUser()) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const container = document.getElementById(`${tabName}-tab`);
    if (!container) return;

    const map = {
        'users': renderUsersView,
        'companies': renderCompaniesView,
        'logs': renderLogsView,
        'profile': renderProfileView
    };

    const renderFn = map[tabName];
    if (typeof renderFn === 'function') {
        // 清空容器并重新渲染
        container.innerHTML = '';
        renderFn(container, currentUser);
    }

    // 显示当前标签
    container.classList.add('active');
}

/**
 * 通用更新个人信息 API 封装
 */
async function updateUserProfileApi(payload) {
    try {
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(`${USER_API_BASE}/${payload.userId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, message: `网络错误: ${response.status} ${errorText}` };
        }

        const json = await response.json();
        if (json.code !== 200) {
            return { success: false, message: json.message || '更新失败' };
        }

        return { success: true, message: json.message || '更新成功' };
    } catch (e) {
        console.error('更新用户信息异常:', e);
        return { success: false, message: '请求异常，请稍后重试' };
    }
}

/**
 * 修改密码 API 封装，供 admin profile 视图使用
 */
async function updateUserPasswordApi(payload) {
    try {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || !currentUser.userId) {
            return { success: false, message: '用户未登录' };
        }
        
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(`${USER_API_BASE}/${encodeURIComponent(currentUser.userId)}/password`, {
            method: 'PUT',
            body: JSON.stringify({
                oldPassword: payload.oldPassword,
                newPassword: payload.newPassword
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, message: `网络错误: ${response.status} ${errorText}` };
        }

        const json = await response.json();
        if (json.code !== 200) {
            return { success: false, message: json.message || '更新失败' };
        }

        return { success: true, message: json.message || '更新成功' };
    } catch (e) {
        console.error('更新用户密码异常:', e);
        return { success: false, message: '请求异常，请稍后重试' };
    }
}

// 添加公司管理视图渲染函数
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
                        <option value="enabled">启用</option>
                        <option value="disabled">停用</option>
                    </select>
                </div>
            </div>

            <!-- 公司状态标签页 -->
            <div class="company-status-tabs" style="margin-bottom: 15px;">
                <button class="tab-btn active" data-status="" onclick="switchCompanyStatus('')">全部</button>
                <button class="tab-btn" data-status="enabled" onclick="switchCompanyStatus('enabled')">启用</button>
                <button class="tab-btn" data-status="disabled" onclick="switchCompanyStatus('disabled')">停用</button>
            </div>

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
        </div>
    `;

    // 加载公司数据
    loadCompanies(currentUser);
}

/**
 * 加载公司数据
 * @param {Object} adminUser - 管理员用户信息
 */
async function loadCompanies(adminUser) {
    const tbody = document.getElementById('company-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8">正在加载公司数据...</td></tr>';

    try {
        const response = await Auth.authenticatedFetch('/api/company/list', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '获取公司列表失败');
        }

        const companies = result.data || [];
        
        if (!companies || companies.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">暂无公司数据</td></tr>';
            return;
        }

        tbody.innerHTML = companies.map(company => `
            <tr>
                <td>${company.companyId}</td>
                <td>${company.companyName}</td>
                <td>${company.contactPerson || ''}</td>
                <td>${company.contactPhone || ''}</td>
                <td>${company.contactEmail || ''}</td>
                <td>${company.createTime ? company.createTime.substring(0, 19).replace('T', ' ') : ''}</td>
                <td><span class="tag tag-success">启用</span></td>
                <td>
                    <button class="btn btn-sm" onclick="viewCompany(${company.companyId})">查看</button>
                    <button class="btn btn-warning btn-sm" onclick="toggleCompanyStatus(${company.companyId}, 'disable')">停用</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('加载公司失败:', e);
        tbody.innerHTML = `<tr><td colspan="8">加载失败：${e.message}</td></tr>`;
    }
}

/**
 * 搜索公司
 */
function searchCompanies() {
    const currentUser = Auth.getCurrentUser();
    loadCompanies(currentUser);
}

/**
 * 按状态筛选公司
 */
function filterCompaniesByStatus() {
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
 * @param {string} action - 操作 (enable=启用, disable=停用)
 */
function toggleCompanyStatus(companyId, action) {
    const actionText = action === 'enable' ? '启用' : '停用';
    if (confirm(`确定要${actionText}该公司及其所有相关账户吗？`)) {
        alert(`${actionText}公司 ${companyId}（模拟操作）`);
    }
}