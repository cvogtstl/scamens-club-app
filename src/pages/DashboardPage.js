// src/pages/DashboardPage.js
import React from 'react';
import { Box, Heading, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Box p={6}>
      <Heading mb={4}>St Clare of Assisi's Men's Club Dashboard</Heading>
      <VStack spacing={4}>
        <Button onClick={() => navigate('/register')} colorScheme="green">
          Join Now
        </Button>
        <Button onClick={() => navigate('/directory')}>View Directory</Button>
        <Button onClick={() => navigate('/notes')}>Meeting Notes</Button>
        <Button onClick={() => navigate('/events')}>Calendar Events</Button>
      </VStack>
    </Box>
  );
}

export default DashboardPage;
