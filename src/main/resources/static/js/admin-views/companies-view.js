/**
 * 渲染公司管理视图
 * @param {HTMLElement} container - 容器元素
 * @param {Object} currentUser - 当前用户信息
 */
function renderCompaniesView(container, currentUser) {
    container.innerHTML = `
        <div class="view companies-view active">
            <h2>公司管理</h2>
            
            <!-- 搜索框 -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div class="search-box" style="max-width: 300px;">
                    <input type="text" id="company-search" placeholder="搜索公司名称..." oninput="searchCompanies()">
                </div>
                <button class="btn btn-primary" onclick="showCreateCompanyModal()">创建公司</button>
            </div>

            <div id="companies-status" style="margin-bottom: 8px; color: #666;">正在加载公司数据...</div>
            
            <table class="data-table">
                <thead>
                <tr>
                    <th>公司ID</th>
                    <th>公司名称</th>
                    <th>联系人</th>
                    <th>联系电话</th>
                    <th>联系邮箱</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="company-table-body">
                <!-- 动态加载 -->
                </tbody>
            </table>
            
            <!-- 分页控件 -->
            <div id="companies-pagination" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <div id="companies-pagination-info"></div>
                <div style="display: flex; gap: 10px;">
                    <button id="companies-prev-page" class="btn btn-sm" disabled>上一页</button>
                    <button id="companies-next-page" class="btn btn-sm">下一页</button>
                </div>
            </div>
        </div>
        
        <!-- 创建公司模态框 -->
        <div id="create-company-modal" class="modal" style="display:none;">
            <div class="modal-content" style="width: 500px;">
                <span class="close" onclick="closeCreateCompanyModal()">&times;</span>
                <h2>创建公司</h2>
                <form id="create-company-form">
                    <div class="form-group">
                        <label>公司名称 *</label>
                        <input type="text" id="create-company-name" class="form-control" placeholder="请输入公司名称" required>
                    </div>
                    <div class="form-group">
                        <label>公司描述</label>
                        <textarea id="create-company-desc" class="form-control" placeholder="请输入公司描述"></textarea>
                    </div>
                    <div class="form-group">
                        <label>公司地址</label>
                        <input type="text" id="create-company-address" class="form-control" placeholder="请输入公司地址">
                    </div>
                    <div class="form-group">
                        <label>联系人</label>
                        <input type="text" id="create-contact-person" class="form-control" placeholder="请输入联系人">
                    </div>
                    <div class="form-group">
                        <label>联系电话</label>
                        <input type="text" id="create-contact-phone" class="form-control" placeholder="请输入联系电话">
                    </div>
                    <div class="form-group">
                        <label>联系邮箱</label>
                        <input type="email" id="create-contact-email" class="form-control" placeholder="请输入联系邮箱">
                    </div>
                    <button type="submit" class="btn btn-primary">创建</button>
                </form>
            </div>
        </div>
    `;

    // 初始化分页状态
    window.companiesPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    // 绑定创建公司表单事件
    document.getElementById('create-company-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createCompany(currentUser);
    });

    // 绑定分页按钮事件
    document.getElementById('companies-prev-page').addEventListener('click', () => {
        if (window.companiesPagination.current > 1) {
            window.companiesPagination.current--;
            const currentUser = Auth.getCurrentUser();
            loadCompanies(currentUser);
        }
    });

    document.getElementById('companies-next-page').addEventListener('click', () => {
        if (window.companiesPagination.current < window.companiesPagination.pages) {
            window.companiesPagination.current++;
            const currentUser = Auth.getCurrentUser();
            loadCompanies(currentUser);
        }
    });

    // 加载公司数据
    loadCompanies(currentUser);
}

/**
 * 加载公司数据
 * @param {Object} adminUser - 管理员用户信息
 */
async function loadCompanies(adminUser) {
    const tbody = document.getElementById('company-table-body');
    const statusEl = document.getElementById('companies-status');
    const paginationContainer = document.getElementById('companies-pagination');
    const paginationInfo = document.getElementById('companies-pagination-info');
    const prevBtn = document.getElementById('companies-prev-page');
    const nextBtn = document.getElementById('companies-next-page');
    
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8">正在加载公司数据...</td></tr>';
    if (statusEl) statusEl.textContent = '正在加载公司数据...';

    try {
        // 获取当前筛选条件
        const keyword = document.getElementById('company-search')?.value || '';
        
        // 构建查询参数
        const params = new URLSearchParams();
        params.append('current', window.companiesPagination.current);
        params.append('size', window.companiesPagination.size);
        
        if (keyword) {
            params.append('companyName', keyword);
        }
        
        const response = await Auth.authenticatedFetch(`/api/company/page?${params.toString()}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // 修复：正确处理后端返回的结果
        if (result.code !== 200) {
            throw new Error(result.message || '获取公司列表失败');
        }

        const pageData = result.data;
        const companies = pageData.records || [];
        
        // 更新分页信息
        window.companiesPagination.total = pageData.total || 0;
        window.companiesPagination.pages = pageData.pages || Math.ceil((pageData.total || 0) / window.companiesPagination.size) || 0;
        
        if (!companies || companies.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">暂无公司数据</td></tr>';
            if (statusEl) statusEl.textContent = '暂无公司数据';
            if (paginationInfo) paginationInfo.textContent = '第 0 页，共 0 页';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            return;
        }

        tbody.innerHTML = companies.map(company => {
                
            return `
                <tr>
                    <td>${company.companyId}</td>
                    <td>${company.companyName}</td>
                    <td>${company.contactPerson || ''}</td>
                    <td>${company.contactPhone || ''}</td>
                    <td>${company.contactEmail || ''}</td>
                    <td>${company.createTime ? company.createTime.substring(0, 19).replace('T', ' ') : ''}</td>
                    <td>
                        <button class="btn btn-sm" onclick="viewCompany(${company.companyId})">查看</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCompany(${company.companyId})">删除</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        // 更新状态和分页信息
        if (statusEl) statusEl.textContent = `共 ${window.companiesPagination.total} 条公司记录`;
        if (paginationInfo) paginationInfo.textContent = `第 ${window.companiesPagination.current} 页，共 ${window.companiesPagination.pages} 页`;
        if (prevBtn) prevBtn.disabled = window.companiesPagination.current <= 1;
        if (nextBtn) nextBtn.disabled = window.companiesPagination.current >= window.companiesPagination.pages;
    } catch (e) {
        console.error('加载公司失败:', e);
        tbody.innerHTML = `<tr><td colspan="8">加载失败：${e.message}</td></tr>`;
        if (statusEl) statusEl.textContent = `加载失败：${e.message}`;
    }
}

/**
 * 搜索公司
 */
function searchCompanies() {
    // 重置到第一页
    window.companiesPagination.current = 1;
    const currentUser = Auth.getCurrentUser();
    loadCompanies(currentUser);
}

/**
 * 显示创建公司模态框
 */
function showCreateCompanyModal() {
    document.getElementById('create-company-modal').style.display = 'block';
}

/**
 * 关闭创建公司模态框
 */
function closeCreateCompanyModal() {
    document.getElementById('create-company-modal').style.display = 'none';
}

/**
 * 创建公司
 * @param {Object} adminUser - 管理员用户信息
 */
async function createCompany(adminUser) {
    const companyName = document.getElementById('create-company-name').value.trim();
    const companyDesc = document.getElementById('create-company-desc').value.trim();
    const companyAddress = document.getElementById('create-company-address').value.trim();
    const contactPerson = document.getElementById('create-contact-person').value.trim();
    const contactPhone = document.getElementById('create-contact-phone').value.trim();
    const contactEmail = document.getElementById('create-contact-email').value.trim();

    if (!companyName) {
        alert('请填写公司名称');
        return;
    }

    const companyData = {
        companyName: companyName
    };

    if (companyDesc) companyData.companyDesc = companyDesc;
    if (companyAddress) companyData.companyAddress = companyAddress;
    if (contactPerson) companyData.contactPerson = contactPerson;
    if (contactPhone) companyData.contactPhone = contactPhone;
    if (contactEmail) companyData.contactEmail = contactEmail;

    try {
        const response = await Auth.authenticatedFetch('/api/company', {
            method: 'POST',
            body: JSON.stringify(companyData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.code !== 200) {
            throw new Error(result.message || '创建失败');
        }

        alert('公司创建成功');
        closeCreateCompanyModal();
        // 重置表单
        document.getElementById('create-company-form').reset();
        // 重新加载公司列表
        loadCompanies(adminUser);
    } catch (e) {
        console.error('创建公司失败:', e);
        alert(`创建失败：${e.message}`);
    }
}

/**
 * 查看公司详情
 * @param {number} companyId - 公司ID
 */
async function viewCompany(companyId) {
    try {
        const response = await Auth.authenticatedFetch(`/api/company/${companyId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.code !== 200) {
            throw new Error(result.message || '获取公司详情失败');
        }

        const company = result.data;
        if (!company) {
            throw new Error('未找到公司信息');
        }

        // 显示公司详情弹窗
        showCompanyDetailModal(company);
    } catch (e) {
        console.error('获取公司详情失败:', e);
        alert(`获取公司详情失败：${e.message}`);
    }
}

/**
 * 显示公司详情模态框
 * @param {Object} company - 公司信息
 */
function showCompanyDetailModal(company) {
    // 创建模态框HTML
    const modalHtml = `
        <div id="company-detail-modal" class="modal" style="display:block;">
            <div class="modal-content" style="width: 600px;">
                <span class="close" onclick="closeCompanyDetailModal()">&times;</span>
                <h2>公司详情</h2>
                <div class="form-group">
                    <label>公司ID:</label>
                    <div class="readonly-field">${company.companyId}</div>
                </div>
                <div class="form-group">
                    <label>公司名称:</label>
                    <div class="readonly-field">${company.companyName || ''}</div>
                </div>
                <div class="form-group">
                    <label>公司描述:</label>
                    <div class="readonly-field">${company.companyDesc || ''}</div>
                </div>
                <div class="form-group">
                    <label>公司地址:</label>
                    <div class="readonly-field">${company.companyAddress || ''}</div>
                </div>
                <div class="form-group">
                    <label>联系人:</label>
                    <div class="readonly-field">${company.contactPerson || ''}</div>
                </div>
                <div class="form-group">
                    <label>联系电话:</label>
                    <div class="readonly-field">${company.contactPhone || ''}</div>
                </div>
                <div class="form-group">
                    <label>联系邮箱:</label>
                    <div class="readonly-field">${company.contactEmail || ''}</div>
                </div>
                <div class="form-group">
                    <label>创建时间:</label>
                    <div class="readonly-field">${company.createTime ? company.createTime.substring(0, 19).replace('T', ' ') : ''}</div>
                </div>
                <div class="form-group">
                    <label>更新时间:</label>
                    <div class="readonly-field">${company.updateTime ? company.updateTime.substring(0, 19).replace('T', ' ') : ''}</div>
                </div>
            </div>
        </div>
    `;

    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * 关闭公司详情模态框
 */
function closeCompanyDetailModal() {
    const modal = document.getElementById('company-detail-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * 删除公司
 * @param {number} companyId - 公司ID
 */
async function deleteCompany(companyId) {
    if (!confirm('确定删除公司 ' + companyId + '？此操作不可恢复！')) {
        return;
    }

    try {
        const response = await Auth.authenticatedFetch(`/api/company/${companyId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || '删除失败');
        }

        alert('公司删除成功');
        // 重新加载公司列表
        const currentUser = Auth.getCurrentUser();
        loadCompanies(currentUser);
    } catch (e) {
        console.error('删除失败:', e);
        alert(`删除失败：${e.message}`);
    }
}