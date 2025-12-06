const USER_API_BASE = 'http://124.71.101.139:10085/api/user';

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'employer') {
        window.location.href = 'login.html';
        return;
    }

    const greeting = document.getElementById('user-greeting');
    if (greeting) {
        greeting.textContent = '欢迎，' + (currentUser.realName || currentUser.username || '企业管理员');
    }

    // 标签页事件绑定
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const tabName = e.target.getAttribute('onclick').match(/'([^']+)'/)?.[1];
            if (tabName) {
                switchTab(tabName, currentUser);
            }
        });
    });

    // 默认显示第一个标签页
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
    // 激活标签按钮
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${tabName}'`));
    });

    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const container = document.getElementById(`${tabName}-tab`);
    if (!container) return;

    const map = {
        'manage': renderJobManageView,
        'post': renderJobPostView,
        'applicants': renderApplicantsView,
        'talent': renderTalentView,
        'company': renderCompanyView
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
 * 通用更新个人信息 API 封装（复用求职者的）
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