import React from 'react';
import { Box, Heading, Button, VStack, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Box p={6} textAlign="center">
      {/* Add a logo with improved formatting */}
      <Image 
        src="scalogo.jfif" // Update this path to your actual logo location
        alt="Men's Club Logo" 
        boxSize={{ base: '120px', md: '150px' }} // Responsive size
        borderRadius="full" // Makes the logo circular if it's square
        mx="auto" 
        mb={6} // Add more spacing below the logo
        shadow="md" // Add a subtle shadow for better appearance
      />
      <Heading mb={6} fontSize={{ base: '2xl', md: '3xl' }}>
        St Clare of Assisi's Men's Club
      </Heading>
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
