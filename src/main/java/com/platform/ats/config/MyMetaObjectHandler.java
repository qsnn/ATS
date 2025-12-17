package com.platform.ats.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        // 只在为空时填充，避免手动传值被覆盖
        strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        // 为TalentPool实体添加putInTime字段的自动填充
        strictInsertFill(metaObject, "putInTime", LocalDateTime.class, LocalDateTime.now());
        // 为SysNotice实体添加sendTime字段的自动填充
        strictInsertFill(metaObject, "sendTime", LocalDateTime.class, LocalDateTime.now());
        // 设置默认的deleteFlag为0（未删除）
        strictInsertFill(metaObject, "deleteFlag", Integer.class, 0);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}