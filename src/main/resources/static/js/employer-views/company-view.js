function renderCompanyView(container, currentUser) {
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