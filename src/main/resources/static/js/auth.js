// js/auth.js
// 认证与本地存储工具（接入后端接口）

const API_BASE = 'http://124.71.101.139:10085/api/user';
const CURRENT_USER_KEY = 'currentUser';

// 本地存储封装
const storage = {
    get(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(key);
            if (raw == null) return defaultValue;
            return JSON.parse(raw);
        } catch (e) {
            console.error('读取本地存储失败:', key, e);
            return defaultValue;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('写入本地存储失败:', key, e);
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('移除本地存储失败:', key, e);
        }
    }
};

// 后端 userType(数字) → 前端 role(字符串) 映射
function mapUserTypeToRole(userType) {
    switch (userType) {
        case 1: return 'admin';       // 平台管理员
        case 2: return 'employer';    // 企业管理员
        case 3: return 'recruiter';   // HR/面试官
        case 4: return 'job-seeker';  // 求职者
        default: return null;
    }
}

// 登录
async function login(username, password) {
    try {
        const resp = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!resp.ok) {
            return { success: false, message: '网络错误' };
        }

        const json = await resp.json();
        if (json.code !== 200 || !json.data) {
            return { success: false, message: json.message || '登录失败' };
        }

        const backendUser = json.data;
        const role = mapUserTypeToRole(backendUser.userType);

        if (!role) {
            return { success: false, message: '未识别的用户类型' };
        }

        // 前端统一保存为 currentUser，带上 userType 和 role
        const currentUser = {
            userId: backendUser.userId,
            username: backendUser.username,
            realName: backendUser.realName,
            phone: backendUser.phone,
            email: backendUser.email,
            userType: backendUser.userType, // 数字，后端原样
            role: role,                     // 字符串，前端内部使用
            companyId: backendUser.companyId,
            status: backendUser.status
        };

        storage.set(CURRENT_USER_KEY, currentUser);

        return {
            success: true,
            message: json.message || '登录成功',
            user: currentUser
        };
    } catch (e) {
        console.error('登录异常:', e);
        return { success: false, message: '登录异常，请稍后重试' };
    }
}

// 注册（这里示例为求职者，按你后端约定调整 userType）
async function register(payload) {
    try {
        const resp = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            return { success: false, message: '网络错误' };
        }

        const json = await resp.json();
        if (json.code !== 200) {
            return { success: false, message: json.message || '注册失败' };
        }

        return { success: true, message: json.message || '注册成功' };
    } catch (e) {
        console.error('注册异常:', e);
        return { success: false, message: '注册异常，请稍后重试' };
    }
}

function getCurrentUser() {
    return storage.get(CURRENT_USER_KEY, null);
}

function logout() {
    storage.remove(CURRENT_USER_KEY);
}

function isAuthenticated() {
    return !!getCurrentUser();
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 暴露到全局
window.Auth = {
    login,
    register,
    getCurrentUser,
    logout,
    isAuthenticated,
    requireAuth
};