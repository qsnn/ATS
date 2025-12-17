function renderResumesView(container, currentUser) {
    container.innerHTML = `
        <div class="view resumes-view active">
            <h2>我的简历</h2>
            <button class="btn btn-primary" id="create-resume-btn">创建新简历</button>
            <div class="list-container" style="margin-top: 1rem;">
                <div id="resume-list">正在加载简历列表...</div>
                <div class="pagination" id="resume-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                    <button class="btn pagination-btn" id="resume-prev-page">上一页</button>
                    <span class="pagination-info" id="resume-pagination-info"></span>
                    <button class="btn pagination-btn" id="resume-next-page">下一页</button>
                </div>
            </div>

            <!-- 简历编辑弹窗 -->
            <div id="resume-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:9999;">
                <div style="background:#fff; width:600px; max-height:90vh; overflow:auto; margin:40px auto; padding:20px; border-radius:6px; position:relative;">
                    <h3 id="resume-modal-title">新建简历</h3>
                    <button id="resume-modal-close" style="position:absolute; right:16px; top:10px; border:none; background:none; font-size:18px; cursor:pointer;">×</button>
                    
                    <form id="resume-form">
                        <input type="hidden" id="resume-id">
                        
                        <div class="form-group">
                            <label>简历标题 *</label>
                            <input type="text" id="resume-title" class="form-control" placeholder="请输入简历标题">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>姓名 *</label>
                                <input type="text" id="resume-name" class="form-control" placeholder="请输入姓名">
                            </div>
                            
                            <div class="form-group">
                                <label>性别</label>
                                <select id="resume-gender" class="form-control">
                                    <option value="">请选择</option>
                                    <option value="1">男</option>
                                    <option value="2">女</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>年龄</label>
                                <input type="number" id="resume-age" class="form-control" placeholder="请输入年龄">
                            </div>
                            
                            <div class="form-group">
                                <label>学历</label>
                                <select id="resume-education" class="form-control">
                                    <option value="">请选择学历</option>
                                    <option value="0">无</option>
                                    <option value="1">高中</option>
                                    <option value="2">大专</option>
                                    <option value="3">本科</option>
                                    <option value="4">硕士</option>
                                    <option value="5">博士</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>电话 *</label>
                                <input type="tel" id="resume-phone" class="form-control" placeholder="请输入电话">
                            </div>
                            
                            <div class="form-group">
                                <label>邮箱 *</label>
                                <input type="email" id="resume-email" class="form-control" placeholder="请输入邮箱">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>工作经验(年)</label>
                                <input type="number" id="resume-workExp" class="form-control" placeholder="请输入工作经验年数">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>技能</label>
                            <textarea id="resume-skills" class="form-control" rows="3" placeholder="请输入技能，多个技能请用逗号分隔"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>求职意向</label>
                            <input type="text" id="resume-job-intention" class="form-control" placeholder="请输入求职意向">
                        </div>
                        
                        <div style="margin-top:16px; text-align:right;">
                            <button type="button" class="btn" id="resume-cancel-btn">取消</button>
                            <button type="button" class="btn btn-primary" id="resume-save-btn" style="margin-left:8px;">保存</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.getElementById('create-resume-btn').addEventListener('click', () => {
        createNewResume(currentUser);
    });

    const modal = document.getElementById('resume-modal');
    const closeBtn = document.getElementById('resume-modal-close');
    const cancelBtn = document.getElementById('resume-cancel-btn');
    const saveBtn = document.getElementById('resume-save-btn');

    const hideModal = () => { modal.style.display = 'none'; };
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) hideModal();
    });

    // 修复：为保存按钮添加事件监听器
    saveBtn.addEventListener('click', async e => {
        e.preventDefault();
        const mode = modal.dataset.mode; // 'create' or 'update'
        const resumeId = document.getElementById('resume-id').value || null;
        await saveResume(currentUser, mode, resumeId);
    });

    // 初始化分页状态
    window.resumePagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    initUserResumes(currentUser);
}

/**
 * 初始化/刷新当前用户简历列表
 */
async function initUserResumes(user) {
    const listContainer = document.getElementById('resume-list');
    const paginationContainer = document.getElementById('resume-pagination');
    const paginationInfo = document.getElementById('resume-pagination-info');
    const prevBtn = document.getElementById('resume-prev-page');
    const nextBtn = document.getElementById('resume-next-page');

    if (!listContainer || !user) return;

    listContainer.textContent = '正在加载简历列表...';

    const result = await fetchUserResumesApi(user.userId);
    if (!result.success) {
        listContainer.textContent = result.message || '加载失败';
        return;
    }

    const resumes = result.data;
    if (!resumes || resumes.length === 0) {
        listContainer.textContent = '暂无简历，请点击上方「创建新简历」。';
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        return;
    }

    // 显示总数信息
    const totalCountEl = document.getElementById('resume-list-total-count');
    if (totalCountEl) {
        totalCountEl.textContent = `共 ${resumes.length} 份简历`;
    } else {
        // 如果找不到专门的计数元素，就在列表上方显示
        const countInfo = document.createElement('div');
        countInfo.id = 'resume-list-total-count';
        countInfo.textContent = `共 ${resumes.length} 份简历`;
        countInfo.style.marginBottom = '10px';
        countInfo.style.color = '#666';
        listContainer.parentNode.insertBefore(countInfo, listContainer);
    }

    // 更新分页信息
    if (paginationInfo) {
        paginationInfo.textContent = `第 ${window.resumePagination.current} 页，共 ${Math.ceil(resumes.length / window.resumePagination.size)} 页`;
    }

    if (paginationContainer) {
        paginationContainer.style.display = 'flex';
    }

    if (prevBtn) {
        prevBtn.disabled = window.resumePagination.current <= 1;
        prevBtn.onclick = () => {
            if (window.resumePagination.current > 1) {
                window.resumePagination.current--;
                initUserResumes(user);
            }
        };
    }

    if (nextBtn) {
        const totalPages = Math.ceil(resumes.length / window.resumePagination.size);
        nextBtn.disabled = window.resumePagination.current >= totalPages;
        nextBtn.onclick = () => {
            if (window.resumePagination.current < totalPages) {
                window.resumePagination.current++;
                initUserResumes(user);
            }
        };
    }

    // 分页处理
    const startIndex = (window.resumePagination.current - 1) * window.resumePagination.size;
    const endIndex = startIndex + window.resumePagination.size;
    const paginatedResumes = resumes.slice(startIndex, endIndex);

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';

    paginatedResumes.forEach(resume => {
        const li = document.createElement('li');
        li.style.border = '1px solid #ddd';
        li.style.padding = '8px 12px';
        li.style.marginBottom = '8px';
        li.style.borderRadius = '4px';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';

        const left = document.createElement('div');
        // 使用后端字段 resumeName
        const title = document.createElement('div');
        title.textContent = resume.resumeName || '未命名简历';

        // 创建时间使用 createTime
        const meta = document.createElement('div');
        meta.style.fontSize = '12px';
        meta.style.color = '#666';
        const createTime = resume.createTime || '';
        meta.textContent = createTime ? `创建时间：${createTime}` : '';

        left.appendChild(title);
        left.appendChild(meta);

        const actions = document.createElement('div');

        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-sm';
        viewBtn.textContent = '查看';
        viewBtn.onclick = () => viewResumeDetail(resume);

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm';
        editBtn.style.marginLeft = '8px';
        editBtn.textContent = '编辑';
        editBtn.onclick = () => editResume(resume);

        const smartRecommendBtn = document.createElement('button');
        smartRecommendBtn.className = 'btn btn-sm';
        smartRecommendBtn.style.marginLeft = '8px';
        smartRecommendBtn.textContent = '智能推荐';
        smartRecommendBtn.onclick = () => smartRecommend(resume);

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm';
        delBtn.style.marginLeft = '8px';
        delBtn.textContent = '删除';
        delBtn.onclick = () => deleteResume(resume.resumeId, user);

        actions.appendChild(viewBtn);
        actions.appendChild(editBtn);
        actions.appendChild(smartRecommendBtn);
        actions.appendChild(delBtn);

        li.appendChild(left);
        li.appendChild(actions);

        ul.appendChild(li);
    });

    listContainer.innerHTML = '';
    listContainer.appendChild(ul);
}

/** 打开新建简历弹窗 */
function createNewResume(currentUser) {
    const modal = document.getElementById('resume-modal');
    modal.dataset.mode = 'create';
    document.getElementById('resume-modal-title').textContent = '新建简历';
    document.getElementById('resume-id').value = '';
    document.getElementById('resume-title').value = '';
    document.getElementById('resume-name').value = currentUser.username || '';
    document.getElementById('resume-gender').value = '';
    document.getElementById('resume-age').value = '';
    document.getElementById('resume-phone').value = '';
    document.getElementById('resume-email').value = '';
    document.getElementById('resume-education').value = '';
    document.getElementById('resume-workExp').value = '';
    document.getElementById('resume-skills').value = '';
    document.getElementById('resume-job-intention').value = '';
    modal.style.display = 'block';
}

/** 打开编辑简历弹窗 */
function editResume(resume) {
    const modal = document.getElementById('resume-modal');
    modal.dataset.mode = 'update';
    document.getElementById('resume-modal-title').textContent = '编辑简历';
    document.getElementById('resume-id').value = resume.resumeId || '';
    document.getElementById('resume-title').value = resume.resumeName || '';
    document.getElementById('resume-name').value = resume.name || '';
    document.getElementById('resume-gender').value = resume.gender || '';
    document.getElementById('resume-age').value = resume.age || '';
    document.getElementById('resume-phone').value = resume.phone || '';
    document.getElementById('resume-email').value = resume.email || '';
    document.getElementById('resume-education').value = resume.education || '';
    document.getElementById('resume-workExp').value = resume.workExperience || '';
    document.getElementById('resume-skills').value = resume.skill || '';
    document.getElementById('resume-job-intention').value = resume.jobIntention || '';
    modal.style.display = 'block';
}

/**
 * 智能推荐函数
 * 根据简历信息跳转到职位搜索页面，并自动设置搜索条件
 */
function smartRecommend(resume) {
    // 获取简历中的教育和工作经验信息
    const education = resume.education || '';
    const workExperience = resume.workExperience || '';
    
    // 处理简历名称，去除"简历"二字
    let resumeName = resume.resumeName || '';
    if (resumeName.endsWith('简历')) {
        resumeName = resumeName.substring(0, resumeName.length - 2);
    }
    
    // 构造跳转URL，包含搜索参数
    const searchParams = new URLSearchParams();
    
    // 设置搜索关键词
    if (resumeName) {
        searchParams.set('jobName', resumeName);
    }
    
    // 设置教育水平筛选
    if (education) {
        searchParams.set('education', education);
    }
    
    // 设置工作经验筛选
    if (workExperience) {
        searchParams.set('workExperience', workExperience);
    }
    
    // 跳转到职位搜索页面
    const searchUrl = `job-seeker-dashboard.html?tab=job-search&${searchParams.toString()}`;
    window.location.href = searchUrl;
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

/** 查看简历详情（简单弹窗，后续可跳转详情页） */
function viewResumeDetail(resume) {
    const msg = `
标题：${resume.resumeName || ''}
姓名：${resume.name || ''}  
性别：${resume.gender == 1 ? '男' : resume.gender == 2 ? '女' : ''}
年龄：${resume.age || ''}
电话：${resume.phone || ''}
邮箱：${resume.email || ''}
学历：${mapEducationText(resume.education) || ''}
工作经验：${mapWorkExperienceText(resume.workExperience) || ''}
技能：${resume.skill || ''}
求职意向：${resume.jobIntention || ''}
    `;
    alert(msg);
}

/** 保存简历：根据 mode 调用创建或更新接口 */
async function saveResume(currentUser, mode, resumeId) {
    const title = document.getElementById('resume-title').value.trim();
    const name = document.getElementById('resume-name').value.trim();
    const gender = document.getElementById('resume-gender').value;
    const age = document.getElementById('resume-age').value;
    const phone = document.getElementById('resume-phone').value.trim();
    const email = document.getElementById('resume-email').value.trim();
    const education = document.getElementById('resume-education').value.trim();
    const workExperience = document.getElementById('resume-workExp').value.trim();
    const skills = document.getElementById('resume-skills').value.trim();
    const jobIntention = document.getElementById('resume-job-intention').value.trim();

    // 前端验证
    if (!title) {
        alert('请输入简历标题');
        document.getElementById('resume-title').focus();
        return;
    }
    
    if (!name) {
        alert('请输入姓名');
        document.getElementById('resume-name').focus();
        return;
    }
    
    if (!phone) {
        alert('请输入电话');
        document.getElementById('resume-phone').focus();
        return;
    }
    
    // 电话号码简单验证
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入正确的手机号码');
        document.getElementById('resume-phone').focus();
        return;
    }
    
    if (!email) {
        alert('请输入邮箱');
        document.getElementById('resume-email').focus();
        return;
    }
    
    // 邮箱简单验证
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('请输入正确的邮箱地址');
        document.getElementById('resume-email').focus();
        return;
    }
    
    // 年龄验证
    if (age && (isNaN(age) || age < 16 || age > 100)) {
        alert('请输入正确的年龄（16-100之间）');
        document.getElementById('resume-age').focus();
        return;
    }
    
    // 工作经验验证
    if (workExperience && (isNaN(workExperience) || workExperience < 0 || workExperience > 50)) {
        alert('请输入正确的工作经验年数（0-50之间）');
        document.getElementById('resume-workExp').focus();
        return;
    }

    const payload = {
        userId: currentUser.userId,
        // 映射到后端 ResumeInfoDTO 字段
        resumeName: title,
        name: name,
        gender: gender ? parseInt(gender) : null,
        age: age ? parseInt(age) : null,
        phone,
        email,
        education,
        workExperience,
        skill: skills,
        jobIntention
    };
    if (mode === 'update' && resumeId) {
        payload.resumeId = Number(resumeId);
    }

    try {
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const resp = await Auth.authenticatedFetch(RESUME_API_BASE, {
            method: mode === 'create' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误：${resp.status} ${text}`);
            return;
        }
        const json = await resp.json();
        if (json.code !== 200) {
            alert(json.message || '系统内部错误');
            return;
        }
        alert('保存成功');
        document.getElementById('resume-modal').style.display = 'none';
        initUserResumes(currentUser);
    } catch (e) {
        console.error('保存简历异常:', e);
        alert('请求异常，请稍后重试');
    }
}

/** 删除简历 */
async function deleteResume(resumeId, currentUser) {
    if (!confirm('确认删除该简历吗？')) return;
    try {
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const resp = await Auth.authenticatedFetch(`${RESUME_API_BASE}/${encodeURIComponent(resumeId)}`, {
            method: 'DELETE'
        });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误：${resp.status} ${text}`);
            return;
        }
        const json = await resp.json();
        if (json.code !== 200 || json.data !== true) {
            alert(json.message || '删除失败');
            return;
        }
        alert('删除成功');
        await initUserResumes(currentUser);
    } catch (e) {
        console.error(e);
        alert('请求异常，请稍后重试');
    }
}

/** 原有：根据用户ID获取简历列表，这里移除重复定义，统一使用 dashboard.js 中的实现 */
// async function fetchUserResumesApi(userId) {
//     // 重复定义，已在 dashboard.js 中实现
// }
