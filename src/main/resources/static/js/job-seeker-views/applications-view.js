function renderApplicationsView(container, currentUser) {
    container.innerHTML = `
        <div class="view applications-view active">
            <h2>我的申请</h2>
            <!-- 添加状态筛选标签 -->
            <div class="status-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                <button class="tab-btn active" data-status="">全部</button>
                <button class="tab-btn" data-status="1">申请中</button>
                <button class="tab-btn" data-status="2">已通过</button>
                <button class="tab-btn" data-status="3">被驳回</button>
                <button class="tab-btn" data-status="4">已撤回</button>
            </div>
            <div id="applications-status" style="margin-bottom:8px;color:#666;">正在加载申请记录...</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>职位名称</th>
                        <th>公司</th>
                        <th>申请日期</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="applications-tbody"></tbody>
            </table>
            <div class="pagination" id="applications-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="applications-prev-page">上一页</button>
                <span class="pagination-info" id="applications-pagination-info"></span>
                <button class="btn pagination-btn" id="applications-next-page">下一页</button>
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
            
            // 加载对应状态的数据
            const status = button.getAttribute('data-status');
            // 重置分页到第一页
            window.applicationsPagination = {
                current: 1,
                size: 20,
                total: 0,
                pages: 0
            };
            loadApplications(currentUser, status);
        });
    });

    // 初始化分页状态
    window.applicationsPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };

    loadApplications(currentUser);
}

async function loadApplications(currentUser, status = '') {
    const statusEl = document.getElementById('applications-status');
    const tbody = document.getElementById('applications-tbody');
    const paginationContainer = document.getElementById('applications-pagination');
    const paginationInfo = document.getElementById('applications-pagination-info');
    const prevBtn = document.getElementById('applications-prev-page');
    const nextBtn = document.getElementById('applications-next-page');

    if (!tbody || !currentUser) return;

    if (statusEl) statusEl.textContent = '正在加载申请记录...';
    tbody.innerHTML = '';

    try {
        const params = new URLSearchParams({
            userId: currentUser.userId,
            current: window.applicationsPagination.current,
            size: window.applicationsPagination.size
        });
        
        // 如果指定了状态，则添加到参数中
        if (status) {
            params.append('status', status);
        }
        
        const base = window.API_BASE || '/api';
        const resp = await Auth.authenticatedFetch(`${base}/applications/my?${params.toString()}`);
        if (!resp.ok) {
            const text = await resp.text();
            if (statusEl) statusEl.textContent = `网络错误: ${resp.status} ${text}`;
            return;
        }
        const json = await resp.json();
        if (json.code !== 200) {
            if (statusEl) statusEl.textContent = json.message || '加载失败';
            return;
        }
        const page = json.data || {};
        const records = page.records || [];

        if (records.length === 0) {
            if (statusEl) statusEl.textContent = '暂无申请记录。去职位搜索页多投几份简历吧~';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        // 更新分页信息
        window.applicationsPagination.total = page.total || 0;
        window.applicationsPagination.pages = page.pages || Math.ceil((page.total || 0) / window.applicationsPagination.size) || 0;
        
        if (statusEl) statusEl.textContent = `共 ${window.applicationsPagination.total} 条申请记录`;

        if (paginationInfo) {
            paginationInfo.textContent = `第 ${window.applicationsPagination.current} 页，共 ${window.applicationsPagination.pages} 页`;
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = window.applicationsPagination.current <= 1;
            prevBtn.onclick = () => {
                if (window.applicationsPagination.current > 1) {
                    window.applicationsPagination.current--;
                    loadApplications(currentUser, status);
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = window.applicationsPagination.current >= window.applicationsPagination.pages;
            nextBtn.onclick = () => {
                if (window.applicationsPagination.current < window.applicationsPagination.pages) {
                    window.applicationsPagination.current++;
                    loadApplications(currentUser, status);
                }
            };
        }

        records.forEach(app => {
            const tr = document.createElement('tr');

            const jobTd = document.createElement('td');
            const link = document.createElement('a');
            link.href = '#';
            
            // 检查职位是否已下架或已删除
            let jobText = app.jobTitle || '未知职位';
            if (app.publishStatus === 2) {
                jobText += ' [已下架]';
            } else if (app.publishStatus === null) {
                jobText += ' [已删除]';
            }
            
            link.textContent = jobText;
            link.onclick = (e) => {
                e.preventDefault();
                if (typeof viewJobDetail === 'function' && app.jobId) {
                    viewJobDetail(app.jobId);
                } else {
                    alert('职位详情暂不可用');
                }
            };
            jobTd.appendChild(link);

            const companyTd = document.createElement('td');
            companyTd.textContent = app.companyName || '';
            
            // 如果职位已下架或已删除，在公司名旁边也加上标记
            if (app.publishStatus === 2) {
                companyTd.innerHTML = (app.companyName || '') + ' <span style="color: #ff4d4f;">[已下架]</span>';
            } else if (app.publishStatus === null) {
                companyTd.innerHTML = (app.companyName || '') + ' <span style="color: #ff4d4f;">[已删除]</span>';
            }

            const dateTd = document.createElement('td');
            const applyTime = app.applyTime || '';
            dateTd.textContent = applyTime ? applyTime.replace('T', ' ') : '';

            const statusTd = document.createElement('td');
            statusTd.textContent = mapApplicationStatus(app.status);

            const actionTd = document.createElement('td');
            // 根据不同状态显示不同的操作按钮
            switch (app.status) {
                case 1:
                case '1':
                    // 申请中 - 撤回申请
                    const withdrawButton = document.createElement('button');
                    withdrawButton.className = 'btn btn-warning btn-sm';
                    withdrawButton.textContent = '撤回申请';
                    withdrawButton.onclick = () => withdrawApplication(app.applicationId, currentUser.userId);
                    actionTd.appendChild(withdrawButton);
                    break;
                case 2:
                case '2':
                    // 已通过 - 无操作
                    actionTd.textContent = '-';
                    break;
                case 3:
                case '3':
                    // 被驳回 - 删除记录
                    const deleteRejectedButton = document.createElement('button');
                    deleteRejectedButton.className = 'btn btn-danger btn-sm';
                    deleteRejectedButton.textContent = '删除记录';
                    deleteRejectedButton.onclick = () => deleteApplication(app.applicationId, currentUser.userId, app.jobId, app.resumeId);
                    actionTd.appendChild(deleteRejectedButton);
                    break;
                case 4:
                case '4':
                    // 已撤回 - 删除记录、重新申请
                    const deleteWithdrawnButton = document.createElement('button');
                    deleteWithdrawnButton.className = 'btn btn-danger btn-sm';
                    deleteWithdrawnButton.textContent = '删除记录';
                    deleteWithdrawnButton.onclick = () => deleteApplication(app.applicationId, currentUser.userId, app.jobId, app.resumeId);
                    actionTd.appendChild(deleteWithdrawnButton);
                    
                    const reapplyButton = document.createElement('button');
                    reapplyButton.className = 'btn btn-primary btn-sm';
                    reapplyButton.textContent = '重新申请';
                    reapplyButton.style.marginLeft = '5px';
                    reapplyButton.onclick = () => reapplyApplication(app, currentUser.userId);
                    actionTd.appendChild(reapplyButton);
                    break;
                default:
                    actionTd.textContent = '-';
            }

            tr.appendChild(jobTd);
            tr.appendChild(companyTd);
            tr.appendChild(dateTd);
            tr.appendChild(statusTd);
            tr.appendChild(actionTd);

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('加载申请记录异常:', e);
        if (statusEl) statusEl.textContent = '请求异常，请稍后重试';
    }
}

function mapApplicationStatus(status) {
    if (!status) return '未知';
    switch (status) {
        case 1:
        case '1':
            return '申请中';
        case 2:
        case '2':
            return '已通过';
        case 3:
        case '3':
            return '被驳回';
        case 4:
        case '4':
            return '已撤回';
        default:
            return status;
    }
}

async function withdrawApplication(applicationId, userId) {
    if (!confirm('确定要撤回此申请吗？')) {
        return;
    }
    
    try {
        const base = window.API_BASE || '/api';
        const resp = await Auth.authenticatedFetch(`${base}/applications/${applicationId}/withdraw?userId=${userId}`, {
            method: 'PUT'
        });
        
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        
        const json = await resp.json();
        if (json.code !== 200 || !json.data) {
            alert(json.message || '撤回申请失败');
            return;
        }
        
        alert('申请已撤回');
        // 重新加载申请列表
        const currentUser = window.Auth && Auth.getCurrentUser ? Auth.getCurrentUser() : null;
        if (currentUser) {
            // 获取当前激活的标签页状态
            let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || '';
            // 强制转换为字符串并确保是有效的状态值之一
            currentStatus = String(currentStatus);
            if (!['', '1', '2', '3', '4'].includes(currentStatus)) {
                currentStatus = '';
            }
            loadApplications(currentUser, currentStatus);
        }
    } catch (e) {
        console.error('撤回申请异常:', e);
        alert('请求异常，请稍后重试');
    }
}

// 删除申请记录功能（对于被驳回和已撤回的申请）
async function deleteApplication(applicationId, userId, jobId, resumeId) {
    if (!confirm('确定要删除此申请记录吗？')) {
        return;
    }
    
    try {
        const base = window.API_BASE || '/api';
        // 使用新的删除接口，通过查询参数传递所需信息
        const resp = await Auth.authenticatedFetch(`${base}/applications?userId=${userId}&jobId=${jobId}&resumeId=${resumeId}`, {
            method: 'DELETE'
        });
        
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        
        const json = await resp.json();
        if (json.code !== 200 || !json.data) {
            alert(json.message || '删除记录失败');
            return;
        }
        
        alert('记录已删除');
        // 重新加载申请列表
        const currentUser = window.Auth && Auth.getCurrentUser ? Auth.getCurrentUser() : null;
        if (currentUser) {
            // 获取当前激活的标签页状态
            let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || '';
            // 强制转换为字符串并确保是有效的状态值之一
            currentStatus = String(currentStatus);
            if (!['', '1', '2', '3', '4'].includes(currentStatus)) {
                currentStatus = '';
            }
            loadApplications(currentUser, currentStatus);
        }
    } catch (e) {
        console.error('删除记录异常:', e);
        alert('请求异常，请稍后重试');
    }
}

// 重新申请功能（对于已撤回的申请）
async function reapplyApplication(application, userId) {
    if (!confirm('确定要重新申请此职位吗？')) {
        return;
    }
    
    try {
        // 获取用户的所有简历
        const base = window.API_BASE || '/api';
        const resumeResp = await Auth.authenticatedFetch(`${base}/resume/list?userId=${userId}`);
        if (!resumeResp.ok) {
            alert('获取简历列表失败');
            return;
        }
        
        const resumeData = await resumeResp.json();
        if (resumeData.code !== 200) {
            alert(resumeData.message || '获取简历列表失败');
            return;
        }
        
        const resumes = resumeData.data || [];
        if (resumes.length === 0) {
            alert('您还没有创建简历，请先创建简历');
            return;
        }
        
        // 让用户选择简历
        let resumeOptions = resumes.map((resume, index) => 
            `${index + 1}. ${resume.resumeName || '未命名简历'}`
        ).join('\n');
        
        let selectedIndex = prompt(`请选择要投递的简历:\n${resumeOptions}\n\n请输入序号(1-${resumes.length}):`);
        if (!selectedIndex) {
            return; // 用户取消选择
        }
        
        selectedIndex = parseInt(selectedIndex) - 1;
        if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= resumes.length) {
            alert('选择的简历序号无效');
            return;
        }
        
        const chosenResume = resumes[selectedIndex];
        
        // 使用选择的简历重新申请
        const payload = {
            userId: userId,
            jobId: application.jobId,
            resumeId: chosenResume.resumeId
        };
        
        const resp = await Auth.authenticatedFetch(`${base}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        
        const json = await resp.json();
        if (json.code !== 200) {
            alert(json.message || '重新申请失败');
            return;
        }
        
        alert('重新申请成功');
        // 重新加载申请列表
        const currentUser = window.Auth && Auth.getCurrentUser ? Auth.getCurrentUser() : null;
        if (currentUser) {
            // 获取当前激活的标签页状态
            let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || '';
            // 强制转换为字符串并确保是有效的状态值之一
            currentStatus = String(currentStatus);
            if (!['', '1', '2', '3', '4'].includes(currentStatus)) {
                currentStatus = '';
            }
            loadApplications(currentUser, currentStatus);
        }
    } catch (e) {
        console.error('重新申请异常:', e);
        alert('请求异常，请稍后重试');
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
        case 0: return '无学历要求';
        case 1: return '高中';
        case 2: return '大专';
        case 3: return '本科';
        case 4: return '硕士';
        case 5: return '博士';
        default: return eduValue;
    }
}

async function viewJobDetail(jobId) {
    try {
        const base = window.API_BASE || '/api';
        const resp = await Auth.authenticatedFetch(`${base}/job/info/${encodeURIComponent(jobId)}`);
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误：${resp.status} ${text}`);
            return;
        }
        const job = await resp.json();
        
        // 生成完整的地址信息
        let fullAddress = '';
        if (job.province) fullAddress += job.province;
        if (job.city) fullAddress += '-' + job.city;
        if (job.district) fullAddress += '-' + job.district;
        
        // 通过公司ID获取公司联系方式
        let contactInfo = '';
        if (job.companyId) {
            try {
                const companyResp = await Auth.authenticatedFetch(`${base}/company/${encodeURIComponent(job.companyId)}`);
                if (companyResp.ok) {
                    const company = await companyResp.json();
                    if (company && company.data) {
                        if (company.data.contactPhone) contactInfo += `\n联系电话：${company.data.contactPhone}`;
                        if (company.data.contactEmail) contactInfo += `\n联系邮箱：${company.data.contactEmail}`;
                    }
                }
            } catch (companyError) {
                console.warn('获取公司信息失败:', companyError);
            }
        }
        
        const msg = `职位：${job.jobName || ''}
公司：${job.companyName || ''}
部门：${job.department || ''}
地点：${fullAddress || job.city || ''}
经验要求：${mapWorkExperienceText(job.workExperience) || ''}
学历要求：${mapEducationText(job.education) || ''}
薪资范围：${(job.salaryMin || 0) / 1000}K - ${(job.salaryMax || 0) / 1000}K${contactInfo}

职位描述：
${job.jobDesc || ''}`;
        alert(msg);
    } catch (e) {
        console.error('查看职位详情异常:', e);
        alert('请求异常，请稍后重试');
    }
}

// 文件结尾