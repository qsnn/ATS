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
        '/recruiter-dashboard.html': 'recruiter-dashboard.html',
        '/admin-dashboard.html': 'admin-dashboard.html'
    },

    rolePermissions: {
        'job-seeker': ['/job-seeker-dashboard.html'],
        'employer': ['/employer-dashboard.html'],
        'recruiter': ['/recruiter-dashboard.html'],
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
        // 1. 定义公共路径，任何人都可以访问
        const publicPaths = ['/', '/index.html', '/login.html', '/register.html'];
        // 移除路径末尾的'/'以便匹配
        const cleanPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;

        // 兼容 / 和 /index.html
        if (publicPaths.includes(cleanPath) || publicPaths.includes(cleanPath.replace('/index', '/'))) {
            return true;
        }

        // 2. 检查用户是否登录
        const currentUser = Auth.getCurrentUser(); // 使用 auth.js 的方法更安全
        if (!currentUser) {
            // 未登录且访问的不是公共页面，则无权限
            return false;
        }

        // 3. 检查登录用户的角色是否有权访问该路径
        const userRole = currentUser.role;
        const allowedRoutes = this.rolePermissions[userRole] || [];

        // 使用 startsWith 允许路径后面带参数，例如 /job-seeker-dashboard.html?tab=profile
        if (allowedRoutes.some(route => cleanPath.startsWith(route))) {
            return true;
        }

        // 4. 如果以上都不满足，则无权限
        return false;
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

        // 如果是仪表盘页面，确保用户已登录（使用 Auth API）
        if (path.includes('dashboard') && !Auth.getCurrentUser()) {
            this.redirectToLogin();
            return;
        }

        // 设置页面标题
        this.setPageTitle();

        // 更新导航栏激活状态
        this.updateNavActiveState();

        // 显示加载指示器
        this.showLoading();

        // 模拟页面切换（在实际应用中会加载新页面）
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
            '/recruiter-dashboard.html': '招聘系统 - 招聘专员中心',
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
            '/recruiter-dashboard.html': 'a[href*="recruiter"]',
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
            'recruiter': 'recruiter-dashboard.html',
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
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        Router.init();

        // 导出到全局作用域（使用 defineProperty 以避免对只读属性的直接赋值）
        try {
            if (typeof window.Router === 'undefined') {
                Object.defineProperty(window, 'Router', {
                    value: Router,
                    writable: true,
                    configurable: true,
                    enumerable: false
                });
            }
        } catch (e) {
            // 如果 defineProperty 失败（极少数环境），尽量不抛出错误
            // 这里不再进行赋值，保持程序继续运行
            console.warn('无法在 window 上定义 Router:', e);
        }
    });
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}