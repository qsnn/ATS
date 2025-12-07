// 模拟数据（可以从原HTML中迁移过来）
window.MockData = {
    talentPool: [
        {
            id: 1,
            name: '候选人1',
            position: 'Java开发工程师',
            experience: '3-5年',
            education: '本科',
            skills: ['Java', 'Spring', 'MySQL'],
            phone: '138****5678',
            email: 'candidate1@email.com',
            source: '申请人转化',
            sourceJob: 'Java开发工程师',
            note: '技术能力优秀，暂时没有合适职位',
            addedDate: '2024-01-20'
        }
    ],
    addToTalentPool: function(talent) {
        talent.id = this.talentPool.length + 1;
        talent.addedDate = new Date().toLocaleDateString();
        this.talentPool.push(talent);
        return { success: true };
    },
    removeFromTalentPool: function(id) {
        const index = this.talentPool.findIndex(t => t.id === id);
        if (index > -1) {
            this.talentPool.splice(index, 1);
            return { success: true };
        }
        return { success: false, message: '未找到该人才' };
    }
};

function renderTalentView(container, currentUser) {
    container.innerHTML = `
        <div class="view talent-view active">
            <div class="flex items-center justify-between mb-4">
                <h2>人才库管理</h2>
                <div class="flex gap-2">
                    <select id="talent-filter" onchange="filterTalent()">
                        <option value="">全部人才</option>
                        <option value="web">Web开发</option>
                        <option value="java">Java开发</option>
                        <option value="ui">UI设计</option>
                        <option value="product">产品经理</option>
                    </select>
                    <input type="text" placeholder="搜索人才..." oninput="searchTalent()">
                </div>
            </div>

            <div class="talent-stats mb-4">
                <div class="card" style="padding: 15px;">
                    <div class="flex justify-between">
                        <div>
                            <strong>人才库统计</strong>
                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                                共 <span id="total-talents">0</span> 人 |
                                最近添加：<span id="recent-added">0</span> 人
                            </p>
                        </div>
                        <button class="btn btn-sm" onclick="exportTalent()">导出人才库</button>
                    </div>
                </div>
            </div>

            <div class="talent-list" id="talent-list-container">
                <!-- 动态渲染 -->
            </div>
        </div>
    `;

    loadTalentPool(currentUser);
}

async function loadTalentPool(user) {
    const container = document.getElementById('talent-list-container');
    const totalEl = document.getElementById('total-talents');
    const recentEl = document.getElementById('recent-added');
    if (!container) return;

    container.innerHTML = '<p>正在加载人才库...</p>';

    if (!user.companyId) {
        container.innerHTML = '<p>当前账号未关联公司，无法加载人才库。</p>';
        return;
    }

    try {
        // 1. 先拉取当前公司的人才库记录（仅有 talentId/resumeId/companyId/tag/putInTime 等）
        const talentList = await ApiService.getTalentPool();
        const list = Array.isArray(talentList) ? talentList : [];

        if (totalEl) totalEl.textContent = list.length;
        if (recentEl) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentCount = list.filter(t => t.putInTime && new Date(t.putInTime) >= thirtyDaysAgo).length;
            recentEl.textContent = recentCount;
        }

        if (!list.length) {
            container.innerHTML = '<p>人才库为空。</p>';
            return;
        }

        // 后端已返回富VO，直接使用列表渲染
        const enriched = list.map(tp => ({
            talentId: tp.talentId,
            resumeId: tp.resumeId,
            tag: tp.tag,
            putInTime: tp.putInTime,
            candidateName: tp.candidateName || '',
            position: tp.position || '',
            phone: tp.phone || '',
            email: tp.email || ''
        }));

        container.innerHTML = enriched.map(talent => `
            <div class="talent-card" data-talent-id="${talent.talentId}">
                <div class="talent-header">
                    <div>
                        <h3 class="talent-name">${talent.candidateName || ''}</h3>
                        <div style="font-size: 14px; color: #666; margin-top: 4px;">
                            ${talent.position || ''}
                        </div>
                    </div>
                </div>
                <div class="talent-info">
                    <div class="talent-info-item">
                        <span>📱</span>
                        <span>${talent.phone || ''}</span>
                    </div>
                    <div class="talent-info-item">
                        <span>📧</span>
                        <span>${talent.email || ''}</span>
                    </div>
                    <div class="talent-info-item">
                        <span>📅</span>
                        <span>${talent.putInTime || ''}</span>
                    </div>
                </div>
                <div class="talent-actions">
                    <button class="btn btn-sm" onclick="viewTalentDetail(${talent.talentId}, ${talent.resumeId})">查看详情</button>
                    <button class="btn btn-danger btn-sm" onclick="removeTalent(${talent.talentId})">移除</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('加载人才库失败:', e);
        container.innerHTML = '<p>加载失败，请稍后重试</p>';
    }
}

// 其他函数保持原样（inviteTalent等）
async function viewTalentDetail(talentId, resumeId) {
    if (!talentId) {
        alert('找不到该人才信息');
        return;
    }

    try {
        const talent = await ApiService.getTalentById(talentId);
        let resume = null;
        if (resumeId) {
            try {
                resume = await ApiService.request(`/resume/${encodeURIComponent(resumeId)}`);
            } catch (e) {
                console.error('加载简历详情失败:', e);
            }
        }

        if (!talent && !resume) {
            alert('找不到该人才信息');
            return;
        }

        const name = (resume && resume.realName) || (talent && talent.candidateName) || '';
        const position = (resume && resume.jobIntention) || (talent && talent.position) || '';

        const modalHTML = `
        <div class="talent-modal" id="talent-detail-modal">
            <div class="talent-modal-content">
                <div class="talent-modal-header">
                    <h3 class="talent-modal-title">人才详情</h3>
                    <button class="close-modal" onclick="closeTalentModal()">×</button>
                </div>

                <div class="talent-detail">
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">${name} - ${position}</h4>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button class="btn" onclick="closeTalentModal()">关闭</button>
                </div>
            </div>
        </div>
    `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('talent-detail-modal').style.display = 'flex';
    } catch (e) {
        console.error('加载人才详情失败:', e);
    }
}

async function inviteTalent(talentId) {
    if (!talentId) return;

    const jobTitle = prompt('请输入要邀请的职位名称：', '前端开发工程师');
    if (!jobTitle) return;

    const interviewTime = prompt('请输入面试时间或安排说明：', '2024-01-25 14:00 在公司现场面试');
    if (!interviewTime) return;

    const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
    if (!currentUser || !currentUser.userId) {
        alert('未登录或用户信息缺失，无法安排面试');
        return;
    }

    try {
        const talent = await ApiService.getTalentById(talentId);
        if (!talent) {
            alert('无法获取人才信息，邀约失败');
            return;
        }

        const intro = `职位：${jobTitle}\n安排：${interviewTime}`;
        const payload = {
            deliveryId: null,
            interviewerId: currentUser.userId,
            interviewIntro: intro,
            intervieweeName: talent.candidateName || ''
        };

        await ApiService.request('/interview', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        alert('已向该人才发送面试邀约');
        closeTalentModal();
    } catch (e) {
        console.error('邀请面试失败:', e);
    }
}

// 调整 removeTalent 调用后台删除 API
async function removeTalent(talentId) {
    if (!talentId) return;
    if (!confirm('确定要从人才库中移除该人才吗？')) return;
    try {
        await ApiService.removeTalent(talentId);
        alert('人才已从人才库移除');
        loadTalentPool(Auth.getCurrentUser());
    } catch (e) {
        console.error('移除人才失败:', e);
    }
}

function filterTalent() {
    const filterValue = document.getElementById('talent-filter').value;
    alert(`筛选人才：${filterValue || '全部'}（模拟操作）`);
}

function searchTalent() {
    const searchTerm = document.querySelector('input[placeholder*="搜索人才"]').value;
    if (searchTerm) {
        alert(`搜索人才：${searchTerm}（模拟操作）`);
    }
}

function exportTalent() {
    const user = Auth.getCurrentUser && Auth.getCurrentUser();
    if (!user || !user.companyId) {
        alert('当前账号未关联公司，无法导出人才库');
        return;
    }

    ApiService.getTalentPool()
        .then(list => {
            if (!list || !list.length) {
                alert('人才库为空，无需导出');
                return;
            }

            const headers = ['人才ID', '姓名', '职位', '电话', '邮箱', '来源', '来源职位', '备注', '加入时间'];
            const rows = list.map(t => [
                t.talentId || '',
                t.candidateName || '',
                t.position || '',
                t.phone || '',
                t.email || '',
                t.source || '',
                t.sourceJob || '',
                (t.note || '').replace(/\n/g, ' '),
                t.addedDate || ''
            ]);

            const csvContent = [headers, ...rows]
                .map(row => row.map(field => {
                    const value = String(field).replace(/"/g, '""');
                    return `"${value}"`;
                }).join(','))
                .join('\r\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const today = new Date().toISOString().slice(0, 10);
            a.download = `talent_pool_${user.companyId}_${today}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(e => {
            console.error('导出人才库失败:', e);
        });
}

function closeTalentModal() {
    const modal = document.getElementById('talent-detail-modal');
    if (modal) {
        modal.remove();
    }
}