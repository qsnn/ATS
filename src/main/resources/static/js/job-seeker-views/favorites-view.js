// language: javascript
function renderFavoritesView(container, currentUser) {
    container.innerHTML = `
        <div class="view favorites-view active">
            <h2>我的收藏</h2>
            <div id="favorites-status" style="margin-bottom:8px;color:#666;">正在加载收藏职位...</div>
            <div class="job-list" id="favorite-job-list"></div>
        </div>
    `;

    loadFavoriteJobs(currentUser);
}

async function loadFavoriteJobs(currentUser) {
    const statusEl = document.getElementById('favorites-status');
    const listEl = document.getElementById('favorite-job-list');
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
            current: 1,
            size: 20
        });
        if (!result.success) {
            if (statusEl) statusEl.textContent = result.message || '加载失败';
            return;
        }
        const page = result.data || {};
        const records = page.records || [];

        if (records.length === 0) {
            if (statusEl) statusEl.textContent = '暂无收藏职位。去职位搜索页看看吧~';
            return;
        }

        if (statusEl) statusEl.textContent = `共 ${page.total || records.length} 条收藏职位`;

        records.forEach(fav => {
            const card = document.createElement('div');
            card.className = 'card job-card';
            card.innerHTML = `
                <div class="job-header">
                    <h3>${escapeHtml(fav.jobTitle || '')}</h3>
                </div>
                <div class="job-info">
                    <span class="company">公司ID: ${fav.companyId || ''}</span>
                </div>
                <div class="job-actions">
                    <button class="btn" data-job-id="${fav.jobId}">查看详情</button>
                    <button class="btn btn-success" data-apply-job-id="${fav.jobId}">使用简历投递</button>
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
                applyBtn.onclick = () => openApplyFromFavoriteModal(currentUser, fav.jobId);
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
                };
            }

            listEl.appendChild(card);
        });
    } catch (e) {
        console.error('加载收藏职位异常:', e);
        if (statusEl) statusEl.textContent = '请求异常，请稍后重试';
    }
}

async function openApplyFromFavoriteModal(currentUser, jobId) {
    if (!currentUser || !jobId) return;
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

    // 构造简易选择框
    const options = resumes.map(r => `${r.resumeId}:${r.resumeName || '未命名简历'}`).join('\n');
    const input = prompt(`请选择用于投递的简历（输入编号前的ID）：\n${options}`, resumes[0].resumeId);
    if (input === null) return;
    const resumeId = Number(input);
    if (!resumeId || !resumes.find(r => r.resumeId === resumeId)) {
        alert('无效的简历ID');
        return;
    }

    if (!window.JobSeekerApi || typeof JobSeekerApi.applyJobApi !== 'function') {
        alert('投递接口未就绪');
        return;
    }

    const payload = {
        userId: currentUser.userId,
        jobId,
        resumeId
    };

    const result = await JobSeekerApi.applyJobApi(payload);
    if (!result.success) {
        alert(result.message || '投递失败');
        return;
    }
    alert('投递成功');
}
