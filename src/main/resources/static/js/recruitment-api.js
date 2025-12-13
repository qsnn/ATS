/**
 * 招聘相关API服务
 * 提供人才库相关的API调用封装
 */
const ApiService = (function () {
    const API_BASE = '/api';

    /**
     * 统一的请求处理器（更健壮的 JSON 解析与错误处理）
     * @param {string} endpoint - API 端点
     * @param {object} options - fetch 的配置选项
     * @returns {Promise<any>}
     */
    async function request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        return apiRequest(url, options);
    }

    /**
     * 获取当前登录用户的公司 ID
     * @returns {number|null} 公司ID或null
     */
    function getCompanyId() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || !currentUser.companyId) {
            console.error('无法获取公司ID，用户未登录或用户信息不完整。');
            return null;
        }
        return currentUser.companyId;
    }

    return {
        /**
         * 根据公司ID获取人才列表
         * @returns {Promise<Array>}
         */
        getTalentPool: function () {
            const companyId = getCompanyId();
            if (!companyId) return Promise.reject('无法获取公司ID');
            return request(`/talent/company/${companyId}`);
        },

        /**
         * 添加新的人才
         * @param {object} talentData - 人才数据，不含id
         * @returns {Promise<object>}
         */
        addTalent: function (talentData) {
            const companyId = getCompanyId();
            if (!companyId) return Promise.reject('无法获取公司ID');

            const payload = { ...talentData, companyId };
            return request('/talent', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
        },

        /**
         * 更新人才信息
         * @param {object} talentData - 人才数据，必须包含id
         * @returns {Promise<object>}
         */
        updateTalent: function (talentData) {
            const companyId = getCompanyId();
            if (!companyId) return Promise.reject('无法获取公司ID');
            if (!talentData.id) return Promise.reject('更新人才时缺少ID');

            const payload = { ...talentData, companyId };
            return request('/talent', {
                method: 'PUT',
                body: JSON.stringify(payload),
            });
        },

        /**
         * 根据ID删除人才
         * @param {number} talentId
         * @returns {Promise<boolean>}
         */
        removeTalent: function (talentId) {
            return request(`/talent/${talentId}`, {
                method: 'DELETE',
            });
        },

        /**
         * 根据ID查询人才详情
         * @param {number} talentId
         * @returns {Promise<object>}
         */
        getTalentById: function (talentId) {
            return request(`/talent/${talentId}`);
        },

        // 新增：对外暴露通用 request 方法，供各个视图统一调用
        request: function (endpoint, options = {}) {
            return request(endpoint, options);
        },
    };
})();

// 导出到全局作用域，并暴露 API_BASE 方便其他脚本共用
window.ApiService = ApiService;
window.API_BASE = '/api';