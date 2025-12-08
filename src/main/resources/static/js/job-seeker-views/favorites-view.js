// language: javascript
function renderFavoritesView(container, currentUser) {
    container.innerHTML = `
        <div class="view favorites-view active">
            <h2>我的收藏</h2>
            <div id="favorites-status" style="margin-bottom:8px;color:#666;">正在加载收藏职位...</div>
            <div class="job-list" id="favorite-job-list"></div>
            <div class="pagination" id="favorites-pagination" style="justify-content: center; align-items: center; gap: 10px; margin-top: 20px;">
                <button class="btn pagination-btn" id="favorites-prev-page">上一页</button>
                <span class="pagination-info" id="favorites-pagination-info"></span>
                <button class="btn pagination-btn" id="favorites-next-page">下一页</button>
            </div>
        </div>
    `;

    // 初始化分页状态
    window.favoritesPagination = {
        current: 1,
        size: 20,
        total: 0,
        pages: 0
    };

    loadFavoriteJobs(currentUser);
}

async function loadFavoriteJobs(currentUser) {
    const statusEl = document.getElementById('favorites-status');
    const listEl = document.getElementById('favorite-job-list');
    const paginationContainer = document.getElementById('favorites-pagination');
    const paginationInfo = document.getElementById('favorites-pagination-info');
    const prevBtn = document.getElementById('favorites-prev-page');
    const nextBtn = document.getElementById('favorites-next-page');

    if (!listEl || !currentUser) return;

    if (statusEl) statusEl.textContent = '正在加载收藏职位...';
    listEl.innerHTML = '';

    if (!window.JobSeekerApi || typeof JobSeekerApi.fetchMyFavoriteJobsApi !== 'function') {
        if (statusEl) statusEl.textContent = '收藏接口未就绪';
        return;
    }

    try {
        const result = await JobSeekerApi.fetchMyFavoriteJobsApi({
            userId: currentUser.userId,
            current: window.favoritesPagination.current,
            size: window.favoritesPagination.size
        });
        if (!result.success) {
            if (statusEl) statusEl.textContent = result.message || '加载失败';
            return;
        }
        const page = result.data || {};
        const records = page.records || [];

        if (records.length === 0) {
            if (statusEl) statusEl.textContent = '暂无收藏职位。去职位搜索页看看吧~';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        // 更新分页信息
        window.favoritesPagination.total = page.total || 0;
        window.favoritesPagination.pages = page.pages || 0;
        
        if (statusEl) statusEl.textContent = `共 ${window.favoritesPagination.total} 条收藏职位`;

        if (paginationInfo) {
            paginationInfo.textContent = `第 ${window.favoritesPagination.current} 页，共 ${window.favoritesPagination.pages} 页`;
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = window.favoritesPagination.current <= 1;
            prevBtn.onclick = () => {
                if (window.favoritesPagination.current > 1) {
                    window.favoritesPagination.current--;
                    loadFavoriteJobs(currentUser);
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = window.favoritesPagination.current >= window.favoritesPagination.pages;
            nextBtn.onclick = () => {
                if (window.favoritesPagination.current < window.favoritesPagination.pages) {
                    window.favoritesPagination.current++;
                    loadFavoriteJobs(currentUser);
                }
            };
        }

        records.forEach(fav => {
            // 检查职位是否已下架
            const isUnpublished = fav.publishStatus === 2;
            
            const card = document.createElement('div');
            card.className = 'card job-card';
            card.innerHTML = `
                <div class="job-header">
                    <h3>${escapeHtml(fav.jobTitle || '')}</h3>
                    ${isUnpublished ? '<span style="color: #ff4d4f; font-size: 12px; margin-left: 10px;">[已下架]</span>' : ''}
                </div>
                <div class="job-info">
                    <span class="company">公司: ${escapeHtml(fav.companyName || '未知公司')}</span>
                    <span class="department">部门: ${escapeHtml(fav.department || '')}</span>
                </div>
                <div class="job-actions">
                    <button class="btn" data-job-id="${fav.jobId}">查看详情</button>
                    <button class="btn btn-success" data-apply-job-id="${fav.jobId}" ${isUnpublished ? 'disabled' : ''}>使用简历投递</button>
                    <button class="btn btn-primary" data-fav-action="unfavorite" data-job-id="${fav.jobId}">取消收藏</button>
                </div>
            `;

            const detailBtn = card.querySelector('button[data-job-id]:not([data-fav-action])');
            const applyBtn = card.querySelector('button[data-apply-job-id]');
            const unfavBtn = card.querySelector('button[data-fav-action="unfavorite"]');

            if (detailBtn) {
                detailBtn.onclick = () => {
                    if (typeof viewJobDetail === 'function') {
                        viewJobDetail(fav.jobId);
                    }
                };
            }

            if (applyBtn) {
                applyBtn.onclick = () => openApplyFromFavoriteModal(currentUser, fav.jobId, fav);
            }

            if (unfavBtn && window.JobSeekerApi && typeof JobSeekerApi.removeFavoriteJobApi === 'function') {
                unfavBtn.onclick = async () => {
                    const result2 = await JobSeekerApi.removeFavoriteJobApi({
                        userId: currentUser.userId,
                        jobId: fav.jobId
                    });
                    if (!result2.success) {
                        alert(result2.message || '取消收藏失败');
                        return;
                    }
                    card.remove();
                    // 重新加载数据以更新总数
                    window.favoritesPagination.current = 1;
                    loadFavoriteJobs(currentUser);
                };
            }

            listEl.appendChild(card);
        });
    } catch (e) {
        console.error('加载收藏职位异常:', e);
        if (statusEl) statusEl.textContent = '请求异常，请稍后重试';
    }
}

async function openApplyFromFavoriteModal(currentUser, jobId, jobInfo) {
    if (!currentUser || !jobId) return;
    
    // 检查职位是否已下架
    if (jobInfo && jobInfo.publishStatus === 2) {
        alert('该职位已下架，无法投递简历');
        return;
    }
    
    // 获取当前用户的简历列表
    const res = await fetchUserResumesApi(currentUser.userId);
    if (!res.success) {
        alert(res.message || '加载简历列表失败');
        return;
    }
    const resumes = res.data || [];
    if (!resumes.length) {
        alert('您还没有简历，请先在“我的简历”中创建简历。');
        return;
    }

    // 使用与职位搜索页相同的编号选择方式：1. 简历A\n2. 简历B ...
    const optionsText = resumes
        .map((r, index) => `${index + 1}. ${r.resumeName || '未命名简历'}`)
        .join('\n');
    const input = prompt(`请选择用于投递的简历编号：\n${optionsText}`);
    if (!input) return;
    const index = parseInt(input, 10) - 1;
    if (Number.isNaN(index) || index < 0 || index >= resumes.length) {
        alert('输入的编号无效');
        return;
    }

    const chosenResume = resumes[index];

    if (!window.JobSeekerApi || typeof JobSeekerApi.applyJobApi !== 'function') {
        alert('投递接口未就绪');
        return;
    }

    const payload = {
        userId: currentUser.userId,
        jobId,
        resumeId: chosenResume.resumeId
    };

    const result = await JobSeekerApi.applyJobApi(payload);
    if (!result.success) {
        alert(result.message || '投递失败');
        return;
    }
    alert('投递成功');
}