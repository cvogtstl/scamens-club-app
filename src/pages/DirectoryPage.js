// src/pages/DirectoryPage.js
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
  useDisclosure,
  SimpleGrid,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import MemberModal from '../components/MemberModal';

function DirectoryPage() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('member'));

  useEffect(() => {
    const member = localStorage.getItem('member');
    if (!member) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('first_name, last_name, email, phone, photo_url, officer_title, hide_contact_info')
      .order('last_name', { ascending: true });

    if (error) {
      console.error('Error fetching members:', error.message);
    } else {
      setMembers(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('member');
    navigate('/');
  };

  const officerOrder = ['President', 'Vice-President', 'Secretary', 'Treasurer', 'Oktoberfest Chair'];

  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      (m.first_name?.toLowerCase().includes(term) || '') ||
      (m.last_name?.toLowerCase().includes(term) || '') ||
      (m.email?.toLowerCase().includes(term) || '') ||
      (m.officer_title?.toLowerCase().includes(term) || '')
    );
  });

  const officers = filteredMembers
    .filter((m) => m.officer_title)
    .sort((a, b) => officerOrder.indexOf(a.officer_title) - officerOrder.indexOf(b.officer_title));

  const nonOfficers = filteredMembers
    .filter((m) => !m.officer_title)
    .sort((a, b) => a.last_name?.localeCompare(b.last_name));

  const handleCardClick = (member) => {
    setSelectedMember(member);
    onOpen();
  };

  const MemberCard = ({ member }) => (
    <Box
      p={4}
      bg="white"
      boxShadow="sm"
      borderRadius="md"
      cursor="pointer"
      onClick={() => handleCardClick(member)}
      w="100%"
      h="100%"
      minH="220px" // Ensures uniform height
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      textAlign="center"
    >
      <Avatar
        src={member.photo_url || undefined}
        name={`${member.first_name} ${member.last_name}`}
        size="xl"
        mb={2}
      />
      <Text fontWeight="bold" fontSize="lg">
        {member.first_name} {member.last_name}
      </Text>
      {member.officer_title && (
        <Text fontSize="sm" color="blue.600">
          {member.officer_title}
        </Text>
      )}
      {!member.hide_contact_info ? (
        <>
          <Text fontSize="sm">{member.email}</Text>
          {member.phone && <Text fontSize="sm">{member.phone}</Text>}
        </>
      ) : (
        <Text fontSize="sm" color="gray.400" mt={1}>
          Contact info hidden
        </Text>
      )}
    </Box>
  );
  

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading>Member Directory</Heading>
        <Button size="sm" onClick={handleLogout} colorScheme="red">
          Log Out
        </Button>
      </HStack>

      <HStack mb={4} justify="space-between">
        <Input
          placeholder="Search members by name, email, or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="sm"
        />
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor="view-toggle" mb="0">
            Grid View
          </FormLabel>
          <Switch id="view-toggle" isChecked={isGridView} onChange={() => setIsGridView(!isGridView)} />
        </FormControl>
      </HStack>

      {loading ? (
        <Spinner />
      ) : (
        <VStack spacing={6} align="stretch">
        {officers.length > 0 && (
  <>
    <Heading size="md" mb={2}>Club Officers</Heading>

    {isGridView ? (
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {officers.map((member, i) => (
          <MemberCard key={`officer-${i}`} member={member} />
        ))}
      </SimpleGrid>
    ) : (
      officers.map((member, i) => (
        <MemberCard key={`officer-${i}`} member={member} />
      ))
    )}

    <Divider my={6} borderColor="gray.400" />
    <Heading size="md" mb={2}>Members</Heading>
  </>
)}

          {isGridView ? (
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {nonOfficers.map((member, i) => (
                <MemberCard key={`member-${i}`} member={member} />
              ))}
            </SimpleGrid>
          ) : (
            nonOfficers.map((member, i) => (
              <MemberCard key={`member-${i}`} member={member} />
            ))
          )}

          {filteredMembers.length === 0 && <Text>No matching members found.</Text>}
        </VStack>
      )}

      {selectedMember && (
        <MemberModal
          isOpen={isOpen}
          onClose={onClose}
          member={selectedMember}
          isCurrentUser={currentUser?.email === selectedMember.email}
          onMemberUpdate={fetchMembers}
        />
      )}
    </Box>
  );
}

export default DirectoryPage;
