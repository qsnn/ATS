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
    
    // 加载未读通知数量
    loadUnreadNoticeCount(currentUser);
});

function handleLogout() {
    Auth.logout();
    window.location.href = 'index.html';
}

/**
 * 视图切换
 * @param {string} viewId
 * @param {object} currentUser
 */
function switchView(viewId, currentUser = Auth.getCurrentUser()) {
    // 检查URL参数，如果是从智能推荐跳转过来的，需要特殊处理
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    // 如果URL中有tab参数且viewId是job-search，则保持在职位搜索页面
    if (tabParam === 'job-search' && viewId !== 'job-search') {
        viewId = 'job-search';
    }
    
    // 激活导航
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    const targetLink = document.querySelector(`.sidebar-nav a[data-view="${viewId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // 隐藏所有视图
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // 显示目标视图容器
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = '<div style="text-align:center;padding:40px;">加载中...</div>';
    }

    // 根据视图ID渲染对应内容
    switch (viewId) {
        case 'job-search':
            renderJobSearchView(mainContent, currentUser);
            break;
        case 'profile':
            renderProfileView(mainContent, currentUser);
            break;
        case 'resumes':
            renderResumesView(mainContent, currentUser);
            break;
        case 'applications':
            renderApplicationsView(mainContent, currentUser);
            break;
        case 'favorites':
            renderFavoritesView(mainContent, currentUser);
            break;
        case 'interviews':
            renderInterviewsView(mainContent, currentUser);
            break;
        case 'notices':
            // 动态加载通知模块
            loadModule('/js/common/notices-view.js', () => {
                if (typeof window.renderNoticesView === 'function' && mainContent) {
                    window.renderNoticesView(mainContent, currentUser);
                }
            });
            break;
        default:
            if (mainContent) {
                mainContent.innerHTML = '<p>功能建设中...</p>';
            }
    }
    
    // 清理URL中的tab参数，避免影响后续操作
    if (tabParam === 'job-search') {
        const newUrl = window.location.pathname + window.location.hash;
        history.replaceState({}, document.title, newUrl);
    }
}

/**
 * 加载未读通知数量
 * @param {object} currentUser - 当前用户
 */
async function loadUnreadNoticeCount(currentUser) {
    try {
        // 动态加载通知模块
        await loadModule('/js/common/notices-view.js');
        
        const url = `/api/notices/user/${currentUser.userId}/unread-count`;
        const resp = await Auth.authenticatedFetch(url);
        if (!resp.ok) {
            return;
        }
        
        const json = await resp.json();
        const count = json.data || 0;
        
        // 更新侧边栏红点
        const noticeLink = document.querySelector('[data-view="notices"]');
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
 * 动态加载模块
 * @param {string} src - 模块路径
 * @param {function} callback - 加载完成回调
 * @returns {Promise} 加载完成的Promise
 */
function loadModule(src, callback) {
    return new Promise((resolve, reject) => {
        // 检查是否已加载
        if (document.querySelector(`script[src="${src}"]`)) {
            if (callback) callback();
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            if (callback) callback();
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * 通用更新个人信息 API 封装
 * 供 profile 视图复用
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
 * 简历接口封装，供 resumes 视图使用
 */
async function fetchUserResumesApi(userId) {
    try {
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(`${RESUME_API_BASE}/user/${encodeURIComponent(userId)}`, {
            method: 'GET'
        });

        if (!response.ok) {
            const text = await response.text();
            return { success: false, message: `网络错误: ${response.status} ${text}` };
        }

        const json = await response.json();
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
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(`${USER_PASSWORD_API_BASE(currentUser.userId)}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
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