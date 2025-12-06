// 企业管理员账号与安全视图
function renderEmployerProfileView(container, currentUser) {
    container.innerHTML = `
        <div class="view employer-profile-view active">
            <h2>账号概览与安全</h2>
            <div class="card-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">账号概览</h3>
                        <p class="card-subtitle">查看企业管理员的基础信息与统计</p>
                    </div>
                    <div class="card-body" id="employer-profile-summary">
                        <p>正在加载账号信息...</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">基础信息</h3>
                        <p class="card-subtitle">更新联系方式和显示名称</p>
                    </div>
                    <div class="card-body">
                        <form id="employer-profile-form" class="profile-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employer-username">登录名</label>
                                    <input type="text" id="employer-username" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="employer-realname">姓名</label>
                                    <input type="text" id="employer-realname" placeholder="请输入联系人姓名">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employer-phone">手机号</label>
                                    <input type="text" id="employer-phone" placeholder="常用联系电话">
                                </div>
                                <div class="form-group">
                                    <label for="employer-email">邮箱</label>
                                    <input type="email" id="employer-email" placeholder="用于接收系统通知">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">保存基础信息</button>
                        </form>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">账号安全</h3>
                        <p class="card-subtitle">定期修改密码，保障账号安全</p>
                    </div>
                    <div class="card-body">
                        <form id="employer-password-form" class="password-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employer-old-password">当前密码</label>
                                    <input type="password" id="employer-old-password" autocomplete="current-password" placeholder="请输入当前密码">
                                </div>
                                <div class="form-group">
                                    <label for="employer-new-password">新密码</label>
                                    <input type="password" id="employer-new-password" autocomplete="new-password" placeholder="至少 6 位，建议大小写字母+数字">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employer-confirm-password">确认新密码</label>
                                    <input type="password" id="employer-confirm-password" autocomplete="new-password" placeholder="再次输入新密码">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">修改密码</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    loadEmployerProfile(currentUser);
    bindEmployerProfileEvents(currentUser);
}

async function loadEmployerProfile(currentUser) {
    const summaryEl = document.getElementById('employer-profile-summary');
    if (!currentUser || !summaryEl) return;

    try {
        const resp = await fetch(`${USER_API_BASE}/${encodeURIComponent(currentUser.userId)}`);
        if (!resp.ok) {
            const text = await resp.text();
            summaryEl.innerHTML = `<p>加载失败：${resp.status} ${text}</p>`;
            return;
        }
        const json = await resp.json();
        if (!json || json.code !== 200 || !json.data) {
            summaryEl.innerHTML = `<p>${(json && json.message) || '加载失败'}</p>`;
            return;
        }
        const p = json.data; // UserProfileVO

        // 概览卡片
        summaryEl.innerHTML = `
            <div class="card-body">
                <p><strong>账号：</strong>${p.username || ''}</p>
                <p><strong>姓名：</strong>${p.realName || ''}</p>
                <p><strong>所属公司：</strong>${p.companyName || '未关联公司'}</p>
                <p><strong>部门 / 职位：</strong>${p.department || ''} ${p.position || ''}</p>
                <p><strong>账号创建时间：</strong>${p.createTime || ''}</p>
                <div style="margin-top:12px;font-size:13px;color:#6b7280;">
                    <p>管理企业数量：<strong>${p.companyManageCount ?? '-'}</strong></p>
                    <p>负责招聘职位数：<strong>${p.recruitmentCount ?? '-'}</strong></p>
                </div>
            </div>
        `;

        // 填充基础信息表单（与 SysUser / UserUpdateDTO 字段对应）
        document.getElementById('employer-username').value = p.username || '';
        document.getElementById('employer-realname').value = p.realName || '';
        document.getElementById('employer-phone').value = p.phone || '';
        document.getElementById('employer-email').value = p.email || '';
    } catch (e) {
        console.error('加载企业账号信息异常:', e);
        summaryEl.innerHTML = '<p>加载异常，请稍后重试</p>';
    }
}

function bindEmployerProfileEvents(currentUser) {
    const profileForm = document.getElementById('employer-profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async e => {
            e.preventDefault();
            const user = Auth.getCurrentUser();
            if (!user) {
                alert('用户未登录，无法更新信息。');
                return;
            }
            const realName = document.getElementById('employer-realname').value.trim();
            const phone = document.getElementById('employer-phone').value.trim();
            const email = document.getElementById('employer-email').value.trim();

            const payload = {
                userId: user.userId,
                realName,
                phone,
                email
            };

            const result = await updateUserProfileApi(payload);
            if (!result.success) {
                alert(result.message || '更新失败');
                return;
            }

            alert('基础信息更新成功！');
            const updatedUser = Auth.updateCurrentUser({ realName, phone, email });
            const greeting = document.getElementById('user-greeting');
            if (greeting && updatedUser) {
                greeting.textContent = '欢迎，' + (updatedUser.realName || updatedUser.username || '企业管理员');
            }
        });
    }

    const passwordForm = document.getElementById('employer-password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async e => {
            e.preventDefault();
            const user = Auth.getCurrentUser();
            if (!user) {
                alert('用户未登录，无法修改密码。');
                return;
            }

            const oldPassword = document.getElementById('employer-old-password').value.trim();
            const newPassword = document.getElementById('employer-new-password').value.trim();
            const confirmPassword = document.getElementById('employer-confirm-password').value.trim();

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
            Auth.logout();
            window.location.href = 'login.html';
        });
    }
}

