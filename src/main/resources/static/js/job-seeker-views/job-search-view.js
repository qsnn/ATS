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
                            <label>学历要求</label>
                            <select id="education-filter" class="filter-select">
                                <option value="">不限学历</option>
                                <option value="大专">大专</option>
                                <option value="本科">本科</option>
                                <option value="硕士">硕士</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>工作经验</label>
                            <select id="experience-filter" class="filter-select">
                                <option value="">不限经验</option>
                                <option value="0">应届生</option>
                                <option value="1">1年及以上</option>
                                <option value="3">3年及以上</option>
                                <option value="5">5年及以上</option>
                                <option value="10">10年及以上</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>薪资范围</label>
                            <div style="display: flex; gap: 5px; align-items: center;">
                                <input type="number" id="salary-min" placeholder="最低薪资" class="filter-select" style="flex: 1; min-width: 0;">
                                <span>-</span>
                                <input type="number" id="salary-max" placeholder="最高薪资" class="filter-select" style="flex: 1; min-width: 0;">
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
                    <span id="results-count">正在加载职位...</span>
                </div>
                <div class="sort-options">
                    <label>排序:</label>
                    <select id="sort-order" class="filter-select">
                        <option value="update_time_desc">最新发布</option>
                        <option value="salary_desc">薪资最高</option>
                        <option value="salary_asc">薪资最低</option>
                    </select>
                </div>
            </div>
            
            <div class="job-list" id="job-list">
                <div class="loading-placeholder">正在加载职位信息...</div>
            </div>
            
            <div class="pagination" id="pagination-container" style="display: none;">
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
    window.currentSearchState = {
        current: 1,
        size: 10,
        total: 0
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
    const sortOrder = document.getElementById('sort-order');
    const resetBtn = document.getElementById('reset-filters');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    // 搜索事件
    const triggerSearch = () => {
        window.currentSearchState.current = 1; // 重置到第一页
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
    salaryFilter.addEventListener('change', triggerSearch);
    sortOrder.addEventListener('change', triggerSearch);
    
    // 重置筛选
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        locationFilter.value = '';
        educationFilter.value = '';
        experienceFilter.value = '';
        salaryFilter.value = '';
        sortOrder.value = 'update_time_desc';
        triggerSearch();
    });
    
    // 分页事件
    prevBtn.addEventListener('click', () => {
        if (window.currentSearchState.current > 1) {
            window.currentSearchState.current--;
            searchJobs();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const { current, size, total } = window.currentSearchState;
        const totalPages = Math.ceil(total / size);
        if (current < totalPages) {
            window.currentSearchState.current++;
            searchJobs();
        }
    });
}

function initCityFilter() {
    const locationSelect = document.getElementById('location-filter');
    if (!locationSelect) {
        return;
    }

    // 保留第一个“全部城市”选项，清空其他动态选项
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
    fetch('/api/job/info/cities')
        .then(response => response.json())
        .then(cities => {
            if (Array.isArray(cities)) {
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    locationSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('获取城市列表失败:', error);
            // 如果获取失败，可以添加一些默认选项或提示
        });
}
