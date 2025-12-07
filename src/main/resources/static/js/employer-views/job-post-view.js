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
                        <label>工作经验要求</label>
                        <input type="text" id="job-experience" placeholder="如：3-5年">
                    </div>
                    <div class="form-group">
                        <label>学历要求</label>
                        <input type="text" id="job-education" placeholder="如：本科">
                    </div>
                </div>

                <div class="form-group">
                    <label>职位描述 *</label>
                    <textarea id="job-description" rows="6" required></textarea>
                </div>

                <div class="form-group">
                    <label>技能要求</label>
                    <textarea id="job-skills" rows="4" placeholder="如：熟练掌握Java、SpringBoot"></textarea>
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
    const province = document.getElementById('job-province').value.trim();
    const city = document.getElementById('job-city').value.trim();
    const district = document.getElementById('job-district').value.trim();
    const experience = document.getElementById('job-experience').value.trim();
    const education = document.getElementById('job-education').value.trim();
    const description = document.getElementById('job-description').value.trim();
    const skills = document.getElementById('job-skills').value.trim();
    const requirements = document.getElementById('job-requirements').value.trim();

    if (!title || !salaryText || !province || !city || !description) {
        alert('请填写所有必填字段（带*的）');
        return;
    }

    // 解析薪资：形如 "20K-35K"
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
        companyId: user.companyId || null,
        publisherId: user.userId,
        province,
        city,
        district: district || null,
        salaryMin,
        salaryMax,
        workExperience: experience || null,
        education: education || null,
        skillRequire: skills || null,
        jobDesc: description,
        // "职位要求" 映射到任职资格 qualification
        qualification: requirements || null
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