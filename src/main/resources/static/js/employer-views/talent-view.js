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
                    <input type="text" id="talent-search" placeholder="按姓名搜索人才..." oninput="searchTalentByName()">
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
        const result = await ApiService.getTalentPool();
        if (!result.success) {
            throw new Error(result.message || '获取人才库失败');
        }
        const list = Array.isArray(result.data) ? result.data : [];

        if (totalEl) totalEl.textContent = list.length;
        if (recentEl) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentCount = list.filter(t => {
                if (!t.putInTime) return false;
                try {
                    const putInTime = new Date(t.putInTime);
                    return putInTime >= thirtyDaysAgo;
                } catch (e) {
                    return false;
                }
            }).length;
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
                            ${talent.tag || ''}
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

async function viewTalentDetail(talentId, resumeId) {
    if (!talentId) {
        alert('找不到该人才信息');
        return;
    }

    try {
        const talentResult = await ApiService.getTalentById(talentId);
        if (!talentResult.success) {
            alert(talentResult.message || '获取人才信息失败');
            return;
        }
        
        let resumeResult = null;
        if (resumeId) {
            try {
                resumeResult = await ApiService.request(`/resume/${encodeURIComponent(resumeId)}`);
            } catch (e) {
                console.error('加载简历详情失败:', e);
            }
        }

        const talent = talentResult.data;
        const resume = resumeResult && resumeResult.success ? resumeResult.data : null;

        if (!talent && !resume) {
            alert('找不到该人才信息');
            return;
        }

        const name = (resume && resume.name) || (talent && talent.candidateName) || '';
        const tag = (talent && talent.tag) || '';
        const phone = (resume && resume.phone) || '';
        const email = (resume && resume.email) || '';

        // 构建简历详细信息HTML
        let resumeDetails = '';
        if (resume) {
            resumeDetails = `
                <div class="resume-details">
                    <h4>简历信息</h4>
                    <div class="detail-item">
                        <label>姓名:</label>
                        <span>${resume.name || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>性别:</label>
                        <span>${resume.gender === 1 ? '男' : resume.gender === 2 ? '女' : ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>年龄:</label>
                        <span>${resume.age || ''}</span>
                    </div>

                    <div class="detail-item">
                        <label>求职意向:</label>
                        <span>${resume.jobIntention || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>工作经验:</label>
                        <span>${mapWorkExperienceText(resume.workExperience) || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>教育背景:</label>
                        <span>${mapEducationText(resume.education) || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>专业技能:</label>
                        <span>${resume.skill || ''}</span>
                    </div>
                </div>
            `;
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
                        <h4 style="margin-bottom: 10px;">${name}</h4>
                        <div class="detail-item">
                            <label>标签:</label>
                            <span>${tag}</span>
                        </div>
                        <div class="detail-item">
                            <label>电话:</label>
                            <span>${phone}</span>
                        </div>
                        <div class="detail-item">
                            <label>邮箱:</label>
                            <span>${email}</span>
                        </div>
                    </div>
                    
                    ${resumeDetails}
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
        // 避免重复提示，只显示一次错误信息
        if (!(e.message && (e.message.includes('404') || e.message.includes('NOT_FOUND')))) {
            alert('移除人才失败，请稍后重试');
        }
    }
}

// 模糊搜索功能
function searchTalentByName() {
    const searchTerm = document.getElementById('talent-search').value.toLowerCase().trim();
    const talentCards = document.querySelectorAll('.talent-card');
    
    talentCards.forEach(card => {
        const nameElement = card.querySelector('.talent-name');
        const name = nameElement ? nameElement.textContent.toLowerCase() : '';
        
        if (!searchTerm || name.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// 导出人才库功能
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

            // 根据后端实际传递的字段更新导出功能
            const headers = ['人才ID', '姓名', '标签', '电话', '邮箱', '入库时间'];
            const rows = list.map(t => [
                t.talentId || '',
                t.candidateName || '',
                t.tag || '',
                t.phone || '',
                t.email || '',
                t.putInTime || ''
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

function mapWorkExperienceText(expValue) {
    if (expValue === 0 || expValue === '0') {
        return '应届生';
    }
    
    const numValue = parseInt(expValue);
    if (isNaN(numValue) || numValue < 0) {
        return expValue;
    }
    
    return numValue + '年';
}

function mapEducationText(eduValue) {
    switch (parseInt(eduValue)) {
        case 0: return '无';
        case 1: return '高中';
        case 2: return '大专';
        case 3: return '本科';
        case 4: return '硕士';
        case 5: return '博士';
        default: return eduValue;
    }
}
