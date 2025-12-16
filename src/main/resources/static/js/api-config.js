/**
 * 统一API配置管理模块
 * 提供各服务的路径前缀配置和URL构建工具
 */
let API_CONFIG = {
    /**
     * 各个服务的路径前缀
     */
    SERVICES: {
        USER: '/api/user',
        JOB: '/api/job/info',
        COMPANY: '/api/company',
        APPLICATION: '/api/applications',
        INTERVIEW: '/api/interview',
        FAVORITE: '/api/favorites',
        TALENT: '/api/talent',
        RESUME: '/api/resume',
        NOTICE: '/api/notices'
    }
};

/**
 * API工具类
 * 提供常用的API处理方法
 */
let ApiUtils = {
    /**
     * 构建完整URL
     * @param {string} service - 服务名称
     * @param {string} path - 路径
     * @returns {string} 完整URL
     */
    buildUrl: function(service, path = '') {
        const servicePath = API_CONFIG.SERVICES[service] || '';
        // 确保路径正确拼接
        return path ? `${servicePath}${path.startsWith('/') ? path : '/' + path}` : servicePath;
    }
};

// 暴露到全局
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
    window.ApiUtils = ApiUtils;
}