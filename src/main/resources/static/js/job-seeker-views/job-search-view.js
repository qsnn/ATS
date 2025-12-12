function renderJobSearchView(container, currentUser) {
    container.innerHTML = `
        <div class="view job-search-view active">
            <div class="dashboard-header">
                <h2>职位搜索</h2>
            </div>
            
            <div class="search-section">
                <div class="search-bar-container">
                    <div class="search-input-wrapper">
                        <input type="text" id="job-search-input" placeholder="搜索职位、公司或关键词..." class="search-input">
                        <button class="search-button" id="job-search-btn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14.5 14.5L10.5 10.5M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" 
                                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="advanced-filters">
                    <div class="filter-row">
                        <div class="filter-group">
                            <label>工作地点</label>
                            <select id="location-filter" class="filter-select">
                                <option value="">全部城市</option>
                                <!-- 城市选项将通过API动态加载 -->
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>最低学历</label>
                            <select id="education-filter" class="filter-select">
                                <option value="">不限学历</option>
                                <option value="5">博士</option>
                                <option value="4">硕士</option>
                                <option value="3">本科</option>
                                <option value="2">大专</option>
                                <option value="1">高中</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>工作经验</label>
                            <select id="experience-filter" class="filter-select">
                                <option value="">不限经验</option>
                                <option value="0">应届生</option>
                                <option value="1">1年经验</option>
                                <option value="2">2年经验</option>
                                <option value="3">3年经验</option>
                                <option value="4">4年经验</option>
                                <option value="5">5年经验</option>
                                <option value="6">6年经验</option>
                                <option value="7">7年经验</option>
                                <option value="8">8年经验</option>
                                <option value="9">9年经验</option>
                                <option value="10">10年经验</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>薪资范围</label>
                            <div style="display: flex; gap: 5px; align-items: center;">
                                <input type="number" step="0.01" id="salary-min" placeholder="最低薪资" class="filter-select" style="flex: 1; min-width: 0;">
                                <span>-</span>
                                <input type="number" step="0.01" id="salary-max" placeholder="最高薪资" class="filter-select" style="flex: 1; min-width: 0;">
                            </div>
                        </div>
                    </div>
                    
                    <div class="filter-actions">
                        <button class="btn btn-secondary" id="reset-filters">重置筛选</button>
                    </div>
                </div>
            </div>
            
            <div class="search-results-header">
                <div class="results-info">
                    <span id="results-count"></span>
                </div>
            </div>
            
            <div class="job-list" id="job-list">
            </div>
            
            <div class="pagination" id="pagination-container" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="prev-page">上一页</button>
                <span class="pagination-info" id="pagination-info"></span>
                <button class="btn pagination-btn" id="next-page">下一页</button>
            </div>
        </div>
    `;

    // 初始化搜索组件
    initSearchComponents();
    
    // 初始化城市筛选选项
    initCityFilter();
    
    // 初始搜索
    window.jobSearchPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };
    
    searchJobs();
}

function initSearchComponents() {
    // 获取DOM元素
    const searchInput = document.getElementById('job-search-input');
    const searchBtn = document.getElementById('job-search-btn');
    const locationFilter = document.getElementById('location-filter');
    const educationFilter = document.getElementById('education-filter');
    const experienceFilter = document.getElementById('experience-filter');
    const salaryMin = document.getElementById('salary-min');
    const salaryMax = document.getElementById('salary-max');
    const resetBtn = document.getElementById('reset-filters');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    // 搜索事件
    const triggerSearch = () => {
        window.jobSearchPagination.current = 1; // 重置到第一页
        searchJobs();
    };

    // 事件监听
    searchBtn.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            triggerSearch();
        }
    });
    
    locationFilter.addEventListener('change', triggerSearch);
    educationFilter.addEventListener('change', triggerSearch);
    experienceFilter.addEventListener('change', triggerSearch);
    salaryMin.addEventListener('input', triggerSearch);
    salaryMax.addEventListener('input', triggerSearch);
    
    // 重置筛选
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        locationFilter.value = '';
        educationFilter.value = '';
        experienceFilter.value = '';
        salaryMin.value = '';
        salaryMax.value = '';
        triggerSearch();
    });
    
    // 分页事件
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (window.jobSearchPagination.current > 1) {
                window.jobSearchPagination.current--;
                searchJobs();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (window.jobSearchPagination.current < window.jobSearchPagination.pages) {
                window.jobSearchPagination.current++;
                searchJobs();
            }
        });
    }
}

function initCityFilter() {
    const locationSelect = document.getElementById('location-filter');
    if (!locationSelect) {
        return;
    }

    // 保留第一个"全部城市"选项，清空其他动态选项
    const firstOption = locationSelect.querySelector('option');
    locationSelect.innerHTML = '';
    if (firstOption) {
        locationSelect.appendChild(firstOption);
    } else {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '全部城市';
        locationSelect.appendChild(defaultOption);
    }

    // 通过API获取城市列表
    // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
    Auth.authenticatedFetch('/api/job/info/cities')
        .then(response => response.json())
        .then(cities => {
            if (Array.isArray(cities)) {
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    locationSelect.appendChild(option);
                })
            }
        })
        .catch(error => {
            console.error('获取城市列表失败:', error);
            // 如果获取失败，可以添加一些默认选项或提示
        });
}

async function viewJobDetail(jobId) {
    try {
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const resp = await Auth.authenticatedFetch(`${API_BASE_URL}/job/info/${encodeURIComponent(jobId)}`);
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
                // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
                const companyResp = await Auth.authenticatedFetch(`${API_BASE_URL}/company/${encodeURIComponent(job.companyId)}`);
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

function mapWorkExperienceText(expValue) {
    if (expValue === 0 || expValue === '0') {
        return '应届生';
    }
    
    const numValue = parseInt(expValue);
    if (isNaN(numValue) || numValue < 0) {
        return expValue;
    }
    
    return numValue + '年及以上';
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
