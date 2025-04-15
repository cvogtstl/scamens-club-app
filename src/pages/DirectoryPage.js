import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Avatar,
  Text,
  VStack,
  HStack,
  Spinner,
  Input,
  Button,
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function DirectoryPage() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const member = localStorage.getItem('member');
    if (!member) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('first_name, last_name, email, phone, photo_url, officer_title, updated_at') // ✅ include updated_at
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching members:', error.message);
      } else {
        setMembers(data);
      }

      setLoading(false);
    };

    fetchMembers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('member');
    navigate('/');
  };

  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.first_name.toLowerCase().includes(term) ||
      m.last_name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      (m.officer_title && m.officer_title.toLowerCase().includes(term))
    );
  });

  const officers = filteredMembers.filter((m) => m.officer_title);
  const nonOfficers = filteredMembers.filter((m) => !m.officer_title);

  const MemberCard = ({ member }) => (
    <HStack
      p={4}
      bg="white"
      boxShadow="sm"
      borderRadius="md"
      spacing={6}
      align="center"
      w="100%"
    >
      <Avatar
        src={member.photo_url || undefined}
        name={`${member.first_name} ${member.last_name}`}
        size="xl"
      />
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          {member.first_name} {member.last_name}
        </Text>
        {member.officer_title && (
          <Text fontSize="sm" color="blue.600">
            {member.officer_title}
          </Text>
        )}
        <Text fontSize="sm">{member.email}</Text>
        {member.phone && <Text fontSize="sm">{member.phone}</Text>}
        {member.updated_at && (
          <Text fontSize="xs" color="gray.500" mt={1}>
            Last updated: {new Date(member.updated_at).toLocaleDateString()}
          </Text>
        )}
      </Box>
    </HStack>
  );

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading>Member Directory</Heading>
        <Button size="sm" onClick={handleLogout} colorScheme="red">
          Log Out
        </Button>
      </HStack>

      <Input
        placeholder="Search members by name, email, or title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={6}
      />

      {loading ? (
        <Spinner />
      ) : (
        <VStack spacing={6} align="stretch">
          {officers.length > 0 && (
            <>
              <Heading size="md">Club Officers</Heading>
              {officers.map((member, i) => (
                <MemberCard key={`officer-${i}`} member={member} />
              ))}
              <Divider my={4} />
            </>
          )}

          {nonOfficers.map((member, i) => (
            <MemberCard key={`member-${i}`} member={member} />
          ))}

          {filteredMembers.length === 0 && (
            <Text>No matching members found.</Text>
          )}
        </VStack>
      )}
    </Box>
  );
}

export default DirectoryPage;
