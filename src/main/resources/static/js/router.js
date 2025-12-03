/**
 * 招聘系统 - 路由模块
 * 处理页面导航和权限控制
 */

const Router = {
    // 路由配置
    routes: {
        '/': 'index.html',
        '/index': 'index.html',
        '/login': 'login.html',
        '/register': 'register.html',

        // 直接使用仪表盘页面路径
        '/job-seeker-dashboard.html': 'job-seeker-dashboard.html',
        '/employer-dashboard.html': 'employer-dashboard.html',
        '/interviewer-dashboard.html': 'interviewer-dashboard.html',
        '/admin-dashboard.html': 'admin-dashboard.html'
    },

    rolePermissions: {
        'job-seeker': ['/job-seeker-dashboard.html'],
        'employer': ['/employer-dashboard.html'],
        'interviewer': ['/interviewer-dashboard.html'],
        'admin': ['/admin-dashboard.html']
    },


    // 初始化
    init: function () {
        // 绑定链接点击事件
        this.bindLinks();

        // 监听浏览器前进后退
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // 初始路由处理
        this.handleRoute();

        // 设置页面标题
        this.setPageTitle();
    },

    // 绑定链接点击事件
    bindLinks: function () {
        document.addEventListener('click', (e) => {
            // 检查是否是内部链接
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                e.preventDefault();

                // 获取相对路径
                const path = link.pathname + link.search + link.hash;
                this.navigate(path);
            }
        });
    },

    // 导航到指定路径
    navigate: function (path, replace = false) {
        // 解析路径
        const url = new URL(path, window.location.origin);

        // 检查权限
        if (!this.checkPermission(url.pathname)) {
            this.redirectToLogin();
            return;
        }

        // 更新浏览器历史
        if (replace) {
            window.history.replaceState({}, '', url.pathname);
        } else {
            window.history.pushState({}, '', url.pathname);
        }

        // 处理路由
        this.handleRoute();

        // 滚动到顶部
        window.scrollTo(0, 0);
    },

    // 检查权限
    checkPermission: function(path) {
        if (['/', '/index', '/login', '/register'].includes(path)) {
            return true;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            return false;
        }

        const userRole = currentUser.role;
        const allowedRoutes = this.rolePermissions[userRole] || [];

        return allowedRoutes.some(route => path.startsWith(route));
    },
    
    // 重定向到登录页
    redirectToLogin: function () {
        // 保存当前想要访问的路径
        const returnTo = window.location.pathname;
        localStorage.setItem('returnTo', returnTo);

        // 重定向到登录页
        window.location.href = 'login.html';
    },

    // 处理路由
    handleRoute: function () {
        const path = window.location.pathname;

        // 检查权限
        if (!this.checkPermission(path)) {
            this.redirectToLogin();
            return;
        }

        // 如果是仪表板页面，确保用户已登录
        if (path.includes('dashboard') && !localStorage.getItem('currentUser')) {
            this.redirectToLogin();
            return;
        }

        // 设置页面标题
        this.setPageTitle();

        // 更新导航栏激活状态
        this.updateNavActiveState();

        // 显示加载指示器
        this.showLoading();

        // 模拟页面切换（在实际应用中这里会加载新页面）
        setTimeout(() => {
            this.hideLoading();
        }, 300);
    },

    // 设置页面标题
    setPageTitle: function () {
        const path = window.location.pathname;
        const titles = {
            '/': '招聘系统 - 主页',
            '/index': '招聘系统 - 主页',
            '/login': '招聘系统 - 登录',
            '/register': '招聘系统 - 注册',
            '/job-seeker-dashboard.html': '招聘系统 - 求职者中心',
            '/employer-dashboard.html': '招聘系统 - 企业管理员中心',
            '/interviewer-dashboard.html': '招聘系统 - 面试官中心',
            '/admin-dashboard.html': '招聘系统 - 平台管理员中心'
        };

        const title = titles[path] || '招聘系统';
        document.title = title;
    },

    // 更新导航栏激活状态
    updateNavActiveState: function () {
        const path = window.location.pathname;

        // 移除所有激活状态
        document.querySelectorAll('.nav-link, .tab-btn').forEach(element => {
            element.classList.remove('active');
        });

        // 根据路径设置激活状态
        const navSelectors = {
            '/job-seeker-dashboard.html': 'a[href*="job-seeker"]',
            '/employer-dashboard.html': 'a[href*="employer"]',
            '/interviewer-dashboard.html': 'a[href*="interviewer"]',
            '/admin-dashboard.html': 'a[href*="admin"]'
        };

        if (navSelectors[path]) {
            const activeElement = document.querySelector(navSelectors[path]);
            if (activeElement) {
                activeElement.classList.add('active');
            }
        }
    },

    // 显示加载指示器
    showLoading: function () {
        // 创建或获取加载指示器
        let loader = document.getElementById('router-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'router-loader';
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, var(--primary-color), var(--primary-hover));
                z-index: 9999;
                transform: translateX(-100%);
                animation: routerLoading 0.5s ease-out;
            `;
            document.body.appendChild(loader);

            // 添加动画样式
            const style = document.createElement('style');
            style.textContent = `
                @keyframes routerLoading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `;
            document.head.appendChild(style);
        } else {
            loader.style.display = 'block';
            loader.style.animation = 'none';
            void loader.offsetWidth; // 触发重绘
            loader.style.animation = 'routerLoading 0.5s ease-out';
        }

        // 0.5秒后自动隐藏
        setTimeout(() => {
            this.hideLoading();
        }, 500);
    },

    // 隐藏加载指示器
    hideLoading: function () {
        const loader = document.getElementById('router-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    },

    // 获取当前路由参数
    getQueryParams: function () {
        const searchParams = new URLSearchParams(window.location.search);
        const params = {};

        for (const [key, value] of searchParams) {
            params[key] = value;
        }

        return params;
    },

    // 构建URL查询参数
    buildQueryString: function (params) {
        const searchParams = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
                searchParams.set(key, value);
            }
        }

        return searchParams.toString() ? `?${searchParams.toString()}` : '';
    },

    // 跳转到指定路由
    goTo: function (route, params = {}) {
        const queryString = this.buildQueryString(params);
        this.navigate(`${route}${queryString}`);
    },

    // 返回上一页
    goBack: function () {
        window.history.back();
    },

    // 刷新当前页
    reload: function () {
        window.location.reload();
    },

    // 获取当前角色应该访问的仪表板
    getDashboardForRole: function (role) {
        const dashboards = {
            'job-seeker': 'job-seeker-dashboard.html',
            'employer': 'employer-dashboard.html',
            'interviewer': 'interviewer-dashboard.html',
            'admin': 'admin-dashboard.html'
        };

        return dashboards[role] || 'index.html';
    },

    // 登录成功后跳转到正确的仪表板
    redirectAfterLogin: function (role) {
        const dashboard = this.getDashboardForRole(role);
        const returnTo = localStorage.getItem('returnTo');

        if (returnTo && returnTo !== '/login' && returnTo !== '/register') {
            // 跳转到之前想要访问的页面
            localStorage.removeItem('returnTo');
            this.navigate(returnTo, true);
        } else {
            // 跳转到角色对应的仪表板
            this.navigate(dashboard, true);
        }
    },

    // 登出
    logout: function () {
        // 清除用户数据
        localStorage.removeItem('currentUser');
        localStorage.removeItem('returnTo');

        // 跳转到首页
        this.navigate('/', true);
    }
};

// 初始化路由
document.addEventListener('DOMContentLoaded', () => {
    Router.init();

    // 导出到全局作用域
    window.Router = Router;
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}