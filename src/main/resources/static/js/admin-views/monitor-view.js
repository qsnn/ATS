function renderMonitorView(container, currentUser) {
    container.innerHTML = `
        <h2>系统监控</h2>
        <div class="card">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;" id="monitor-stats">
                <!-- 动态加载 -->
            </div>
            <p style="margin-top:15px;color:#666;font-size:13px;">以上为模拟数据，仅用于前端展示。</p>
        </div>
    `;

    loadMonitorStats();
}

function loadMonitorStats() {
    const container = document.getElementById('monitor-stats');
    if (!container) return;

    const stats = [
        { name: '在线用户数', value: '128', color: '#333' },
        { name: '今日访问量', value: '3,562', color: '#333' },
        { name: '接口错误率', value: '0.7%', color: '#f56565' },
        { name: '平均响应时间', value: '220ms', color: '#333' }
    ];

    container.innerHTML = stats.map(stat => `
        <div>
            <h4>${stat.name}</h4>
            <p style="font-size:24px;font-weight:bold;color:${stat.color};">${stat.value}</p>
        </div>
    `).join('');
}