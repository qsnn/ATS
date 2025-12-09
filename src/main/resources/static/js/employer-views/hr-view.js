function renderHrManageView(container, currentUser) {
    container.innerHTML = `
        <div class="view hr-manage-view active">
            <h2>HR账户管理</h2>
            <button class="btn btn-primary" id="create-hr-btn" style="margin: 15px 0;">创建HR账户</button>
            
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
        </div>
        
        <!-- HR账户详情弹窗 -->
        <div id="hr-detail-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:9999;">
            <div style="background:#fff; width:500px; max-height:90vh; overflow:auto; margin:40px auto; padding:20px; border-radius:6px; position:relative;">
                <h3>HR账户详情</h3>
                <button id="hr-detail-modal-close" style="position:absolute; right:16px; top:10px; border:none; background:none; font-size:18px; cursor:pointer;">×</button>
                <div id="hr-detail-content"></div>
            </div>
        </div>
    `;

    // 绑定创建HR账户按钮事件
    document.getElementById('create-hr-btn').addEventListener('click', () => {
        createHrAccount(currentUser);
    });

    // 绑定模态框关闭事件
    const modal = document.getElementById('hr-detail-modal');
    const closeBtn = document.getElementById('hr-detail-modal-close');

    const hideModal = () => { modal.style.display = 'none'; };
    closeBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) hideModal();
    });

    // 加载HR账户列表
    setTimeout(() => {
        loadHrList(currentUser);
    }, 500);
}

async function loadHrList(user) {
    const statusEl = document.getElementById('hr-status');
    const tbody = document.getElementById('hr-manage-tbody');
    
    try {
        statusEl.textContent = '正在加载HR账户信息...';
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">加载中...</td></tr>';
        
        const resp = await fetch(`${USER_API_BASE}/hr/${user.companyId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const json = await resp.json();
        if (json.code !== 200) {
            throw new Error(json.message || '加载失败');
        }
        
        const hrList = json.data || [];
        statusEl.textContent = `共找到 ${hrList.length} 个HR账户`;
        
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
        const resp = await fetch(`${USER_API_BASE}/hr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyId: currentUser.companyId
            })
        });
        
        const json = await resp.json();
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
        const resp = await fetch(`${USER_API_BASE}/${userId}/reset-password?newPassword=123456`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const json = await resp.json();
        if (json.code !== 200) {
            throw new Error(json.message || '重置失败');
        }
        
        alert('密码重置成功');
    } catch (e) {
        console.error('重置密码失败:', e);
        alert(`重置密码失败: ${e.message}`);
    }
}

async function deleteHrAccount(userId) {
    if (!confirm('确定要删除该HR账户吗？此操作不可恢复！')) {
        return;
    }
    
    try {
        const resp = await fetch(`${USER_API_BASE}/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const json = await resp.json();
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