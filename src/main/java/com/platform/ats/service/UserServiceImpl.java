package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.entity.user.SysUser;
import com.platform.ats.entity.user.UserStatus;
import com.platform.ats.entity.user.dto.UserCreateDTO;
import com.platform.ats.entity.user.dto.UserUpdateDTO;
import com.platform.ats.entity.user.query.UserQuery;
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
    public Long register(UserCreateDTO userCreateDTO) {
        // 检查用户名是否已存在
        if (checkUsernameExists(userCreateDTO.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查手机号是否已存在
        if (StringUtils.hasText(userCreateDTO.getPhone()) && checkPhoneExists(userCreateDTO.getPhone())) {
            throw new RuntimeException("手机号已存在");
        }

        // 检查邮箱是否已存在
        if (StringUtils.hasText(userCreateDTO.getEmail()) && checkEmailExists(userCreateDTO.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }

        // 创建用户
        SysUser sysUser = new SysUser();
        BeanUtils.copyProperties(userCreateDTO, sysUser);
        sysUser.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));
        sysUser.setStatus(UserStatus.NORMAL.getCode());

        this.baseMapper.insert(sysUser);
        log.info("用户注册成功: username={}, userId={}", sysUser.getUsername(), sysUser.getUserId());

        return sysUser.getUserId();
    }

    @Override
    public SysUser login(String username, String password) {
        SysUser sysUser = this.baseMapper.selectByUsername(username);
        if (sysUser == null) {
            throw new RuntimeException("用户不存在");
        }

        if (sysUser.isDisabled()) {
            throw new RuntimeException("账号已被禁用");
        }

        if (!passwordEncoder.matches(password, sysUser.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        return sysUser;
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
        return register(userCreateDTO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateUser(UserUpdateDTO userUpdateDTO) {
        SysUser existingSysUser = getUserById(userUpdateDTO.getUserId());
        if (existingSysUser == null) {
            throw new RuntimeException("用户不存在");
        }

        // 检查手机号是否被其他用户使用
        if (StringUtils.hasText(userUpdateDTO.getPhone()) &&
                !Objects.equals(existingSysUser.getPhone(), userUpdateDTO.getPhone()) &&
                checkPhoneExists(userUpdateDTO.getPhone())) {
            throw new RuntimeException("手机号已被其他用户使用");
        }

        // 检查邮箱是否被其他用户使用
        if (StringUtils.hasText(userUpdateDTO.getEmail()) &&
                !Objects.equals(existingSysUser.getEmail(), userUpdateDTO.getEmail()) &&
                checkEmailExists(userUpdateDTO.getEmail())) {
            throw new RuntimeException("邮箱已被其他用户使用");
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
        return this.baseMapper.deleteById(userId) > 0;
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
}