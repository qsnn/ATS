const USER_API_BASE = '/api/user';
const JOB_API_BASE = '/api/job/info';
const TALENT_API_BASE = '/api/talent';
const COMPANY_API_BASE = '/api/company';
const USER_PASSWORD_API_BASE = userId => (`/api/user/${encodeURIComponent(userId)}/password`);

// 动态加载各个模块的渲染函数
function loadModule(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}

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
    
    // 加载未读通知数量
    loadUnreadNoticeCount(currentUser);
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

    // 根据标签页动态加载相应模块
    const moduleMap = {
        manage: { src: '/js/employer-views/job-manage-view.js', renderFn: 'renderJobManageView' },
        applicants: { src: '/js/employer-views/applicants-view.js', renderFn: 'renderApplicantsView' },
        interviews: { src: '/js/employer-views/interviews-view.js', renderFn: 'renderInterviewsView' },
        talent: { src: '/js/employer-views/talent-view.js', renderFn: 'renderTalentView' },
        hr: { src: '/js/employer-views/hr-view.js', renderFn: 'renderHrManageView' },
        company: { src: '/js/employer-views/company-view.js', renderFn: 'renderCompanyView' },
        profile: { src: '/js/employer-views/profile-view.js', renderFn: 'renderEmployerProfileView' },
        notices: { src: '/js/common/notices-view.js', renderFn: 'renderNoticesView' }
    };

    const moduleInfo = moduleMap[tabName];
    if (moduleInfo) {
        loadModule(moduleInfo.src, () => {
            const renderFn = window[moduleInfo.renderFn];
            if (typeof renderFn === 'function') {
                container.innerHTML = '';
                renderFn(container, currentUser);
            }
            container.classList.add('active');
        });
    } else {
        container.classList.add('active');
    }
}

/**
 * 加载未读通知数量
 * @param {object} currentUser - 当前用户
 */
async function loadUnreadNoticeCount(currentUser) {
    try {
        // 动态加载通知模块
        await new Promise((resolve, reject) => {
            loadModule('/js/common/notices-view.js', resolve);
        });
        
        const url = `/api/notices/user/${currentUser.userId}/unread-count`;
        const resp = await Auth.authenticatedFetch(url);
        if (!resp.ok) {
            return;
        }
        
        const json = await resp.json();
        const count = json.data || 0;
        
        // 更新侧边栏红点
        const noticeLink = document.querySelector('[data-tab="notices"]');
        if (noticeLink) {
            let badge = noticeLink.querySelector('.badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge';
                badge.style.cssText = 'background-color: red; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px; margin-left: 5px; display: inline-block;';
                noticeLink.appendChild(badge);
            }
            
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    } catch (e) {
        console.error('加载未读通知数量异常:', e);
    }
}

/**
 * 通用更新个人信息 API 封装（复用求职者的）
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
 * 修改密码 API 封装，供 employer profile 视图使用
 */
async function updateUserPasswordApi(payload) {
    try {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || !currentUser.userId) {
            return { success: false, message: '用户未登录' };
        }
        
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(USER_PASSWORD_API_BASE(currentUser.userId), {
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
            return { success: false, message: json.message || '修改密码失败' };
        }

        return { success: true, message: json.message || '修改密码成功' };
    } catch (e) {
        console.error('修改密码异常:', e);
        return { success: false, message: '请求异常，请稍后重试' };
    }
}