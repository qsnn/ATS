function renderJobPostView(container, currentUser) {
    container.innerHTML = `
        <h2>发布新职位</h2>
        <div class="card">
            <form id="post-job-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>职位名称 *</label>
                        <input type="text" id="job-title" required>
                    </div>
                    <div class="form-group">
                        <label>薪资范围 *</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="number" id="job-salary-min" placeholder="最低薪资" required style="flex: 1;">
                            <span>-</span>
                            <input type="number" id="job-salary-max" placeholder="最高薪资" required style="flex: 1;">
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>省份 *</label>
                        <input type="text" id="job-province" required>
                    </div>
                    <div class="form-group">
                        <label>城市 *</label>
                        <input type="text" id="job-city" required>
                    </div>
                    <div class="form-group">
                        <label>地区</label>
                        <input type="text" id="job-district">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>工作经验要求（最少年限）</label>
                        <select id="job-experience">
                            <option value="0">应届生</option>
                            <option value="1">1年及以上</option>
                            <option value="2">2年及以上</option>
                            <option value="3">3年及以上</option>
                            <option value="4">4年及以上</option>
                            <option value="5">5年及以上</option>
                            <option value="6">6年及以上</option>
                            <option value="7">7年及以上</option>
                            <option value="8">8年及以上</option>
                            <option value="9">9年及以上</option>
                            <option value="10">10年及以上</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>学历要求</label>
                        <select id="job-education">
                            <option value="硕士">硕士</option>
                            <option value="本科" selected>本科</option>
                            <option value="大专">大专</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>职位描述 *</label>
                    <textarea id="job-description" rows="6" required></textarea>
                </div>

                <button type="submit" class="btn btn-primary">发布职位</button>
            </form>
        </div>
    `;

    document.getElementById('post-job-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await postJob(currentUser);
    });
}

async function postJob(user) {
    const title = document.getElementById('job-title').value.trim();
    const salaryMinInput = document.getElementById('job-salary-min').value;
    const salaryMaxInput = document.getElementById('job-salary-max').value;
    const province = document.getElementById('job-province').value.trim();
    const city = document.getElementById('job-city').value.trim();
    const district = document.getElementById('job-district').value.trim();
    const experience = document.getElementById('job-experience').value;
    const education = document.getElementById('job-education').value;
    const description = document.getElementById('job-description').value.trim();

    if (!title || !salaryMinInput || !salaryMaxInput || !province || !city || !description) {
        alert('请填写所有必填字段（带*的）');
        return;
    }

    // 验证薪资输入
    const salaryMin = parseFloat(salaryMinInput);
    const salaryMax = parseFloat(salaryMaxInput);
    
    if (isNaN(salaryMin) || isNaN(salaryMax)) {
        alert('请填写有效的数字薪资');
        return;
    }
    
    if (salaryMin >= salaryMax) {
        alert('最低薪资必须小于最高薪资');
        return;
    }

    const jobInfo = {
        jobName: title,
        companyId: user.companyId || null,
        publisherId: user.userId,
        province,
        city,
        district: district || null,
        salaryMin,
        salaryMax,
        workExperience: experience ? parseInt(experience) : null,
        education: education || null,
        jobDesc: description
    };

    try {
        // 使用 Auth.authenticatedFetch 确保携带 JWT 令牌
        const resp = await Auth.authenticatedFetch(`${JOB_API_BASE}/saveOrUpdate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobInfo)
        });

        if (!resp.ok) {
            const text = await resp.text();
            alert(`网络错误: ${resp.status} ${text}`);
            return;
        }
        const ok = await resp.json();
        if (!ok) {
            alert('发布职位失败');
            return;
        }

        alert('职位发布成功！');
        document.getElementById('post-job-form').reset();
        // 可选：切换到职位管理 Tab
        // switchTab('manage');
    } catch (e) {
        console.error('发布职位失败:', e);
        alert('发布失败，请稍后重试');
    }
}