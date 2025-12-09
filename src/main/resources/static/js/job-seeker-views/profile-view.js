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
                                    <input type="text" id="profile-username" name="username" readonly>
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

        const phone = document.getElementById('profile-phone').value;
        const email = document.getElementById('profile-email').value;

        const payload = {
            userId: user.userId,
            phone,
            email
        };

        const result = await updateUserProfileApi(payload);
        if (result.success) {
            alert('个人信息更新成功！');
            const updatedUser = Auth.updateCurrentUser({ phone, email });

            const greeting = document.getElementById('user-greeting');
            if (greeting && updatedUser) {
                greeting.textContent = '欢迎，' + (updatedUser.username || '求职者');
            }
        } else {
            alert('更新失败：' + result.message);
        }
    });

    // 修改密码提交
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async e => {
            e.preventDefault();

            const user = Auth.getCurrentUser();
            if (!user) {
                alert('用户未登录，无法修改密码。');
                return;
            }

            const oldPassword = document.getElementById('old-password').value.trim();
            const newPassword = document.getElementById('new-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();

            if (!oldPassword || !newPassword || !confirmPassword) {
                alert('请完整填写当前密码和新密码。');
                return;
            }
            if (newPassword.length < 6) {
                alert('新密码长度不能少于 6 位。');
                return;
            }
            if (newPassword !== confirmPassword) {
                alert('两次输入的新密码不一致，请重新输入。');
                return;
            }

            if (typeof updateUserPasswordApi !== 'function') {
                alert('修改密码接口未就绪，请稍后重试。');
                return;
            }

            const result = await updateUserPasswordApi({
                userId: user.userId,
                oldPassword,
                newPassword
            });

            if (!result.success) {
                alert(result.message || '修改密码失败');
                return;
            }

            alert('修改密码成功，请使用新密码重新登录。');
            // 安全起见，修改成功后强制登出
            Auth.logout();
            window.location.href = 'login.html';
        });
    }
}