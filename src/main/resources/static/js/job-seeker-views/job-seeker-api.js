const JOB_SEEKER_API_BASE = 'http://124.71.101.139:10085/api';

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

async function fetchMyInterviewsByNameApi(name) {
    return apiRequest(`${JOB_SEEKER_API_BASE}/interview/name/${encodeURIComponent(name)}`);
}

async function addFavoriteJobApi(payload) {
    return apiRequest(`${JOB_SEEKER_API_BASE}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

async function removeFavoriteJobApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`${JOB_SEEKER_API_BASE}/favorites?${query.toString()}`, {
        method: 'DELETE'
    });
}

async function checkFavoriteJobApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`${JOB_SEEKER_API_BASE}/favorites/check?${query.toString()}`);
}

async function fetchMyFavoriteJobsApi(params) {
    const query = new URLSearchParams(params || {});
    return apiRequest(`${JOB_SEEKER_API_BASE}/favorites/my?${query.toString()}`);
}

window.JobSeekerApi = {
    applyJobApi,
    fetchMyApplicationsApi,
    fetchMyInterviewsByNameApi,
    addFavoriteJobApi,
    removeFavoriteJobApi,
    checkFavoriteJobApi,
    fetchMyFavoriteJobsApi
};
