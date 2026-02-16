package com.example.sample.service;

import com.example.sample.model.Group;
import com.example.sample.model.Person;
import com.example.sample.repository.GroupRepository;
import com.example.sample.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class GroupService {

    private final GroupRepository groupRepository;
    private final PersonRepository personRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository, PersonRepository personRepository) {
        this.groupRepository = groupRepository;
        this.personRepository = personRepository;
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Integer id) {
        return groupRepository.findById(id);
    }

    public Optional<Group> getGroupByName(String groupName) {
        return groupRepository.findByGroupName(groupName);
    }

    public Group createGroup(Group group) {
        if (groupRepository.existsByGroupName(group.getGroupName())) {
            throw new IllegalArgumentException("Group name already exists");
        }
        return groupRepository.save(group);
    }

    public Group updateGroup(Integer id, Group groupDetails) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + id));

        if (groupDetails.getGroupName() != null && !groupDetails.getGroupName().equals(group.getGroupName())) {
            if (groupRepository.existsByGroupName(groupDetails.getGroupName())) {
                throw new IllegalArgumentException("Group name already exists");
            }
            group.setGroupName(groupDetails.getGroupName());
        }

        return groupRepository.save(group);
    }

    public void deleteGroup(Integer id) {
        if (!groupRepository.existsById(id)) {
            throw new IllegalArgumentException("Group not found with id: " + id);
        }
        groupRepository.deleteById(id);
    }

    public Set<Person> getGroupMembers(Integer groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));
        return group.getPersons();
    }

    public Group addPersonToGroup(Integer groupId, Integer personId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new IllegalArgumentException("Person not found with id: " + personId));

        group.getPersons().add(person);
        return groupRepository.save(group);
    }

    public Group removePersonFromGroup(Integer groupId, Integer personId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new IllegalArgumentException("Person not found with id: " + personId));

        if (!group.getPersons().contains(person)) {
            throw new IllegalArgumentException("Person is not a member of this group");
        }

        group.getPersons().remove(person);
        return groupRepository.save(group);
    }
}