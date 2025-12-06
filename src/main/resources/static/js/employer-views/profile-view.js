function renderEmployerProfileView(container, currentUser) {
    container.innerHTML = `
        <h2>账号与安全</h2>
        <div class="dashboard-card">
            <h3>基本信息</h3>
            <p>用户名：<span id="emp-username"></span></p>
            <p>角色：<span id="emp-role"></span></p>
            <p>邮箱：<span id="emp-email"></span></p>
            <p>手机号：<span id="emp-phone"></span></p>
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
    bindEmployerPasswordChange();
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

        document.getElementById('emp-username').textContent = data.username || '';
        document.getElementById('emp-role').textContent = data.role || '';
        document.getElementById('emp-email').textContent = data.email || '';
        document.getElementById('emp-phone').textContent = data.phone || '';
    } catch (e) {
        console.error('加载账号信息失败:', e);
    }
}

function bindEmployerPasswordChange() {
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

        const result = await updateUserPasswordApi({ oldPassword: oldPwd, newPassword: newPwd });
        if (!result.success) {
            alert(result.message || '修改密码失败');
            return;
        }

        alert('密码修改成功，请使用新密码重新登录。');
    };
}

