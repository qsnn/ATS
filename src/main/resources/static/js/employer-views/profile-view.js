function renderEmployerProfileView(container, currentUser) {
    container.innerHTML = `
        <h2>账号与安全</h2>
        <div class="dashboard-card">
            <h3>基本信息</h3>
            <div class="form-row">
                <div>
                    <label>用户名</label>
                    <input type="text" id="emp-username-input" placeholder="请输入用户名">
                </div>
                <div>
                    <label>角色</label>
                    <input type="text" id="emp-role-input" disabled>
                </div>
            </div>
            <div class="form-row" style="margin-top: 8px;">
                <div>
                    <label>邮箱</label>
                    <input type="email" id="emp-email-input" placeholder="请输入邮箱">
                </div>
                <div>
                    <label>手机号</label>
                    <input type="text" id="emp-phone-input" placeholder="请输入手机号">
                </div>
            </div>
            <div class="action-buttons" style="margin-top: 12px;">
                <button class="btn btn-primary" id="emp-save-profile-btn">保存基本信息</button>
            </div>
        </div>

        <div class="dashboard-card" style="margin-top: 16px;">
            <h3>修改密码</h3>
            <div class="form-row">
                <div>
                    <label>当前密码</label>
                    <input type="password" id="emp-old-password" placeholder="请输入当前密码">
                </div>
                <div>
                    <label>新密码</label>
                    <input type="password" id="emp-new-password" placeholder="请输入新密码">
                </div>
                <div>
                    <label>确认新密码</label>
                    <input type="password" id="emp-confirm-password" placeholder="请再次输入新密码">
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" id="emp-change-password-btn">保存修改</button>
            </div>
        </div>
    `;

    loadEmployerProfile(currentUser);
    bindEmployerPasswordChange(currentUser);
    bindEmployerProfileSave(currentUser);
}

async function loadEmployerProfile(user) {
    try {
        const resp = await fetch(`/api/user/${encodeURIComponent(user.userId)}`);
        if (!resp.ok) return;
        const json = await resp.json();
        const data = (json && typeof json === 'object' && 'code' in json)
            ? (json.code === 200 ? json.data : null)
            : json;
        if (!data) return;

        document.getElementById('emp-username-input').value = data.username || '';
        document.getElementById('emp-role-input').value = (data.roleName || data.role || '企业管理员');
        document.getElementById('emp-email-input').value = data.email || '';
        document.getElementById('emp-phone-input').value = data.phone || '';
    } catch (e) {
        console.error('加载账号信息失败:', e);
    }
}

function bindEmployerProfileSave(user) {
    const btn = document.getElementById('emp-save-profile-btn');
    if (!btn) return;

    btn.onclick = async () => {
        const usernameInput = document.getElementById('emp-username-input');
        const emailInput = document.getElementById('emp-email-input');
        const phoneInput = document.getElementById('emp-phone-input');
        
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!username) {
            alert('用户名不能为空');
            return;
        }

        // 检查用户名是否已存在（如果不是当前用户名）
        if (username !== user.username) {
            try {
                const checkResp = await fetch(`/api/user/check/username?username=${encodeURIComponent(username)}`);
                const checkResult = await checkResp.json();
                
                if (checkResult.code === 200 && checkResult.data === true) {
                    alert('用户名已存在，请选择其他用户名');
                    usernameInput.focus();
                    return;
                }
            } catch (error) {
                console.error('检查用户名失败:', error);
                alert('检查用户名时发生错误，请稍后重试');
                return;
            }
        }

        const payload = {
            userId: user.userId,
            username,
            email,
            phone
        };

        try {
            const resp = await fetch(`/api/user/${user.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) {
                const text = await resp.text();
                alert(`网络错误: ${resp.status} ${text}`);
                return;
            }
            const json = await resp.json();
            if (!json || json.code !== 200) {
                alert((json && json.message) || '保存失败');
                return;
            }
            alert('基本信息已保存');
            
            // 同步更新本地 Auth 信息
            if (window.Auth && typeof Auth.getCurrentUser === 'function' && typeof Auth.updateCurrentUser === 'function') {
                Auth.updateCurrentUser({ username, email, phone });
            }
            
            // 更新界面右上角的欢迎信息
            const greeting = document.getElementById('user-greeting');
            if (greeting) {
                greeting.textContent = '欢迎，' + (username || '企业管理员');
            }
        } catch (e) {
            console.error('保存账号信息失败:', e);
            alert('保存失败，请稍后重试');
        }
    };
}

function bindEmployerPasswordChange(user) {
    const btn = document.getElementById('emp-change-password-btn');
    if (!btn) return;

    btn.onclick = async () => {
        const oldPwd = document.getElementById('emp-old-password').value.trim();
        const newPwd = document.getElementById('emp-new-password').value.trim();
        const confirmPwd = document.getElementById('emp-confirm-password').value.trim();

        if (!oldPwd || !newPwd || !confirmPwd) {
            alert('请完整填写所有密码字段');
            return;
        }
        if (newPwd !== confirmPwd) {
            alert('两次输入的新密码不一致');
            return;
        }

        try {
            const resp = await fetch(`/api/user/${encodeURIComponent(user.userId)}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
            });
            if (!resp.ok) {
                const text = await resp.text();
                alert(`网络错误: ${resp.status} ${text}`);
                return;
            }
            const json = await resp.json();
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