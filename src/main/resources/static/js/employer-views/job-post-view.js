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
    const jobData = {
        title: document.getElementById('job-title').value.trim(),
        salary: document.getElementById('job-salary').value.trim(),
        location: document.getElementById('job-location').value.trim(),
        experience: document.getElementById('job-experience').value.trim(),
        description: document.getElementById('job-description').value.trim(),
        requirements: document.getElementById('job-requirements').value.trim(),
        employerId: user.userId
    };

    // 验证必填字段
    if (!jobData.title || !jobData.salary || !jobData.location || !jobData.description) {
        alert('请填写所有必填字段（带*的）');
        return;
    }

    try {
        // 这里替换为实际的发布职位API
        // const resp = await fetch('http://xxx/api/job', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(jobData)
        // });

        // 模拟成功
        alert('职位发布成功（模拟）');
        document.getElementById('post-job-form').reset();

        // 可选：切换到管理标签页查看
        // switchTab('manage');
    } catch (e) {
        console.error('发布职位失败:', e);
        alert('发布失败，请稍后重试');
    }
}