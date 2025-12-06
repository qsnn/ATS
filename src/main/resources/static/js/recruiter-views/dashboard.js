const USER_API_BASE = 'http://124.71.101.139:10085/api/user';

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

    // 标签页事件绑定
    document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName, currentUser);
        });
    });

    // 默认显示第一个标签页
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
        'schedule': renderScheduleView,
        'candidates': renderCandidatesView,
        'talent': renderTalentView,
        'evaluation': renderEvaluationView,
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