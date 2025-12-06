function renderCompanyView(container, currentUser) {
    container.innerHTML = `
        <h2>公司信息</h2>
        <div class="card">
            <form id="company-form">
                <div class="form-group">
                    <label>公司名称</label>
                    <input type="text" id="company-name" value="示例科技有限公司">
                </div>
                <div class="form-group">
                    <label>公司简介</label>
                    <textarea id="company-description" rows="4">这是一家优秀的科技公司...</textarea>
                </div>
                <div class="form-group">
                    <label>公司地址</label>
                    <input type="text" id="company-address" value="北京市海淀区">
                </div>
                <div class="form-group">
                    <label>联系人</label>
                    <input type="text" id="company-contact" value="李经理">
                </div>
                <div class="form-group">
                    <label>联系电话</label>
                    <input type="text" id="company-phone" value="010-12345678">
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
    // 若用户对象中带有 companyId，则优先根据 companyId 查询
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
        document.getElementById('company-address').value = c.address || '';
        document.getElementById('company-contact').value = c.contactName || '';
        document.getElementById('company-phone').value = c.contactPhone || '';
    } catch (e) {
        console.error('加载公司信息失败:', e);
    }
}

async function saveCompanyInfo(user) {
    const companyData = {
        companyId: user.companyId || null,
        companyName: document.getElementById('company-name').value.trim(),
        companyDesc: document.getElementById('company-description').value.trim(),
        address: document.getElementById('company-address').value.trim(),
        contactName: document.getElementById('company-contact').value.trim(),
        contactPhone: document.getElementById('company-phone').value.trim()
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