// 改进的API工具模块，包含统一的错误处理

// 错误码到用户友好消息的映射
function getFriendlyMessage(errorCode, defaultMessage) {
    const errorMessages = {
        // 用户相关错误 (1000-1099)
        1000: "用户不存在",
        1001: "用户名已存在，请选择其他用户名",
        1002: "手机号已被注册，请使用其他手机号",
        1003: "邮箱已被注册，请使用其他邮箱",
        1004: "账户已被禁用，请联系管理员",
        1005: "密码错误，请重新输入",
        1006: "账户已被锁定，请联系管理员",
        1007: "密码格式不符合要求",
        1008: "用户角色不合法",
        1010: "登录凭证无效，请重新登录",
        1011: "登录凭证已过期，请重新登录",
        1012: "缺少认证信息，请重新登录",
        1013: "登录失败，请检查用户名和密码",
        1014: "注册信息冲突，请修改后重试",
        
        // 职位相关错误 (2000-2099)
        2000: "职位不存在",
        2001: "职位状态不合法",
        2002: "没有权限发布或编辑该职位",
        2003: "职位已发布",
        2004: "职位未发布",
        2005: "职位标题必填",
        2006: "职位类别不合法",
        2007: "职位地点信息不合法",
        2008: "薪资范围不合法",
        2009: "工作经验要求不合法",
        2010: "学历要求不合法",
        
        // 职位收藏相关错误 (3000-3099)
        3000: "已收藏该职位",
        3001: "收藏记录不存在",
        3002: "收藏数量超出上限",
        3003: "收藏的职位已失效",
        3004: "收藏记录不属于当前用户",
        
        // 职位申请相关错误 (4000-4099)
        4000: "申请记录不存在",
        4001: "您已申请过该职位，请勿重复申请",
        4002: "申请状态不合法",
        4003: "申请状态流转不合法",
        4004: "职位不可申请",
        4005: "申请时简历必填",
        4006: "申请使用的简历不存在",
        4007: "申请记录不属于当前用户",
        
        // 人才库相关错误 (40001+)
        40001: "人才库记录不存在",
        40002: "该简历已在人才库中",
        
        // 公司信息相关错误 (50001+)
        50001: "公司信息不存在",
        
        // 通用错误
        400: "您提交的信息有误，请检查后重试",
        401: "未登录或登录已过期，请重新登录",
        403: "您没有权限执行此操作",
        404: "请求的内容不存在",
        405: "请求方法不被允许",
        415: "不支持的请求类型",
        500: "系统内部错误，请稍后重试",
        501: "数据库操作异常",
        502: "服务暂时不可用，请稍后重试",
        
        // 通用参数错误 (8000-8099)
        8000: "缺少必填参数",
        8001: "参数不合法",
        8002: "页码不合法",
        8003: "每页大小不合法",
        8004: "排序字段不支持",
        8005: "时间范围不合法"
    };
    
    return errorMessages[errorCode] || defaultMessage || "操作失败，请稍后再试";
}

// 处理API响应错误
function handleApiResponse(response) {
    if (response.code !== 200) {
        const friendlyMessage = getFriendlyMessage(response.code, response.message);
        return {
            success: false,
            message: friendlyMessage,
            code: response.code
        };
    }
    return {
        success: true,
        data: response.data,
        message: response.message
    };
}

// 处理网络错误
function handleNetworkError(error) {
    console.error('网络请求异常:', error);
    return {
        success: false,
        message: '网络连接出现问题，请检查网络后重试'
    };
}

// 统一的API请求函数
async function apiRequest(url, options = {}) {
    try {
        // 使用 Auth.authenticatedFetch 替代普通 fetch 以确保携带 JWT 令牌
        const resp = await Auth.authenticatedFetch(url, options);
        if (!resp.ok) {
            const text = await resp.text();
            return { 
                success: false, 
                message: getFriendlyMessage(resp.status, `网络错误: ${resp.status} ${text}`),
                code: resp.status
            };
        }
        const json = await resp.json();
        return handleApiResponse(json);
    } catch (e) {
        return handleNetworkError(e);
    }
}

// 暴露到全局
window.apiRequest = apiRequest;