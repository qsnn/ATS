function renderApplicantsView(container, currentUser) {
    container.innerHTML = `
        <div class="view applicants-view active">
            <h2>职位申请人</h2>
            <!-- 添加状态筛选标签 -->
            <div class="status-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                <button class="tab-btn active" data-status="1" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">待处理</button>
                <button class="tab-btn" data-status="2" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">已通过</button>
                <button class="tab-btn" data-status="3" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">已拒绝</button>
            </div>
            <div id="applicants-status" style="margin-bottom:8px;color:#666;">正在加载申请人记录...</div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 15%; text-align: center; vertical-align: middle;">申请人</th>
                            <th style="width: 25%; text-align: center; vertical-align: middle;">申请职位</th>
                            <th style="width: 25%; text-align: center; vertical-align: middle;">申请时间</th>
                            <th style="width: 35%; text-align: center; vertical-align: middle;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="applicants-tbody"></tbody>
                </table>
            </div>
            <div class="pagination" id="applicants-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="applicants-prev-page">上一页</button>
                <span class="pagination-info" id="applicants-pagination-info"></span>
                <button class="btn pagination-btn" id="applicants-next-page">下一页</button>
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
            window.applicantsPagination = {
                current: 1,
                size: 20,
                total: 0,
                pages: 0
            };
            loadApplicants(currentUser, status);
        });
    });

    // 初始化分页状态
    window.applicantsPagination = {
        current: 1,
        size: 20,
        total: 0,
        pages: 0
    };

    // 默认加载待处理状态的数据
    loadApplicants(currentUser, '1');
}

async function loadApplicants(currentUser, status = '') {
    const statusEl = document.getElementById('applicants-status');
    const tbody = document.getElementById('applicants-tbody');
    const paginationContainer = document.getElementById('applicants-pagination');
    const paginationInfo = document.getElementById('applicants-pagination-info');
    const prevBtn = document.getElementById('applicants-prev-page');
    const nextBtn = document.getElementById('applicants-next-page');

    if (!tbody || !currentUser) return;

    if (statusEl) statusEl.textContent = '正在加载申请人记录...';
    tbody.innerHTML = '';

    try {
        const params = new URLSearchParams({
            current: window.applicantsPagination.current,
            size: window.applicantsPagination.size,
            excludeStatus: 4  // 排除求职者撤回的申请
        });
        
        // 如果指定了状态，则添加到参数中
        if (status) {
            // 直接使用状态值，因为标签页的data-status已经是合适的数字字符串
            params.append('status', status);
        }

        // 使用 ApiService.request 替代普通 fetch 以确保携带 JWT 令牌
        const resp = await ApiService.request(`/applications/company/${encodeURIComponent(currentUser.companyId)}?${params.toString()}`);

        const page = resp || {};
        const records = page.records || [];

        if (records.length === 0) {
            if (statusEl) statusEl.textContent = '暂无申请人记录。';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        // 更新分页信息
        window.applicantsPagination.total = page.total || 0;
        window.applicantsPagination.pages = page.pages || Math.ceil((page.total || 0) / window.applicantsPagination.size) || 0;

        if (statusEl) statusEl.textContent = `共 ${window.applicantsPagination.total} 条申请人记录`;

        if (paginationInfo) {
            paginationInfo.textContent = `第 ${window.applicantsPagination.current} 页，共 ${window.applicantsPagination.pages} 页`;
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = window.applicantsPagination.current <= 1;
            prevBtn.onclick = () => {
                if (window.applicantsPagination.current > 1) {
                    window.applicantsPagination.current--;
                    loadApplicants(currentUser, status);
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = window.applicantsPagination.current >= window.applicantsPagination.pages;
            nextBtn.onclick = () => {
                if (window.applicantsPagination.current < window.applicantsPagination.pages) {
                    window.applicantsPagination.current++;
                    loadApplicants(currentUser, status);
                }
            };
        }

        // 渲染申请人列表，保持与求职者端一致的实现方式
        tbody.innerHTML = '';
        records.forEach(app => {
            const tr = document.createElement('tr');
            
            // 为整行添加点击事件以查看简历详情
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', (event) => {
                // 避免点击操作按钮时触发查看详情
                if (!event.target.classList.contains('btn')) {
                    viewResume(app.resumeSnapshot, app.resumeId, app.applicationId);
                }
            });

            const userTd = document.createElement('td');
            userTd.textContent = app.userName || '';
            userTd.style.overflow = 'hidden';
            userTd.style.textOverflow = 'ellipsis';
            userTd.style.whiteSpace = 'nowrap';
            userTd.style.textAlign = 'center';
            userTd.style.verticalAlign = 'middle';

            const jobTd = document.createElement('td');
            jobTd.textContent = app.jobTitle || '';
            jobTd.style.overflow = 'hidden';
            jobTd.style.textOverflow = 'ellipsis';
            jobTd.style.whiteSpace = 'nowrap';
            jobTd.style.textAlign = 'center';
            jobTd.style.verticalAlign = 'middle';

            const dateTd = document.createElement('td');
            const applyTime = app.applyTime || '';
            dateTd.textContent = applyTime ? applyTime.replace('T', ' ') : '';
            dateTd.style.overflow = 'hidden';
            dateTd.style.textOverflow = 'ellipsis';
            dateTd.style.whiteSpace = 'nowrap';
            dateTd.style.textAlign = 'center';
            dateTd.style.verticalAlign = 'middle';



            const actionTd = document.createElement('td');
            actionTd.style.whiteSpace = 'nowrap';
            actionTd.style.textAlign = 'center';
            actionTd.style.verticalAlign = 'middle';

            // 根据不同状态显示不同的操作按钮
            const currentStatus = status || ''; // 当前标签页状态

            // 根据当前标签页和状态显示操作按钮（移除了查看简历按钮）
            if (currentStatus === '1') {
                // 待处理状态下的额外操作按钮
                const scheduleInterviewButton = document.createElement('button');
                scheduleInterviewButton.className = 'btn btn-success btn-sm';
                scheduleInterviewButton.textContent = '安排面试';
                scheduleInterviewButton.style.marginLeft = '5px';
                scheduleInterviewButton.onclick = () => scheduleInterview(app.applicationId, app.userId, (app.userName || '').replace(/'/g, "\\'"));
                actionTd.appendChild(scheduleInterviewButton);

                const addToTalentPoolButton = document.createElement('button');
                addToTalentPoolButton.className = 'btn btn-sm';
                addToTalentPoolButton.textContent = '加入人才库';
                addToTalentPoolButton.style.marginLeft = '5px';
                addToTalentPoolButton.onclick = () => addToTalentPool(app.applicationId);
                actionTd.appendChild(addToTalentPoolButton);

                const rejectButton = document.createElement('button');
                rejectButton.className = 'btn btn-danger btn-sm';
                rejectButton.textContent = '拒绝';
                rejectButton.style.marginLeft = '5px';
                rejectButton.onclick = () => rejectApplicant(app.applicationId);
                actionTd.appendChild(rejectButton);
            } else if (currentStatus === '2') {
                // 已通过状态无需额外按钮
            } else if (currentStatus === '3') {
                // 已拒绝状态下的额外操作按钮
                const addToTalentPoolButton = document.createElement('button');
                addToTalentPoolButton.className = 'btn btn-sm';
                addToTalentPoolButton.textContent = '加入人才库';
                addToTalentPoolButton.style.marginLeft = '5px';
                addToTalentPoolButton.onclick = () => addToTalentPool(app.applicationId);
                actionTd.appendChild(addToTalentPoolButton);
            } else if (currentStatus === '') {
                // 全部状态下的额外操作按钮（根据实际记录状态显示）
                if (app.status === '1') {
                    const scheduleInterviewButton = document.createElement('button');
                    scheduleInterviewButton.className = 'btn btn-success btn-sm';
                    scheduleInterviewButton.textContent = '安排面试';
                    scheduleInterviewButton.style.marginLeft = '5px';
                    scheduleInterviewButton.onclick = () => scheduleInterview(app.applicationId, app.userId, (app.userName || '').replace(/'/g, "\\'"));
                    actionTd.appendChild(scheduleInterviewButton);

                    const addToTalentPoolButton = document.createElement('button');
                    addToTalentPoolButton.className = 'btn btn-sm';
                    addToTalentPoolButton.textContent = '加入人才库';
                    addToTalentPoolButton.style.marginLeft = '5px';
                    addToTalentPoolButton.onclick = () => addToTalentPool(app.applicationId);
                    actionTd.appendChild(addToTalentPoolButton);

                    const rejectButton = document.createElement('button');
                    rejectButton.className = 'btn btn-danger btn-sm';
                    rejectButton.textContent = '拒绝';
                    rejectButton.style.marginLeft = '5px';
                    rejectButton.onclick = () => rejectApplicant(app.applicationId);
                    actionTd.appendChild(rejectButton);
                } else if (app.status === '3') {
                    const addToTalentPoolButton = document.createElement('button');
                    addToTalentPoolButton.className = 'btn btn-sm';
                    addToTalentPoolButton.textContent = '加入人才库';
                    addToTalentPoolButton.style.marginLeft = '5px';
                    addToTalentPoolButton.onclick = () => addToTalentPool(app.applicationId);
                    actionTd.appendChild(addToTalentPoolButton);
                }
                // ACCEPTED状态不显示额外按钮
            }

            tr.appendChild(userTd);
            tr.appendChild(jobTd);
            tr.appendChild(dateTd);
            tr.appendChild(actionTd);

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('加载申请人记录异常:', e);
        if (statusEl) statusEl.textContent = '请求异常，请稍后重试';
    }
}

function mapApplicationStatus(status) {
    if (!status) return '未知';
    
    // 处理后端返回的字符串枚举值
    switch (status) {
        case 'APPLIED':
        case '1':
        case 1:
            return '待处理';
        case 'ACCEPTED':
        case '2':
        case 2:
            return '已通过';
        case 'REJECTED':
        case '3':
        case 3:
            return '已拒绝';
        case 'WITHDRAWN':
        case '4':
        case 4:
            return '已撤回';
        default:
            return status;
    }
}

async function scheduleInterview(applicationId, userId) {
    if (!applicationId) {
        alert('无法安排面试：缺少申请ID');
        return;
    }

    // 创建模态框用于输入面试时间和地点
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    const now = new Date();
    const minDate = now.toISOString().slice(0, 16); // 获取当前时间作为最小可选时间

    modal.innerHTML = `
        <div style="background:white;padding:20px;border-radius:8px;width:400px;max-width:90%;">
            <h3>安排面试</h3>
            <div style="margin:15px 0;">
                <label>面试时间：</label><br/>
                <input type="datetime-local" id="interview-time" min="${minDate}" style="width:100%;padding:8px;margin-top:5px;" required>
            </div>
            <div style="margin:15px 0;">
                <label>面试地点：</label><br/>
                <input type="text" id="interview-place" placeholder="请输入面试地点" style="width:100%;padding:8px;margin-top:5px;" required>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
                <button id="cancel-interview" class="btn" style="background:#ccc;">取消</button>
                <button id="confirm-interview" class="btn btn-primary">确认</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const confirmBtn = modal.querySelector('#confirm-interview');
    const cancelBtn = modal.querySelector('#cancel-interview');

    // 取消按钮事件
    cancelBtn.onclick = () => {
        document.body.removeChild(modal);
    };

    // 确认按钮事件
    confirmBtn.onclick = () => {
        const interviewTime = modal.querySelector('#interview-time').value;
        const interviewPlace = modal.querySelector('#interview-place').value;

        if (!interviewTime || !interviewPlace) {
            alert('请填写完整的面试信息');
            return;
        }

        // 关闭模态框
        document.body.removeChild(modal);

        // 执行原逻辑，不再传递userName参数
        confirmScheduleInterview(applicationId, userId, interviewTime, interviewPlace);
    };
}

async function confirmScheduleInterview(applicationId, userId, interviewTime, interviewPlace) {
    const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
    if (!currentUser || !currentUser.userId || !currentUser.companyId) {
        alert('未登录或用户信息缺失，无法安排面试');
        return;
    }

    try {
        // 转换日期格式为后端需要的格式
        const formattedTime = interviewTime.replace('T', ' ') + ':00';

        const payload = {
            applicationId: applicationId,  // 修改为applicationId
            interviewerId: currentUser.userId,
            interviewTime: formattedTime,
            interviewPlace: interviewPlace
            // 不再手动传递intervieweeName和intervieweeId，由后端从applicationId获取
        };

        const response = await ApiService.request('/interview', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        alert(`面试安排成功！\n时间：${payload.interviewTime}\n地点：${payload.interviewPlace}`);

        // 延迟刷新页面，确保后端数据同步完成
        await new Promise(resolve => setTimeout(resolve, 200));

        // 重新加载申请人列表
        // 获取当前激活的标签页状态
        let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || '1';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['1', '2', '3'].includes(currentStatus)) {
            currentStatus = '1';
        }
        loadApplicants(currentUser, currentStatus);
    } catch (e) {
        console.error('安排面试失败:', e);
        alert('安排面试失败，请稍后重试');
        throw e; // 重新抛出错误，确保调用栈能正确处理
    }
}

async function viewResume(resumeSnapshot, resumeId, applicationId) {
    // 优先使用简历快照
    if (resumeSnapshot && resumeSnapshot !== 'null') {
        try {
            const data = JSON.parse(resumeSnapshot);
            showResumeDetails(data);
            return;
        } catch (e) {
            console.error('解析简历快照失败:', e);
        }
    }

    // 如果没有快照或解析失败，尝试通过applicationId获取申请详情
    if (applicationId) {
        try {
            const appData = await ApiService.request(`/applications/company/application/${encodeURIComponent(applicationId)}`);
            if (appData && appData.resumeSnapshot) {
                try {
                    const data = JSON.parse(appData.resumeSnapshot);
                    showResumeDetails(data);
                    return;
                } catch (e) {
                    console.error('解析简历快照失败:', e);
                }
            }
        } catch (e) {
            console.error('通过申请ID获取简历信息失败:', e);
        }
    }

    // 回退到原来的查询方式
    if (!resumeId) {
        alert('无法查看简历：缺少简历ID');
        return;
    }

    try {
        const data = await ApiService.request(`/resume/${encodeURIComponent(resumeId)}`);
        if (!data) {
            alert('未找到简历信息');
            return;
        }

        showResumeDetails(data);
    } catch (e) {
        console.error('查看简历失败:', e);
        // ApiService 已经弹出错误提示
    }
}

function showResumeDetails(data) {
    // 当前后端返回字段：name, age, education, jobIntention, workExperience, skill, createTime, updateTime 等
    // 先用现有字段对齐展示，后续如后端补充 phone/email/projectExperience/selfEvaluation 再扩展
    const detailLines = [];
    detailLines.push(`姓名：${data.name || ''}`);
    if (data.phone) {
        detailLines.push(`电话：${data.phone}`);
    }
    if (data.email) {
        detailLines.push(`邮箱：${data.email}`);
    }
    if (data.age != null) {
        detailLines.push(`年龄：${data.age}`);
    }
    if (data.genderDesc) {
        detailLines.push(`性别：${data.genderDesc}`);
    }
    detailLines.push(`学历：${data.education || ''}`);
    if (data.jobIntention) {
        detailLines.push(`求职意向：${data.jobIntention}`);
    }
    if (data.workExperience) {
        detailLines.push(`工作经历：${data.workExperience}`);
    }
    if (data.skill) {
        detailLines.push(`技能：${data.skill}`);
    }
    if (data.resumeName) {
        detailLines.push(`简历名称：${data.resumeName}`);
    }
    if (data.createTime) {
        detailLines.push(`创建时间：${data.createTime}`);
    }
    if (data.updateTime) {
        detailLines.push(`更新时间：${data.updateTime}`);
    }

    const detailHtml = '\n' + detailLines.join('\n');
    alert(`简历详情：\n\n${detailHtml}`);
}

async function addToTalentPool(applicationId) {
    if (!applicationId) {
        alert('无法加入人才库：缺少申请ID');
        return;
    }

    const note = prompt('请输入备注（为什么加入人才库）：', '技术能力优秀，暂时没有合适岗位');
    if (note === null) return;

    const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
    if (!currentUser || !currentUser.companyId || !currentUser.userId) {
        alert('当前账号未关联公司或用户信息不完整，无法加入人才库');
        return;
    }

    try {
        // 直接通过申请ID获取申请详情
        const app = await ApiService.request(`/applications/company/application/${encodeURIComponent(applicationId)}`);

        if (!app) {
            alert('未找到对应的申请记录，无法加入人才库');
            return;
        }

        // 按数据库结构，只需要 resumeId, companyId, operatorId, tag
        const talentPayload = {
            resumeId: app.resumeId,
            companyId: currentUser.companyId,
            operatorId: currentUser.userId,
            tag: note || ''
        };

        await ApiService.addTalent(talentPayload);
        alert('已加入人才库');

        // 重新加载申请人列表
        // 获取当前激活的标签页状态
        let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || '1';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['1', '2', '3'].includes(currentStatus)) {
            currentStatus = '1';
        }
        loadApplicants(currentUser, currentStatus);
    } catch (e) {
        console.error('加入人才库失败:', e);
        // 添加更友好的错误提示
        if (e.message && e.message.includes('404')) {
            alert('申请记录不存在或已被删除');
        } else if (e.message && e.message.includes('TALENT_ALREADY_EXISTS')) {
            // 避免重复提示，只显示一次错误信息
            alert('该简历已在人才库中');
        } else {
            // 避免在其他错误情况下重复提示
            // 只有在没有明确处理过的错误才显示通用错误提示
            if (!(e.message && (e.message.includes('404') || e.message.includes('TALENT_ALREADY_EXISTS')))) {
                alert('加入人才库失败，请稍后重试: ' + e.message);
            }
        }
    }
}

async function rejectApplicant(applicationId) {
    if (!applicationId) {
        alert('无法拒绝：缺少申请ID');
        return;
    }
    if (!confirm('确定要拒绝该申请人吗？')) {
        return;
    }

    const reason = prompt('可以填写拒绝原因（选填）：', '简历与岗位要求不匹配');

    try {
        await ApiService.request(`/applications/${encodeURIComponent(applicationId)}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: 3, reason: reason || '' })
        });
        alert('已拒绝该申请人');
        const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
        if (currentUser) {
            // 获取当前激活的标签页状态
            let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || '1';
            // 强制转换为字符串并确保是有效的状态值之一
            currentStatus = String(currentStatus);
            if (!['1', '2', '3'].includes(currentStatus)) {
                currentStatus = '1';
            }
            loadApplicants(currentUser, currentStatus);
        }
    } catch (e) {
        console.error('拒绝申请失败:', e);
    }
}
