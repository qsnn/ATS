function renderProfileView(container, currentUser) {
    container.innerHTML = `
        <div class="view profile-view active">
            <h2>个人信息与安全</h2>
            <div class="card-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">基础信息</h3>
                        <p class="card-subtitle">更新联系方式，保持沟通畅通</p>
                    </div>
                    <div class="card-body">
                        <form id="profile-form" class="profile-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="profile-username">用户名</label>
                                    <input type="text" id="profile-username" name="username">
                                </div>
                                <div class="form-group">
                                    <label for="profile-phone">手机号</label>
                                    <input type="text" id="profile-phone" name="phone" placeholder="请输入常用手机号">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="profile-email">邮箱</label>
                                    <input type="email" id="profile-email" name="email" placeholder="用于接收面试通知等">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">保存更新</button>
                        </form>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">账号安全</h3>
                        <p class="card-subtitle">定期修改密码，保障账号安全</p>
                    </div>
                    <div class="card-body">
                        <form id="password-form" class="password-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="old-password">当前密码</label>
                                    <input type="password" id="old-password" autocomplete="current-password" placeholder="请输入当前登录密码">
                                </div>
                                <div class="form-group">
                                    <label for="new-password">新密码</label>
                                    <input type="password" id="new-password" autocomplete="new-password" placeholder="至少 6 位，建议包含字母和数字">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="confirm-password">确认新密码</label>
                                    <input type="password" id="confirm-password" autocomplete="new-password" placeholder="再次输入新密码">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">修改密码</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    const USER_API_BASE = `${window.API_BASE || '/api'}/user`;

    // 填充数据
    document.getElementById('profile-username').value = currentUser.username || '';
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-email').value = currentUser.email || '';

    // 个人信息提交
    document.getElementById('profile-form').addEventListener('submit', async e => {
        e.preventDefault();

        const user = Auth.getCurrentUser();
        if (!user) {
            alert('用户未登录，无法更新信息。');
            return;
        }

        const username = document.getElementById('profile-username').value.trim();
        const phone = document.getElementById('profile-phone').value;
        const email = document.getElementById('profile-email').value;

        // 检查用户名是否已存在
        if (username !== user.username) {
            try {
                const checkResp = await Auth.authenticatedFetch(`${USER_API_BASE}/check/username?username=${encodeURIComponent(username)}`);
                if (!checkResp.ok) {
                    throw new Error(`HTTP error! status: ${checkResp.status}`);
                }
                const result = await checkResp.json();
                
                if (result.data === true) {
                    alert('用户名已存在，请选择其他用户名');
                    return;
                }
            } catch (error) {
                console.error('检查用户名失败:', error);
                showMessage('检查用户名时发生错误，请稍后重试', 'error');
                return;
            }
        }

        const payload = {
            userId: user.userId,
            username,
            phone,
            email
        };

        const result = await updateUserProfileApi(payload);
        if (result.success) {
            showMessage('个人信息更新成功！', 'success');

            // 更新界面右上角的欢迎信息
            const greeting = document.getElementById('user-greeting');
            if (greeting) {
                greeting.textContent = '欢迎，' + (username || '求职者');
            }
            
            // 同步更新本地 Auth 信息
            if (window.Auth && typeof Auth.getCurrentUser === 'function' && typeof Auth.updateCurrentUser === 'function') {
                Auth.updateCurrentUser({ username, phone, email });
            }
        } else {
            showMessage('更新失败：' + result.message, 'error');
        }

    });

    // 修改密码提交
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async e => {
            e.preventDefault();

            const user = Auth.getCurrentUser();
            if (!user) {
                showMessage('用户未登录，无法修改密码。', 'error');
                return;
            }

            const oldPassword = document.getElementById('old-password').value.trim();
            const newPassword = document.getElementById('new-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();

            if (!oldPassword || !newPassword || !confirmPassword) {
                showMessage('请完整填写当前密码和新密码。', 'warning');
                return;
            }
            if (newPassword.length < 8) {
                showMessage('新密码长度不能少于 8 位。', 'warning');
                return;
            }
            // 检查密码是否包含字母和数字
            if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
                showMessage('新密码必须同时包含字母和数字。', 'warning');
                return;
            }
            if (newPassword !== confirmPassword) {
                showMessage('两次输入的新密码不一致，请重新输入。', 'warning');
                return;
            }

            if (typeof updateUserPasswordApi !== 'function') {
                showMessage('修改密码接口未就绪，请稍后重试。', 'error');
                return;
            }

            const result = await updateUserPasswordApi({
                userId: user.userId,
                oldPassword,
                newPassword
            });

            if (!result.success) {
                showMessage(result.message || '修改密码失败', 'error');
                return;
            }

            showMessage('修改密码成功，请使用新密码重新登录。', 'success');
            // 安全起见，修改成功后强制登出
            Auth.logout();
            window.location.href = 'login.html';
        });
    }
}