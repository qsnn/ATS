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

    // 默认加载已发布职位
    loadJobList(currentUser, 1);
}

/**
 * 加载职位列表
 */
async function loadJobList(currentUser, status) {
    const tbody = document.getElementById('job-manage-tbody');
    const statusEl = document.getElementById('jobs-status');
    const paginationContainer = document.getElementById('jobs-pagination');
    const paginationInfo = document.getElementById('jobs-pagination-info');
    const prevBtn = document.getElementById('jobs-prev-page');
    const nextBtn = document.getElementById('jobs-next-page');

    if (!tbody || !statusEl) return;

    try {
        statusEl.textContent = '正在加载...';
        const params = new URLSearchParams({
            pageNum: window.jobsPagination.current,
            pageSize: window.jobsPagination.size,
            companyId: currentUser.companyId,
            status: status
        });

        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(`${JOB_API_BASE}/company/list?${params.toString()}`);
        if (!response.ok) {
            const text = await response.text();
            statusEl.textContent = `网络错误: ${response.status} ${text}`;
            return;
        }

        const json = await response.json();
        if (json.code !== 200) {
            statusEl.textContent = json.message || '加载失败';
            return;
        }

        const page = json.data || {};
        const records = page.records || [];

        if (records.length === 0) {
            statusEl.textContent = '暂无职位记录。';
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">暂无数据</td></tr>';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        // 更新分页信息
        window.jobsPagination.total = page.total || 0;
        window.jobsPagination.pages = page.pages || Math.ceil((page.total || 0) / window.jobsPagination.size) || 0;

        statusEl.textContent = `共 ${window.jobsPagination.total} 条职位记录`;

        if (paginationInfo) {
            paginationInfo.textContent = `第 ${window.jobsPagination.current} 页，共 ${window.jobsPagination.pages} 页`;
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = window.jobsPagination.current <= 1;
            prevBtn.onclick = () => {
                if (window.jobsPagination.current > 1) {
                    window.jobsPagination.current--;
                    loadJobList(currentUser, status);
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = window.jobsPagination.current >= window.jobsPagination.pages;
            nextBtn.onclick = () => {
                if (window.jobsPagination.current < window.jobsPagination.pages) {
                    window.jobsPagination.current++;
                    loadJobList(currentUser, status);
                }
            };
        }

        // 渲染职位列表
        tbody.innerHTML = '';
        records.forEach(job => {
            const tr = document.createElement('tr');
            
            const nameTd = document.createElement('td');
            nameTd.textContent = job.jobName || '';
            nameTd.style.overflow = 'hidden';
            nameTd.style.textOverflow = 'ellipsis';
            nameTd.style.whiteSpace = 'nowrap';
            nameTd.style.textAlign = 'center';
            nameTd.style.verticalAlign = 'middle';

            const salaryTd = document.createElement('td');
            salaryTd.textContent = (job.salaryMin && job.salaryMax) ? `${job.salaryMin}-${job.salaryMax}` : '面议';
            salaryTd.style.overflow = 'hidden';
            salaryTd.style.textOverflow = 'ellipsis';
            salaryTd.style.whiteSpace = 'nowrap';
            salaryTd.style.textAlign = 'center';
            salaryTd.style.verticalAlign = 'middle';

            const cityTd = document.createElement('td');
            cityTd.textContent = job.city || '';
            cityTd.style.overflow = 'hidden';
            cityTd.style.textOverflow = 'ellipsis';
            cityTd.style.whiteSpace = 'nowrap';
            cityTd.style.textAlign = 'center';
            cityTd.style.verticalAlign = 'middle';

            const timeTd = document.createElement('td');
            const updateTime = job.updateTime || '';
            timeTd.textContent = updateTime ? updateTime.replace('T', ' ') : '';
            timeTd.style.overflow = 'hidden';
            timeTd.style.textOverflow = 'ellipsis';
            timeTd.style.whiteSpace = 'nowrap';
            timeTd.style.textAlign = 'center';
            timeTd.style.verticalAlign = 'middle';

            tr.appendChild(nameTd);
            tr.appendChild(salaryTd);
            tr.appendChild(cityTd);
            tr.appendChild(timeTd);

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('加载职位记录异常:', e);
        statusEl.textContent = '请求异常，请稍后重试';
    }
}

/**
 * recruiter的公司信息栏目为卡片形式，只读，允许复制，没有任何按钮
 */
function renderRecruiterCompanyView(container, currentUser) {
    container.innerHTML = `
        <div class="view company-view active">
            <h2>公司信息</h2>
            <div id="company-info-loading">正在加载公司信息...</div>
        </div>
    `;

    loadRecruiterCompanyInfo(container, currentUser);
}

async function loadRecruiterCompanyInfo(container, currentUser) {
    const loadingEl = document.getElementById('company-info-loading');
    if (!loadingEl) return;

    try {
        if (!currentUser.companyId) {
            loadingEl.innerHTML = '<p>您尚未关联任何公司</p>';
            return;
        }

        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(`${COMPANY_API_BASE}/${encodeURIComponent(currentUser.companyId)}`);
        if (!response.ok) {
            const text = await response.text();
            loadingEl.innerHTML = `<p>网络错误: ${response.status} ${text}</p>`;
            return;
        }

        const json = await response.json();
        if (json.code !== 200) {
            loadingEl.innerHTML = `<p>${json.message || '加载失败'}</p>`;
            return;
        }

        const company = json.data || {};
        loadingEl.outerHTML = `
            <div class="card" style="margin-top: 16px;">
                <div class="card-body">
                    <h3 style="margin-top: 0;">${company.companyName || ''}</h3>
                    <p><strong>统一社会信用代码:</strong> ${company.creditCode || ''}</p>
                    <p><strong>所属行业:</strong> ${company.industry || ''}</p>
                    <p><strong>所在城市:</strong> ${company.city || ''}</p>
                    <p><strong>公司规模:</strong> ${company.companySize || ''}</p>
                    <p><strong>公司性质:</strong> ${company.companyNature || ''}</p>
                    <p><strong>公司介绍:</strong></p>
                    <div style="white-space: pre-wrap; background: #f8f9fa; padding: 12px; border-radius: 4px;">${company.description || ''}</div>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('加载公司信息异常:', e);
        loadingEl.innerHTML = '<p>请求异常，请稍后重试</p>';
    }
}

/**
 * recruiter的账号与安全内容与employer一致，角色显示为HR，基本信息栏目不允许修改，只允许修改密码
 */
function renderRecruiterProfileView(container, currentUser) {
    container.innerHTML = `
        <div class="view profile-view active">
            <h2>账号与安全</h2>
            
            <div class="card" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3 style="margin: 0;">基本信息</h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label>用户名</label>
                            <p id="rec-username-display" style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;"></p>
                        </div>
                        <div>
                            <label>角色</label>
                            <p style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">HR</p>
                        </div>
                        <div>
                            <label>邮箱</label>
                            <p id="rec-email-display" style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;"></p>
                        </div>
                        <div>
                            <label>手机</label>
                            <p id="rec-phone-display" style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;"></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 style="margin: 0;">修改密码</h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 500px;">
                        <div>
                            <label for="rec-old-password">当前密码</label>
                            <input type="password" id="rec-old-password" class="form-control" placeholder="请输入当前密码">
                        </div>
                        <div></div>
                        <div>
                            <label for="rec-new-password">新密码</label>
                            <input type="password" id="rec-new-password" class="form-control" placeholder="请输入新密码">
                        </div>
                        <div>
                            <label for="rec-confirm-password">确认新密码</label>
                            <input type="password" id="rec-confirm-password" class="form-control" placeholder="请再次输入新密码">
                        </div>
                    </div>
                    <div style="margin-top: 16px;">
                        <button id="rec-change-password-btn" class="btn btn-primary">保存密码</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    loadRecruiterProfile(currentUser);
    bindRecruiterPasswordChange(currentUser);
}

async function loadRecruiterProfile(user) {
    try {
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(`/api/user/${encodeURIComponent(user.userId)}`);
        if (!response.ok) return;
        
        const json = await response.json();
        const data = (json && typeof json === 'object' && 'code' in json)
            ? (json.code === 200 ? json.data : null)
            : json;
        if (!data) return;

        document.getElementById('rec-username-display').textContent = data.username || '';
        document.getElementById('rec-email-display').textContent = data.email || '';
        document.getElementById('rec-phone-display').textContent = data.phone || '';
    } catch (e) {
        console.error('加载账号信息失败:', e);
    }
}

function bindRecruiterPasswordChange(user) {
    const btn = document.getElementById('rec-change-password-btn');
    if (!btn) return;

    btn.onclick = async () => {
        const oldPwd = document.getElementById('rec-old-password').value.trim();
        const newPwd = document.getElementById('rec-new-password').value.trim();
        const confirmPwd = document.getElementById('rec-confirm-password').value.trim();

        if (!oldPwd || !newPwd || !confirmPwd) {
            alert('请完整填写所有密码字段');
            return;
        }
        if (newPwd !== confirmPwd) {
            alert('两次输入的新密码不一致');
            return;
        }

        try {
            // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
            const response = await Auth.authenticatedFetch(`/api/user/${encodeURIComponent(user.userId)}/password`, {
                method: 'PUT',
                body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
            });
            
            if (!response.ok) {
                const text = await response.text();
                alert(`网络错误: ${response.status} ${text}`);
                return;
            }
            
            const json = await response.json();
            if (!json || json.code !== 200) {
                alert((json && json.message) || '修改密码失败');
                return;
            }
            
            alert('密码修改成功，请使用新密码重新登录。');
        } catch (e) {
            console.error('修改密码失败:', e);
            alert('修改密码失败，请稍后重试');
        }
    };
}