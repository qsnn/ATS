package com.example.ats.controller;

import com.example.ats.entity.Client;
import com.example.ats.service.ClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // GET /api/clients => 查询所有用户
    @GetMapping
    public List<Client> listAll() {
        return clientService.listAll();
    }

    // GET /api/clients/{id} => 按 ID 查询
    @GetMapping("/{id}")
    public Client getById(@PathVariable Long id) {
        return clientService.getById(id).orElse(null);
    }

    // GET /api/clients/search?name=xxx => 按名字模糊查询
    @GetMapping("/search")
    public List<Client> search(@RequestParam String name) {
        return clientService.searchByName(name);
    }

    // POST /api/clients => 新增用户
    @PostMapping
    public Client create(@RequestBody Client client) {
        return clientService.save(client);
    }

    // PUT /api/clients/{id} => 更新用户
    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client client) {
        client.setId(id);
        return clientService.save(client);
    }

    // DELETE /api/clients/{id} => 删除用户
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clientService.delete(id);
    }
}