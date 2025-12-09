package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.user.SysUser;
import com.platform.ats.entity.user.UserStatus;
import com.platform.ats.entity.user.UserType;
import com.platform.ats.entity.user.dto.HrCreateDTO;
import com.platform.ats.entity.user.dto.UserCreateDTO;
import com.platform.ats.entity.user.dto.UserPasswordDTO;
import com.platform.ats.entity.user.dto.UserRegisterDTO;
import com.platform.ats.entity.user.dto.UserUpdateDTO;
import com.platform.ats.entity.user.query.UserQuery;
import com.platform.ats.entity.user.vo.HrVO;
import com.platform.ats.entity.user.vo.UserProfileVO;
import com.platform.ats.entity.user.vo.UserVO;
import com.platform.ats.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

/**
 * 用户服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserRepository, SysUser> implements UserService {

    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long register(UserRegisterDTO userRegisterDTO) {
        // 检查用户名是否已存在
        if (checkUsernameExists(userRegisterDTO.getUsername())) {
            throw new BizException(ErrorCode.USERNAME_EXISTS);
        }

        // 检查手机号是否已存在
        if (StringUtils.hasText(userRegisterDTO.getPhone()) && checkPhoneExists(userRegisterDTO.getPhone())) {
            throw new BizException(ErrorCode.PHONE_EXISTS);
        }

        // 检查邮箱是否已存在
        if (StringUtils.hasText(userRegisterDTO.getEmail()) && checkEmailExists(userRegisterDTO.getEmail())) {
            throw new BizException(ErrorCode.EMAIL_EXISTS);
        }

        // 创建用户实体
        SysUser sysUser = new SysUser();
        BeanUtils.copyProperties(userRegisterDTO, sysUser);
        sysUser.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));

        // 后端设置固定值：用户类型为求职者(4)，状态为正常(1)
        sysUser.setUserType(UserType.JOB_SEEKER.getCode()); // 假设 UserType.JOB_SEEKER.getCode() 返回 4
        sysUser.setStatus(UserStatus.NORMAL.getCode());

        this.baseMapper.insert(sysUser);
        log.info("用户注册成功: username={}, userId={}", sysUser.getUsername(), sysUser.getUserId());

        return sysUser.getUserId();
    }

    @Override
    public SysUser login(String username, String password) {
        SysUser sysUser = this.baseMapper.selectByUsername(username);
        if (sysUser == null) {
            throw new BizException(ErrorCode.USER_NOT_FOUND);
        }

        if (sysUser.isDisabled()) {
            throw new BizException(ErrorCode.ACCOUNT_DISABLED);
        }

        if (!passwordEncoder.matches(password, sysUser.getPassword())) {
            throw new BizException(ErrorCode.PASSWORD_ERROR);
        }

        return sysUser;
    }

    @Override
    public UserProfileVO getUserProfile(Long userId) {
        SysUser sysUser = this.getById(userId);
        if (sysUser == null) {
            return null;
        }

        UserProfileVO profileVO = new UserProfileVO();
        BeanUtils.copyProperties(sysUser, profileVO);

        return profileVO;
    }


    @Override
    public SysUser getUserById(Long userId) {
        return this.baseMapper.selectById(userId);
    }

    @Override
    public SysUser getUserByUsername(String username) {
        return this.baseMapper.selectByUsername(username);
    }

    @Override
    public IPage<UserVO> getUserPage(UserQuery query, Integer pageNum, Integer pageSize) {
        Page<UserVO> page = new Page<>(pageNum, pageSize);
        return this.baseMapper.selectUserPage(page, query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUser(UserCreateDTO userCreateDTO) {
        // 检查用户名是否已存在
        if (checkUsernameExists(userCreateDTO.getUsername())) {
            throw new BizException(ErrorCode.USERNAME_EXISTS);
        }

        // 检查手机号是否已存在
        if (StringUtils.hasText(userCreateDTO.getPhone()) && checkPhoneExists(userCreateDTO.getPhone())) {
            throw new BizException(ErrorCode.PHONE_EXISTS);
        }

        // 检查邮箱是否已存在
        if (StringUtils.hasText(userCreateDTO.getEmail()) && checkEmailExists(userCreateDTO.getEmail())) {
            throw new BizException(ErrorCode.EMAIL_EXISTS);
        }

        // 创建用户实体
        SysUser sysUser = new SysUser();
        BeanUtils.copyProperties(userCreateDTO, sysUser);

        // 对密码进行加密
        sysUser.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));

        // 如果DTO中未指定状态，则默认为正常
        if (sysUser.getStatus() == null) {
            sysUser.setStatus(UserStatus.NORMAL.getCode()); // 假设 UserStatus.NORMAL.getCode() 返回 1
        }

        this.baseMapper.insert(sysUser);
        log.info("管理员创建用户成功: username={}, userId={}", sysUser.getUsername(), sysUser.getUserId());

        return sysUser.getUserId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateUser(UserUpdateDTO userUpdateDTO) {
        SysUser existingSysUser = getUserById(userUpdateDTO.getUserId());
        if (existingSysUser == null) {
            throw new BizException(ErrorCode.USER_NOT_FOUND);
        }

        // 检查手机号是否被其他用户使用
        if (StringUtils.hasText(userUpdateDTO.getPhone()) &&
                !Objects.equals(existingSysUser.getPhone(), userUpdateDTO.getPhone()) &&
                checkPhoneExists(userUpdateDTO.getPhone())) {
            throw new BizException(ErrorCode.PHONE_EXISTS);
        }

        // 检查邮箱是否被其他用户使用
        if (StringUtils.hasText(userUpdateDTO.getEmail()) &&
                !Objects.equals(existingSysUser.getEmail(), userUpdateDTO.getEmail()) &&
                checkEmailExists(userUpdateDTO.getEmail())) {
            throw new BizException(ErrorCode.EMAIL_EXISTS);
        }

        SysUser sysUser = new SysUser();
        BeanUtils.copyProperties(userUpdateDTO, sysUser);

        return this.baseMapper.updateById(sysUser) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateUserStatus(Long userId, Integer status) {
        return this.baseMapper.updateStatus(userId, status) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteUser(Long userId) {
        // 使用自定义逻辑删除 SQL，避免物理删除
        return this.baseMapper.logicDelete(userId) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changePassword(Long userId, UserPasswordDTO dto) {
        SysUser sysUser = this.getById(userId);
        if (sysUser == null) {
            throw new BizException(ErrorCode.USER_NOT_FOUND);
        }
        // 校验原密码
        if (!passwordEncoder.matches(dto.getOldPassword(), sysUser.getPassword())) {
            throw new BizException(ErrorCode.PASSWORD_ERROR, "原密码不正确");
        }
        // 更新为新密码
        SysUser toUpdate = new SysUser();
        toUpdate.setUserId(userId);
        toUpdate.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        this.baseMapper.updateById(toUpdate);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean resetPassword(Long userId, String newPassword) {
        SysUser sysUser = new SysUser();
        sysUser.setUserId(userId);
        sysUser.setPassword(passwordEncoder.encode(newPassword));
        return this.baseMapper.updateById(sysUser) > 0;
    }

    @Override
    public List<SysUser> getUsersByCompanyId(Long companyId) {
        return this.baseMapper.selectByCompanyId(companyId);
    }

    @Override
    public List<SysUser> getUsersByType(Integer userType) {
        return this.baseMapper.selectByUserType(userType);
    }

    @Override
    public Boolean checkUsernameExists(String username) {
        return this.baseMapper.selectByUsername(username) != null;
    }

    @Override
    public Boolean checkPhoneExists(String phone) {
        return this.baseMapper.selectByPhone(phone) != null;
    }

    @Override
    public Boolean checkEmailExists(String email) {
        return this.baseMapper.selectByEmail(email) != null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createHrAccount(HrCreateDTO hrCreateDTO) {
        SysUser sysUser = new SysUser();
        
        // 生成6位随机用户名
        String username = generateRandomUsername();
        
        // 检查生成的用户名是否已存在，如果存在则重新生成
        while (checkUsernameExists(username)) {
            username = generateRandomUsername();
        }
        
        sysUser.setUsername(username);
        sysUser.setPassword(passwordEncoder.encode("123456")); // 默认密码
        sysUser.setUserType(UserType.HR.getCode()); // HR类型
        sysUser.setCompanyId(hrCreateDTO.getCompanyId());
        sysUser.setStatus(UserStatus.NORMAL.getCode()); // 默认状态为正常
        
        this.baseMapper.insert(sysUser);
        log.info("HR账户创建成功: username={}, userId={}", sysUser.getUsername(), sysUser.getUserId());
        
        return sysUser.getUserId();
    }

    @Override
    public List<HrVO> getHrAccountsByCompanyId(Long companyId) {
        List<SysUser> hrUsers = this.baseMapper.selectHrByCompanyId(companyId);
        return hrUsers.stream().map(sysUser -> {
            HrVO hrVO = new HrVO();
            BeanUtils.copyProperties(sysUser, hrVO);
            return hrVO;
        }).collect(java.util.stream.Collectors.toList());
    }

    /**
     * 生成6位随机用户名（数字和字母组合）
     */
    private String generateRandomUsername() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}