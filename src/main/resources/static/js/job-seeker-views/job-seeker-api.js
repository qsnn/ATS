const JOB_SEEKER_API_BASE = '/api';

/**
 * 申请职位API
 * @param {Object} payload - 申请信息
 * @returns {Promise<Object>} API响应结果
 */
async function applyJobApi(payload) {
    return apiRequest(`${JOB_SEEKER_API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

/**
 * 获取我的申请列表API
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} API响应结果
 */
async function fetchMyApplicationsApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`${JOB_SEEKER_API_BASE}/applications/my?${query.toString()}`);
}

/**
 * 添加收藏职位API
 * @param {Object} payload - 收藏信息
 * @returns {Promise<Object>} API响应结果
 */
async function addFavoriteJobApi(payload) {
    return apiRequest(`/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

/**
 * 移除收藏职位API
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} API响应结果
 */
async function removeFavoriteJobApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`/api/favorites?${query.toString()}`, {
        method: 'DELETE'
    });
}

/**
 * 检查是否收藏职位API
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} API响应结果
 */
async function checkFavoriteJobApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`/api/favorites/check?${query.toString()}`);
}

/**
 * 获取我的收藏职位列表API
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} API响应结果
 */
async function fetchMyFavoriteJobsApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`/api/favorites/my?${query.toString()}`);
}

window.JobSeekerApi = {
    applyJobApi,
    fetchMyApplicationsApi,
    addFavoriteJobApi,
    removeFavoriteJobApi,
    checkFavoriteJobApi,
    fetchMyFavoriteJobsApi
};