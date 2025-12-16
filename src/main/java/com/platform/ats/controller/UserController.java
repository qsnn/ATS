// language: java
package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.platform.ats.common.annotation.DataPermission;
import com.platform.ats.common.annotation.LogOperation;
import com.platform.ats.entity.user.SysUser;
import com.platform.ats.entity.user.dto.HrCreateDTO;
import com.platform.ats.entity.user.dto.UserCreateDTO;
import com.platform.ats.entity.user.dto.UserLoginDTO;
import com.platform.ats.entity.user.dto.UserRegisterDTO;
import com.platform.ats.entity.user.dto.UserUpdateDTO;
import com.platform.ats.entity.user.dto.UserPasswordDTO;
import com.platform.ats.entity.user.query.UserQuery;
import com.platform.ats.entity.user.vo.HrVO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.entity.user.vo.UserProfileVO;
import com.platform.ats.entity.user.vo.UserVO;
import java.util.List;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.service.NotificationHelperService;
import com.platform.ats.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 用户管理控制器
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Validated
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "用户管理")
public class UserController {

    private final UserService userService;
    private final NotificationHelperService notificationHelperService;

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    @LogOperation(module = "用户管理", type = "新增", content = "用户注册")
    public Result<Long> register(@RequestBody @Valid UserRegisterDTO userRegisterDTO) {
        Long userId = userService.register(userRegisterDTO);
        return Result.success(userId, "注册成功");
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    @LogOperation(module = "用户管理", type = "登录", content = "用户登录")
    public Result<UserProfileVO> login(@Valid @RequestBody UserLoginDTO dto) {
        String username = dto.getUsername() == null ? null : dto.getUsername().trim();
        SysUser sysUser = userService.login(username, dto.getPassword());
        // 调用新方法获取UserProfileVO
        UserProfileVO userProfile = userService.getUserProfile(sysUser.getUserId());
        
        // 当HR或雇主登录时，检查未处理的申请和即将到来的面试
        if (sysUser.getUserType() == 3 || sysUser.getUserType() == 2) { // HR或企业管理员
            // TODO: 实际查询未处理的申请数量
            int pendingCount = 0; // 示例值，实际应从数据库查询
            notificationHelperService.createPendingApplicationsNotice(sysUser.getUserId(), pendingCount);
            
            // TODO: 实际查询即将到来的面试
            // notificationHelperService.createUpcomingInterviewsNotice(sysUser.getUserId(), upcomingInterviews);
        }
        
        return Result.success(userProfile, "登录成功");
    }

    @GetMapping("/{userId}")
    @Operation(summary = "根据ID获取用户")
    @DataPermission(DataPermission.Type.SELF)
    @LogOperation(module = "用户管理", type = "查询", content = "根据ID获取用户信息")
    public Result<UserProfileVO> getUserById(@PathVariable Long userId) {
        UserProfileVO userProfile = userService.getUserProfile(userId);
        return Result.success(userProfile);
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询用户列表")
    @DataPermission(DataPermission.Type.ALL) // 只有管理员才能分页查询所有用户
    @LogOperation(module = "用户管理", type = "查询", content = "分页查询用户列表")
    public Result<IPage<UserVO>> getUserPage(UserQuery query,
                                             @RequestParam(defaultValue = "1") Integer pageNum,
                                             @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<UserVO> page = userService.getUserPage(query, pageNum, pageSize);
        return Result.success(page);
    }

    @PostMapping
    @Operation(summary = "创建用户")
    @DataPermission(DataPermission.Type.ALL) // 只有管理员才能创建用户
    @LogOperation(module = "用户管理", type = "新增", content = "管理员创建用户")
    public Result<Long> createUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        Long userId = userService.createUser(userCreateDTO);
        return Result.success(userId, "创建成功");
    }

    @PutMapping("/{userId}")
    @Operation(summary = "更新用户")
    @DataPermission(DataPermission.Type.SELF)
    @LogOperation(module = "用户管理", type = "修改", content = "更新用户信息")
    public Result<Boolean> updateUser(@PathVariable Long userId, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        // 确保路径变量和请求体中的userId一致
        if (!userId.equals(userUpdateDTO.getUserId())) {
            return Result.error(ErrorCode.PARAM_INVALID.getCode(), "路径中的用户ID与请求体中的用户ID不一致");
        }
        Boolean success = userService.updateUser(userUpdateDTO);
        return Result.success(success, "更新成功");
    }

    @PutMapping("/{userId}/status")
    @Operation(summary = "更新用户状态")
    @DataPermission(DataPermission.Type.ALL) // 只有管理员才能更新用户状态
    @LogOperation(module = "用户管理", type = "修改", content = "更新用户状态")
    public Result<Boolean> updateUserStatus(@PathVariable Long userId, @RequestParam Integer status) {
        Boolean success = userService.updateUserStatus(userId, status);
        return Result.success(success, "状态更新成功");
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "删除用户")
    @DataPermission(DataPermission.Type.ALL) // 只有管理员才能删除用户
    @LogOperation(module = "用户管理", type = "删除", content = "删除用户")
    public Result<Boolean> deleteUser(@PathVariable Long userId) {
        Boolean success = userService.deleteUser(userId);
        return Result.success(success, "删除成功");
    }

    @PutMapping("/{userId}/password")
    @Operation(summary = "修改当前用户密码")
    @DataPermission(DataPermission.Type.SELF)
    @LogOperation(module = "用户管理", type = "修改", content = "用户修改密码")
    public Result<Boolean> changePassword(@PathVariable Long userId,
                                          @Valid @RequestBody UserPasswordDTO dto) {
        userService.changePassword(userId, dto);
        return Result.success(true, "密码修改成功");
    }

    @PutMapping("/{userId}/reset-password")
    @Operation(summary = "重置密码")
    @DataPermission(DataPermission.Type.ALL) // 只有管理员才能重置密码
    @LogOperation(module = "用户管理", type = "修改", content = "管理员重置用户密码")
    public Result<Boolean> resetPassword(@PathVariable Long userId, @RequestParam String newPassword) {
        Boolean success = userService.resetPassword(userId, newPassword);
        return Result.success(success, "密码重置成功");
    }

    @GetMapping("/check/username")
    @Operation(summary = "检查用户名是否存在")
    @LogOperation(module = "用户管理", type = "查询", content = "检查用户名是否存在")
    public Result<Boolean> checkUsernameExists(@RequestParam String username) {
        Boolean exists = userService.checkUsernameExists(username);
        return Result.success(exists);
    }

    @GetMapping("/check/phone")
    @Operation(summary = "检查手机号是否存在")
    @LogOperation(module = "用户管理", type = "查询", content = "检查手机号是否存在")
    public Result<Boolean> checkPhoneExists(@RequestParam String phone) {
        Boolean exists = userService.checkPhoneExists(phone);
        return Result.success(exists);
    }

    @GetMapping("/check/email")
    @Operation(summary = "检查邮箱是否存在")
    @LogOperation(module = "用户管理", type = "查询", content = "检查邮箱是否存在")
    public Result<Boolean> checkEmailExists(@RequestParam String email) {
        Boolean exists = userService.checkEmailExists(email);
        return Result.success(exists);
    }

    @PostMapping("/hr")
    @Operation(summary = "创建HR账户")
    @DataPermission(DataPermission.Type.COMPANY) // HR只能创建本公司HR账户
    @LogOperation(module = "用户管理", type = "新增", content = "创建HR账户")
    public Result<Long> createHrAccount(@Valid @RequestBody HrCreateDTO hrCreateDTO) {
        Long userId = userService.createHrAccount(hrCreateDTO);
        return Result.success(userId, "HR账户创建成功");
    }

    @PostMapping("/hr/batch")
    @Operation(summary = "批量创建HR账户")
    @DataPermission(DataPermission.Type.COMPANY) // HR只能批量创建本公司HR账户
    @LogOperation(module = "用户管理", type = "新增", content = "批量创建HR账户")
    public Result<List<Long>> createHrAccounts(@Valid @RequestBody HrCreateDTO hrCreateDTO) {
        int count = hrCreateDTO.getCount() != null ? hrCreateDTO.getCount() : 1;
        if (count < 1 || count > 20) {
            throw new BizException(ErrorCode.PARAM_INVALID, "账户数量必须在1-20之间");
        }
        List<Long> userIds = userService.createHrAccounts(hrCreateDTO, count);
        return Result.success(userIds, "HR账户批量创建成功");
    }

    @GetMapping("/hr/{companyId}")
    @Operation(summary = "获取企业下的所有HR账户")
    @DataPermission(DataPermission.Type.COMPANY) // HR只能查看本公司HR账户
    @LogOperation(module = "用户管理", type = "查询", content = "获取企业下的所有HR账户")
    public Result<Object> getHrAccountsByCompanyId(
            @PathVariable Long companyId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<HrVO> hrPage = userService.getHrAccountsByCompanyId(companyId, pageNum, pageSize);
        return Result.success(hrPage);
    }
}