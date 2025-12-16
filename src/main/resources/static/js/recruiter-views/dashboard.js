const USER_API_BASE = '/api/user';
const JOB_API_BASE = '/api/job/info';
const TALENT_API_BASE = '/api/talent';
const COMPANY_API_BASE = '/api/company';
const USER_PASSWORD_API_BASE = userId => (`/api/user/${encodeURIComponent(userId)}/password`);

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
        greeting.textContent = '欢迎，' + (currentUser.username || '招聘专员');
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

    // 默认进入面试管理
    switchTab('interviews', currentUser);
    
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

    // 根据tabName调用对应的渲染函数
    const map = {
        // recruiter职位管理界面只显示已发布和已下架两栏
        'manage': renderRecruiterJobManageView,
        // recruiter的申请人管理和面试管理、人才库三个栏目所有UI、内容、功能保持和employer完全一致
        'applicants': renderApplicantsView,
        'interviews': renderInterviewsView,
        'talent': renderTalentView,
        // recruiter没有HR管理栏目
        // recruiter的公司信息栏目为卡片形式，只读，允许复制，没有任何按钮
        'company': renderRecruiterCompanyView,
        // recruiter的账号与安全内容与employer一致，角色显示为HR，基本信息栏目不允许修改，只允许修改密码
        'profile': renderRecruiterProfileView
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
    } else if (tabName === 'notices') {
        // 动态加载通知模块
        loadModule('../common/notices-view.js', () => {
            const renderFn = window.renderNoticesView;
            if (typeof renderFn === 'function') {
                container.innerHTML = '';
                renderFn(container, currentUser);
            }
            container.classList.add('active');
        });
        return;
    }

    container.classList.add('active');
}

// 导入employer的视图函数
function renderApplicantsView(container, currentUser) {
    // 动态导入employer的applicant-view.js
    const script = document.createElement('script');
    script.src = '../employer-views/applicants-view.js';
    script.onload = () => {
        // 调用实际的渲染函数
        window.renderApplicantsView(container, currentUser);
    };
    document.head.appendChild(script);
}

function renderInterviewsView(container, currentUser) {
    // 动态导入employer的interviews-view.js
    const script = document.createElement('script');
    script.src = '../employer-views/interviews-view.js';
    script.onload = () => {
        // 调用实际的渲染函数
        window.renderInterviewsView(container, currentUser);
    };
    document.head.appendChild(script);
}

function renderTalentView(container, currentUser) {
    // 动态导入employer的talent-view.js
    const script = document.createElement('script');
    script.src = '../employer-views/talent-view.js';
    script.onload = () => {
        // 调用实际的渲染函数
        window.renderTalentView(container, currentUser);
    };
    document.head.appendChild(script);
}

/**
 * 加载未读通知数量
 * @param {object} currentUser - 当前用户
 */
async function loadUnreadNoticeCount(currentUser) {
    try {
        // 动态加载通知模块
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '../common/notices-view.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
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
 * recruiter职位管理界面只显示已发布和已下架两栏
 */
function renderRecruiterJobManageView(container, currentUser) {
    container.innerHTML = `
        <div class="view job-manage-view active">
            <h2>职位管理</h2>
            
            <!-- 添加状态筛选标签 -->
            <div class="status-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                <button class="tab-btn active" data-status="1" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">已发布</button>
                <button class="tab-btn" data-status="2" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">已下架</button>
            </div>
            
            <div id="jobs-status" style="margin-bottom:8px;color:#666;">正在加载职位信息...</div>
            <table class="table" style="width: 100%; table-layout: fixed;">
                <thead>
                    <tr>
                        <th style="width: 25%; text-align: center;">职位名称</th>
                        <th style="width: 25%; text-align: center;">薪资范围</th>
                        <th style="width: 25%; text-align: center;">工作地点</th>
                        <th style="width: 25%; text-align: center;">更新时间</th>
                        <!-- 没有操作这一子栏目 -->
                    </tr>
                </thead>
                <tbody id="job-manage-tbody"></tbody>
            </table>
            <div class="pagination" id="jobs-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="jobs-prev-page">上一页</button>
                <span class="pagination-info" id="jobs-pagination-info"></span>
                <button class="btn pagination-btn" id="jobs-next-page">下一页</button>
            </div>
        </div>
    `;

    // 添加标签页点击事件监听
    const tabButtons = container.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新激活状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新按钮样式
            tabButtons.forEach(btn => {
                btn.style.backgroundColor = '#f3f4f6';
                btn.style.color = '#000';
            });
            button.style.backgroundColor = '#4f46e5';
            button.style.color = '#fff';
            
            // 加载对应状态的数据
            const status = button.getAttribute('data-status');
            // 重置分页到第一页
            window.jobsPagination = {
                current: 1,
                size: 20,
                total: 0,
                pages: 0
            };
            loadJobList(currentUser, status);
        });
    });

    // 初始化分页状态
    window.jobsPagination = {
        current: 1,
        size: 20,
        total: 0,
        pages: 0
    };

    // 绑定分页事件
    const prevBtn = container.querySelector('#jobs-prev-page');
    const nextBtn = container.querySelector('#jobs-next-page');
    
    prevBtn.addEventListener('click', () => {
        if (window.jobsPagination.current > 1) {
            window.jobsPagination.current--;
            const activeTab = container.querySelector('.tab-btn.active');
            const status = activeTab.getAttribute('data-status');
            loadJobList(currentUser, status);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (window.jobsPagination.current < window.jobsPagination.pages) {
            window.jobsPagination.current++;
            const activeTab = container.querySelector('.tab-btn.active');
            const status = activeTab.getAttribute('data-status');
            loadJobList(currentUser, status);
        }
    });

    // 默认加载已发布职位
    loadJobList(currentUser, 1);
}

/**
 * recruiter的账号与安全内容与employer一致，角色显示为HR，基本信息栏目不允许修改，只允许修改密码
 */
function renderRecruiterProfileView(container, currentUser) {
    // 动态导入employer的profile-view.js
    const script = document.createElement('script');
    script.src = '../employer-views/profile-view.js';
    script.onload = () => {
        // 调用实际的渲染函数，但传入recruiter角色
        const modifiedUser = Object.assign({}, currentUser, { role: 'recruiter' });
        window.renderEmployerProfileView(container, modifiedUser);
    };
    document.head.appendChild(script);
}

/**
 * recruiter的公司信息栏目为卡片形式，只读，允许复制，没有任何按钮
 */
function renderRecruiterCompanyView(container, currentUser) {
    // 动态导入employer的company-view.js
    const script = document.createElement('script');
    script.src = '../employer-views/company-view.js';
    script.onload = () => {
        // 调用实际的渲染函数
        window.renderRecruiterCompanyView(container, currentUser);
    };
    document.head.appendChild(script);
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