function renderProfileView(container, currentUser) {
    container.innerHTML = `
        <div class="view profile-view active">
            <h2>个人信息管理</h2>
            <form id="profile-form" class="profile-form">
                <div class="form-group">
                    <label for="profile-username">用户名</label>
                    <input type="text" id="profile-username" name="username" readonly>
                </div>
                <div class="form-group">
                    <label for="profile-phone">手机号</label>
                    <input type="text" id="profile-phone" name="phone">
                </div>
                <div class="form-group">
                    <label for="profile-email">邮箱</label>
                    <input type="email" id="profile-email" name="email">
                </div>
                <button type="submit" class="btn btn-primary">保存更新</button>
            </form>
        </div>
    `;

    // 填充数据
    document.getElementById('profile-username').value = currentUser.username || '';
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-email').value = currentUser.email || '';

    // 提交事件
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
                greeting.textContent = '欢迎，' + (updatedUser.realName || updatedUser.username || '求职者');
            }
        } else {
            alert('更新失败：' + result.message);
        }
    });
}