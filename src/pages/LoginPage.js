// src/pages/LoginPage.js
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
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) {
      toast({
        title: 'Not Found',
        description: 'That email is not registered.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    localStorage.setItem('member', JSON.stringify(data)); // ✅ Store session
    toast({
      title: 'Welcome!',
      description: `${data.first_name} ${data.last_name}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/directory'); // ✅ Redirect to the directory
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading size="lg" mb={4}>Member Login</Heading>
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Log In
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default LoginPage;
