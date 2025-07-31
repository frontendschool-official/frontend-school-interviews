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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const Heading = styled.h3`
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.text};
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.text};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  &.primary {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
  }
  &.secondary {
    background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.text};
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
