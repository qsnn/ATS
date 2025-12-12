function renderJobManageView(container, currentUser) {
    container.innerHTML = `
        <div class="view job-manage-view active">
            <h2>职位管理</h2>
            <button class="btn btn-primary" id="create-job-btn" style="margin: 15px 0;">新建职位</button>
            
            <!-- 添加状态筛选标签 -->
            <div class="status-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                <button class="tab-btn active" data-status="0" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">草稿箱</button>
                <button class="tab-btn" data-status="1" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">已发布</button>
                <button class="tab-btn" data-status="2" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">已下架</button>
            </div>
            
            <div id="jobs-status" style="margin-bottom:8px;color:#666;">正在加载职位信息...</div>
            <table class="table" style="width: 100%; table-layout: fixed;">
                <thead>
                    <tr>
                        <th style="width: 20%; text-align: center;">职位名称</th>
                        <th style="width: 20%; text-align: center;">薪资范围</th>
                        <th style="width: 20%; text-align: center;">工作地点</th>
                        <th style="width: 20%; text-align: center;">更新时间</th>
                        <th style="width: 20%; text-align: center;">操作</th>
                    </tr>
                </thead>
                <tbody id="job-manage-tbody"></tbody>
            </table>
            <div class="pagination" id="jobs-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="jobs-prev-page">上一页</button>
                <span class="pagination-info" id="jobs-pagination-info"></span>
                <button class="btn pagination-btn" id="jobs-next-page">下一页</button>
            </div>
        </div>
        
        <!-- 职位编辑弹窗 -->
        <div id="job-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:9999;">
            <div style="background:#fff; width:600px; max-height:90vh; overflow:auto; margin:40px auto; padding:20px; border-radius:6px; position:relative;">
                <h3 id="job-modal-title">新建职位</h3>
                <button id="job-modal-close" style="position:absolute; right:16px; top:10px; border:none; background:none; font-size:18px; cursor:pointer;">×</button>
                <form id="job-form">
                    <input type="hidden" id="job-id">
                    <div class="form-row">
                        <div class="form-group">
                            <label>职位名称 *</label>
                            <input type="text" id="job-title" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>所属部门</label>
                            <input type="text" id="job-department" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>省份 *</label>
                            <input type="text" id="job-province" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>城市 *</label>
                            <input type="text" id="job-city" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>地区</label>
                            <input type="text" id="job-district" class="form-control">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>薪资范围 *</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="number" id="job-salary-min" placeholder="最低薪资" class="form-control" required style="flex: 1;">
                                <span>-</span>
                                <input type="number" id="job-salary-max" placeholder="最高薪资" class="form-control" required style="flex: 1;">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>工作经验要求（最少年限）</label>
                            <select id="job-experience" class="form-control">
                                <option value="0">应届生</option>
                                <option value="1">1年及以上</option>
                                <option value="2">2年及以上</option>
                                <option value="3">3年及以上</option>
                                <option value="4">4年及以上</option>
                                <option value="5">5年及以上</option>
                                <option value="6">6年及以上</option>
                                <option value="7">7年及以上</option>
                                <option value="8">8年及以上</option>
                                <option value="9">9年及以上</option>
                                <option value="10">10年及以上</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>学历要求</label>
                            <select id="job-education" class="form-control">
                                <option value="硕士">硕士</option>
                                <option value="本科" selected>本科</option>
                                <option value="大专">大专</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>职位描述 *</label>
                        <textarea id="job-description" class="form-control" rows="6" required></textarea>
                    </div>

                    <div style="margin-top:12px; text-align:right;">
                        <button type="button" class="btn" id="job-cancel-btn">取消</button>
                        <button type="button" class="btn btn-secondary" id="job-save-draft-btn" style="margin-left:8px;">保存草稿</button>
                        <button type="submit" class="btn btn-primary" id="job-publish-btn" style="margin-left:8px;">发布职位</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // 添加标签页点击事件监听
    const tabButtons = container.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新激活状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新按钮样式
            tabButtons.forEach(btn => {
                btn.style.backgroundColor = '#f3f4f6';
                btn.style.color = '#000';
            });
            button.style.backgroundColor = '#4f46e5';
            button.style.color = '#fff';
            
            // 加载对应状态的数据
            const status = button.getAttribute('data-status');
            // 重置分页到第一页
            window.jobsPagination = {
                current: 1,
                size: 20,
                total: 0,
                pages: 0
            };
            loadJobList(currentUser, status);
        });
    });

    // 初始化分页状态
    window.jobsPagination = {
        current: 1,
        size: 20,
        total: 0,
        pages: 0
    };

    // 绑定新建职位按钮事件
    document.getElementById('create-job-btn').addEventListener('click', () => {
        createNewJob(currentUser);
    });

    // 绑定模态框关闭事件
    const modal = document.getElementById('job-modal');
    const closeBtn = document.getElementById('job-modal-close');
    const cancelBtn = document.getElementById('job-cancel-btn');

    const hideModal = () => { modal.style.display = 'none'; };
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) hideModal();
    });

    // 绑定表单提交事件
    document.getElementById('job-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveJob(currentUser, 'publish');
    });
    
    // 绑定保存草稿事件
    document.getElementById('job-save-draft-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        await saveJob(currentUser, 'draft');
    });
    
    // 绑定发布职位事件
    document.getElementById('job-publish-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        await saveJob(currentUser, 'publish');
    });

    // 默认加载草稿箱
    setTimeout(() => {
        loadJobList(currentUser, 0);
    }, 500);
}

async function loadJobList(user, status) {
    const statusEl = document.getElementById('jobs-status');
    const tbody = document.getElementById('job-manage-tbody');
    const paginationContainer = document.getElementById('jobs-pagination');
    const paginationInfo = document.getElementById('jobs-pagination-info');
    const prevBtn = document.getElementById('jobs-prev-page');
    const nextBtn = document.getElementById('jobs-next-page');

    if (!tbody) return;

    if (statusEl) statusEl.textContent = '正在加载职位信息...';
    tbody.innerHTML = '';

    try {
        const params = new URLSearchParams({
            current: window.jobsPagination.current,
            size: window.jobsPagination.size,
            publishStatus: status,
            companyId: user.companyId
        });
        
        const resp = await Auth.authenticatedFetch(`${JOB_API_BASE}/list?${params.toString()}`);
        if (!resp.ok) {
            const text = await resp.text();
            if (statusEl) statusEl.textContent = `网络错误: ${resp.status} ${text}`;
            return;
        }
        const json = await resp.json();
        
        // 处理统一的API响应格式 {code: 200, message: "", data: {...}}
        let page;
        if (json && typeof json === 'object' && 'data' in json) {
            page = json.data;
        } else {
            page = json;
        }
        
        // 确保正确提取records数组
        const jobs = (page && Array.isArray(page.records)) ? page.records : 
                     (page && Array.isArray(page)) ? page : [];

        if (jobs.length === 0) {
            if (statusEl) statusEl.textContent = '暂无职位信息';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        // 更新分页信息
        window.jobsPagination.total = page.total || 0;
        window.jobsPagination.pages = page.pages || Math.ceil((page.total || 0) / window.jobsPagination.size) || 0;
        
        if (statusEl) statusEl.textContent = `共 ${window.jobsPagination.total} 条职位信息`;

        if (paginationInfo) {
            paginationInfo.textContent = `第 ${window.jobsPagination.current} 页，共 ${window.jobsPagination.pages} 页`;
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = window.jobsPagination.current <= 1;
            prevBtn.onclick = () => {
                if (window.jobsPagination.current > 1) {
                    window.jobsPagination.current--;
                    loadJobList(user, status);
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = window.jobsPagination.current >= window.jobsPagination.pages;
            nextBtn.onclick = () => {
                if (window.jobsPagination.current < window.jobsPagination.pages) {
                    window.jobsPagination.current++;
                    loadJobList(user, status);
                }
            };
        }

        // 清空现有内容
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        // 逐条添加职位信息
        jobs.forEach((job) => {
            const min = job.salaryMin || 0;
            const max = job.salaryMax || 0;
            let salary = '-';
            if (min > 0 && max > 0) {
                salary = `${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`;
            }
            const updateTime = job.updateTime ? String(job.updateTime).replace('T', ' ') : '';
            
            // 构造完整地址显示
            let location = '';
            if (job.province) location += job.province;
            if (job.city) location += job.city;
            if (job.district) location += job.district;
            
            // 根据不同状态显示不同的操作按钮
            let actions = '';
            const statusNum = Number(status);
            if (statusNum === 0) { // 草稿箱
                actions = `
                    <button class="btn btn-sm" onclick="viewJob(${job.jobId})" style="margin-right: 5px;">查看</button>
                    <button class="btn btn-sm" onclick="editJob(${job.jobId})" style="margin-right: 5px; background-color: #f3f4f6; border-color: #d1d5db;">修改</button>
                    <button class="btn btn-primary btn-sm" onclick="publishJob(${job.jobId})" style="margin-right: 5px;">发布</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.jobId})">删除</button>
                `;
            } else if (statusNum === 1) { // 已发布
                actions = `
                    <button class="btn btn-warning btn-sm" onclick="unpublishJob(${job.jobId})" style="background-color: #f59e0b; border-color: #f59e0b; color: white;">下架</button>
                `;
            } else if (statusNum === 2) { // 已下架
                actions = `
                    <button class="btn btn-sm btn-primary" onclick="publishJob(${job.jobId})" style="margin-right: 5px;">重新发布</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.jobId})">删除</button>
                `;
            }
            
            // 创建表格行
            const tr = document.createElement('tr');
            
            // 创建单元格元素
            const nameTd = document.createElement('td');
            nameTd.textContent = job.jobName || '';
            nameTd.style.overflow = 'hidden';
            nameTd.style.textOverflow = 'ellipsis';
            nameTd.style.whiteSpace = 'nowrap';
            nameTd.style.textAlign = 'center';
            
            const salaryTd = document.createElement('td');
            salaryTd.textContent = salary;
            salaryTd.style.overflow = 'hidden';
            salaryTd.style.textOverflow = 'ellipsis';
            salaryTd.style.whiteSpace = 'nowrap';
            salaryTd.style.textAlign = 'center';
            
            const locationTd = document.createElement('td');
            locationTd.textContent = location || '';
            locationTd.style.overflow = 'hidden';
            locationTd.style.textOverflow = 'ellipsis';
            locationTd.style.whiteSpace = 'nowrap';
            locationTd.style.textAlign = 'center';
            
            const updateTimeTd = document.createElement('td');
            updateTimeTd.textContent = updateTime;
            updateTimeTd.style.overflow = 'hidden';
            updateTimeTd.style.textOverflow = 'ellipsis';
            updateTimeTd.style.whiteSpace = 'nowrap';
            updateTimeTd.style.textAlign = 'center';
            
            const actionsTd = document.createElement('td');
            actionsTd.innerHTML = actions;
            actionsTd.style.whiteSpace = 'nowrap';
            actionsTd.style.textAlign = 'center';
            
            // 添加单元格到行
            tr.appendChild(nameTd);
            tr.appendChild(salaryTd);
            tr.appendChild(locationTd);
            tr.appendChild(updateTimeTd);
            tr.appendChild(actionsTd);
            
            // 添加行到表格主体
            tbody.appendChild(tr);
            
            // 确保行可见
            tr.style.display = '';
        });
    } catch (e) {
        console.error('加载职位失败:', e);
        if (statusEl) statusEl.textContent = '请求异常，请稍后重试';
    }
}

// 添加HTML转义函数，防止XSS攻击并提高稳定性
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return text;
    }
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

async function togglePublish(jobId, isPublished) {
    const url = isPublished ? `${JOB_API_BASE}/unpublish/${jobId}` : `${JOB_API_BASE}/publish/${jobId}`;
    try {
        const resp = await Auth.authenticatedFetch(url, { method: 'PUT' });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const ok = await resp.json();
        if (!ok) {
            alert('操作失败');
            return;
        }
        alert(isPublished ? '职位已下架' : '职位已发布');
        // 获取当前激活的标签页状态
        const activeTab = document.querySelector('.tab-btn.active');
        let currentStatus = activeTab ? activeTab.getAttribute('data-status') : '0';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['0', '1', '2'].includes(currentStatus)) {
            currentStatus = '0';
        }
        loadJobList(Auth.getCurrentUser(), currentStatus);
    } catch (e) {
        console.error('更新发布状态失败:', e);
        alert('操作失败，请稍后重试');
    }
}

async function deleteJob(jobId) {
    if (!confirm('确定要删除这个职位吗？')) return;
    try {
        const resp = await Auth.authenticatedFetch(`${JOB_API_BASE}/${jobId}`, { method: 'DELETE' });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const ok = await resp.json();
        if (!ok) {
            alert('删除失败');
            return;
        }
        alert('职位已删除');
        // 获取当前激活的标签页状态
        const activeTab = document.querySelector('.tab-btn.active');
        let currentStatus = activeTab ? activeTab.getAttribute('data-status') : '0';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['0', '1', '2'].includes(currentStatus)) {
            currentStatus = '0';
        }
        loadJobList(Auth.getCurrentUser(), currentStatus);
    } catch (e) {
        console.error('删除职位失败:', e);
        alert('删除失败，请稍后重试');
    }
}

async function createNewJob(user) {
    const modal = document.getElementById('job-modal');
    modal.style.display = 'block';

    const form = document.getElementById('job-form');
    form.reset();

    const title = document.getElementById('job-modal-title');
    title.innerText = '新建职位';

    const submitBtn = document.getElementById('job-publish-btn');
    submitBtn.innerText = '发布职位';
}

// 新增函数：查看职位
async function viewJob(jobId) {
    try {
        const resp = await Auth.authenticatedFetch(`${JOB_API_BASE}/detail/${jobId}`);
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const job = await resp.json();
        
        // 构造职位详情信息
        let location = '';
        if (job.province) location += job.province;
        if (job.city) location += job.city;
        if (job.district) location += job.district;
        
        const min = job.salaryMin || 0;
        const max = job.salaryMax || 0;
        const salary = min && max ? `${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K` : '-';
        
        let experienceText = '';
        switch(job.workExperience) {
            case 0: experienceText = '应届生'; break;
            case 1: experienceText = '1年及以上'; break;
            case 2: experienceText = '2年及以上'; break;
            case 3: experienceText = '3年及以上'; break;
            case 4: experienceText = '4年及以上'; break;
            case 5: experienceText = '5年及以上'; break;
            case 6: experienceText = '6年及以上'; break;
            case 7: experienceText = '7年及以上'; break;
            case 8: experienceText = '8年及以上'; break;
            case 9: experienceText = '9年及以上'; break;
            case 10: experienceText = '10年及以上'; break;
            default: experienceText = job.workExperience + '年及以上';
        }
        
        const msg = `
职位名称：${job.jobName || ''}
所属部门：${job.department || ''}
工作地点：${location}
薪资范围：${salary}
工作经验：${experienceText}
学历要求：${job.education || ''}
职位描述：${job.jobDesc || ''}
        `;
        alert(msg);
    } catch (e) {
        console.error('获取职位信息失败:', e);
        alert('加载职位信息失败，请稍后重试');
    }
}

// 新增函数：编辑职位
async function editJob(jobId) {
    try {
        const resp = await Auth.authenticatedFetch(`${JOB_API_BASE}/detail/${jobId}`);
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const job = await resp.json();
        
        const modal = document.getElementById('job-modal');
        modal.dataset.mode = 'update';
        document.getElementById('job-modal-title').textContent = '编辑职位';
        document.getElementById('job-id').value = job.jobId || '';
        document.getElementById('job-title').value = job.jobName || '';
        document.getElementById('job-department').value = job.department || '';
        document.getElementById('job-province').value = job.province || '';
        document.getElementById('job-city').value = job.city || '';
        document.getElementById('job-district').value = job.district || '';
        document.getElementById('job-salary-min').value = job.salaryMin || '';
        document.getElementById('job-salary-max').value = job.salaryMax || '';
        document.getElementById('job-experience').value = job.workExperience || '0';
        document.getElementById('job-education').value = job.education || '本科';
        document.getElementById('job-description').value = job.jobDesc || '';
        modal.style.display = 'block';
    } catch (e) {
        console.error('获取职位信息失败:', e);
        alert('加载职位信息失败，请稍后重试');
    }
}

// 新增函数：发布职位
async function publishJob(jobId) {
    try {
        const resp = await Auth.authenticatedFetch(`${JOB_API_BASE}/publish/${jobId}`, { method: 'PUT' });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const ok = await resp.json();
        if (!ok) {
            alert('发布失败');
            return;
        }
        alert('职位已发布');
        // 获取当前激活的标签页状态
        const activeTab = document.querySelector('.tab-btn.active');
        let currentStatus = activeTab ? activeTab.getAttribute('data-status') : '0';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['0', '1', '2'].includes(currentStatus)) {
            currentStatus = '0';
        }
        loadJobList(Auth.getCurrentUser(), currentStatus);
    } catch (e) {
        console.error('发布职位失败:', e);
        alert('发布失败，请稍后重试');
    }
}

// 新增函数：下架职位
async function unpublishJob(jobId) {
    if (!confirm('确定要下架这个职位吗？')) return;
    try {
        const resp = await Auth.authenticatedFetch(`${JOB_API_BASE}/unpublish/${jobId}`, { method: 'PUT' });
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const ok = await resp.json();
        if (!ok) {
            alert('下架失败');
            return;
        }
        alert('职位已下架');
        // 获取当前激活的标签页状态
        const activeTab = document.querySelector('.tab-btn.active');
        let currentStatus = activeTab ? activeTab.getAttribute('data-status') : '0';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['0', '1', '2'].includes(currentStatus)) {
            currentStatus = '0';
        }
        loadJobList(Auth.getCurrentUser(), currentStatus);
    } catch (e) {
        console.error('下架职位失败:', e);
        alert('下架失败，请稍后重试');
    }
}

async function saveJob(user, action) {
    const jobId = document.getElementById('job-id').value || null;
    const title = document.getElementById('job-title').value.trim();
    const department = document.getElementById('job-department').value.trim();
    const province = document.getElementById('job-province').value.trim();
    const city = document.getElementById('job-city').value.trim();
    const district = document.getElementById('job-district').value.trim();
    const salaryMinInput = document.getElementById('job-salary-min').value;
    const salaryMaxInput = document.getElementById('job-salary-max').value;
    const experience = document.getElementById('job-experience').value;
    const education = document.getElementById('job-education').value;
    const description = document.getElementById('job-description').value.trim();

    if (!title || !salaryMinInput || !salaryMaxInput || !province || !city || !description) {
        alert('请填写所有必填字段（带*的）');
        return;
    }

    // 验证薪资输入
    const salaryMin = parseFloat(salaryMinInput);
    const salaryMax = parseFloat(salaryMaxInput);
    
    if (isNaN(salaryMin) || isNaN(salaryMax)) {
        alert('请填写有效的数字薪资');
        return;
    }
    
    if (salaryMin >= salaryMax) {
        alert('最低薪资必须小于最高薪资');
        return;
    }

    const jobInfo = {
        companyId: user.companyId || null,
        publisherId: user.userId,
        jobName: title,
        department: department || null,
        province,
        city,
        district: district || null,
        salaryMin,
        salaryMax,
        workExperience: experience ? parseInt(experience) : null,
        education: education || null,
        jobDesc: description
    };

    // 如果是更新操作，需要添加 jobId
    if (jobId) {
        jobInfo.jobId = parseInt(jobId);
    }

    try {
        // 根据操作类型决定发布状态
        if (action === 'publish') {
            jobInfo.publishStatus = 1; // 已发布
        } else {
            jobInfo.publishStatus = 0; // 草稿
        }
        
        const resp = await Auth.authenticatedFetch(`${JOB_API_BASE}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobInfo)
        });

        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const ok = await resp.json();
        if (!ok) {
            alert('保存职位失败');
            return;
        }

        alert(action === 'publish' ? '职位发布成功！' : '职位保存成功！');
        document.getElementById('job-modal').style.display = 'none';
        
        // 获取当前激活的标签页状态
        const activeTab = document.querySelector('.tab-btn.active');
        let currentStatus = activeTab ? activeTab.getAttribute('data-status') : '0';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['0', '1', '2'].includes(currentStatus)) {
            currentStatus = '0';
        }
        loadJobList(user, currentStatus);
    } catch (e) {
        console.error('保存职位失败:', e);
        alert('保存失败，请稍后重试');
    }
}