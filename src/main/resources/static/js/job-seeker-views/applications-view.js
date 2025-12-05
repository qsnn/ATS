function renderApplicationsView(container, currentUser) {
    // TODO
    container.innerHTML = `
        <div class="view applications-view active">
            <h2>我的申请</h2>
            <table>
                <thead>
                    <tr>
                        <th>职位名称</th>
                        <th>公司</th>
                        <th>申请日期</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody id="applications-tbody">
                    <tr>
                        <td>Java开发工程师</td>
                        <td>示例科技公司</td>
                        <td>2023-11-01</td>
                        <td>待审核</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

}