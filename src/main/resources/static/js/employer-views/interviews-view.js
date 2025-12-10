function renderInterviewsView(container, currentUser) {
    container.innerHTML = `
        <div class="view interviews-view active">
            <h2>面试管理</h2>
            <!-- 添加状态筛选标签 -->
            <div class="status-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                <button class="tab-btn active" data-status="PREPARING_INTERVIEW" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">待面试</button>
                <button class="tab-btn" data-status="INTERVIEW_ENDED" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">待录取</button>
                <button class="tab-btn" data-status="ACCEPTED" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">录取</button>
                <button class="tab-btn" data-status="REJECTED" style="padding: 8px 16px; border: none; background-color: #f3f4f6; cursor: pointer; border-radius: 4px;">未录取</button>
            </div>
            
            <!-- 日期筛选器，仅在待面试状态下显示 -->
            <div id="date-filter-container" style="display: none; margin-bottom: 20px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
                <label for="interview-date-filter" style="margin-right: 10px;">筛选日期:</label>
                <input type="date" id="interview-date-filter" style="padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                <button id="apply-date-filter" class="btn btn-primary" style="margin-left: 10px;">应用筛选</button>
                <button id="clear-date-filter" class="btn" style="margin-left: 10px;">清除筛选</button>
            </div>
            
            <div id="interviews-status" style="margin-bottom:8px;color:#666;">正在加载面试记录...</div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 12%; text-align: center; vertical-align: middle;">面试者</th>
                            <th style="width: 20%; text-align: center; vertical-align: middle;">申请职位</th>
                            <th style="width: 15%; text-align: center; vertical-align: middle;">面试时间</th>
                            <th style="width: 15%; text-align: center; vertical-align: middle;">面试地点</th>
                            <th style="width: 10%; text-align: center; vertical-align: middle;">状态</th>
                            <th style="width: 28%; text-align: center; vertical-align: middle;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="interviews-tbody"></tbody>
                </table>
            </div>
            <div class="pagination" id="interviews-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="interviews-prev-page">上一页</button>
                <span class="pagination-info" id="interviews-pagination-info"></span>
                <button class="btn pagination-btn" id="interviews-next-page">下一页</button>
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
            
            // 获取当前状态
            const status = button.getAttribute('data-status');
            
            // 控制日期筛选器的显示（仅在待面试状态下显示）
            const dateFilterContainer = document.getElementById('date-filter-container');
            if (status === 'PREPARING_INTERVIEW') {
                dateFilterContainer.style.display = 'block';
            } else {
                dateFilterContainer.style.display = 'none';
                // 清除日期筛选
                const dateFilter = document.getElementById('interview-date-filter');
                if (dateFilter) {
                    dateFilter.value = '';
                }
            }
            
            // 重置分页到第一页
            window.interviewsPagination = {
                current: 1,
                size: 20,
                total: 0,
                pages: 0
            };
            loadInterviews(currentUser, status);
        });
    });

    // 添加日期筛选事件监听
    setTimeout(() => {
        const applyDateFilter = document.getElementById('apply-date-filter');
        const clearDateFilter = document.getElementById('clear-date-filter');
        
        if (applyDateFilter) {
            applyDateFilter.addEventListener('click', () => {
                // 日期筛选始终在 PREPARING_INTERVIEW 状态下使用
                const status = 'PREPARING_INTERVIEW';
                // 重置分页到第一页
                window.interviewsPagination.current = 1;
                loadInterviews(currentUser, status);
            });
        }
        
        if (clearDateFilter) {
            clearDateFilter.addEventListener('click', () => {
                const dateFilter = document.getElementById('interview-date-filter');
                if (dateFilter) {
                    dateFilter.value = '';
                    const activeTab = document.querySelector('.tab-btn.active');
                    const status = activeTab ? activeTab.getAttribute('data-status') : 'PREPARING_INTERVIEW';
                    // 重置分页到第一页
                    window.interviewsPagination.current = 1;
                    loadInterviews(currentUser, status);
                }
            });
        }
    }, 0);

    // 初始化分页状态
    window.interviewsPagination = {
        current: 1,
        size: 20,
        total: 0,
        pages: 0
    };

    // 默认显示待面试状态，并确保日期筛选框可见
    const defaultTab = container.querySelector('.tab-btn[data-status="PREPARING_INTERVIEW"]');
    if (defaultTab) {
        // 更新激活状态
        const tabButtons = container.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        defaultTab.classList.add('active');
        
        // 更新按钮样式
        tabButtons.forEach(btn => {
            btn.style.backgroundColor = '#f3f4f6';
            btn.style.color = '#000';
        });
        defaultTab.style.backgroundColor = '#4f46e5';
        defaultTab.style.color = '#fff';
        
        // 显示日期筛选框
        const dateFilterContainer = document.getElementById('date-filter-container');
        if (dateFilterContainer) {
            dateFilterContainer.style.display = 'block';
        }
    }
    
    loadInterviews(currentUser, 'PREPARING_INTERVIEW');
}

async function loadInterviews(currentUser, status) {
    const statusEl = document.getElementById('interviews-status');
    const tbody = document.getElementById('interviews-tbody');
    const paginationContainer = document.getElementById('interviews-pagination');
    const paginationInfo = document.getElementById('interviews-pagination-info');
    const prevBtn = document.getElementById('interviews-prev-page');
    const nextBtn = document.getElementById('interviews-next-page');

    if (!tbody || !currentUser) return;

    if (statusEl) statusEl.textContent = '正在加载面试记录...';
    tbody.innerHTML = '';

    try {
        const params = new URLSearchParams({
            current: window.interviewsPagination.current,
            size: window.interviewsPagination.size
        });
        
        // 如果指定了状态，则添加到参数中（确保是字符串）
        if (status) {
            // 强制转换为字符串并确保是有效的状态值之一
            const statusStr = String(status);
            if (['PREPARING_INTERVIEW', 'INTERVIEW_ENDED', 'ACCEPTED', 'REJECTED'].includes(statusStr)) {
                params.append('status', statusStr);
            }
        }
        
        // 如果是待面试状态且选择了日期，则添加日期参数
        if (status === 'PREPARING_INTERVIEW') {
            const dateFilter = document.getElementById('interview-date-filter');
            if (dateFilter && dateFilter.value) {
                params.append('interviewDate', dateFilter.value);
            }
        }

        const resp = await fetch(`http://124.71.101.139:10085/api/interview/company/${encodeURIComponent(currentUser.companyId)}?${params.toString()}`);
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
            if (statusEl) statusEl.textContent = '暂无面试记录。';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        // 更新分页信息
        window.interviewsPagination.total = page.total || 0;
        window.interviewsPagination.pages = page.pages || Math.ceil((page.total || 0) / window.interviewsPagination.size) || 0;

        if (statusEl) statusEl.textContent = `共 ${window.interviewsPagination.total} 条面试记录`;

        if (paginationInfo) {
            paginationInfo.textContent = `第 ${window.interviewsPagination.current} 页，共 ${window.interviewsPagination.pages} 页`;
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = window.interviewsPagination.current <= 1;
            prevBtn.onclick = () => {
                if (window.interviewsPagination.current > 1) {
                    window.interviewsPagination.current--;
                    loadInterviews(currentUser, status);
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = window.interviewsPagination.current >= window.interviewsPagination.pages;
            nextBtn.onclick = () => {
                if (window.interviewsPagination.current < window.interviewsPagination.pages) {
                    window.interviewsPagination.current++;
                    loadInterviews(currentUser, status);
                }
            };
        }

        // 渲染面试列表
        tbody.innerHTML = '';
        records.forEach(interview => {
            const tr = document.createElement('tr');
            
            // 为整行添加点击事件以查看简历详情
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', (event) => {
                // 避免点击操作按钮时触发查看详情
                if (!event.target.classList.contains('btn')) {
                    viewResume(interview.resumeSnapshot, interview.resumeId, interview.applicationId);
                }
            });

            const userTd = document.createElement('td');
            userTd.textContent = interview.intervieweeName || '';
            userTd.style.overflow = 'hidden';
            userTd.style.textOverflow = 'ellipsis';
            userTd.style.whiteSpace = 'nowrap';
            userTd.style.textAlign = 'center';
            userTd.style.verticalAlign = 'middle';

            const jobTd = document.createElement('td');
            jobTd.textContent = interview.jobTitle || '';
            jobTd.style.overflow = 'hidden';
            jobTd.style.textOverflow = 'ellipsis';
            jobTd.style.whiteSpace = 'nowrap';
            jobTd.style.textAlign = 'center';
            jobTd.style.verticalAlign = 'middle';

            const timeTd = document.createElement('td');
            const interviewTime = interview.interviewTime || '';
            timeTd.textContent = interviewTime ? interviewTime.replace('T', ' ') : '';
            timeTd.style.overflow = 'hidden';
            timeTd.style.textOverflow = 'ellipsis';
            timeTd.style.whiteSpace = 'nowrap';
            timeTd.style.textAlign = 'center';
            timeTd.style.verticalAlign = 'middle';

            const placeTd = document.createElement('td');
            placeTd.textContent = interview.interviewPlace || '';
            placeTd.style.overflow = 'hidden';
            placeTd.style.textOverflow = 'ellipsis';
            placeTd.style.whiteSpace = 'nowrap';
            placeTd.style.textAlign = 'center';
            placeTd.style.verticalAlign = 'middle';

            const statusTd = document.createElement('td');
            statusTd.textContent = mapInterviewStatus(interview.status);
            statusTd.style.overflow = 'hidden';
            statusTd.style.textOverflow = 'ellipsis';
            statusTd.style.whiteSpace = 'nowrap';
            statusTd.style.textAlign = 'center';
            statusTd.style.verticalAlign = 'middle';

            const actionTd = document.createElement('td');
            actionTd.style.whiteSpace = 'nowrap';
            actionTd.style.textAlign = 'center';
            actionTd.style.verticalAlign = 'middle';

            // 根据不同状态显示不同的操作按钮（移除了查看简历按钮）
            if (status === 'PREPARING_INTERVIEW') {
                // 待面试状态下的操作按钮
                const finishInterviewButton = document.createElement('button');
                finishInterviewButton.className = 'btn btn-success btn-sm';
                finishInterviewButton.textContent = '完成面试';
                finishInterviewButton.style.marginLeft = '5px';
                finishInterviewButton.onclick = () => finishInterview(interview.arrangeId);
                actionTd.appendChild(finishInterviewButton);

                const updateInfoButton = document.createElement('button');
                updateInfoButton.className = 'btn btn-sm';
                updateInfoButton.textContent = '更改信息';
                updateInfoButton.style.marginLeft = '5px';
                updateInfoButton.onclick = () => updateInterviewInfo(interview.arrangeId, interview.interviewTime, interview.interviewPlace);
                actionTd.appendChild(updateInfoButton);
            } else if (status === 'INTERVIEW_ENDED') {
                // 待录取状态下的操作按钮
                const acceptButton = document.createElement('button');
                acceptButton.className = 'btn btn-success btn-sm';
                acceptButton.textContent = '录取';
                acceptButton.style.marginLeft = '5px';
                acceptButton.onclick = () => updateInterviewStatus(interview.arrangeId, 'ACCEPTED');
                actionTd.appendChild(acceptButton);

                const rejectButton = document.createElement('button');
                rejectButton.className = 'btn btn-danger btn-sm';
                rejectButton.textContent = '拒绝';
                rejectButton.style.marginLeft = '5px';
                rejectButton.onclick = () => updateInterviewStatus(interview.arrangeId, 'REJECTED');
                actionTd.appendChild(rejectButton);
            }

            tr.appendChild(userTd);
            tr.appendChild(jobTd);
            tr.appendChild(timeTd);
            tr.appendChild(placeTd);
            tr.appendChild(statusTd);
            tr.appendChild(actionTd);

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('加载面试记录异常:', e);
        if (statusEl) statusEl.textContent = '请求异常，请稍后重试';
    }
}

function mapInterviewStatus(status) {
    if (!status) return '未知';
    switch (status) {
        case 'PREPARING_INTERVIEW':
            return '待面试';
        case 'INTERVIEW_ENDED':
            return '待录取';
        case 'ACCEPTED':
            return '录取';
        case 'REJECTED':
            return '未录取';
        default:
            return status;
    }
}

async function finishInterview(arrangeId) {
    if (!arrangeId) {
        alert('无法完成面试：缺少面试ID');
        return;
    }

    if (!confirm('确定要将此面试标记为已完成吗？')) {
        return;
    }

    try {
        const payload = {
            arrangeId: arrangeId,
            status: 'INTERVIEW_ENDED'
        };

        const response = await ApiService.request('/interview', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        alert('面试已完成');

        // 重新加载面试列表
        const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
        // 确保状态值是字符串形式，防止被意外转换为数字
        let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || 'PREPARING_INTERVIEW';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['PREPARING_INTERVIEW', 'INTERVIEW_ENDED', 'ACCEPTED', 'REJECTED'].includes(currentStatus)) {
            currentStatus = 'PREPARING_INTERVIEW';
        }
        loadInterviews(currentUser, currentStatus);
    } catch (e) {
        console.error('完成面试失败:', e);
        alert('完成面试失败，请稍后重试');
    }
}

async function updateInterviewStatus(arrangeId, status) {
    if (!arrangeId) {
        alert('无法更新面试状态：缺少面试ID');
        return;
    }

    try {
        const payload = {
            arrangeId: arrangeId,
            status: status
        };

        const response = await ApiService.request('/interview', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        alert(status === 'ACCEPTED' ? '已录取' : '已拒绝');

        // 重新加载面试列表
        const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
        // 确保状态值是字符串形式，防止被意外转换为数字
        let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || 'INTERVIEW_ENDED';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['PREPARING_INTERVIEW', 'INTERVIEW_ENDED', 'ACCEPTED', 'REJECTED'].includes(currentStatus)) {
            currentStatus = 'INTERVIEW_ENDED';
        }
        loadInterviews(currentUser, currentStatus);
    } catch (e) {
        console.error('更新面试状态失败:', e);
        alert('更新面试状态失败，请稍后重试');
    }
}

async function updateInterviewInfo(arrangeId, currentTime, currentPlace) {
    if (!arrangeId) {
        alert('无法更新面试信息：缺少面试ID');
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
            <h3>更新面试信息</h3>
            <div style="margin:15px 0;">
                <label>面试时间：</label><br/>
                <input type="datetime-local" id="interview-time" value="${currentTime ? currentTime.slice(0, 16) : ''}" min="${minDate}" style="width:100%;padding:8px;margin-top:5px;" required>
            </div>
            <div style="margin:15px 0;">
                <label>面试地点：</label><br/>
                <input type="text" id="interview-place" value="${currentPlace || ''}" placeholder="请输入面试地点" style="width:100%;padding:8px;margin-top:5px;" required>
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

        // 执行更新操作
        confirmUpdateInterviewInfo(arrangeId, interviewTime, interviewPlace);
    };
}

async function confirmUpdateInterviewInfo(arrangeId, interviewTime, interviewPlace) {
    try {
        // 转换日期格式为后端需要的格式
        const formattedTime = interviewTime.replace('T', ' ') + ':00';

        const payload = {
            arrangeId: arrangeId,
            interviewTime: formattedTime,
            interviewPlace: interviewPlace
        };

        const response = await ApiService.request('/interview', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        alert('面试信息更新成功！');

        // 重新加载面试列表
        const currentUser = Auth.getCurrentUser && Auth.getCurrentUser();
        // 确保状态值是字符串形式，防止被意外转换为数字
        let currentStatus = document.querySelector('.tab-btn.active')?.getAttribute('data-status') || 'PREPARING_INTERVIEW';
        // 强制转换为字符串并确保是有效的状态值之一
        currentStatus = String(currentStatus);
        if (!['PREPARING_INTERVIEW', 'INTERVIEW_ENDED', 'ACCEPTED', 'REJECTED'].includes(currentStatus)) {
            currentStatus = 'PREPARING_INTERVIEW';
        }
        loadInterviews(currentUser, currentStatus);
    } catch (e) {
        console.error('更新面试信息失败:', e);
        alert('更新面试信息失败，请稍后重试');
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