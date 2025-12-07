const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : '/api';

// 简单防抖工具
function debounce(fn, wait) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

/**
 * 初始化城市筛选选项
 */
async function initCityFilter() {
    try {
        const response = await fetch(`${API_BASE_URL}/job/info/cities`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const cities = await response.json();
        const locationFilter = document.getElementById('location-filter');
        
        if (locationFilter && cities.data) {
            // 保存当前选中的值
            const currentValue = locationFilter.value;
            
            // 清空现有选项（除了第一个"全部城市"选项）
            locationFilter.innerHTML = '<option value="">全部城市</option>';
            
            // 添加从数据库获取的城市选项
            cities.data.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                locationFilter.appendChild(option);
            });
            
            // 恢复之前的选中值
            if (currentValue) {
                locationFilter.value = currentValue;
            }
        }
    } catch (error) {
        console.error('获取城市列表失败:', error);
    }
}

/**
 * 根据条件搜索职位
 */
async function searchJobs() {
    const inputEl = document.getElementById('job-search-input');
    const locEl = document.getElementById('location-filter');
    const eduEl = document.getElementById('education-filter');
    const expEl = document.getElementById('experience-filter');
    const salaryEl = document.getElementById('salary-filter');
    const sortEl = document.getElementById('sort-order');
    const jobListContainer = document.getElementById('job-list');
    const resultsCountEl = document.getElementById('results-count');
    const paginationContainer = document.getElementById('pagination-container');
    const paginationInfoEl = document.getElementById('pagination-info');

    if (!jobListContainer) return; // 无容器则不渲染

    // 显示加载状态
    jobListContainer.innerHTML = '<div class="loading-placeholder">正在搜索职位...</div>';
    
    const jobName = inputEl ? inputEl.value.trim() : '';
    const city = locEl ? locEl.value : '';
    const education = eduEl ? eduEl.value : '';
    const workExperience = expEl ? expEl.value : '';
    const salaryRange = salaryEl ? salaryEl.value : '';
    const sort = sortEl ? sortEl.value : 'update_time_desc';
    
    // 构建查询参数
    const params = new URLSearchParams({
        current: window.currentSearchState.current || 1,
        size: window.currentSearchState.size || 10,
    });
    
    if (jobName) params.append('jobName', jobName);
    if (city) params.append('city', city);
    if (education) params.append('education', education);
    if (workExperience) params.append('workExperience', workExperience);
    
    // 添加薪资筛选参数
    if (salaryRange) {
        const [min, max] = salaryRange.split('-').map(Number);
        if (!isNaN(min)) params.append('salaryMin', min);
        if (!isNaN(max)) params.append('salaryMax', max);
    }
    
    // 添加排序参数
    switch (sort) {
        case 'salary_desc':
            params.append('orderBy', 'salary_max');
            params.append('orderDirection', 'DESC');
            break;
        case 'salary_asc':
            params.append('orderBy', 'salary_min');
            params.append('orderDirection', 'ASC');
            break;
        case 'update_time_desc':
        default:
            params.append('orderBy', 'update_time');
            params.append('orderDirection', 'DESC');
            break;
    }

    try {
        const url = `${API_BASE_URL}/job/info/list?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // 更新分页状态
        if (data && data.records) {
            window.currentSearchState.total = data.total || 0;
            window.currentSearchState.current = data.current || 1;
            window.currentSearchState.size = data.size || 10;
        }
        
        // 更新结果计数和分页信息
        updateSearchResultsInfo(resultsCountEl, paginationInfoEl, paginationContainer);
        
        // 渲染职位列表
        renderJobList(data && data.records ? data.records : []);
    } catch (error) {
        console.error('获取职位列表失败:', error);
        jobListContainer.innerHTML = '<div class="error-placeholder">加载职位信息失败，请稍后重试。</div>';
    }
}

function updateSearchResultsInfo(resultsCountEl, paginationInfoEl, paginationContainer) {
    const { current, size, total } = window.currentSearchState;
    const totalPages = Math.ceil(total / size);
    
    if (resultsCountEl) {
        if (total === 0) {
            resultsCountEl.textContent = '未找到相关职位';
        } else {
            const start = (current - 1) * size + 1;
            const end = Math.min(current * size, total);
            resultsCountEl.textContent = `共找到 ${total} 个职位，显示第 ${start}-${end} 个`;
        }
    }
    
    if (paginationInfoEl) {
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
        } else {
            paginationInfoEl.textContent = `第 ${current} 页 / 共 ${totalPages} 页`;
            paginationContainer.style.display = 'flex';
        }
    }
}

/**
 * 将职位数据渲染到页面上
 * @param {Array} jobs - 职位对象数组 (JobInfoDetailDto)
 */
function renderJobList(jobs) {
    const jobListContainer = document.getElementById('job-list');
    if (!jobListContainer) return;
    
    if (!jobs || jobs.length === 0) {
        jobListContainer.innerHTML = '<div class="empty-placeholder">未找到相关职位，试试调整筛选条件</div>';
        return;
    }

    const currentUser = window.Auth && Auth.getCurrentUser ? Auth.getCurrentUser() : null;
    
    jobListContainer.innerHTML = '';
    
    jobs.forEach(job => {
        const min = job.salaryMin || 0;
        const max = job.salaryMax || 0;
        const salary = min === max ? 
            `¥${(min / 1000).toFixed(0)}K` : 
            `¥${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`;

        const jobCard = document.createElement('div');
        jobCard.className = 'job-card-modern';
        
        jobCard.innerHTML = `
            <div class="job-card-content">
                <div class="job-header-modern">
                    <div class="job-title-section">
                        <h3 class="job-title">${escapeHtml(job.jobName || '')}</h3>
                        <span class="job-salary">${salary}</span>
                    </div>
                    <div class="job-company-section">
                        <span class="job-company">${escapeHtml(job.companyName || '')}</span>
                        <span class="job-location">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M6 11C6 11 1 7.3125 1 4.5C1 2.0125 3.0125 0 5.5 0C7.9875 0 10 2.0125 10 4.5C10 7.3125 5 11 5 11H6Z" 
                                      stroke="currentColor" stroke-width="1.2"/>
                                <circle cx="5.5" cy="4.5" r="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/>
                            </svg>
                            ${escapeHtml(job.city || '')}
                        </span>
                    </div>
                </div>
                
                <div class="job-meta">
                    <span class="job-meta-item">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M11 5V2H10V1H9V2H3V1H2V2H1V5M1 6V10H3V11H9V10H11V6M3 5H9V6H3V5ZM3 7H9V8H3V7ZM3 9H6V10H3V9Z" 
                                  fill="currentColor"/>
                        </svg>
                        ${escapeHtml(job.education || '学历不限')}
                    </span>
                    <span class="job-meta-item">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M11 4L6 1L1 4V10C1 10.2652 1.10536 10.5196 1.29289 10.7071C1.48043 10.8946 1.73478 11 2 11H10C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10V4Z" 
                                  stroke="currentColor" stroke-width="1.2"/>
                        </svg>
                        ${escapeHtml(job.workExperience || '经验不限')}
                    </span>
                </div>
                
                <div class="job-description-modern">
                    ${escapeHtml((job.jobDesc || '').substring(0, 120))}${(job.jobDesc || '').length > 120 ? '...' : ''}
                </div>
                
                <div class="job-actions-modern">
                    <button class="btn btn-outline detail-btn" data-job-id="${job.jobId}">查看详情</button>
                    <div class="job-action-buttons">
                        <button class="btn favorite-btn" data-job-id="${job.jobId}" style="display:none;">
                            收藏
                        </button>
                        <button class="btn btn-primary apply-btn" data-job-id="${job.jobId}">投递简历</button>
                    </div>
                </div>
            </div>
        `;
        
        jobListContainer.appendChild(jobCard);
    });
    
    // 绑定事件
    bindJobCardEvents(currentUser);
}

function bindJobCardEvents(currentUser) {
    // 投递简历按钮
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.currentTarget.getAttribute('data-job-id');
            if (jobId) {
                applyJob(jobId);
            }
        });
    });
    
    // 查看详情按钮
    document.querySelectorAll('.detail-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.currentTarget.getAttribute('data-job-id');
            if (jobId) {
                viewJobDetail(jobId);
            }
        });
    });
    
    // 收藏按钮
    document.querySelectorAll('.favorite-btn').forEach(button => {
        const jobId = parseInt(button.getAttribute('data-job-id')); // 转换为整数
        if (jobId && currentUser && currentUser.role === 'job-seeker') {
            button.style.display = '';
            
            // 检查收藏状态
            JobSeekerApi.checkFavoriteJobApi({ 
                userId: currentUser.userId, 
                jobId: jobId 
            }).then(res => {
                if (res && res.success && res.data === true) {
                    button.classList.add('favorited');
                    button.textContent = '已收藏';
                }
            }).catch(() => {});
            
            // 点击事件
            button.addEventListener('click', async (e) => {
                e.stopPropagation();
                const isFavorited = button.classList.contains('favorited');
                
                if (isFavorited) {
                    // 取消收藏
                    const result = await JobSeekerApi.removeFavoriteJobApi({ 
                        userId: currentUser.userId, 
                        jobId: jobId 
                    });
                    
                    if (result.success) {
                        button.classList.remove('favorited');
                        button.textContent = '收藏';
                    } else {
                        alert(result.message || '取消收藏失败');
                    }
                } else {
                    // 添加收藏
                    const result = await JobSeekerApi.addFavoriteJobApi({ 
                        userId: currentUser.userId, 
                        jobId: jobId 
                    });
                    
                    if (result.success) {
                        button.classList.add('favorited');
                        button.textContent = '已收藏';
                    } else {
                        alert(result.message || '收藏失败');
                    }
                }
            });
        }
    });
}

/**
 * 对HTML特殊字符进行转义，防止XSS攻击
 * @param {string} unsafe - 可能包含HTML的字符串
 * @returns {string} - 转义后的安全字符串
 */
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function applyJob(jobId) {
    const currentUser = window.Auth && Auth.getCurrentUser ? Auth.getCurrentUser() : null;
    if (!currentUser || currentUser.role !== 'job-seeker') {
        alert('请先以求职者身份登录后再投递简历。');
        return;
    }

    const resumeResult = await fetchUserResumesApi(currentUser.userId);
    if (!resumeResult.success) {
        alert(resumeResult.message || '加载简历列表失败');
        return;
    }
    const resumes = resumeResult.data || [];
    if (resumes.length === 0) {
        alert('您还没有简历，请先在"我的简历"中创建简历。');
        return;
    }

    const optionsText = resumes.map((r, index) => {
        // 修复简历标题显示问题
        const title = r.resumeName || r.title || '未命名简历';
        return `${index + 1}. ${title}`;
    }).join('\n');
    
    const input = prompt(`请选择要用于投递的简历编号：\n${optionsText}`);
    if (!input) return;
    const index = parseInt(input, 10) - 1;
    if (Number.isNaN(index) || index < 0 || index >= resumes.length) {
        alert('输入的编号无效');
        return;
    }

    const chosenResume = resumes[index];

    const payload = {
        userId: currentUser.userId,
        jobId: jobId,
        resumeId: chosenResume.resumeId
    };

    if (!window.JobSeekerApi || typeof JobSeekerApi.applyJobApi !== 'function') {
        alert('职位申请接口未就绪');
        return;
    }

    const result = await JobSeekerApi.applyJobApi(payload);
    if (!result.success) {
        alert(result.message || '投递失败');
        return;
    }

    alert('投递成功！您可以在"我的申请"中查看投递记录。');
}

async function viewJobDetail(jobId) {
    try {
        const resp = await fetch(`${API_BASE_URL}/job/info/${encodeURIComponent(jobId)}`);
        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误：${resp.status} ${text}`);
            return;
        }
        const job = await resp.json();
        const msg = `职位：${job.jobName || ''}
公司：${job.companyName || ''}
地点：${job.city || ''}
经验要求：${job.workExperience || ''}
学历要求：${job.education || ''}
薪资范围：${(job.salaryMin || 0) / 1000}K - ${(job.salaryMax || 0) / 1000}K

职位描述：
${job.jobDesc || ''}`;
        alert(msg);
    } catch (e) {
        console.error('查看职位详情异常:', e);
        alert('请求异常，请稍后重试');
    }
}