import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../hooks/useAuth";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaTrophy,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 20px;
  box-shadow: 0 4px 20px ${({ theme }) => theme.border}20;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primary},
    ${({ theme }) => theme.accent}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const Email = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MemberSince = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primary},
    ${({ theme }) => theme.accent}
  );
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${({ theme }) => theme.primary}40;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 1.2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 15px ${({ theme }) => theme.border}20;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

const Section = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px ${({ theme }) => theme.border}20;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ primary?: boolean; danger?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ primary, danger, theme }) => {
    if (danger) {
      return `
        background: #dc3545;
        color: white;
        
        &:hover {
          background: #c82333;
          transform: translateY(-2px);
        }
      `;
    }

    if (primary) {
      return `
        background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px ${theme.primary}40;
        }
      `;
    }

    return `
      background: transparent;
      color: ${theme.text};
      border: 2px solid ${theme.border};
      
      &:hover {
        border-color: ${theme.primary};
        color: ${theme.primary};
      }
    `;
  }}
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.primary}20;
  color: ${({ theme }) => theme.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const PreferencesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const PreferenceItem = styled.div`
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.bodyBg};
`;

const PreferenceLabel = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const PreferenceValue = styled.div`
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

const UserProfile: React.FC = () => {
  const { userProfile, updateProfile, profileLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userProfile?.displayName || "",
    phoneNumber: userProfile?.phoneNumber || "",
    preferences: {
      theme: userProfile?.preferences.theme || "auto",
      difficulty: userProfile?.preferences.difficulty || "intermediate",
      dailyGoal: userProfile?.preferences.dailyGoal || 30,
    },
  });

  if (!userProfile) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p>Loading profile...</p>
        </div>
      </ProfileContainer>
    );
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        displayName: editData.displayName,
        phoneNumber: editData.phoneNumber,
        preferences: editData.preferences,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setEditData({
      displayName: userProfile.displayName,
      phoneNumber: userProfile.phoneNumber || "",
      preferences: {
        theme: userProfile.preferences.theme,
        difficulty: userProfile.preferences.difficulty,
        dailyGoal: userProfile.preferences.dailyGoal,
      },
    });
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>
          {userProfile.photoURL ? (
            <img src={userProfile.photoURL} alt={userProfile.displayName} />
          ) : (
            <FaUser />
          )}
        </Avatar>

        <ProfileInfo>
          <Name>{userProfile.displayName}</Name>
          <Email>
            <FaEnvelope />
            {userProfile.email}
          </Email>
          <MemberSince>
            <FaCalendar />
            Member since {formatDate(userProfile.createdAt)}
          </MemberSince>
        </ProfileInfo>

        <EditButton onClick={() => setIsEditing(true)}>
          <FaEdit />
          Edit Profile
        </EditButton>
      </ProfileHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FaTrophy />
          </StatIcon>
          <StatValue>{userProfile.stats.totalProblemsCompleted}</StatValue>
          <StatLabel>Problems Completed</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaChartLine />
          </StatIcon>
          <StatValue>{userProfile.stats.currentStreak}</StatValue>
          <StatLabel>Day Streak</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaCog />
          </StatIcon>
          <StatValue>{userProfile.stats.totalProblemsAttempted}</StatValue>
          <StatLabel>Problems Attempted</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaUser />
          </StatIcon>
          <StatValue>{Math.round(userProfile.stats.averageScore)}%</StatValue>
          <StatLabel>Average Score</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>
          <FaUser />
          Personal Information
        </SectionTitle>

        {isEditing ? (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <FormGroup>
              <Label>Display Name</Label>
              <Input
                type="text"
                value={editData.displayName}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={editData.phoneNumber}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
              />
            </FormGroup>

            <ButtonGroup>
              <Button type="button" onClick={handleCancel}>
                <FaTimes />
                Cancel
              </Button>
              <Button type="submit" primary disabled={profileLoading}>
                <FaSave />
                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </ButtonGroup>
          </Form>
        ) : (
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Display Name:</strong> {userProfile.displayName}
            </div>
            {userProfile.phoneNumber && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Phone:</strong> {userProfile.phoneNumber}
              </div>
            )}
            <div>
              <strong>Last Login:</strong> {formatDate(userProfile.lastLoginAt)}
            </div>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>
          <FaCog />
          Preferences
        </SectionTitle>

        <PreferencesGrid>
          <PreferenceItem>
            <PreferenceLabel>Theme</PreferenceLabel>
            <PreferenceValue>{userProfile.preferences.theme}</PreferenceValue>
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>Difficulty Level</PreferenceLabel>
            <PreferenceValue>
              {userProfile.preferences.difficulty}
            </PreferenceValue>
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>Daily Goal</PreferenceLabel>
            <PreferenceValue>
              {userProfile.preferences.dailyGoal} minutes
            </PreferenceValue>
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>Timezone</PreferenceLabel>
            <PreferenceValue>
              {userProfile.preferences.timezone}
            </PreferenceValue>
          </PreferenceItem>
        </PreferencesGrid>

        {userProfile.preferences.focusAreas.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <PreferenceLabel>Focus Areas</PreferenceLabel>
            <TagList>
              {userProfile.preferences.focusAreas.map((area, index) => (
                <Tag key={index}>{area}</Tag>
              ))}
            </TagList>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>
          <FaChartLine />
          Statistics
        </SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <strong>Problems by Type:</strong>
            <div>
              Machine Coding: {userProfile.stats.problemsByType.machineCoding}
            </div>
            <div>
              System Design: {userProfile.stats.problemsByType.systemDesign}
            </div>
            <div>DSA: {userProfile.stats.problemsByType.dsa}</div>
          </div>

          <div>
            <strong>Problems by Difficulty:</strong>
            <div>Easy: {userProfile.stats.problemsByDifficulty.easy}</div>
            <div>Medium: {userProfile.stats.problemsByDifficulty.medium}</div>
            <div>Hard: {userProfile.stats.problemsByDifficulty.hard}</div>
          </div>

          <div>
            <strong>Time Spent:</strong>
            <div>{Math.round(userProfile.stats.totalTimeSpent / 60)} hours</div>
            <strong>Longest Streak:</strong>
            <div>{userProfile.stats.longestStreak} days</div>
          </div>
        </div>
      </Section>
    </ProfileContainer>
  );
};

export default UserProfile;
