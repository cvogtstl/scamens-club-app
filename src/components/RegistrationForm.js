// src/components/RegistrationForm.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    photo: null,
    hide_contact_info: false,
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'photo') {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let photo_url = null;

    if (formData.photo) {
      const file = formData.photo;
      const filePath = `members/${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        toast({
          title: 'Photo upload failed.',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
        return;
      }

      const { data: publicData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      photo_url = publicData.publicUrl;
    }

    const { data: existing, error: fetchError } = await supabase
      .from('members')
      .select('*')
      .eq('email', formData.email)
      .maybeSingle();

    if (existing) {
      toast({
        title: 'Email already registered.',
        status: 'warning',
        duration: 4000,
      });
      return;
    }

    const { error: insertError } = await supabase.from('members').insert([
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        photo_url,
        hide_contact_info: formData.hide_contact_info,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      toast({ title: 'Registration failed.', status: 'error' });
    } else {
      toast({ title: 'Registered successfully!', status: 'success' });
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        photo: null,
        hide_contact_info: false,
      });
      navigate('/');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading size="lg" mb={4}>Men's Club Registration</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input name="first_name" value={formData.first_name} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input name="last_name" value={formData.last_name} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Photo</FormLabel>
            <Input type="file" name="photo" accept="image/*" onChange={handleChange} />
          </FormControl>

          <FormControl>
            <Checkbox name="hide_contact_info" isChecked={formData.hide_contact_info} onChange={handleChange}>
              Hide my contact info
            </Checkbox>
          </FormControl>

          <Button colorScheme="blue" type="submit">Register</Button>
        </Stack>
      </form>
    </Box>
  );
}

export default RegistrationForm;
