package com.example.ats.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "clientNumber", nullable = false)
    private String clientNumber;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "gender")
    private String gender;

    @Column(name = "age")
    private int age;

    @Column(name = "idCard")
    private String idCard;

    @Column(name = "entryTime")
    private Date entryTime;
}
