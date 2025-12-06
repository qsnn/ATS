function renderContentView(container, currentUser) {
    container.innerHTML = `
        <h2>内容审核</h2>
        <div class="card">
            <table class="data-table">
                <thead>
                <tr>
                    <th>编号</th>
                    <th>类型</th>
                    <th>提交人</th>
                    <th>提交时间</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="content-tbody">
                    <!-- 动态加载 -->
                </tbody>
            </table>
        </div>
    `;

    loadPendingContents();
}

function loadPendingContents() {
    const tbody = document.getElementById('content-tbody');
    if (!tbody) return;

    const contents = [
        {
            id: 101,
            type: '职位发布',
            submitter: '某科技公司',
            submitTime: '2024-01-20 10:23',
            status: '待审核',
            statusClass: 'tag'
        },
        {
            id: 102,
            type: '企业介绍',
            submitter: '某互联网公司',
            submitTime: '2024-01-20 11:05',
            status: '已通过',
            statusClass: 'tag tag-success'
        }
    ];

    tbody.innerHTML = contents.map(content => `
        <tr>
            <td>${content.id}</td>
            <td>${content.type}</td>
            <td>${content.submitter}</td>
            <td>${content.submitTime}</td>
            <td><span class="${content.statusClass}">${content.status}</span></td>
            <td>
                ${content.status === '待审核' ? `
                <button class="btn btn-primary btn-sm" onclick="approveContent(${content.id})">通过</button>
                <button class="btn btn-danger btn-sm" onclick="rejectContent(${content.id})">拒绝</button>
                ` : `
                <button class="btn btn-sm" onclick="viewContentDetail(${content.id})">查看</button>
                `}
            </td>
        </tr>
    `).join('');
}

function approveContent(contentId) {
    if (confirm('确定通过此内容？')) {
        alert('已通过内容 ' + contentId + '（模拟操作）');
        loadPendingContents(); // 刷新列表
    }
}

function rejectContent(contentId) {
    if (confirm('确定拒绝此内容？')) {
        alert('已拒绝内容 ' + contentId + '（模拟操作）');
        loadPendingContents(); // 刷新列表
    }
}

function viewContentDetail(contentId) {
    alert('查看内容 ' + contentId + ' 详情（模拟操作）');
}