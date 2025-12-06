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
        const resp = await fetch(`${TALENT_API_BASE}/company/${user.companyId}`);
        if (!resp.ok) {
            const text = await resp.text();
            container.innerHTML = `<p>网络错误: ${resp.status} ${text}</p>`;
            return;
        }
        const json = await resp.json();
        if (!json || json.code !== 200) {
            container.innerHTML = `<p>${(json && json.message) || '加载失败'}</p>`;
            return;
        }
        const list = json.data || [];

        if (totalEl) totalEl.textContent = list.length;
        if (recentEl) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentCount = list.filter(t => t.addedDate && new Date(t.addedDate) >= thirtyDaysAgo).length;
            recentEl.textContent = recentCount;
        }

        if (!list.length) {
            container.innerHTML = '<p>人才库为空。</p>';
            return;
        }

        container.innerHTML = list.map(talent => `
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
                        <span>${talent.addedDate || ''}</span>
                    </div>
                </div>
                <div class="talent-actions">
                    <button class="btn btn-sm" onclick="viewTalentDetail(${talent.talentId})">查看详情</button>
                    <button class="btn btn-danger btn-sm" onclick="removeTalent(${talent.talentId})">移除</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('加载人才库失败:', e);
        container.innerHTML = '<p>加载失败，请稍后重试</p>';
    }
}

// 其他函数保持原样（viewTalentDetail, inviteTalent等）
function viewTalentDetail(talentId) {
    const talent = MockData.talentPool.find(t => t.id === talentId);
    if (!talent) {
        alert('找不到该人才信息');
        return;
    }

    const modalHTML = `
        <div class="talent-modal" id="talent-detail-modal">
            <div class="talent-modal-content">
                <div class="talent-modal-header">
                    <h3 class="talent-modal-title">人才详情</h3>
                    <button class="close-modal" onclick="closeTalentModal()">×</button>
                </div>

                <div class="talent-detail">
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">${talent.name} - ${talent.position}</h4>
                        <div style="color: #666; font-size: 14px;">
                            ${talent.experience}经验 · ${talent.education}
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <strong>联系方式</strong>
                            <p>📱 ${talent.phone}</p>
                            <p>📧 ${talent.email}</p>
                        </div>
                        <div>
                            <strong>人才来源</strong>
                            <p>来源：${talent.source}</p>
                            <p>添加时间：${talent.addedDate}</p>
                            ${talent.sourceJob ? `<p>来源职位：${talent.sourceJob}</p>` : ''}
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <strong>技能标签</strong>
                        <div class="talent-tags" style="margin-top: 10px;">
                            ${talent.skills.map(skill => `<span class="talent-tag">${skill}</span>`).join('')}
                        </div>
                    </div>

                    ${talent.note ? `
                    <div style="margin-bottom: 20px;">
                        <strong>备注</strong>
                        <p style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                            ${talent.note}
                        </p>
                    </div>
                    ` : ''}
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button class="btn" onclick="closeTalentModal()">关闭</button>
                    <button class="btn btn-primary" onclick="inviteTalent(${talent.id})">邀请面试</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('talent-detail-modal').style.display = 'flex';
}

function inviteTalent(talentId) {
    const jobTitle = prompt('请输入要邀请的职位名称：', '前端开发工程师');
    if (!jobTitle) return;

    const interviewTime = prompt('请输入建议的面试时间（YYYY-MM-DD HH:MM）：', '2024-01-25 14:00');
    if (!interviewTime) return;

    alert(`已向人才发送面试邀请\n职位：${jobTitle}\n时间：${interviewTime}\n（模拟操作）`);
    closeTalentModal();
}

// 调整 removeTalent 调用后台删除 API
async function removeTalent(talentId) {
    if (!confirm('确定要从人才库中移除该人才吗？')) return;
    try {
        const resp = await fetch(`${TALENT_API_BASE}/${talentId}`, { method: 'DELETE' });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const json = await resp.json();
        if (!json || json.code !== 200) {
            alert((json && json.message) || '移除失败');
            return;
        }
        alert('人才已从人才库移除');
        loadTalentPool(Auth.getCurrentUser());
    } catch (e) {
        console.error('移除人才失败:', e);
        alert('移除失败，请稍后重试');
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
    alert('正在导出人才库数据...（模拟操作）');
    setTimeout(() => {
        alert('人才库数据已导出为 talent_pool_export.csv');
    }, 1000);
}

function closeTalentModal() {
    const modal = document.getElementById('talent-detail-modal');
    if (modal) {
        modal.remove();
    }
}