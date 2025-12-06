function renderReportsView(container, currentUser) {
    container.innerHTML = `
        <h2>运营数据报表</h2>
        <div class="card">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
                <div>
                    <h4>平台关键指标</h4>
                    <div style="margin-top:10px;" id="platform-stats">
                        <!-- 动态加载 -->
                    </div>
                </div>

                <div>
                    <h4>本月运营情况</h4>
                    <div style="margin-top:10px;" id="monthly-stats">
                        <!-- 动态加载 -->
                    </div>
                </div>
            </div>
            <button class="btn btn-primary" style="margin-top:20px;" onclick="exportReport()">导出报表</button>
        </div>
    `;

    loadReportStats();
}

function loadReportStats() {
    const platformStats = [
        { label: '注册用户总数：', value: '10,000+', color: '#333' },
        { label: '企业数量：', value: '500+', color: '#333' },
        { label: '累计职位发布：', value: '3,200', color: '#333' },
        { label: '成功匹配：', value: '5,000+', color: 'var(--success-color)' }
    ];

    const monthlyStats = [
        { label: '新增求职者：', value: '820', color: '#333' },
        { label: '新增企业：', value: '32', color: '#333' },
        { label: '职位发布量：', value: '480', color: '#333' },
        { label: '用户满意度：', value: '99.5%', color: 'var(--success-color)' }
    ];

    document.getElementById('platform-stats').innerHTML = platformStats.map(stat => `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span>${stat.label}</span>
            <strong style="color:${stat.color};">${stat.value}</strong>
        </div>
    `).join('');

    document.getElementById('monthly-stats').innerHTML = monthlyStats.map(stat => `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span>${stat.label}</span>
            <strong style="color:${stat.color};">${stat.value}</strong>
        </div>
    `).join('');
}

function exportReport() {
    alert('正在导出运营报表...（模拟操作）');
    setTimeout(() => {
        alert('运营报表已导出为 CSV 文件（模拟）');
    }, 1000);
}