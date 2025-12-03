const ApiService = (function () {
    const API_BASE = 'http://124.71.101.139:10085/api';

    /**
     * 统一的请求处理器
     * @param {string} endpoint - API 端点
     * @param {object} options - fetch 的配置选项
     * @returns {Promise<any>}
     */
    async function request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const json = await response.json();

            if (!response.ok || json.code !== 200) {
                throw new Error(json.message || '网络请求失败');
            }

            return json.data;
        } catch (error) {
            console.error(`API Error: ${error.message}`, { url, config });
            alert(`操作失败: ${error.message}`);
            throw error; // 抛出错误，让调用方可以捕获
        }
    }

    // 获取当前登录用户的公司ID
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
    };
})();

// 导出到全局作用域
window.ApiService = ApiService;