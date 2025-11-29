package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.platform.ats.entity.user.User;
import com.platform.ats.entity.user.dto.UserCreateDTO;
import com.platform.ats.entity.user.dto.UserUpdateDTO;
import com.platform.ats.entity.user.query.UserQuery;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.entity.user.vo.UserVO;
import com.platform.ats.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 用户管理控制器
 */
@Validated
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "用户管理")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result<Long> register(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        Long userId = userService.register(userCreateDTO);
        return Result.success(userId, "注册成功");
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<User> login(@RequestParam String username, @RequestParam String password) {
        User user = userService.login(username, password);
        return Result.success(user, "登录成功");
    }

    @GetMapping("/{userId}")
    @Operation(summary = "根据ID获取用户")
    public Result<User> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return Result.success(user);
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询用户列表")
    public Result<IPage<UserVO>> getUserPage(UserQuery query,
                                             @RequestParam(defaultValue = "1") Integer pageNum,
                                             @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<UserVO> page = userService.getUserPage(query, pageNum, pageSize);
        return Result.success(page);
    }

    @PostMapping
    @Operation(summary = "创建用户")
    public Result<Long> createUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        Long userId = userService.createUser(userCreateDTO);
        return Result.success(userId, "创建成功");
    }

    @PutMapping
    @Operation(summary = "更新用户")
    public Result<Boolean> updateUser(@Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        Boolean success = userService.updateUser(userUpdateDTO);
        return Result.success(success, "更新成功");
    }

    @PutMapping("/{userId}/status")
    @Operation(summary = "更新用户状态")
    public Result<Boolean> updateUserStatus(@PathVariable Long userId, @RequestParam Integer status) {
        Boolean success = userService.updateUserStatus(userId, status);
        return Result.success(success, "状态更新成功");
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "删除用户")
    public Result<Boolean> deleteUser(@PathVariable Long userId) {
        Boolean success = userService.deleteUser(userId);
        return Result.success(success, "删除成功");
    }

    @PutMapping("/{userId}/reset-password")
    @Operation(summary = "重置密码")
    public Result<Boolean> resetPassword(@PathVariable Long userId, @RequestParam String newPassword) {
        Boolean success = userService.resetPassword(userId, newPassword);
        return Result.success(success, "密码重置成功");
    }

    @GetMapping("/company/{companyId}")
    @Operation(summary = "根据企业ID获取用户列表")
    public Result<List<User>> getUsersByCompanyId(@PathVariable Long companyId) {
        List<User> users = userService.getUsersByCompanyId(companyId);
        return Result.success(users);
    }

    @GetMapping("/check/username")
    @Operation(summary = "检查用户名是否存在")
    public Result<Boolean> checkUsernameExists(@RequestParam String username) {
        Boolean exists = userService.checkUsernameExists(username);
        return Result.success(exists);
    }

    @GetMapping("/check/phone")
    @Operation(summary = "检查手机号是否存在")
    public Result<Boolean> checkPhoneExists(@RequestParam String phone) {
        Boolean exists = userService.checkPhoneExists(phone);
        return Result.success(exists);
    }

    @GetMapping("/check/email")
    @Operation(summary = "检查邮箱是否存在")
    public Result<Boolean> checkEmailExists(@RequestParam String email) {
        Boolean exists = userService.checkEmailExists(email);
        return Result.success(exists);
    }

}