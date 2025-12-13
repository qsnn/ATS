function renderHrManageView(container, currentUser) {
    container.innerHTML = `
        <div class="view hr-manage-view active">
            <h2>HR账户管理</h2>
            <div style="display: flex; gap: 10px; margin: 15px 0;">
                <button class="btn btn-primary" id="create-hr-btn">创建HR账户</button>
                <button class="btn btn-secondary" id="batch-create-hr-btn">批量创建</button>
                <button class="btn btn-success" id="export-hr-btn">导出CSV</button>
            </div>
            
            <!-- 批量创建弹窗 -->
            <div id="batch-create-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:9999;">
                <div style="background:#fff; width:500px; max-height:90vh; overflow:auto; margin:40px auto; padding:20px; border-radius:6px; position:relative;">
                    <h3>批量创建HR账户</h3>
                    <button id="batch-create-modal-close" style="position:absolute; right:16px; top:10px; border:none; background:none; font-size:18px; cursor:pointer;">×</button>
                    <form id="batch-create-form">
                        <div class="form-group">
                            <label>创建数量 (1-20):</label>
                            <input type="number" id="batch-count" class="form-control" min="1" max="20" value="5" required>
                        </div>
                        <div style="margin-top:12px; text-align:right;">
                            <button type="button" class="btn" id="batch-create-cancel-btn">取消</button>
                            <button type="submit" class="btn btn-primary" style="margin-left:8px;">创建</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div id="hr-status" style="margin-bottom:8px;color:#666;">正在加载HR账户信息...</div>
            <table class="table" style="width: 100%; table-layout: fixed;">
                <thead>
                    <tr>
                        <th style="width: 25%; text-align: center;">用户ID</th>
                        <th style="width: 35%; text-align: center;">用户名</th>
                        <th style="width: 20%; text-align: center;">创建时间</th>
                        <th style="width: 20%; text-align: center;">操作</th>
                    </tr>
                </thead>
                <tbody id="hr-manage-tbody"></tbody>
            </table>
            <div class="pagination" id="hr-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="hr-prev-page">上一页</button>
                <span class="pagination-info" id="hr-pagination-info"></span>
                <button class="btn pagination-btn" id="hr-next-page">下一页</button>
            </div>
        </div>
    `;

    // 初始化分页状态
    window.hrPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    // 绑定创建HR账户按钮事件
    document.getElementById('create-hr-btn').addEventListener('click', () => {
        createHrAccount(currentUser);
    });

    // 绑定批量创建HR账户按钮事件
    document.getElementById('batch-create-hr-btn').addEventListener('click', () => {
        document.getElementById('batch-create-modal').style.display = 'block';
    });

    // 绑定导出CSV按钮事件
    document.getElementById('export-hr-btn').addEventListener('click', () => {
        exportHrToCsv(currentUser);
    });

    // 绑定批量创建表单提交事件
    document.getElementById('batch-create-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await batchCreateHrAccounts(currentUser);
    });

    // 绑定批量创建模态框关闭事件
    const batchModal = document.getElementById('batch-create-modal');
    const batchCloseBtn = document.getElementById('batch-create-modal-close');
    const batchCancelBtn = document.getElementById('batch-create-cancel-btn');

    const hideBatchModal = () => { batchModal.style.display = 'none'; };
    batchCloseBtn.addEventListener('click', hideBatchModal);
    batchCancelBtn.addEventListener('click', hideBatchModal);
    batchModal.addEventListener('click', e => {
        if (e.target === batchModal) hideBatchModal();
    });

    // 绑定分页按钮事件
    document.getElementById('hr-prev-page').addEventListener('click', () => {
        if (window.hrPagination.current > 1) {
            window.hrPagination.current--;
            loadHrList(currentUser);
        }
    });

    document.getElementById('hr-next-page').addEventListener('click', () => {
        if (window.hrPagination.current < window.hrPagination.pages) {
            window.hrPagination.current++;
            loadHrList(currentUser);
        }
    });

    // 加载HR账户列表
    setTimeout(() => {
        loadHrList(currentUser);
    }, 500);
}

async function loadHrList(user) {
    const statusEl = document.getElementById('hr-status');
    const tbody = document.getElementById('hr-manage-tbody');
    const paginationInfo = document.getElementById('hr-pagination-info');
    const prevBtn = document.getElementById('hr-prev-page');
    const nextBtn = document.getElementById('hr-next-page');
    
    try {
        statusEl.textContent = '正在加载HR账户信息...';
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">加载中...</td></tr>';
        
        const params = new URLSearchParams({
            pageNum: window.hrPagination.current,
            pageSize: window.hrPagination.size
        });
        
        const resp = await Auth.authenticatedFetch(`${USER_API_BASE}/hr/${user.companyId}?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const json = await resp.json();
        if (json.code !== 200) {
            throw new Error(json.message || '加载失败');
        }
        
        const pageData = json.data || {};
        const hrList = pageData.records || [];
        window.hrPagination.total = pageData.total || 0;
        window.hrPagination.pages = pageData.pages || 0;
        
        statusEl.textContent = `共找到 ${window.hrPagination.total} 个HR账户`;
        
        // 更新分页信息
        paginationInfo.textContent = `第 ${window.hrPagination.current} 页，共 ${window.hrPagination.pages} 页`;
        prevBtn.disabled = window.hrPagination.current <= 1;
        nextBtn.disabled = window.hrPagination.current >= window.hrPagination.pages;
        
        if (hrList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">暂无HR账户</td></tr>';
            return;
        }
        
        tbody.innerHTML = hrList.map(hr => `
            <tr>
                <td style="text-align: center; padding: 12px 8px;">${hr.userId}</td>
                <td style="text-align: center; padding: 12px 8px;">${hr.username}</td>
                <td style="text-align: center; padding: 12px 8px;">${hr.createTime ? hr.createTime.substring(0, 10) : ''}</td>
                <td style="text-align: center; padding: 12px 8px;">
                    <button class="btn btn-sm btn-secondary" onclick="showResetPasswordModal(${hr.userId})" style="margin-right: 5px;">重置密码</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteHrAccount(${hr.userId})">删除</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('加载HR账户列表失败:', e);
        statusEl.textContent = '加载HR账户信息失败';
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:red;">加载失败: ${e.message}</td></tr>`;
    }
}

async function createHrAccount(currentUser) {
    try {
        // 先获取公司信息以获取联系方式
        const companyResp = await Auth.authenticatedFetch(`${COMPANY_API_BASE}/${currentUser.companyId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        // 检查响应是否有效
        if (!companyResp.ok) {
            throw new Error(`HTTP error! status: ${companyResp.status}`);
        }

        const companyText = await companyResp.text();
        if (!companyText) {
            throw new Error('服务器返回空响应');
        }

        let companyJson;
        try {
            companyJson = JSON.parse(companyText);
        } catch (parseError) {
            throw new Error('服务器响应不是有效的JSON格式');
        }
        
        if (companyJson.code !== 200) {
            throw new Error(companyJson.message || '获取公司信息失败');
        }
        
        const companyInfo = companyJson.data || {};
        
        const resp = await Auth.authenticatedFetch(`${USER_API_BASE}/hr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyId: currentUser.companyId,
                contactPhone: companyInfo.contactPhone,
                contactEmail: companyInfo.contactEmail
            })
        });
        
        // 检查响应是否有效
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const text = await resp.text();
        if (!text) {
            throw new Error('服务器返回空响应');
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
            throw new Error('服务器响应不是有效的JSON格式');
        }
        if (json.code !== 200) {
            throw new Error(json.message || '创建失败');
        }
        
        alert('HR账户创建成功');
        // 重新加载列表
        loadHrList(currentUser);
    } catch (e) {
        console.error('创建HR账户失败:', e);
        alert(`创建HR账户失败: ${e.message}`);
    }
}

async function showResetPasswordModal(userId) {
    if (!confirm('确定要将该HR账户的密码重置为默认密码"123456"吗？')) {
        return;
    }
    
    try {
        const resp = await Auth.authenticatedFetch(`${USER_API_BASE}/${userId}/reset-password?newPassword=123456`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        
        // 检查响应是否有效
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const text = await resp.text();
        if (!text) {
            throw new Error('服务器返回空响应');
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
            throw new Error('服务器响应不是有效的JSON格式');
        }
        if (json.code !== 200) {
            // 特别处理密码格式错误
            if (json.code === 1007) { // PASSWORD_FORMAT_INVALID
                alert('默认密码不符合安全要求，无法重置密码，请联系系统管理员');
                return;
            }
            throw new Error(json.message || '重置失败');
        }
        
        alert('密码重置成功');
    } catch (e) {
        console.error('重置密码失败:', e);
        if (e.message.includes('安全要求')) {
            alert(e.message);
        } else {
            alert(`重置密码失败: ${e.message}`);
        }
    }
}

async function deleteHrAccount(userId) {
    if (!confirm('确定要删除该HR账户吗？此操作不可恢复！')) {
        return;
    }
    
    try {
        const resp = await Auth.authenticatedFetch(`${USER_API_BASE}/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        // 检查响应是否有效
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const text = await resp.text();
        if (!text) {
            throw new Error('服务器返回空响应');
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
            throw new Error('服务器响应不是有效的JSON格式');
        }
        if (json.code !== 200) {
            throw new Error(json.message || '删除失败');
        }
        
        alert('HR账户删除成功');
        // 重新加载列表
        loadHrList(Auth.getCurrentUser());
    } catch (e) {
        console.error('删除HR账户失败:', e);
        alert(`删除HR账户失败: ${e.message}`);
    }
}

async function batchCreateHrAccounts(currentUser) {
    try {
        const count = parseInt(document.getElementById('batch-count').value);
        
        if (isNaN(count) || count < 1 || count > 20) {
            alert('创建数量必须在1-20之间');
            return;
        }
        
        // 先获取公司信息以获取联系方式
        const companyResp = await Auth.authenticatedFetch(`${COMPANY_API_BASE}/${currentUser.companyId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        // 检查响应是否有效
        if (!companyResp.ok) {
            throw new Error(`HTTP error! status: ${companyResp.status}`);
        }

        const companyText = await companyResp.text();
        if (!companyText) {
            throw new Error('服务器返回空响应');
        }

        let companyJson;
        try {
            companyJson = JSON.parse(companyText);
        } catch (parseError) {
            throw new Error('服务器响应不是有效的JSON格式');
        }
        
        if (companyJson.code !== 200) {
            throw new Error(companyJson.message || '获取公司信息失败');
        }
        
        const companyInfo = companyJson.data || {};
        
        const resp = await Auth.authenticatedFetch(`${USER_API_BASE}/hr/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyId: currentUser.companyId,
                contactPhone: companyInfo.contactPhone,
                contactEmail: companyInfo.contactEmail,
                count: count
            })
        });
        
        // 检查响应是否有效
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const text = await resp.text();
        if (!text) {
            throw new Error('服务器返回空响应');
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
            throw new Error('服务器响应不是有效的JSON格式');
        }
        if (json.code !== 200) {
            throw new Error(json.message || '批量创建失败');
        }
        
        alert(`成功创建 ${count} 个HR账户`);
        // 关闭模态框
        document.getElementById('batch-create-modal').style.display = 'none';
        // 重新加载列表
        loadHrList(currentUser);
    } catch (e) {
        console.error('批量创建HR账户失败:', e);
        alert(`批量创建HR账户失败: ${e.message}`);
    }
}

async function exportHrToCsv(currentUser) {
    try {
        // 获取所有HR账户数据
        const resp = await Auth.authenticatedFetch(`${USER_API_BASE}/hr/${currentUser.companyId}?pageNum=1&pageSize=10000`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        // 检查响应是否有效
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const text = await resp.text();
        if (!text) {
            throw new Error('服务器返回空响应');
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
            throw new Error('服务器响应不是有效的JSON格式');
        }

        if (json.code !== 200) {
            throw new Error(json.message || '导出失败');
        }

        const hrList = json.data.records || [];
        
        if (hrList.length === 0) {
            alert('没有可导出的数据');
            return;
        }

        // 创建CSV内容
        let csvContent = '用户名\n'; // CSV头部只包含用户名列
        hrList.forEach(hr => {
            csvContent += `${hr.username}\n`;
        });

        // 创建下载链接
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.setAttribute('href', url);
        link.setAttribute('download', `hr_accounts_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error('导出HR账户失败:', e);
        alert(`导出失败: ${e.message}`);
    }
}