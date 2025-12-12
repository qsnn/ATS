const JOB_SEEKER_API_BASE = '/api';

async function applyJobApi(payload) {
    return apiRequest(`${JOB_SEEKER_API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

async function fetchMyApplicationsApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`${JOB_SEEKER_API_BASE}/applications/my?${query.toString()}`);
}

// 收藏相关 API 改为直接调用后端 /api/favorites 路径，避免路径不匹配
async function addFavoriteJobApi(payload) {
    return apiRequest(`/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

async function removeFavoriteJobApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`/api/favorites?${query.toString()}`, {
        method: 'DELETE'
    });
}

async function checkFavoriteJobApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`/api/favorites/check?${query.toString()}`);
}

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