function renderEvaluationView(container, currentUser) {
    container.innerHTML = `
        <h2>面试评价</h2>
        <div class="card">
            <div style="margin-bottom: 15px;">
                <div class="search-box" style="max-width: 300px; display: inline-block; margin-right: 10px;">
                    <input type="text" placeholder="搜索候选人...">
                </div>
                <select onchange="filterEvaluations()">
                    <option value="">所有状态</option>
                    <option value="pending">待评价</option>
                    <option value="completed">已评价</option>
                </select>
                <button class="btn btn-primary" onclick="newEvaluation()" style="float: right;">+ 新建评价</button>
            </div>

            <table class="data-table">
                <thead>
                <tr>
                    <th>候选人</th>
                    <th>面试职位</th>
                    <th>面试时间</th>
                    <th>面试官</th>
                    <th>综合评价</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="evaluation-tbody">
                    <!-- 动态加载 -->
                </tbody>
            </table>
        </div>
    `;

    loadEvaluations();
}

async function loadEvaluations() {
    const tbody = document.getElementById('evaluation-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6">正在加载面试评价...</td></tr>';

    try {
        // 模拟数据
        const evaluations = [
            {
                id: 1,
                candidate: '张三',
                position: '前端开发工程师',
                interviewTime: '2024-01-20 10:00',
                interviewer: '王经理',
                overallScore: '85/100',
                status: '已完成'
            },
            {
                id: 2,
                candidate: '李四',
                position: 'Java开发工程师',
                interviewTime: '2024-01-19 14:00',
                interviewer: '张总监',
                overallScore: '待评价',
                status: '待评价'
            }
        ];

        tbody.innerHTML = evaluations.map(eval => `
            <tr>
                <td>${eval.candidate}</td>
                <td>${eval.position}</td>
                <td>${eval.interviewTime}</td>
                <td>${eval.interviewer}</td>
                <td>
                    <span class="${eval.status === '已完成' ? 'tag tag-success' : 'tag tag-warning'}">
                        ${eval.overallScore}
                    </span>
                </td>
                <td>
                    ${eval.status === '已完成' ?
                        `<button class="btn btn-sm" onclick="viewEvaluation(${eval.id})">查看</button>` :
                        `<button class="btn btn-primary btn-sm" onclick="completeEvaluation(${eval.id})">填写评价</button>`
                    }
                    <button class="btn btn-sm" onclick="downloadEvaluation(${eval.id})">下载</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('加载面试评价失败:', e);
        tbody.innerHTML = '<tr><td colspan="6">加载失败，请稍后重试</td></tr>';
    }
}

function viewEvaluation(evaluationId) {
    alert(`查看面试评价 ${evaluationId}（后续实现）`);
}

function completeEvaluation(evaluationId) {
    alert(`填写面试评价 ${evaluationId}（后续实现）`);
}

function downloadEvaluation(evaluationId) {
    alert(`下载面试评价 ${evaluationId}（模拟操作）`);
}

function filterEvaluations() {
    alert('筛选面试评价（模拟操作）');
}

function newEvaluation() {
    alert('新建面试评价（后续实现）');
}