function renderJobSearchView(container, currentUser) {
    container.innerHTML = `
        <div class="view job-search-view active">
            <div class="dashboard-header">
                <h2>职位搜索</h2>
                <div class="search-box">
                    <input type="text" id="job-search-input" placeholder="搜索职位、公司或关键词...">
                    <button class="btn btn-primary" id="job-search-btn">搜索</button>
                </div>
            </div>
            <div class="filter-controls">
                <h4>筛选条件</h4>
                <select id="location-filter">
                    <option value="">工作地点</option>
                    <option value="北京">北京</option>
                    <option value="上海">上海</option>
                    <option value="深圳">深圳</option>
                </select>
                <select id="education-filter">
                    <option value="">学历要求</option>
                    <option value="大专">大专</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                </select>
                <select id="experience-filter">
                    <option value="">工作经验</option>
                    <option value="1-3年">1-3年</option>
                    <option value="3-5年">3-5年</option>
                </select>
            </div>
            <div class="job-list" id="job-list"></div>
        </div>
    `;

    // 事件绑定（防御式）
    const btn = document.getElementById('job-search-btn');
    const loc = document.getElementById('location-filter');
    const edu = document.getElementById('education-filter');
    const exp = document.getElementById('experience-filter');

    // 如果页面没有引入 job-search.js，searchJobs 可能不存在；做存在性检查
    const searchFn = (typeof debouncedSearchJobs === 'function') ? debouncedSearchJobs : (typeof searchJobs === 'function' ? searchJobs : null);

    if (btn && searchFn) btn.addEventListener('click', () => searchFn());
    if (loc && searchFn) loc.addEventListener('change', () => searchFn());
    if (edu && searchFn) edu.addEventListener('change', () => searchFn());
    if (exp && searchFn) exp.addEventListener('change', () => searchFn());

    // 初始搜索
    if (searchFn) searchFn();
}