package com.example.ats.service;

import com.example.ats.entity.Client;
import com.example.ats.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // 查询所有用户
    public List<Client> listAll() {
        return clientRepository.findAll();
    }

    // 按 ID 查询
    public Optional<Client> getById(Long id) {
        return clientRepository.findById(id);
    }

    // 按名字模糊查询
    public List<Client> searchByName(String name) {
        return clientRepository.findByNameContaining(name);
    }

    // 保存或更新
    public Client save(Client user) {
        return clientRepository.save(user);
    }

    // 删除
    public void delete(Long id) {
        clientRepository.deleteById(id);
    }
}