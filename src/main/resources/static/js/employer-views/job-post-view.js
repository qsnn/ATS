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
                        <input type="text" id="job-salary" placeholder="如：¥20K-35K" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>工作地点 *</label>
                        <input type="text" id="job-location" required>
                    </div>
                    <div class="form-group">
                        <label>工作经验要求</label>
                        <input type="text" id="job-experience" placeholder="如：3-5年">
                    </div>
                </div>

                <div class="form-group">
                    <label>职位描述 *</label>
                    <textarea id="job-description" rows="6" required></textarea>
                </div>

                <div class="form-group">
                    <label>职位要求</label>
                    <textarea id="job-requirements" rows="4"></textarea>
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
    const salaryText = document.getElementById('job-salary').value.trim();
    const location = document.getElementById('job-location').value.trim();
    const experience = document.getElementById('job-experience').value.trim();
    const description = document.getElementById('job-description').value.trim();
    const requirements = document.getElementById('job-requirements').value.trim();

    if (!title || !salaryText || !location || !description) {
        alert('请填写所有必填字段（带*的）');
        return;
    }

    // 简单解析薪资，如 "20K-35K" -> 分转整数
    let salaryMin = null;
    let salaryMax = null;
    const match = salaryText.match(/(\d+)\s*K\s*-\s*(\d+)\s*K/i);
    if (match) {
        salaryMin = parseInt(match[1], 10) * 1000;
        salaryMax = parseInt(match[2], 10) * 1000;
    } else {
        alert('请按 20K-35K 格式填写薪资范围');
        return;
    }

    const jobInfo = {
        jobName: title,
        salaryMin,
        salaryMax,
        city: location,
        workExperience: experience,
        jobDesc: description,
        // 将“职位要求”映射到后端 JobInfo.qualification 字段
        qualification: requirements,
        companyId: user.companyId || null,
        publisherId: user.userId
    };

    try {
        const resp = await fetch(`${JOB_API_BASE}/saveOrUpdate`, {
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