/**
 * 渲染账户与安全视图
 * @param {HTMLElement} container - 容器元素
 * @param {Object} currentUser - 当前用户信息
 */
function renderProfileView(container, currentUser) {
    container.innerHTML = `
        <h2>账户与安全</h2>
        <div class="card">
            <div class="profile-header">
                <h3>基本信息</h3>
            </div>
            
            <div class="form-group">
                <label>用户ID</label>
                <div class="readonly-field">${currentUser.userId || ''}</div>
            </div>
            
            <div class="form-group">
                <label>用户名</label>
                <div class="readonly-field">${currentUser.username || ''}</div>
            </div>
            
            <div class="form-group">
                <label>角色</label>
                <div class="readonly-field">平台管理员</div>
            </div>
            
            <div class="form-group">
                <label>邮箱</label>
                <div class="readonly-field">${currentUser.email || '未设置'}</div>
            </div>
            
            <div class="form-group">
                <label>电话</label>
                <div class="readonly-field">${currentUser.phone || '未设置'}</div>
            </div>
            
            <div class="form-group">
                <label>注册时间</label>
                <div class="readonly-field">${currentUser.createTime ? currentUser.createTime.substring(0, 19).replace('T', ' ') : ''}</div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 16px;">
            <div class="profile-header">
                <h3>修改密码</h3>
            </div>
            <form id="admin-password-form">
                <div class="form-row">
                    <div>
                        <label>当前密码</label>
                        <input type="password" id="admin-old-password" placeholder="请输入当前密码">
                    </div>
                    <div>
                        <label>新密码</label>
                        <input type="password" id="admin-new-password" placeholder="请输入新密码">
                    </div>
                    <div>
                        <label>确认新密码</label>
                        <input type="password" id="admin-confirm-password" placeholder="请再次输入新密码">
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" id="admin-change-password-btn" type="button">保存修改</button>
                </div>
            </form>
        </div>
    `;

    // 绑定修改密码按钮事件
    document.getElementById('admin-change-password-btn').addEventListener('click', function() {
        changeAdminPassword(currentUser);
    });
}

/**
 * 修改管理员密码
 * @param {Object} adminUser - 管理员用户信息
 */
async function changeAdminPassword(adminUser) {
    const oldPassword = document.getElementById('admin-old-password').value.trim();
    const newPassword = document.getElementById('admin-new-password').value.trim();
    const confirmPassword = document.getElementById('admin-confirm-password').value.trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
        alert('请填写所有密码字段');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('新密码与确认密码不一致');
        return;
    }

    if (newPassword.length < 6) {
        alert('密码长度不能少于6位');
        return;
    }

    try {
        const response = await Auth.authenticatedFetch(`/api/user/${adminUser.userId}/password`, {
            method: 'PUT',
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.code !== 200) {
            throw new Error(result.message || '修改密码失败');
        }

        alert('密码修改成功');
        // 清空密码输入框
        document.getElementById('admin-old-password').value = '';
        document.getElementById('admin-new-password').value = '';
        document.getElementById('admin-confirm-password').value = '';
    } catch (e) {
        console.error('修改密码失败:', e);
        alert(`修改密码失败：${e.message}`);
    }
}