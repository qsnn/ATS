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
}

async function saveCompanyInfo(user) {
    const companyData = {
        name: document.getElementById('company-name').value,
        description: document.getElementById('company-description').value,
        address: document.getElementById('company-address').value,
        contact: document.getElementById('company-contact').value,
        phone: document.getElementById('company-phone').value,
        employerId: user.userId
    };

    try {
        // 这里替换为实际的保存公司信息API
        // const resp = await fetch('http://xxx/api/company', {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(companyData)
        // });

        alert('公司信息保存成功（模拟）');
    } catch (e) {
        console.error('保存公司信息失败:', e);
        alert('保存失败，请稍后重试');
    }
}