package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.user.SysUser;
import com.platform.ats.entity.user.query.UserQuery;
import com.platform.ats.entity.user.vo.UserVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户数据访问层
 */
public interface UserRepository extends BaseMapper<SysUser> {

    /**
     * 根据用户名查询用户
     */
    SysUser selectByUsername(@Param("username") String username);

    /**
     * 根据手机号查询用户
     */
    SysUser selectByPhone(@Param("phone") String phone);

    /**
     * 根据邮箱查询用户
     */
    SysUser selectByEmail(@Param("email") String email);

    /**
     * 分页查询用户列表
     */
    IPage<UserVO> selectUserPage(Page<UserVO> page, @Param("query") UserQuery query);

    /**
     * 根据企业ID查询用户列表
     */
    List<SysUser> selectByCompanyId(@Param("companyId") Long companyId);

    /**
     * 根据用户类型查询用户列表
     */
    List<SysUser> selectByUserType(@Param("userType") Integer userType);

    /**
     * 更新用户状态
     */
    int updateStatus(@Param("userId") Long userId, @Param("status") Integer status);

    /**
     * 逻辑删除用户
     */
    int logicDelete(@Param("userId") Long userId);
}