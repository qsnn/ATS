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
        // 注意：不在这里直接引用renderNoticesView，因为它是动态加载的
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
        loadModule('/js/common/notices-view.js', () => {
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
            script.src = '/js/common/notices-view.js';
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
                <button class="tab-btn active" data-status="1" style="padding: 8px 16px; border: none; background-color: #4f46e5; color: #fff; cursor: pointer; border-radius: 4px;">已发布</button>
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
            current: window.jobsPagination.current,
            size: window.jobsPagination.size,
            publishStatus: status,
            companyId: currentUser.companyId
        });

        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const response = await Auth.authenticatedFetch(`${JOB_API_BASE}/list?${params.toString()}`);
        if (!response.ok) {
            const text = await response.text();
            statusEl.textContent = `网络错误: ${response.status} ${text}`;
            return;
        }

        const json = await response.json();
        console.log('API Response:', json); // 调试信息
        
        // 处理统一的API响应格式 {code: 200, message: "", data: {...}}
        let page;
        if (json && typeof json === 'object' && 'data' in json) {
            page = json.data;
        } else {
            page = json;
        }
        
        // 确保正确提取records数组
        const records = (page && Array.isArray(page.records)) ? page.records : 
                     (page && Array.isArray(page)) ? page : [];

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
            const min = job.salaryMin || 0;
            const max = job.salaryMax || 0;
            let salary = '-';
            if (min > 0 && max > 0) {
                salary = `${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`;
            }
            salaryTd.textContent = salary;
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
            timeTd.textContent = updateTime ? new Date(updateTime).toLocaleString() : '';
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
    } catch (error) {
        console.error('加载职位列表失败:', error);
        statusEl.textContent = '加载失败，请稍后重试';
    }
}

/**
 * recruiter的账号与安全内容与employer一致，角色显示为HR，基本信息栏目不允许修改，只允许修改密码
 */
function renderRecruiterProfileView(container, currentUser) {
    // 直接实现招聘专员的个人信息视图
    container.innerHTML = `
        <div class="view profile-view active">
            <h2>账号与安全</h2>
            
            <div class="card mb-4">
                <h3>基本信息</h3>
                <div class="form-group">
                    <label>用户名</label>
                    <input type="text" class="form-control readonly-field" id="username" readonly>
                </div>
                <div class="form-group">
                    <label>手机号</label>
                    <input type="text" class="form-control readonly-field" id="mobile" readonly>
                </div>
                <div class="form-group">
                    <label>邮箱</label>
                    <input type="email" class="form-control readonly-field" id="email" readonly>
                </div>
                <div class="form-group">
                    <label>角色</label>
                    <input type="text" class="form-control readonly-field" id="role" value="招聘专员" readonly>
                </div>
            </div>

            <div class="card">
                <h3>修改密码</h3>
                <form id="password-form">
                    <div class="form-group">
                        <label for="current-password">当前密码</label>
                        <input type="password" class="form-control" id="current-password" required>
                    </div>
                    <div class="form-group">
                        <label for="new-password">新密码</label>
                        <input type="password" class="form-control" id="new-password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">确认新密码</label>
                        <input type="password" class="form-control" id="confirm-password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">修改密码</button>
                </form>
            </div>
        </div>
    `;

    // 填充用户信息
    document.getElementById('username').value = currentUser.username || '';
    document.getElementById('mobile').value = currentUser.phone || '';
    document.getElementById('email').value = currentUser.email || '';

    // 绑定表单提交事件
    const passwordForm = document.getElementById('password-form');
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            alert('新密码与确认密码不一致');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('密码长度至少6位');
            return;
        }
        
        try {
            const resp = await Auth.authenticatedFetch(USER_PASSWORD_API_BASE(currentUser.userId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPassword: currentPassword,
                    newPassword: newPassword
                })
            });
            
            if (!resp.ok) {
                const errorText = await resp.text();
                alert(`修改失败: ${resp.status} ${errorText}`);
                return;
            }
            
            const json = await resp.json();
            if (json.code === 200) {
                alert('密码修改成功');
                passwordForm.reset();
            } else {
                alert(`修改失败: ${json.message}`);
            }
        } catch (error) {
            console.error('修改密码异常:', error);
            alert('修改密码异常，请稍后重试');
        }
    });
}

/**
 * recruiter的公司信息栏目为卡片形式，只读，允许复制，没有任何按钮
 */
function renderRecruiterCompanyView(container, currentUser) {
    // 直接实现公司信息展示，而不是动态加载
    // 检查用户是否绑定了公司
    if (!currentUser.companyId) {
        container.innerHTML = `
            <h2>公司信息</h2>
            <div class="card">
                <p>您尚未绑定到任何公司，请联系管理员。</p>
            </div>
        `;
        return;
    }
    
    // 用户已绑定公司，显示只读信息
    container.innerHTML = `
        <h2>公司信息</h2>
        <div class="card">
            <div class="form-group">
                <label>公司ID</label>
                <div id="company-id" class="readonly-field form-control" style="cursor: copy;"></div>
            </div>
            <div class="form-group">
                <label>公司名称</label>
                <div id="company-name" class="readonly-field form-control" style="cursor: copy;"></div>
            </div>
            <div class="form-group">
                <label>公司简介</label>
                <div id="company-description" class="readonly-field form-control" style="cursor: copy; min-height: 100px;"></div>
            </div>
            <div class="form-group">
                <label>公司地址</label>
                <div id="company-address" class="readonly-field form-control" style="cursor: copy;"></div>
            </div>
            <div class="form-group">
                <label>联系人</label>
                <div id="company-contact" class="readonly-field form-control" style="cursor: copy;"></div>
            </div>
            <div class="form-group">
                <label>联系电话</label>
                <div id="company-phone" class="readonly-field form-control" style="cursor: copy;"></div>
            </div>
            <div class="form-group">
                <label>联系邮箱</label>
                <div id="company-email" class="readonly-field form-control" style="cursor: copy;"></div>
            </div>
        </div>
    `;
    
    // 绑定复制功能
    container.querySelectorAll('.readonly-field').forEach(field => {
        field.addEventListener('click', () => {
            const text = field.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // 显示复制成功的提示
                const originalText = field.textContent;
                field.textContent = '已复制!';
                setTimeout(() => {
                    field.textContent = originalText;
                }, 1000);
            });
        });
    });
    
    loadCompanyInfo(currentUser);
}

// 加载公司信息
async function loadCompanyInfo(user) {
    const companyId = user.companyId;
    if (!companyId) {
        return;
    }
    try {
        const resp = await Auth.authenticatedFetch(`${COMPANY_API_BASE}/${companyId}`);
        if (!resp.ok) return;
        const json = await resp.json();
        if (!json || json.code !== 200 || !json.data) return;
        const c = json.data;
        const idEl = document.getElementById('company-id');
        const nameEl = document.getElementById('company-name');
        const descEl = document.getElementById('company-description');
        const addrEl = document.getElementById('company-address');
        const contactEl = document.getElementById('company-contact');
        const phoneEl = document.getElementById('company-phone');
        const emailEl = document.getElementById('company-email');
        
        if (idEl) idEl.textContent = companyId;
        if (nameEl) nameEl.textContent = c.companyName || '';
        if (descEl) descEl.textContent = c.companyDesc || '';
        if (addrEl) addrEl.textContent = c.companyAddress || '';
        if (contactEl) contactEl.textContent = c.contactPerson || '';
        if (phoneEl) phoneEl.textContent = c.contactPhone || '';
        if (emailEl) emailEl.textContent = c.contactEmail || '';
    } catch (e) {
        console.error('加载公司信息失败:', e);
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