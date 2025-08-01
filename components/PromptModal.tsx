import { useState } from "react";
import styled from "styled-components";

interface PromptValues {
  designation: string;
  companies: string;
  round: string;
  interviewType: "coding" | "design" | "dsa";
}

interface PromptModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: PromptValues) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 2.5rem;
  border-radius: 24px;
  width: 100%;
  max-width: 550px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.neutralDark};
  }
`;

const Heading = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.neutralDark};
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.border}50;
  border-radius: 12px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.neutralDark};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.neutral}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text}60;
  }
`;

const Select = styled.select`
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.border}50;
  border-radius: 12px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.neutralDark};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.neutral}20;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
  &.primary {
    background: ${({ theme }) => theme.primary};
    color: #fff;
    box-shadow: 0 4px 15px ${({ theme }) => theme.primary}40;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px ${({ theme }) => theme.primary}60;
      background: ${({ theme }) => theme.accent};
    }
  }
  
  &.secondary {
    background: ${({ theme }) => theme.bodyBg};
    color: ${({ theme }) => theme.text};
    border: 2px solid ${({ theme }) => theme.border};
    
    &:hover {
      background: ${({ theme }) => theme.border}20;
      transform: translateY(-1px);
    }
  }
`;

export default function PromptModal({
  visible,
  onClose,
  onSubmit,
}: PromptModalProps) {
  const [designation, setDesignation] = useState<string>("Frontend Developer");
  const [companies, setCompanies] = useState<string>("");
  const [round, setRound] = useState<string>("1");
  const [interviewType, setInterviewType] = useState<"coding" | "design" | "dsa">(
    "coding"
  );

  const handleSubmit = () => {
    onSubmit({ designation, companies, round, interviewType });
  };

  if (!visible) return null;
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Heading>Configure Interview</Heading>
        <FormGroup>
          <Label htmlFor="designation">Role</Label>
          <Input
            id="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="companies">Targeted Companies</Label>
          <Input
            id="companies"
            value={companies}
            onChange={(e) => setCompanies(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="round">Interview Round</Label>
          <Select
            id="round"
            value={round}
            onChange={(e) => setRound(e.target.value)}
          >
            <option value="1">Round 1</option>
            <option value="2">Round 2</option>
            <option value="3">Round 3</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="type">Interview Type</Label>
          <Select
            id="type"
            value={interviewType}
            onChange={(e) =>
              setInterviewType(e.target.value as "coding" | "design" | "dsa")
            }
          >
            <option value="coding">Machine Coding</option>
            <option value="design">System Design</option>
            <option value="dsa">DSA</option>
          </Select>
        </FormGroup>
        <Buttons>
          <Button className="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="primary" onClick={handleSubmit}>
            Start
          </Button>
        </Buttons>
      </ModalContainer>
    </Overlay>
  );
}
