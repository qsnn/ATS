const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : '/api';

// 简单防抖工具
function debounce(fn, wait) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

// 全局分页状态
window.jobSearchPagination = {
    current: 1,
    size: 20,
    total: 0,
    pages: 0
};

/**
 * 根据条件搜索职位
 */
async function searchJobs() {
    const inputEl = document.getElementById('job-search-input');
    const locEl = document.getElementById('location-filter');
    const eduEl = document.getElementById('education-filter');
    const expEl = document.getElementById('experience-filter');
    const salaryMinEl = document.getElementById('salary-min');
    const salaryMaxEl = document.getElementById('salary-max');
    const jobListContainer = document.getElementById('job-list');
    const paginationContainer = document.getElementById('pagination-container');
    const paginationInfo = document.getElementById('pagination-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (!jobListContainer) return; // 无容器则不渲染

    const jobName = inputEl ? inputEl.value.trim() : '';
    const city = locEl ? locEl.value : '';
    const education = eduEl ? eduEl.value : '';
    const workExperience = expEl ? expEl.value : '';
    const salaryMin = salaryMinEl ? salaryMinEl.value : '';
    const salaryMax = salaryMaxEl ? salaryMaxEl.value : '';

    // 构建查询参数（确保编码）
    const params = new URLSearchParams({
        current: window.jobSearchPagination.current,
        size: window.jobSearchPagination.size,
        // 默认只显示已发布的职位
        publishStatus: 1
    });
    if (jobName) params.append('jobName', jobName);
    if (city) params.append('city', city);
    if (education) params.append('education', education);
    if (workExperience) params.append('workExperience', workExperience);
    if (salaryMin) params.append('salaryMin', salaryMin);
    if (salaryMax) params.append('salaryMax', salaryMax);

    try {
        const url = `${API_BASE_URL}/job/info/list?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // 后端返回的结构是 IPage，职位列表在 records 字段中
        renderJobList(data && data.records ? data.records : []);
        
        // 更新分页信息
        if (data) {
            window.jobSearchPagination.total = data.total || 0;
            window.jobSearchPagination.pages = data.pages || 0;
            
            if (paginationInfo) {
                paginationInfo.textContent = `第 ${window.jobSearchPagination.current} 页，共 ${window.jobSearchPagination.pages} 页`;
            }
            
            if (paginationContainer) {
                paginationContainer.style.display = 'flex';
            }
            
            if (prevBtn) {
                prevBtn.disabled = window.jobSearchPagination.current <= 1;
            }
            
            if (nextBtn) {
                nextBtn.disabled = window.jobSearchPagination.current >= window.jobSearchPagination.pages;
            }
        }
    } catch (error) {
        console.error('获取职位列表失败:', error);
        if (jobListContainer) jobListContainer.innerHTML = '<p>加载职位信息失败，请稍后重试。</p>';
    }
}

// 使用防抖包装的搜索函数，减少输入时的请求次数
const debouncedSearchJobs = debounce(searchJobs, 300);

/**
 * 将职位数据渲染到页面上
 * @param {Array} jobs - 职位对象数组 (JobInfoDetailDto)
 */
function renderJobList(jobs) {
    const jobListContainer = document.getElementById('job-list');
    if (!jobListContainer) return;
    jobListContainer.innerHTML = '';

    if (!jobs || jobs.length === 0) {
        jobListContainer.innerHTML = '<p>未找到相关职位。</p>';
        return;
    }

    const currentUser = window.Auth && Auth.getCurrentUser ? Auth.getCurrentUser() : null;

    jobs.forEach(job => {
        const min = job.salaryMin || 0;
        const max = job.salaryMax || 0;
        const salary = `${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`;

        const div = document.createElement('div');
        div.className = 'card job-card';

        const inner = document.createElement('div');
        inner.innerHTML = `
            <div class="job-header">
                <h3>${escapeHtml(job.jobName)}</h3>
                <span class="salary">¥${salary}</span>
            </div>
            <div class="job-info">
                <span class="company">${escapeHtml(job.companyName || '')}</span>
                <span class="location">${escapeHtml(job.city || '')}</span>
                <span class="experience">${escapeHtml(job.workExperience || '')}</span>
                <span class="education">${escapeHtml(job.education || '')}</span>
            </div>
            <div class="job-description">
                ${escapeHtml((job.jobDesc || '').substring(0, 100))}...
            </div>
            <div class="job-actions">
                <button class="btn btn-primary apply-btn">提交简历</button>
                <button class="btn detail-btn">查看详情</button>
                <button class="btn favorite-btn" style="display:none;">收藏</button>
            </div>
        `;
        div.appendChild(inner);

        const applyBtn = div.querySelector('.apply-btn');
        const detailBtn = div.querySelector('.detail-btn');
        const favoriteBtn = div.querySelector('.favorite-btn');

        if (applyBtn) {
            applyBtn.onclick = () => {
                if (typeof applyJob === 'function') applyJob(job.jobId);
            };
        }

        if (detailBtn) {
            detailBtn.onclick = () => {
                if (typeof viewJobDetail === 'function') viewJobDetail(job.jobId);
            };
        }

        if (favoriteBtn && currentUser && currentUser.role === 'job-seeker' && window.JobSeekerApi && typeof JobSeekerApi.addFavoriteJobApi === 'function') {
            favoriteBtn.style.display = '';
            favoriteBtn.textContent = '收藏';

            // 初始化收藏状态
            JobSeekerApi.checkFavoriteJobApi({ userId: currentUser.userId, jobId: job.jobId }).then(res => {
                if (res && res.success && res.data === true) {
                    favoriteBtn.textContent = '已收藏';
                    favoriteBtn.classList.add('favorited');
                }
            }).catch(() => {});

            favoriteBtn.onclick = async () => {
                if (!favoriteBtn.classList.contains('favorited')) {
                    const result = await JobSeekerApi.addFavoriteJobApi({ userId: currentUser.userId, jobId: job.jobId });
                    if (!result.success) {
                        alert(result.message || '收藏失败');
                        return;
                    }
                    favoriteBtn.textContent = '已收藏';
                    favoriteBtn.classList.add('favorited');
                } else {
                    const result = await JobSeekerApi.removeFavoriteJobApi({ userId: currentUser.userId, jobId: job.jobId });
                    if (!result.success) {
                        alert(result.message || '取消收藏失败');
                        return;
                    }
                    favoriteBtn.textContent = '收藏';
                    favoriteBtn.classList.remove('favorited');
                }
            };
        }

        jobListContainer.appendChild(div);
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

// 分页功能
function goToPreviousPage() {
    if (window.jobSearchPagination.current > 1) {
        window.jobSearchPagination.current--;
        searchJobs();
    }
}

function goToNextPage() {
    if (window.jobSearchPagination.current < window.jobSearchPagination.pages) {
        window.jobSearchPagination.current++;
        searchJobs();
    }
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
        alert('您还没有简历，请先在“我的简历”中创建简历。');
        return;
    }

    const optionsText = resumes.map((r, index) => `${index + 1}. ${r.resumeName || '未命名简历'}`).join('\n');
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

    alert('投递成功！您可以在“我的申请”中查看投递记录。');
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
部门：${job.department || ''}
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