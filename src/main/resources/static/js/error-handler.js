// 统一错误处理模块
const ErrorHandler = {
    // 错误码到用户友好消息的映射
    getFriendlyMessage: function(errorCode, defaultMessage) {
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
    },
    
    // 处理API响应错误
    handleApiResponse: function(response) {
        if (response.code !== 200) {
            const friendlyMessage = this.getFriendlyMessage(response.code, response.message);
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
    },
    
    // 处理网络错误
    handleNetworkError: function(error) {
        console.error('网络请求异常:', error);
        return {
            success: false,
            message: '网络连接出现问题，请检查网络后重试'
        };
    }
};

// 统一消息显示函数
function showMessage(message, type = 'info', duration = 3000) {
    // 移除已存在的消息
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建消息元素
    const toast = document.createElement('div');
    toast.className = `message-toast message-${type}`;
    toast.textContent = message;
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // 根据消息类型设置背景色
    const backgroundColors = {
        success: '#52c41a',
        error: '#ff4d4f',
        warning: '#faad14',
        info: '#1890ff'
    };
    
    toast.style.backgroundColor = backgroundColors[type] || backgroundColors.info;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 指定时间后自动消失
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }
    }, duration);
}

// 将函数暴露到全局作用域
window.ErrorHandler = ErrorHandler;
window.showMessage = showMessage;