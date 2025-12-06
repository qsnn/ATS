function renderRolesView(container, currentUser) {
    container.innerHTML = `
        <h2>角色与权限</h2>
        <div class="card">
            <table class="data-table">
                <thead>
                <tr>
                    <th>角色标识</th>
                    <th>角色名称</th>
                    <th>说明</th>
                    <th>权限概览</th>
                </tr>
                </thead>
                <tbody id="roles-tbody">
                    <!-- 动态加载 -->
                </tbody>
            </table>
        </div>
    `;

    loadRoles();
}

function loadRoles() {
    const tbody = document.getElementById('roles-tbody');
    if (!tbody) return;

    const roles = [
        {
            id: 'job-seeker',
            name: '求职者',
            description: '投递简历、管理个人信息',
            permissions: '浏览职位、投递、管理简历'
        },
        {
            id: 'employer',
            name: '企业管理员',
            description: '管理企业职位与申请人',
            permissions: '发布职位、查看申请、管理人才库'
        },
        {
            id: 'recruiter',
            name: '招聘专员',
            description: '兼具HR与面试官权限',
            permissions: '管理人才库、安排面试、面试评价'
        },
        {
            id: 'admin',
            name: '平台管理员',
            description: '系统最高权限',
            permissions: '用户管理、系统配置、内容审核等'
        }
    ];

    tbody.innerHTML = roles.map(role => `
        <tr>
            <td>${role.id}</td>
            <td>${role.name}</td>
            <td>${role.description}</td>
            <td>${role.permissions}</td>
        </tr>
    `).join('');
}