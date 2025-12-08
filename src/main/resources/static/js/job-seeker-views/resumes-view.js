function renderResumesView(container, currentUser) {
    container.innerHTML = `
        <div class="view resumes-view active">
            <h2>我的简历</h2>
            <button class="btn btn-primary" id="create-resume-btn">创建新简历</button>
            <div class="list-container" style="margin-top: 1rem;">
                <div id="resume-list">正在加载简历列表...</div>
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
                            <input type="text" id="resume-title" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>姓名 *</label>
                            <input type="text" id="resume-name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>性别</label>
                            <select id="resume-gender" class="form-control">
                                <option value="">请选择</option>
                                <option value="1">男</option>
                                <option value="2">女</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>年龄</label>
                            <input type="number" id="resume-age" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>电话 *</label>
                            <input type="text" id="resume-phone" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>邮箱 *</label>
                            <input type="email" id="resume-email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>最高学历</label>
                            <input type="text" id="resume-education" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>工作经验</label>
                            <input type="text" id="resume-workExp" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>掌握技能</label>
                            <textarea id="resume-skills" class="form-control" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label>求职意向</label>
                            <textarea id="resume-job-intention" class="form-control" rows="3"></textarea>
                        </div>
                        <div style="margin-top:12px; text-align:right;">
                            <button type="button" class="btn" id="resume-cancel-btn">取消</button>
                            <button type="submit" class="btn btn-primary" id="resume-save-btn" style="margin-left:8px;">保存</button>
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

    const hideModal = () => { modal.style.display = 'none'; };
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) hideModal();
    });

    document.getElementById('resume-form').addEventListener('submit', async e => {
        e.preventDefault();
        const mode = modal.dataset.mode; // 'create' or 'update'
        const resumeId = document.getElementById('resume-id').value || null;
        await saveResume(currentUser, mode, resumeId);
    });

    initUserResumes(currentUser);
}

/**
 * 初始化/刷新当前用户简历列表
 */
async function initUserResumes(user) {
    const listContainer = document.getElementById('resume-list');
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
        return;
    }

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';

    resumes.forEach(resume => {
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

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm';
        delBtn.style.marginLeft = '8px';
        delBtn.textContent = '删除';
        delBtn.onclick = () => deleteResume(resume.resumeId, user);

        actions.appendChild(viewBtn);
        actions.appendChild(editBtn);
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
    document.getElementById('resume-name').value = currentUser.realName || currentUser.username || '';
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
    document.getElementById('resume-name').value = resume.realName || '';
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

/** 查看简历详情（简单弹窗，后续可跳转详情页） */
function viewResumeDetail(resume) {
    const msg = `
标题：${resume.resumeName || ''}
姓名：${resume.realName || ''}
性别：${resume.gender == 1 ? '男' : resume.gender == 2 ? '女' : ''}
年龄：${resume.age || ''}
电话：${resume.phone || ''}
邮箱：${resume.email || ''}
学历：${resume.education || ''}
工作经验：${resume.workExperience || ''}
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

    if (!title || !name || !phone || !email) {
        alert('简历标题、姓名、电话、邮箱为必填项');
        return;
    }

    const payload = {
        userId: currentUser.userId,
        // 映射到后端 ResumeInfoDTO 字段
        resumeName: title,
        realName: name,
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
        const resp = await fetch(RESUME_API_BASE, {
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
        const resp = await fetch(`${RESUME_API_BASE}/${encodeURIComponent(resumeId)}`, {
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
