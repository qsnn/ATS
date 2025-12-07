const JOB_SEEKER_API_BASE = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : '/api';

async function apiRequest(url, options = {}) {
    try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
            const text = await resp.text();
            return { success: false, message: `网络错误: ${resp.status} ${text}` };
        }
        const json = await resp.json();
        if (json.code !== 200) {
            return { success: false, message: json.message || '请求失败' };
        }
        return { success: true, data: json.data };
    } catch (e) {
        console.error('API 请求异常:', e);
        return { success: false, message: '请求异常，请稍后重试' };
    }
}

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
