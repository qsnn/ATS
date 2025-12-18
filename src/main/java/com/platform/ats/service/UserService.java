package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.platform.ats.entity.user.SysUser;
import com.platform.ats.entity.user.dto.UserRegisterDTO;
import com.platform.ats.entity.user.query.UserQuery;
import com.platform.ats.entity.user.dto.UserCreateDTO;
import com.platform.ats.entity.user.dto.UserUpdateDTO;
import com.platform.ats.entity.user.dto.HrCreateDTO;
import com.platform.ats.entity.user.dto.UserPasswordDTO;
import com.platform.ats.entity.user.vo.HrVO;
import com.platform.ats.entity.user.vo.UserProfileVO;
import com.platform.ats.entity.user.vo.UserVO;

import java.util.List;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 用户注册
     */
    Long register(UserRegisterDTO userRegisterDTO);

    /**
     * 用户登录
     */
    SysUser login(String username, String password);

    /**
     * 根据用户ID获取用户个人信息
     */
    UserProfileVO getUserProfile(Long userId);

    /**
     * 根据ID获取用户
     */
    SysUser getUserById(Long userId);

    /**
     * 根据用户名获取用户
     */
    SysUser getUserByUsername(String username);

    /**
     * 分页查询用户列表
     */
    IPage<UserVO> getUserPage(UserQuery query, Integer pageNum, Integer pageSize);

    /**
     * 创建用户
     */
    Long createUser(UserCreateDTO userCreateDTO);

    /**
     * 更新用户
     */
    Boolean updateUser(UserUpdateDTO userUpdateDTO);

    /**
     * 更新用户状态
     */
    Boolean updateUserStatus(Long userId, Integer status);

    /**
     * 删除用户（逻辑删除）
     */
    Boolean deleteUser(Long userId);

    /**
     * 重置密码
     */
    Boolean resetPassword(Long userId, String newPassword);

    /**
     * 根据企业ID获取用户列表
     */
    List<SysUser> getUsersByCompanyId(Long companyId);

    /**
     * 根据用户类型获取用户列表
     */
    List<SysUser> getUsersByType(Integer userType);

    /**
     * 检查用户名是否存在
     */
    Boolean checkUsernameExists(String username);

    /**
     * 检查手机号是否存在
     */
    Boolean checkPhoneExists(String phone);

    /**
     * 检查邮箱是否存在
     */
    Boolean checkEmailExists(String email);

    /**
     * 当前登录用户自行修改密码
     */
    void changePassword(Long userId, UserPasswordDTO dto);

    /**
     * 创建HR账户
     */
    Long createHrAccount(HrCreateDTO hrCreateDTO);

    /**
     * 根据企业ID获取HR账户列表
     */
    List<HrVO> getHrAccountsByCompanyId(Long companyId);
    
    /**
     * 根据企业ID分页获取HR账户列表
     */
    IPage<HrVO> getHrAccountsByCompanyId(Long companyId, Integer pageNum, Integer pageSize);

    /**
     * 批量创建HR账户
     */
    List<Long> createHrAccounts(HrCreateDTO hrCreateDTO, int count);
    
    /**
     * 更改用户类型
     */
    Boolean changeUserType(Long userId, Integer newUserType);
}