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
        // 这里应该调用获取人才库的API
        // const resp = await fetch(`${TALENT_API_BASE}?recruiterId=${currentUser.userId}`);

        // 模拟数据
        const talents = [
            {
                id: 1,
                name: '张三',
                position: '前端开发工程师',
                experience: '3年',
                education: '本科',
                phone: '138****5678',
                email: 'zhangsan@email.com',
                source: '主动申请',
                skills: ['Vue', 'React', 'JavaScript'],
                note: '技术扎实，沟通能力好',
                createTime: '2024-01-15'
            },
            {
                id: 2,
                name: '李四',
                position: 'Java开发工程师',
                experience: '5年',
                education: '硕士',
                phone: '139****1234',
                email: 'lisi@email.com',
                source: '内推',
                skills: ['Java', 'Spring', 'MySQL'],
                note: '架构经验丰富',
                createTime: '2024-01-10'
            }
        ];

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
                        <h3 class="talent-name">${talent.name}</h3>
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
                    ${(talent.skills || []).slice(0, 5).map(skill =>
                        `<span class="talent-tag">${skill}</span>`
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
        talentList.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p>加载人才数据失败</p></div>`;
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
    // 这里可以打开模态框显示详细信息
    alert(`查看人才 ${talentId} 详情（后续实现）`);
}

function inviteTalent(talentId) {
    const jobTitle = prompt('请输入要邀请的职位：', '前端开发工程师');
    if (jobTitle) {
        alert(`已向人才 ${talentId} 发送 ${jobTitle} 的面试邀请（模拟操作）`);
    }
}

function editTalent(talentId) {
    const newNote = prompt('请输入新的备注信息：');
    if (newNote) {
        alert(`人才 ${talentId} 的备注已更新（模拟操作）`);
        loadTalentPool(); // 刷新列表
    }
}

function removeTalent(talentId) {
    if (confirm('确定要从人才库移除该人才吗？此操作不可恢复。')) {
        alert(`人才 ${talentId} 已从人才库移除（模拟操作）`);
        loadTalentPool(); // 刷新列表
    }
}

function addNewTalent() {
    const name = prompt('请输入人才姓名：');
    if (!name) return;
    const position = prompt('请输入职位：');
    if (!position) return;
    const phone = prompt('请输入手机号：');
    const email = prompt('请输入邮箱：');

    alert(`人才 "${name}" 已成功添加到人才库（模拟操作）`);
    loadTalentPool(); // 刷新列表
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
