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
    
    // 检查是否有预设的搜索参数
    const urlParams = new URLSearchParams(window.location.search);
    const jobName = urlParams.get('jobName');
    const city = urlParams.get('city');
    const education = urlParams.get('education');
    const workExperience = urlParams.get('workExperience');
    const salaryMin = urlParams.get('salaryMin');
    const salaryMax = urlParams.get('salaryMax');
    
    // 设置表单控件的值
    if (jobName) {
        document.getElementById('job-search-input').value = jobName;
    }
    
    if (city) {
        document.getElementById('location-filter').value = city;
    }
    
    if (education) {
        document.getElementById('education-filter').value = education;
    }
    
    if (workExperience) {
        document.getElementById('experience-filter').value = workExperience;
    }
    
    if (salaryMin) {
        document.getElementById('salary-min').value = salaryMin;
    }
    
    if (salaryMax) {
        document.getElementById('salary-max').value = salaryMax;
    }
    
    // 初始化分页并执行搜索
    window.jobSearchPagination = {
        current: 1,
        size: 10,
        total: 0,
        pages: 0
    };
    
    // 执行初始搜索
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

async function searchJobs() {
    const searchInput = document.getElementById('job-search-input');
    const locationFilter = document.getElementById('location-filter');
    const educationFilter = document.getElementById('education-filter');
    const experienceFilter = document.getElementById('experience-filter');
    const salaryMin = document.getElementById('salary-min');
    const salaryMax = document.getElementById('salary-max');
    const jobListContainer = document.getElementById('job-list');
    const resultsCountEl = document.getElementById('results-count');
    const paginationContainer = document.getElementById('pagination-container');
    const paginationInfo = document.getElementById('pagination-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (!jobListContainer) return;

    // 显示加载状态
    jobListContainer.innerHTML = '<div style="text-align:center;padding:40px;">搜索中...</div>';

    try {
        // 构建查询参数（确保编码）
        const params = new URLSearchParams({
            current: window.jobSearchPagination.current,
            size: window.jobSearchPagination.size,
            // 默认只显示已发布的职位
            publishStatus: 1
        });
        
        const jobName = searchInput ? searchInput.value.trim() : '';
        const city = locationFilter ? locationFilter.value : '';
        const education = educationFilter ? educationFilter.value : '';
        const workExperience = experienceFilter ? experienceFilter.value : '';
        const salaryMinValue = salaryMin ? salaryMin.value : '';
        const salaryMaxValue = salaryMax ? salaryMax.value : '';
        
        if (jobName) params.append('jobName', jobName);
        if (city) params.append('city', city);
        if (education) params.append('education', education);
        if (workExperience) params.append('workExperience', workExperience);
        if (salaryMinValue) params.append('salaryMin', salaryMinValue);
        if (salaryMaxValue) params.append('salaryMax', salaryMaxValue);

        const url = `${API_BASE_URL}/job/info/list?${params.toString()}`;
        const result = await apiRequest(url);

        if (!result.success) {
            throw new Error(result.message || '获取职位列表失败');
        }

        const data = result.data;
        // 后端返回的结构是 IPage，职位列表在 records 字段中
        renderJobList(data && data.records ? data.records : []);

        // 更新分页信息
        if (data) {
            window.jobSearchPagination.total = data.total || 0;
            window.jobSearchPagination.pages = data.pages || Math.ceil((data.total || 0) / window.jobSearchPagination.size) || 0;

            // 显示总数信息
            if (resultsCountEl) {
                resultsCountEl.textContent = `共找到 ${window.jobSearchPagination.total} 个职位`;
            }

            if (paginationInfo) {
                paginationInfo.textContent = `第 ${window.jobSearchPagination.current} 页，共 ${window.jobSearchPagination.pages} 页`;
            }

            if (paginationContainer) {
                paginationContainer.style.display = 'flex';
            }

            if (prevBtn) {
                prevBtn.disabled = window.jobSearchPagination.current <= 1;
                prevBtn.onclick = () => {
                    if (window.jobSearchPagination.current > 1) {
                        window.jobSearchPagination.current--;
                        searchJobs();
                    }
                };
            }

            if (nextBtn) {
                nextBtn.disabled = window.jobSearchPagination.current >= window.jobSearchPagination.pages;
                nextBtn.onclick = () => {
                    if (window.jobSearchPagination.current < window.jobSearchPagination.pages) {
                        window.jobSearchPagination.current++;
                        searchJobs();
                    }
                };
            }
        }
    } catch (error) {
        console.error('搜索职位失败:', error);
        jobListContainer.innerHTML = `<div style="text-align:center;padding:40px;color:red;">搜索失败: ${error.message || '未知错误'}</div>`;
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
    // 使用 apiRequest 替代 Auth.authenticatedFetch 以适配新的统一返回格式
    apiRequest('/api/job/info/cities')
        .then(result => {
            if (result.success && Array.isArray(result.data)) {
                result.data.forEach(city => {
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
        // 使用 apiRequest 替代 Auth.authenticatedFetch 以适配新的统一返回格式
        const result = await apiRequest(`${API_BASE_URL}/job/info/${encodeURIComponent(jobId)}`);
        if (!result.success) {
            alert(result.message || '获取职位详情失败');
            return;
        }
        const job = result.data;
        
        // 生成完整的地址信息
        let fullAddress = '';
        if (job.province) fullAddress += job.province;
        if (job.city) fullAddress += '-' + job.city;
        if (job.district) fullAddress += '-' + job.district;
        
        // 通过公司ID获取公司联系方式
        let contactInfo = '';
        if (job.companyId) {
            try {
                // 使用 apiRequest 替代 Auth.authenticatedFetch 以适配新的统一返回格式
                const companyResult = await apiRequest(`${API_BASE_URL}/company/${encodeURIComponent(job.companyId)}`);
                if (companyResult.success && companyResult.data) {
                    if (companyResult.data.contactPhone) contactInfo += `\n联系电话：${companyResult.data.contactPhone}`;
                    if (companyResult.data.contactEmail) contactInfo += `\n联系邮箱：${companyResult.data.contactEmail}`;
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
