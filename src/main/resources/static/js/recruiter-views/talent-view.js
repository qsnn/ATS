function renderTalentView(container, currentUser) {
    container.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h2>企业人才库</h2>
            <div class="flex gap-2">
                <select id="talent-filter" onchange="filterTalent()">
                    <option value="">全部人才</option>
                    <option value="web">Web开发</option>
                    <option value="java">Java开发</option>
                    <option value="ui">UI设计</option>
                </select>
                <input type="text" placeholder="搜索人才..." oninput="searchTalent()">
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
                            活跃人才：<span id="active-talents">0</span> 人 |
                            最近被邀请：<span id="recent-invited">0</span> 人
                        </p>
                    </div>
                    <button class="btn btn-sm" onclick="exportTalentData()">导出数据</button>
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

    loadTalentPool();
}

async function loadTalentPool() {
    const talentList = document.getElementById('recruiter-talent-list');
    if (!talentList) return;

    talentList.innerHTML = `<div class="empty-state"><div class="icon">🔄</div><p>正在加载人才数据...</p></div>`;

    try {
        // 从API获取人才库数据
        const talents = await ApiService.getTalentPool();

        if (!talents || talents.length === 0) {
            talentList.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📚</div>
                    <p>人才库为空</p>
                    <p style="font-size: 12px; margin-top: 8px;">点击"添加人才"按钮开始建立人才库</p>
                </div>
            `;
            updateTalentStats([]);
            return;
        }

        updateTalentStats(talents);

        talentList.innerHTML = talents.map(talent => `
            <div class="talent-card">
                <div class="talent-header">
                    <div>
                        <h3 class="talent-name">${talent.name || '未命名'}</h3>
                        <div style="font-size: 14px; color: #666; margin-top: 4px;">
                            ${talent.position || '未填写职位'} · ${talent.experience || '经验不详'} · ${talent.education || '学历不详'}
                        </div>
                    </div>
                    <span class="talent-source">${talent.source || '未知'}</span>
                </div>

                <div class="talent-info">
                    <div class="talent-info-item">
                        <span>📱</span>
                        <span>${talent.phone || '未提供'}</span>
                    </div>
                    <div class="talent-info-item">
                        <span>📧</span>
                        <span>${talent.email || '未提供'}</span>
                    </div>
                    <div class="talent-info-item">
                        <span>📅</span>
                        <span>添加：${talent.createTime ? new Date(talent.createTime).toLocaleDateString() : '未知'}</span>
                    </div>
                </div>

                <div class="talent-tags">
                    ${(talent.skills || '').split(',').filter(s => s.trim()).slice(0, 5).map(skill =>
                        `<span class="talent-tag">${skill.trim()}</span>`
                    ).join('')}
                </div>

                ${talent.note ? `
                <div class="talent-note">
                    <strong>备注：</strong>
                    ${talent.note}
                </div>
                ` : ''}

                <div class="talent-actions">
                    <button class="btn btn-sm" onclick="viewTalentDetail(${talent.id})">查看</button>
                    <button class="btn btn-primary btn-sm" onclick="inviteTalent(${talent.id})">邀请面试</button>
                    <button class="btn btn-sm" onclick="editTalent(${talent.id})">编辑</button>
                    <button class="btn btn-danger btn-sm" onclick="removeTalent(${talent.id})">移除</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('加载人才数据失败:', error);
        talentList.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p>加载人才数据失败: ${error.message}</p></div>`;
    }
}

function updateTalentStats(talents = []) {
    const activeTalents = talents.filter(t => t.status === 'active').length;
    document.getElementById('total-talents').textContent = talents.length;
    document.getElementById('active-talents').textContent = activeTalents || talents.length;
    document.getElementById('recent-invited').textContent = Math.floor(talents.length * 0.3);
}

// 人才管理相关函数
function viewTalentDetail(talentId) {
    alert(`查看人才 ${talentId} 详情（后续实现）`);
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
            await ApiService.removeTalent(talentId);
            alert('人才移除成功！');
            loadTalentPool(); // 刷新列表
        } catch (error) {
            console.error('移除人才失败:', error);
            // 避免重复提示，只显示一次错误信息
            if (!(error.message && (error.message.includes('NOT_FOUND') || error.message.includes('404')))) {
                alert('移除人才失败: ' + error.message);
            }
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

function filterTalent() {
    const v = document.getElementById('talent-filter').value;
    alert('筛选人才：' + (v || '全部') + '（模拟操作）');
}

function searchTalent() {
    const kw = document.querySelector('input[placeholder*="搜索人才"]').value;
    if (kw) {
        alert('搜索人才：' + kw + '（模拟操作）');
    }
}

function exportTalentData() {
    alert('正在导出人才数据...（模拟操作）');
    setTimeout(() => {
        alert('人才数据已导出为 talent_pool.csv（模拟）');
    }, 1000);
}

function closeTalentModal() {
    const modal = document.getElementById('add-talent-modal');
    if (modal) {
        modal.remove();
    }
}
