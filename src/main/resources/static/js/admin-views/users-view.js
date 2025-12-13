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
                    <input type="text" id="user-search" placeholder="搜索用户名 / 邮箱..." oninput="searchUser()">
                </div>
                <select id="user-role-filter" onchange="filterUserByRole()">
                    <option value="">全部角色</option>
                    <option value="job-seeker">求职者</option>
                    <option value="employer">企业管理员</option>
                    <option value="recruiter">招聘专员</option>
                    <option value="admin">平台管理员</option>
                </select>
            </div>

            <table class="data-table">
                <thead>
                <tr>
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>角色</th>
                    <th>状态</th>
                    <th>注册时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="user-table-body">
                <!-- 动态加载 -->
                </tbody>
            </table>
        </div>
    `;

    // 加载用户数据
    loadUsers(currentUser);
}

/**
 * 加载用户数据
 * @param {Object} adminUser - 管理员用户信息
 */
async function loadUsers(adminUser) {
    const tbody = document.getElementById('user-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7">正在加载用户数据...</td></tr>';

    try {
        // 这里应该调用获取所有用户的API
        // const resp = await fetch(`${USER_API_BASE}/all`, {
        //     method: 'GET',
        //     headers: { 'Authorization': `Bearer ${adminUser.token}` }
        // });

        // 模拟数据
        const users = [
            {
                userId: 1,
                username: 'demo_user',
                email: 'demo@example.com',
                userType: 4,
                role: 'job-seeker',
                status: '正常',
                createTime: '2024-01-01'
            },
            {
                userId: 2,
                username: 'admin_user',
                email: 'admin@example.com',
                userType: 1,
                role: 'admin',
                status: '正常',
                createTime: '2024-01-02'
            }
        ];

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.userId}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="tag tag-success">${user.status}</span></td>
                <td>${user.createTime}</td>
                <td>
                    <button class="btn btn-sm" onclick="viewUserDetail(${user.userId})">查看</button>
                    <button class="btn btn-sm" onclick="lockUser(${user.userId})">锁定</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.userId})">删除</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('加载用户失败:', e);
        tbody.innerHTML = '<tr><td colspan="7">加载失败，请稍后重试</td></tr>';
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
 * 锁定用户
 * @param {number} userId - 用户ID
 */
function lockUser(userId) {
    if (confirm('确定锁定用户 ' + userId + '？')) {
        alert('已锁定用户 ' + userId + '（模拟操作）');
    }
}

/**
 * 删除用户
 * @param {number} userId - 用户ID
 */
function deleteUser(userId) {
    if (confirm('确定删除用户 ' + userId + '？此操作不可恢复！')) {
        alert('用户 ' + userId + ' 已删除（模拟操作）');
    }
}

/**
 * 搜索用户
 */
function searchUser() {
    const keyword = document.getElementById('user-search').value;
    if (keyword) {
        alert('搜索用户：' + keyword + '（模拟操作）');
    }
}

/**
 * 按角色筛选用户
 */
function filterUserByRole() {
    const role = document.getElementById('user-role-filter').value;
    alert('按角色筛选：' + (role || '全部') + '（模拟操作）');
}