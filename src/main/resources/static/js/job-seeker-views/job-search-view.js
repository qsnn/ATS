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
                                <option value="博士">博士</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>工作经验</label>
                            <select id="experience-filter" class="filter-select">
                                <option value="">不限经验</option>
                                <option value="应届生">应届生</option>
                                <option value="1年以下">1年以下</option>
                                <option value="1-3年">1-3年</option>
                                <option value="3-5年">3-5年</option>
                                <option value="5-10年">5-10年</option>
                                <option value="10年以上">10年以上</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>薪资范围</label>
                            <select id="salary-filter" class="filter-select">
                                <option value="">不限薪资</option>
                                <option value="0-5000">5K以下</option>
                                <option value="5000-10000">5K-10K</option>
                                <option value="10000-15000">10K-15K</option>
                                <option value="15000-20000">15K-20K</option>
                                <option value="20000-30000">20K-30K</option>
                                <option value="30000-50000">30K-50K</option>
                                <option value="50000">50K以上</option>
                            </select>
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
    const salaryFilter = document.getElementById('salary-filter');
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

    // TODO: 如后端提供城市列表接口，可在此通过 fetch 动态加载
    // 目前使用静态示例城市列表，保证功能可用且不再报错
    const cities = [
        '北京',
        '上海',
        '广州',
        '深圳',
        '杭州',
        '南京',
        '苏州',
        '成都',
        '武汉',
        '西安'
    ];

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        locationSelect.appendChild(option);
    });
}
