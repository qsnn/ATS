/**
 * 渲染用户管理视图
 * @param {HTMLElement} container - 容器元素
 * @param {Object} currentUser - 当前用户信息
 */
function renderUsersView(container, currentUser) {
    container.innerHTML = `
        <h2>用户管理</h2>
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <div class="search-box" style="max-width:300px;">
                    <input type="text" id="user-search" placeholder="按ID、用户名、电话、邮箱搜索..." oninput="searchUser()">
                </div>
                <div>
                    <button class="btn btn-primary" onclick="showCreateUserModal()" style="margin-right: 10px;">创建账户</button>
                    <select id="user-status-filter" onchange="filterUserByStatus()">
                        <option value="">全部状态</option>
                        <option value="1">启用</option>
                        <option value="0">停用</option>
                    </select>
                </div>
            </div>

            <!-- 用户类型标签页 -->
            <div class="user-type-tabs" style="margin-bottom: 15px;">
                <button class="tab-btn active" data-user-type="" onclick="switchUserType('')">全部用户</button>
                <button class="tab-btn" data-user-type="4" onclick="switchUserType('4')">求职者</button>
                <button class="tab-btn" data-user-type="2" onclick="switchUserType('2')">企业管理员</button>
                <button class="tab-btn" data-user-type="3" onclick="switchUserType('3')">HR</button>
            </div>

            <div id="users-status" style="margin-bottom: 8px; color: #666;">正在加载用户数据...</div>
            
            <table class="data-table">
                <thead>
                <tr>
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th>电话</th>
                    <th>邮箱</th>
                    <th>角色</th>
                    <th>公司ID</th>
                    <th>状态</th>
                    <th>注册时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="user-table-body">
                <!-- 动态加载 -->
                </tbody>
            </table>
            
            <!-- 分页控件 -->
            <div id="users-pagination" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <div id="users-pagination-info"></div>
                <div style="display: flex; gap: 10px;">
                    <button id="users-prev-page" class="btn btn-sm" disabled>上一页</button>
                    <button id="users-next-page" class="btn btn-sm">下一页</button>
                </div>
            </div>
        </div>

        <!-- 创建用户模态框 -->
        <div id="create-user-modal" class="modal" style="display:none;">
            <div class="modal-content" style="width: 500px;">
                <span class="close" onclick="closeCreateUserModal()">&times;</span>
                <h2>创建账户</h2>
                <form id="create-user-form">
                    <div class="form-group">
                        <label>用户类型 *</label>
                        <select id="create-user-type" class="form-control" required>
                            <option value="">请选择用户类型</option>
                            <option value="4">求职者</option>
                            <option value="2">企业管理员</option>
                            <option value="3">HR</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>用户名 *</label>
                        <input type="text" id="create-username" class="form-control" placeholder="请输入用户名" required>
                    </div>
                    <div class="form-group">
                        <label>密码 *</label>
                        <input type="password" id="create-password" class="form-control" placeholder="请输入密码" required>
                    </div>
                    <div class="form-group">
                        <label>电话</label>
                        <input type="text" id="create-phone" class="form-control" placeholder="请输入电话号码">
                    </div>
                    <div class="form-group">
                        <label>邮箱</label>
                        <input type="email" id="create-email" class="form-control" placeholder="请输入邮箱地址">
                    </div>
                    <div class="form-group" id="create-company-group" style="display:none;">
                        <label>公司ID</label>
                        <input type="number" id="create-company-id" class="form-control" placeholder="请输入公司ID">
                    </div>
                    <button type="submit" class="btn btn-primary">创建</button>
                </form>
            </div>
        </div>
    `;

    // 初始化分页状态
    window.usersPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    // 绑定创建用户表单事件
    document.getElementById('create-user-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createUser(currentUser);
    });

    // 绑定用户类型选择事件
    document.getElementById('create-user-type').addEventListener('change', function() {
        const companyGroup = document.getElementById('create-company-group');
        if (this.value === '2' || this.value === '3') {
            companyGroup.style.display = 'block';
        } else {
            companyGroup.style.display = 'none';
        }
    });

    // 绑定分页按钮事件
    document.getElementById('users-prev-page').addEventListener('click', () => {
        if (window.usersPagination.current > 1) {
            window.usersPagination.current--;
            const currentUser = Auth.getCurrentUser();
            loadUsers(currentUser);
        }
    });

    document.getElementById('users-next-page').addEventListener('click', () => {
        if (window.usersPagination.current < window.usersPagination.pages) {
            window.usersPagination.current++;
            const currentUser = Auth.getCurrentUser();
            loadUsers(currentUser);
        }
    });

    // 加载用户数据
    loadUsers(currentUser);
}

/**
 * 加载用户数据
 * @param {Object} adminUser - 管理员用户信息
 */
async function loadUsers(adminUser) {
    const tbody = document.getElementById('user-table-body');
    const statusEl = document.getElementById('users-status');
    const paginationContainer = document.getElementById('users-pagination');
    const paginationInfo = document.getElementById('users-pagination-info');
    const prevBtn = document.getElementById('users-prev-page');
    const nextBtn = document.getElementById('users-next-page');
    
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="9">正在加载用户数据...</td></tr>';
    if (statusEl) statusEl.textContent = '正在加载用户数据...';

    try {
        // 获取当前筛选条件
        const userType = document.querySelector('.user-type-tabs .tab-btn.active')?.getAttribute('data-user-type') || '';
        const status = document.getElementById('user-status-filter')?.value || '';
        const keyword = document.getElementById('user-search')?.value || '';
        
        // 构建查询参数
        const params = new URLSearchParams();
        params.append('current', window.usersPagination.current);
        params.append('size', window.usersPagination.size);
        if (userType) params.append('userType', userType);
        if (status !== '') params.append('status', status);
        if (keyword) {
            // 构造查询对象
            params.append('username', keyword);
            params.append('phone', keyword);
            params.append('email', keyword);
        }
        
        const response = await Auth.authenticatedFetch(`/api/user/page?${params.toString()}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '获取用户列表失败');
        }

        const pageData = result.data;
        const users = pageData.records || [];
        
        // 更新分页信息
        window.usersPagination.total = pageData.total || 0;
        window.usersPagination.pages = pageData.pages || Math.ceil((pageData.total || 0) / window.usersPagination.size) || 0;
        
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9">暂无用户数据</td></tr>';
            if (statusEl) statusEl.textContent = '暂无用户数据';
            if (paginationInfo) paginationInfo.textContent = '第 0 页，共 0 页';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            return;
        }

        tbody.innerHTML = users.map(user => {
            const userTypeMap = {
                1: '平台管理员',
                2: '企业管理员',
                3: 'HR',
                4: '求职者'
            };
            
            const statusMap = {
                0: '<span class="tag tag-danger">停用</span>',
                1: '<span class="tag tag-success">启用</span>',
                2: '<span class="tag tag-warning">待完善</span>'
            };
            
            return `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.username}</td>
                    <td>${user.phone || ''}</td>
                    <td>${user.email || ''}</td>
                    <td>${userTypeMap[user.userType] || '未知'}</td>
                    <td>${user.companyId || ''}</td>
                    <td>${statusMap[user.status] || '未知'}</td>
                    <td>${user.createTime ? user.createTime.substring(0, 19).replace('T', ' ') : ''}</td>
                    <td>
                        <button class="btn btn-sm" onclick="viewUserDetail(${user.userId})">查看</button>
                        <button class="btn btn-sm" onclick="editUser(${user.userId})">编辑</button>
                        ${user.status == 1 ? 
                          `<button class="btn btn-warning btn-sm" onclick="toggleUserStatus(${user.userId}, 0)">停用</button>` :
                          `<button class="btn btn-success btn-sm" onclick="toggleUserStatus(${user.userId}, 1)">启用</button>`}
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.userId})">删除</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        // 更新状态和分页信息
        if (statusEl) statusEl.textContent = `共 ${window.usersPagination.total} 条用户记录`;
        if (paginationInfo) paginationInfo.textContent = `第 ${window.usersPagination.current} 页，共 ${window.usersPagination.pages} 页`;
        if (prevBtn) prevBtn.disabled = window.usersPagination.current <= 1;
        if (nextBtn) nextBtn.disabled = window.usersPagination.current >= window.usersPagination.pages;
    } catch (e) {
        console.error('加载用户失败:', e);
        tbody.innerHTML = `<tr><td colspan="9">加载失败：${e.message}</td></tr>`;
        if (statusEl) statusEl.textContent = `加载失败：${e.message}`;
    }
}

/**
 * 查看用户详情
 * @param {number} userId - 用户ID
 */
function viewUserDetail(userId) {
    alert('查看用户 ' + userId + ' 详情（后续实现）');
}

/**
 * 编辑用户
 * @param {number} userId - 用户ID
 */
function editUser(userId) {
    alert('编辑用户 ' + userId + '（后续实现）');
}

/**
 * 切换用户状态
 * @param {number} userId - 用户ID
 * @param {number} status - 状态 (0=停用, 1=启用)
 */
async function toggleUserStatus(userId, status) {
    if (!confirm(`确定要${status === 1 ? '启用' : '停用'}该用户吗？`)) {
        return;
    }

    try {
        const response = await Auth.authenticatedFetch(`/api/user/${userId}/status?status=${status}`, {
            method: 'PUT'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '操作失败');
        }

        alert(`用户${status === 1 ? '启用' : '停用'}成功`);
        // 重新加载用户列表
        const currentUser = Auth.getCurrentUser();
        loadUsers(currentUser);
    } catch (e) {
        console.error('操作失败:', e);
        alert(`操作失败：${e.message}`);
    }
}

/**
 * 删除用户
 * @param {number} userId - 用户ID
 */
async function deleteUser(userId) {
    if (!confirm('确定删除用户 ' + userId + '？此操作不可恢复！')) {
        return;
    }

    try {
        const response = await Auth.authenticatedFetch(`/api/user/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '删除失败');
        }

        alert('用户删除成功');
        // 重新加载用户列表
        const currentUser = Auth.getCurrentUser();
        loadUsers(currentUser);
    } catch (e) {
        console.error('删除失败:', e);
        alert(`删除失败：${e.message}`);
    }
}

/**
 * 搜索用户
 */
function searchUser() {
    // 重置到第一页
    window.usersPagination.current = 1;
    const currentUser = Auth.getCurrentUser();
    loadUsers(currentUser);
}

/**
 * 按状态筛选用户
 */
function filterUserByStatus() {
    // 重置到第一页
    window.usersPagination.current = 1;
    const currentUser = Auth.getCurrentUser();
    loadUsers(currentUser);
}

/**
 * 切换用户类型标签页
 * @param {string} userType - 用户类型
 */
function switchUserType(userType) {
    // 更新激活状态
    document.querySelectorAll('.user-type-tabs .tab-btn').forEach(btn => {
        if (btn.getAttribute('data-user-type') === userType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 重置到第一页
    window.usersPagination.current = 1;
    // 重新加载数据
    const currentUser = Auth.getCurrentUser();
    loadUsers(currentUser);
}

/**
 * 显示创建用户模态框
 */
function showCreateUserModal() {
    document.getElementById('create-user-modal').style.display = 'block';
}

/**
 * 关闭创建用户模态框
 */
function closeCreateUserModal() {
    document.getElementById('create-user-modal').style.display = 'none';
}

/**
 * 创建用户
 * @param {Object} adminUser - 管理员用户信息
 */
async function createUser(adminUser) {
    const userType = document.getElementById('create-user-type').value;
    const username = document.getElementById('create-username').value.trim();
    const password = document.getElementById('create-password').value.trim();
    const phone = document.getElementById('create-phone').value.trim();
    const email = document.getElementById('create-email').value.trim();
    const companyId = document.getElementById('create-company-id').value.trim();

    if (!userType || !username || !password) {
        alert('请填写必填字段');
        return;
    }

    const userData = {
        userType: parseInt(userType),
        username: username,
        password: password
    };

    if (phone) userData.phone = phone;
    if (email) userData.email = email;
    if (companyId && (userType === '2' || userType === '3')) {
        userData.companyId = parseInt(companyId);
    }

    try {
        const response = await Auth.authenticatedFetch('/api/user', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '创建失败');
        }

        alert('用户创建成功');
        closeCreateUserModal();
        // 重置表单
        document.getElementById('create-user-form').reset();
        // 重新加载用户列表
        loadUsers(adminUser);
    } catch (e) {
        console.error('创建用户失败:', e);
        alert(`创建失败：${e.message}`);
    }
}