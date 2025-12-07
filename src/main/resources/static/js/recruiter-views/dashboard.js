const USER_API_BASE = '/api/user';

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = Auth.getCurrentUser();

    // 验证招聘专员权限
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // 只有招聘专员和企业管理员可以访问
    if (!['recruiter', 'employer'].includes(currentUser.role)) {
        alert('您不是招聘专员，无法访问此页面');
        window.location.href = 'login.html';
        return;
    }

    // 更新欢迎语
    const greeting = document.getElementById('user-greeting');
    if (greeting) {
        greeting.textContent = '欢迎，' + (currentUser.realName || currentUser.username || '招聘专员');
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

    // 默认进入面试日程
    switchTab('schedule', currentUser);
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
        'schedule': renderScheduleView,
        'candidates': renderCandidatesView,
        'talent': renderTalentView,
        'evaluation': renderEvaluationView,
        'reports': renderReportsView
    };

    const renderFn = map[tabName];
    if (typeof renderFn === 'function') {
        container.innerHTML = '';
        // 处理同步和异步两种情况
        const result = renderFn(container, currentUser);
        if (result instanceof Promise) {
            result.catch(error => {
                console.error('渲染页面失败:', error);
                container.innerHTML = '<p>加载失败，请稍后重试</p>';
            });
        }
    }

    container.classList.add('active');
}