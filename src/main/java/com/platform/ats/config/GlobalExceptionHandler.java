package com.platform.ats.config;

import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.user.vo.Result;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常
     * 
     * @param ex 业务异常
     * @return Result对象
     */
    @ExceptionHandler(BizException.class)
    public Result<Void> handleBizException(BizException ex) {
        return Result.error(ex.getCode(), ex.getMessage());
    }

    /**
     * 处理参数校验异常
     * 
     * @param ex 异常对象
     * @return Result对象
     */
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class, ConstraintViolationException.class, HttpMessageNotReadableException.class})
    public Result<Void> handleValidateException(Exception ex) {
        String message = "参数校验失败";
        if (ex instanceof MethodArgumentNotValidException manve && manve.getBindingResult().getFieldError() != null) {
            message = manve.getBindingResult().getFieldError().getDefaultMessage();
        } else if (ex instanceof BindException be && be.getBindingResult().getFieldError() != null) {
            message = be.getBindingResult().getFieldError().getDefaultMessage();
        } else if (ex instanceof ConstraintViolationException cve && cve.getConstraintViolations().iterator().hasNext()) {
            message = cve.getConstraintViolations().iterator().next().getMessage();
        }
        return Result.error(ErrorCode.BAD_REQUEST.getCode(), message);

    }
    
    @ExceptionHandler(Exception.class)
    public Result<Void> handleOtherException(Exception ex) {
        // 可以在这里添加日志记录
        return Result.error(ErrorCode.INTERNAL_ERROR.getCode(), ErrorCode.INTERNAL_ERROR.getMessage());
    }
}
