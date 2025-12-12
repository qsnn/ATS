function renderTalentView(container, currentUser) {
    container.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h2>企业人才库</h2>
            <div class="flex gap-2">
                <input type="text" id="talent-search" placeholder="按姓名搜索人才..." oninput="searchTalentByName()">
                <button class="btn btn-primary" onclick="addNewTalent()">+ 添加人才</button>
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

        <div class="talent-list" id="recruiter-talent-list">
            <div class="empty-state">
                <div class="icon">📚</div>
                <p>正在加载人才库...</p>
            </div>
        </div>
    `;

    loadTalentPool(currentUser);
}

async function loadTalentPool(user) {
    const container = document.getElementById('recruiter-talent-list');
    const totalEl = document.getElementById('total-talents');
    const recentEl = document.getElementById('recent-added');
    if (!container) return;

    container.innerHTML = '<p>正在加载人才库...</p>';

    if (!user.companyId) {
        container.innerHTML = '<p>当前账号未关联公司，无法加载人才库。</p>';
        return;
    }

    try {
        // 使用 ApiService.request 替代 ApiService.getTalentPool 以确保携带 JWT 令牌并处理统一返回格式
        const result = await ApiService.request(`/talent/company/${encodeURIComponent(user.companyId)}`);
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

function updateTalentStats(talents = []) {
    document.getElementById('total-talents').textContent = talents.length;
    document.getElementById('recent-added').textContent = Math.floor(talents.length * 0.3);
}

// 人才管理相关函数
async function viewTalentDetail(talentId, resumeId) {
    if (!talentId) {
        alert('找不到该人才信息');
        return;
    }

    try {
        const talentResult = await ApiService.request(`/talent/${encodeURIComponent(talentId)}`);
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
                        <label>邮箱:</label>
                        <span>${resume.email || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>电话:</label>
                        <span>${resume.phone || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>地址:</label>
                        <span>${resume.address || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>教育背景:</label>
                        <span>${resume.education || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>工作经验:</label>
                        <span>${resume.experience || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>技能:</label>
                        <span>${resume.skills || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>备注:</label>
                        <span>${resume.note || ''}</span>
                    </div>
                </div>
            `;
        }

        const modalHtml = `
            <div id="talent-detail-modal" class="talent-modal" style="display: block;">
                <div class="talent-modal-content">
                    <div class="talent-modal-header">
                        <h3 class="talent-modal-title">人才详情</h3>
                        <button class="close-modal" onclick="closeTalentModal()">&times;</button>
                    </div>
                    <div class="talent-modal-body">
                        <div class="talent-info">
                            <div class="talent-info-item">
                                <span>姓名:</span>
                                <span>${name}</span>
                            </div>
                            <div class="talent-info-item">
                                <span>标签:</span>
                                <span>${tag}</span>
                            </div>
                            <div class="talent-info-item">
                                <span>电话:</span>
                                <span>${phone}</span>
                            </div>
                            <div class="talent-info-item">
                                <span>邮箱:</span>
                                <span>${email}</span>
                            </div>
                        </div>
                        ${resumeDetails}
                    </div>
                </div>
            </div>
        `;
        
        // 添加模态框到页面
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    } catch (e) {
        console.error('查看人才详情失败:', e);
        alert('查看人才详情失败，请稍后重试');
    }
}

function inviteTalent(talentId) {
    const jobTitle = prompt('请输入要邀请的职位：', '前端开发工程师');
    if (jobTitle) {
        alert(`已向人才 ${talentId} 发送 ${jobTitle} 的面试邀请（模拟操作）`);
    }
}

function editTalent(talentId) {
    alert(`编辑人才 ${talentId}（后续实现）`);
}

async function removeTalent(talentId) {
    if (confirm('确定要从人才库移除该人才吗？此操作不可恢复。')) {
        try {
            const result = await ApiService.request(`/talent/${encodeURIComponent(talentId)}`, {
                method: 'DELETE'
            });
            
            if (!result.success) {
                alert(result.message || '移除人才失败');
                return;
            }
            
            alert('人才移除成功！');
            // 重新加载人才库
            const currentUser = Auth.getCurrentUser();
            if (currentUser) {
                loadTalentPool(currentUser);
            }
        } catch (error) {
            console.error('移除人才失败:', error);
            alert('移除人才失败，请稍后重试');
        }
    }
}

function addNewTalent() {
    // 创建一个简单的模态框来收集人才信息
    const modalHtml = `
        <div id="add-talent-modal" class="talent-modal" style="display: block;">
            <div class="talent-modal-content">
                <div class="talent-modal-header">
                    <h3 class="talent-modal-title">添加新人才</h3>
                    <button class="close-modal" onclick="closeTalentModal()">&times;</button>
                </div>
                <form id="add-talent-form">
                    <div style="margin-bottom: 15px;">
                        <label>姓名 *</label>
                        <input type="text" id="talent-name" required placeholder="请输入姓名">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>职位</label>
                        <input type="text" id="talent-position" placeholder="请输入职位">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>工作经验</label>
                        <input type="text" id="talent-experience" placeholder="如：3年">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>学历</label>
                        <input type="text" id="talent-education" placeholder="如：本科">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>电话</label>
                        <input type="tel" id="talent-phone" placeholder="请输入电话号码">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>邮箱</label>
                        <input type="email" id="talent-email" placeholder="请输入邮箱地址">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>技能（逗号分隔）</label>
                        <input type="text" id="talent-skills" placeholder="如：Java,Spring,MySQL">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>备注</label>
                        <textarea id="talent-note" placeholder="请输入备注信息"></textarea>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>来源</label>
                        <select id="talent-source">
                            <option value="主动申请">主动申请</option>
                            <option value="内推">内推</option>
                            <option value="招聘网站">招聘网站</option>
                            <option value="猎头推荐">猎头推荐</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" class="btn" onclick="closeTalentModal()">取消</button>
                        <button type="submit" class="btn btn-primary">添加人才</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // 添加模态框到页面
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 绑定表单提交事件
    document.getElementById('add-talent-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const talentData = {
            name: document.getElementById('talent-name').value,
            position: document.getElementById('talent-position').value,
            experience: document.getElementById('talent-experience').value,
            education: document.getElementById('talent-education').value,
            phone: document.getElementById('talent-phone').value,
            email: document.getElementById('talent-email').value,
            skills: document.getElementById('talent-skills').value,
            note: document.getElementById('talent-note').value,
            source: document.getElementById('talent-source').value
        };
        
        try {
            await ApiService.addTalent(talentData);
            alert('人才添加成功！');
            closeTalentModal();
            loadTalentPool(); // 刷新列表
        } catch (error) {
            console.error('添加人才失败:', error);
            // 避免重复提示，只显示一次错误信息
            if (!(error.message && (error.message.includes('ALREADY_EXISTS') || error.message.includes('DUPLICATE')))) {
                alert('添加人才失败: ' + error.message);
            }
        }
    });
}

function searchTalentByName() {
    const searchTerm = document.getElementById('talent-search').value.toLowerCase();
    // 在实际应用中，这里应该重新调用API进行搜索
    alert(`搜索功能占位符：搜索 "${searchTerm}"`);
}

function exportTalent() {
    alert('导出人才库功能占位符');
}

function closeTalentModal() {
    const modal = document.getElementById('add-talent-modal');
    if (modal) {
        modal.remove();
    }
}
