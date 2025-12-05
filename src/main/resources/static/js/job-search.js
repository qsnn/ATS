const API_BASE_URL = 'http://124.71.101.139:10085/api';

/**
 * 根据条件搜索职位
 */
async function searchJobs() {
    const jobName = document.getElementById('job-search-input').value.trim();
    const city = document.getElementById('location-filter').value;
    const education = document.getElementById('education-filter').value;
    const workExperience = document.getElementById('experience-filter').value;

    // 构建查询参数
    const params = new URLSearchParams({
        current: 1, // 默认请求第一页
        size: 20,   // 每页显示20条
    });
    if (jobName) {
        params.append('jobName', jobName);
    }
    if (city) {
        params.append('city', city);
    }
    if (education) {
        params.append('education', education);
    }
    if (workExperience) {
        params.append('workExperience', workExperience);
    }

    try {
        // 修正了API的请求URL
        const response = await fetch(`${API_BASE_URL}/job/info/list?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // 后端返回的数据结构是 IPage，职位列表在 records 字段中
        renderJobList(data.records);
    } catch (error) {
        console.error('获取职位列表失败:', error);
        const jobListContainer = document.getElementById('job-list');
        jobListContainer.innerHTML = '<p>加载职位信息失败，请稍后重试。</p>';
    }
}

/**
 * 将职位数据渲染到页面上
 * @param {Array} jobs - 职位对象数组 (JobInfoDetailDto)
 */
function renderJobList(jobs) {
    const jobListContainer = document.getElementById('job-list');
    jobListContainer.innerHTML = ''; // 清空现有列表

    if (!jobs || jobs.length === 0) {
        jobListContainer.innerHTML = '<p>未找到相关职位。</p>';
        return;
    }

    jobs.forEach(job => {
        const salary = `${(job.salaryMin / 1000).toFixed(0)}K-${(job.salaryMax / 1000).toFixed(0)}K`;
        const jobCard = `
                    <div class="card job-card">
                        <div class="job-header">
                            <h3>${escapeHtml(job.jobName)}</h3>
                            <span class="salary">¥${salary}</span>
                        </div>
                        <div class="job-info">
                            <span class="company">${escapeHtml(job.companyName || '')}</span>
                            <span class="location">${escapeHtml(job.city)}</span>
                            <span class="experience">${escapeHtml(job.workExperience)}</span>
                            <span class="education">${escapeHtml(job.education)}</span>
                        </div>
                        <div class="job-description">
                            ${escapeHtml((job.jobDesc || '').substring(0, 100))}...
                        </div>
                        <div class="job-actions">
                            <button class="btn btn-primary" onclick="applyJob(${job.jobId})">提交简历</button>
                            <button class="btn" onclick="viewJobDetail(${job.jobId})">查看详情</button>
                        </div>
                    </div>
                `;
        jobListContainer.innerHTML += jobCard;
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