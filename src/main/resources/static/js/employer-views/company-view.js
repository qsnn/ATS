function renderCompanyView(container, currentUser) {
    // 检查用户是否绑定了公司
    if (!currentUser.companyId) {
        // 用户没有绑定公司，显示创建公司的按钮
        container.innerHTML = `
            <h2>公司信息</h2>
            <div class="card">
                <p>您尚未创建公司信息。</p>
                <button id="create-company-btn" class="btn btn-primary">创建公司</button>
            </div>
            
            <!-- 创建公司模态框 -->
            <div id="create-company-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>创建公司</h2>
                    <form id="create-company-form">
                        <div class="form-group">
                            <label>公司名称 *</label>
                            <input type="text" id="company-name" class="form-control" placeholder="请输入公司名称" required>
                        </div>
                        <div class="form-group">
                            <label>公司简介</label>
                            <textarea id="company-description" class="form-control" rows="4" placeholder="请输入公司简介"></textarea>
                        </div>
                        <div class="form-group">
                            <label>公司地址</label>
                            <input type="text" id="company-address" class="form-control" placeholder="请输入公司地址">
                        </div>
                        <div class="form-group">
                            <label>联系人</label>
                            <input type="text" id="company-contact" class="form-control" placeholder="请输入联系人姓名">
                        </div>
                        <div class="form-group">
                            <label>联系电话</label>
                            <input type="text" id="company-phone" class="form-control" placeholder="请输入联系电话">
                        </div>
                        <div class="form-group">
                            <label>联系邮箱</label>
                            <input type="email" id="company-email" class="form-control" placeholder="请输入联系邮箱">
                        </div>
                        <button type="submit" class="btn btn-primary">创建公司</button>
                    </form>
                </div>
            </div>
        `;

        // 绑定创建公司按钮事件
        document.getElementById('create-company-btn').addEventListener('click', () => {
            document.getElementById('create-company-modal').style.display = 'block';
        });

        // 绑定模态框关闭事件
        const modal = document.getElementById('create-company-modal');
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // 绑定创建公司表单提交事件
        document.getElementById('create-company-form').addEventListener('submit', (e) => {
            e.preventDefault();
            createCompany(currentUser);
        });
    } else {
        // 用户已绑定公司，显示原有界面
        container.innerHTML = `
            <h2>公司信息</h2>
            <div class="card">
                <form id="company-form">
                    <div class="form-group">
                        <label>公司名称</label>
                        <input type="text" id="company-name" class="form-control" placeholder="请输入公司名称">
                    </div>
                    <div class="form-group">
                        <label>公司简介</label>
                        <textarea id="company-description" class="form-control" rows="4" placeholder="请输入公司简介"></textarea>
                    </div>
                    <div class="form-group">
                        <label>公司地址</label>
                        <input type="text" id="company-address" class="form-control" placeholder="请输入公司地址">
                    </div>
                    <div class="form-group">
                        <label>联系人</label>
                        <input type="text" id="company-contact" class="form-control" placeholder="请输入联系人姓名">
                    </div>
                    <div class="form-group">
                        <label>联系电话</label>
                        <input type="text" id="company-phone" class="form-control" placeholder="请输入联系电话">
                    </div>
                    <div class="form-group">
                        <label>联系邮箱</label>
                        <input type="email" id="company-email" class="form-control" placeholder="请输入联系邮箱">
                    </div>
                    <button type="submit" class="btn btn-primary">保存公司信息</button>
                </form>
            </div>
        `;

        document.getElementById('company-form').addEventListener('submit', (e) => {
            e.preventDefault();
            saveCompanyInfo(currentUser);
        });

        loadCompanyInfo(currentUser);
    }
}

async function loadCompanyInfo(user) {
    const companyId = user.companyId;
    if (!companyId) {
        return;
    }
    try {
        const resp = await fetch(`${COMPANY_API_BASE}/${companyId}`);
        if (!resp.ok) return;
        const json = await resp.json();
        if (!json || json.code !== 200 || !json.data) return;
        const c = json.data;
        document.getElementById('company-name').value = c.companyName || '';
        document.getElementById('company-description').value = c.companyDesc || '';
        // 对齐后端 CompanyInfoVO 字段：companyAddress, contactPerson, contactEmail
        document.getElementById('company-address').value = c.companyAddress || '';
        document.getElementById('company-contact').value = c.contactPerson || '';
        document.getElementById('company-phone').value = c.contactPhone || '';
        document.getElementById('company-email').value = c.contactEmail || '';
    } catch (e) {
        console.error('加载公司信息失败:', e);
    }
}

async function saveCompanyInfo(user) {
    const companyData = {
        companyId: user.companyId || null,
        companyName: document.getElementById('company-name').value.trim(),
        companyDesc: document.getElementById('company-description').value.trim(),
        // 保存时同样按后端实体字段命名
        companyAddress: document.getElementById('company-address').value.trim(),
        contactPerson: document.getElementById('company-contact').value.trim(),
        contactPhone: document.getElementById('company-phone').value.trim(),
        contactEmail: document.getElementById('company-email').value.trim()
    };

    const hasId = !!companyData.companyId;
    const method = hasId ? 'PUT' : 'POST';

    try {
        const resp = await fetch(`${COMPANY_API_BASE}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData)
        });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const json = await resp.json();
        if (!json || json.code !== 200) {
            alert(json && json.message ? json.message : '保存失败');
            return;
        }
        alert('公司信息保存成功');
    } catch (e) {
        console.error('保存公司信息失败:', e);
        alert('保存失败，请稍后重试');
    }
}

async function createCompany(user) {
    const companyData = {
        companyName: document.getElementById('company-name').value.trim(),
        companyDesc: document.getElementById('company-description').value.trim(),
        companyAddress: document.getElementById('company-address').value.trim(),
        contactPerson: document.getElementById('company-contact').value.trim(),
        contactPhone: document.getElementById('company-phone').value.trim(),
        contactEmail: document.getElementById('company-email').value.trim(),
        creatorId: user.userId  // 自动填充创建者ID
    };

    try {
        const resp = await fetch(`${COMPANY_API_BASE}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData)
        });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const json = await resp.json();
        if (!json || json.code !== 200) {
            alert(json && json.message ? json.message : '创建失败');
            return;
        }
        
        // 获取新创建的公司ID
        const newCompanyId = json.data.companyId;
        
        // 更新用户信息，将companyId设置为新创建的公司ID
        try {
            const userUpdateResp = await ApiService.request(`/user/${user.userId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    userId: user.userId,
                    companyId: newCompanyId
                })
            });
        } catch (error) {
            alert(`用户信息更新失败: ${error.message}`);
            return;
        }
        
        // 创建成功后隐藏模态框
        document.getElementById('create-company-modal').style.display = 'none';
        alert('公司创建成功，用户信息已更新');
        
        // 更新本地存储的用户信息
        if (window.Auth && typeof Auth.updateCurrentUser === 'function') {
            const updatedUser = Object.assign({}, user, { companyId: newCompanyId });
            Auth.updateCurrentUser(updatedUser);
        }
        
        // 刷新页面以显示新的公司信息
        location.reload();
    } catch (e) {
        console.error('创建公司失败:', e);
        alert('创建失败，请稍后重试');
    }
}