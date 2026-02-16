package com.example.sample.repository;

import com.example.sample.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {

    Optional<Group> findByGroupName(String groupName);

    boolean existsByGroupName(String groupName);
}