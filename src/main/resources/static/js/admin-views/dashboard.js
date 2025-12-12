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

    // 标签页事件绑定
    document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
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
    // 激活标签按钮
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const container = document.getElementById(`${tabName}-tab`);
    if (!container) return;

    const map = {
        'users': renderUsersView,
        'roles': renderRolesView,
        'monitor': renderMonitorView,
        'content': renderContentView,
        'reports': renderReportsView
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