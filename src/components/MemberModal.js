// src/components/MemberModal.js
import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton,
  Button, Avatar, Text, Box, VStack, FormControl, FormLabel, Input, useToast
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';

export default function MemberModal({ isOpen, onClose, member, isCurrentUser, onMemberUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...member });
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    let photo_url = member.photo_url;

    if (formData.photo) {
      const filePath = `members/${Date.now()}_${formData.photo.name}`;
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, formData.photo, {
          cacheControl: '3600',
          upsert: false,
          contentType: formData.photo.type,
        });

      if (error) {
        toast({ title: 'Photo upload failed.', status: 'error' });
        return;
      }

      const { data: publicData } = supabase.storage.from('photos').getPublicUrl(filePath);
      photo_url = publicData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('members')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        photo_url,
        updated_at: new Date().toISOString()
      })
      .eq('email', member.email);

    if (updateError) {
      toast({ title: 'Update failed.', status: 'error' });
    } else {
      toast({ title: 'Profile updated!', status: 'success' });
      setIsEditing(false);
      onMemberUpdate(); // Trigger refresh
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmed) return;

    const { error } = await supabase.from('members').delete().eq('email', member.email);
    if (error) {
      toast({ title: 'Delete failed.', status: 'error' });
    } else {
      toast({ title: 'Profile deleted.', status: 'success' });
      localStorage.removeItem('member');
      onClose();
      window.location.href = '/';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "Edit Profile" : `${member.first_name} ${member.last_name}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEditing ? (
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input name="first_name" value={formData.first_name} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input name="last_name" value={formData.last_name} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input name="email" value={formData.email} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>New Photo</FormLabel>
                <Input type="file" name="photo" onChange={handleChange} />
              </FormControl>
            </VStack>
          ) : (
            <VStack spacing={3} textAlign="center">
              <Avatar size="xl" src={member.photo_url} name={`${member.first_name} ${member.last_name}`} />
              <Text fontWeight="bold">{member.first_name} {member.last_name}</Text>
              {member.officer_title && <Text color="blue.600">{member.officer_title}</Text>}
              <Text>{member.email}</Text>
              {member.phone && <Text>{member.phone}</Text>}
              {member.updated_at && (
                <Text fontSize="sm" color="gray.500">
                  Last updated: {new Date(member.updated_at).toLocaleString()}
                </Text>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {isCurrentUser && (
            <>
              {isEditing ? (
                <>
                  <Button mr={3} onClick={handleSave} colorScheme="blue">Save</Button>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button mr={3} onClick={() => setIsEditing(true)}>Edit</Button>
                  <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                </>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
