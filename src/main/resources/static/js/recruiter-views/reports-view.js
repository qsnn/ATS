async function renderReportsView(container, currentUser) {
    container.innerHTML = `
        <h2>招聘数据报表</h2>
        <div class="card">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <h4>本月招聘数据</h4>
                    <div style="margin-top: 15px;" id="monthly-stats">
                        <!-- 动态加载 -->
                    </div>
                </div>

                <div>
                    <h4>人才库价值</h4>
                    <div style="margin-top: 15px;" id="talent-value-stats">
                        <!-- 动态加载 -->
                    </div>
                </div>
            </div>

            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                <h4>面试成功率分析</h4>
                <div style="margin-top: 15px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">65%</div>
                        <div style="font-size: 12px; color: #666;">初面通过率</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #10b981;">45%</div>
                        <div style="font-size: 12px; color: #666;">终面通过率</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">30%</div>
                        <div style="font-size: 12px; color: #666;">录用接受率</div>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary" style="margin-top: 20px;" onclick="exportReport()">导出完整报表</button>
        </div>
    `;

    await loadReportData();
}

async function loadReportData() {
    try {
        // 获取当前用户信息
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || !currentUser.companyId) {
            throw new Error('用户未登录或缺少公司信息');
        }
        
        // 获取职位信息
        const jobs = await ApiService.request(`/job/info/company/${currentUser.companyId}`);

        // 获取申请信息
        const applications = await ApiService.request(`/applications/company/${currentUser.companyId}`);

        // 获取面试信息
        const interviews = await ApiService.request(`/interview/interviewer/${currentUser.userId}`);

        // 获取人才库信息
        const talents = await ApiService.getTalentPool();
        
        const monthlyStats = [
            { label: '新开启职位：', value: jobs ? jobs.length : '0' },
            { label: '收到简历：', value: applications ? applications.length : '0' },
            { label: '安排面试：', value: interviews ? interviews.length : '0' },
            { label: '发出Offer：', value: applications ? applications.filter(a => a.status === 'offer').length : '0', color: 'var(--success-color)' }
        ];

        const talentValueStats = [
            { label: '人才库总人数：', value: talents ? talents.length : '0' },
            { label: '近期有联系：', value: talents ? Math.floor(talents.length * 0.3) : '0' },
            { label: '转化为面试：', value: interviews ? Math.floor(interviews.length * 0.7) : '0' },
            { label: '转化为录用：', value: applications ? applications.filter(a => a.status === 'hired').length : '0', color: 'var(--success-color)' }
        ];

        document.getElementById('monthly-stats').innerHTML = monthlyStats.map(stat => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${stat.label}</span>
                <strong style="color:${stat.color || '#333'};">${stat.value}</strong>
            </div>
        `).join('');

        document.getElementById('talent-value-stats').innerHTML = talentValueStats.map(stat => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${stat.label}</span>
                <strong style="color:${stat.color || '#333'};">${stat.value}</strong>
            </div>
        `).join('');
    } catch (error) {
        console.error('加载报表数据失败:', error);
        // 使用默认数据
        const monthlyStats = [
            { label: '新开启职位：', value: '0' },
            { label: '收到简历：', value: '0' },
            { label: '安排面试：', value: '0' },
            { label: '发出Offer：', value: '0', color: 'var(--success-color)' }
        ];

        const talentValueStats = [
            { label: '人才库总人数：', value: '0' },
            { label: '近期有联系：', value: '0' },
            { label: '转化为面试：', value: '0' },
            { label: '转化为录用：', value: '0', color: 'var(--success-color)' }
        ];

        document.getElementById('monthly-stats').innerHTML = monthlyStats.map(stat => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${stat.label}</span>
                <strong style="color:${stat.color || '#333'};">${stat.value}</strong>
            </div>
        `).join('');

        document.getElementById('talent-value-stats').innerHTML = talentValueStats.map(stat => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${stat.label}</span>
                <strong style="color:${stat.color || '#333'};">${stat.value}</strong>
            </div>
        `).join('');
    }
}

function exportReport() {
    alert('正在导出招聘报表...（模拟操作）');
    setTimeout(() => {
        alert('招聘报表已导出为 recruitment_report.pdf（模拟）');
    }, 1000);
}
