// 统一API配置管理模块
const API_CONFIG = {
    // 各个服务的路径前缀
    SERVICES: {
        USER: '/api/user',
        JOB: '/api/job/info',
        COMPANY: '/api/company',
        APPLICATION: '/api/applications',
        INTERVIEW: '/api/interview',
        FAVORITE: '/api/favorites',
        TALENT: '/api/talent',
        RESUME: '/api/resume'
    }
};

// API工具类
const ApiUtils = {
    // 构建完整URL
    buildUrl: function(service, path = '') {
        const servicePath = API_CONFIG.SERVICES[service] || '';
        // 确保路径正确拼接
        const fullPath = path ? `${servicePath}${path.startsWith('/') ? path : '/' + path}` : servicePath;
        return fullPath;
    }
};

// 暴露到全局
window.API_CONFIG = API_CONFIG;
window.ApiUtils = ApiUtils;