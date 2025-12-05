// language: javascript
function renderInterviewsView(container, currentUser) {
    // TODO
    container.innerHTML = `
        <div class="view interviews-view active">
            <h2>面试安排</h2>
            <table>
                <thead>
                    <tr>
                        <th>职位名称</th>
                        <th>公司</th>
                        <th>面试时间</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="interviews-tbody">
                    <tr>
                        <td>前端开发工程师</td>
                        <td>示例网络公司</td>
                        <td>2023-11-15 10:00</td>
                        <td>待确认</td>
                        <td>
                            <a href="#" data-action="accept">接受</a> /
                            <a href="#" data-action="reject">拒绝</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    const tbody = document.getElementById('interviews-tbody');
    tbody.addEventListener('click', e => {
        const target = e.target;
        if (target.tagName === 'A') {
            e.preventDefault();
            const action = target.dataset.action;
            if (action === 'accept') {
                alert('已接受面试（示例）');
            } else if (action === 'reject') {
                alert('已拒绝面试（示例）');
            }
        }
    });
}