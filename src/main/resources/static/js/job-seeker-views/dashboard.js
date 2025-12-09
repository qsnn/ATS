const RESUME_API_BASE = `${window.API_BASE || '/api'}/resume`;
const USER_API_BASE = `${window.API_BASE || '/api'}/user`;
const USER_PASSWORD_API_BASE = userId => `${window.API_BASE || '/api'}/user/${encodeURIComponent(userId)}/password`;

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'job-seeker') {
        window.location.href = 'login.html';
        return;
    }

    const greeting = document.getElementById('user-greeting');
    if (greeting) {
        greeting.textContent = '欢迎，' + (currentUser.username || '求职者');
    }

    // 侧边栏事件委托
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const view = a.dataset.view;
            switchView(view, currentUser);
        });
    });

    // 默认进入职位搜索
    switchView('job-search', currentUser);
});

function handleLogout() {
    Auth.logout();
    window.location.href = 'index.html';
}

/**
 * 视图切换
 * \@param {string} viewId
 * \@param {object} currentUser
 */
function switchView(viewId, currentUser = Auth.getCurrentUser()) {
    // 激活导航
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
        a.classList.toggle('active', a.dataset.view === viewId);
    });

    const container = document.getElementById('main-content');
    if (!container) return;

    const map = {
        'job-search': renderJobSearchView,
        'profile': renderProfileView,
        'resumes': renderResumesView,
        'applications': renderApplicationsView,
        'favorites': renderFavoritesView,
        'interviews': renderInterviewsView
    };

    const renderFn = map[viewId];
    if (typeof renderFn === 'function') {
        renderFn(container, currentUser);
    } else {
        container.innerHTML = '<p>视图未实现</p>';
    }
}

/**
 * 通用更新个人信息 API 封装
 * 供 profile 视图复用
 */
async function updateUserProfileApi(payload) {
    try {
        const resp = await fetch(`${USER_API_BASE}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            const errorText = await resp.text();
            return { success: false, message: `网络错误: ${resp.status} ${errorText}` };
        }

        const json = await resp.json();
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
 * 简历接口封装，供 resumes 视图使用
 */
async function fetchUserResumesApi(userId) {
    try {
        const resp = await fetch(`${RESUME_API_BASE}/user/${encodeURIComponent(userId)}`, {
            method: 'GET'
        });

        if (!resp.ok) {
            const text = await resp.text();
            return { success: false, message: `网络错误: ${resp.status} ${text}` };
        }

        const json = await resp.json();
        if (json.code !== 200) {
            return { success: false, message: json.message || '加载失败' };
        }

        return { success: true, data: json.data || [] };
    } catch (e) {
        console.error('获取简历列表异常:', e);
        return { success: false, message: '请求异常，请稍后重试' };
    }
}

// 修改密码 API 封装，供 profile 视图使用
async function updateUserPasswordApi(payload) {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser || !currentUser.userId) {
        return { success: false, message: '未登录或用户信息缺失' };
    }
    try {
        const resp = await fetch(`${USER_PASSWORD_API_BASE(currentUser.userId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            const errorText = await resp.text();
            return { success: false, message: `网络错误: ${resp.status} ${errorText}` };
        }

        const json = await resp.json();
        if (json.code !== 200) {
            return { success: false, message: json.message || '修改密码失败' };
        }

        return { success: true, message: json.message || '修改密码成功' };
    } catch (e) {
        console.error('修改密码异常:', e);
        return { success: false, message: '请求异常，请稍后重试' };
    }
}
