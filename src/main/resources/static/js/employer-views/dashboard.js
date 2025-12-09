const USER_API_BASE = 'http://124.71.101.139:10085/api/user';
const JOB_API_BASE = 'http://124.71.101.139:10085/api/job/info';
const TALENT_API_BASE = 'http://124.71.101.139:10085/api/talent';
const COMPANY_API_BASE = 'http://124.71.101.139:10085/api/company';
const USER_PASSWORD_API_BASE = userId => (`http://124.71.101.139:10085/api/user/${encodeURIComponent(userId)}/password`);

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'employer') {
        window.location.href = 'login.html';
        return;
    }

    const greeting = document.getElementById('user-greeting');
    if (greeting) {
        greeting.textContent = '欢迎，' + (currentUser.username || '企业管理员');
    }

    // 侧边栏点击切换
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const tabName = a.dataset.tab;
            if (tabName) {
                switchTab(tabName, currentUser);
            }
        });
    });

    // 默认进入职位管理
    switchTab('manage', currentUser);
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
    // 激活侧边栏
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
        a.classList.toggle('active', a.dataset.tab === tabName);
    });

    // 隐藏所有 tab 内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const container = document.getElementById(`${tabName}-tab`);
    if (!container) return;

    const map = {
        manage: renderJobManageView,
        applicants: renderApplicantsView,
        talent: renderTalentView,
        hr: renderHrManageView,
        company: renderCompanyView,
        profile: renderEmployerProfileView
    };

    const renderFn = map[tabName];
    if (typeof renderFn === 'function') {
        container.innerHTML = '';
        renderFn(container, currentUser);
    }

    container.classList.add('active');
}

/**
 * 通用更新个人信息 API 封装（复用求职者的）
 */
async function updateUserProfileApi(payload) {
    try {
        const resp = await fetch(`${USER_API_BASE}/${payload.userId}`, {
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
 * 修改密码 API 封装，供 employer profile 视图使用
 */
async function updateUserPasswordApi(payload) {
    try {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || !currentUser.userId) {
            return { success: false, message: '用户未登录' };
        }
        const resp = await fetch(USER_PASSWORD_API_BASE(currentUser.userId), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                oldPassword: payload.oldPassword,
                newPassword: payload.newPassword
            })
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
