package com.example.ats.repository;

import com.example.ats.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    // 根据姓名模糊查询示例
    List<Client> findByNameContaining(String name);
}