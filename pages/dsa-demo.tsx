import React, { useState } from 'react';
import styled from 'styled-components';
import DSAEditor from '../components/DSAEditor';
import NavBar from '../components/NavBar';

const DemoContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bodyBg};
`;

const DemoHeader = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const DemoTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
`;

const DemoDescription = styled.p`
  margin: 0.5rem 0 0 0;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
`;

const EditorWrapper = styled.div`
  flex: 1;
  padding: 1rem;
`;

// Sample test cases for different DSA problems
const SAMPLE_TEST_CASES = [
  {
    id: "1",
    input: "[1, 2, 3, 4, 5]",
    expectedOutput: "15"
  },
  {
    id: "2", 
    input: "[10, 20, 30]",
    expectedOutput: "60"
  },
  {
    id: "3",
    input: "[-1, -2, -3]",
    expectedOutput: "-6"
  },
  {
    id: "4",
    input: "[0, 0, 0]",
    expectedOutput: "0"
  },
  {
    id: "5",
    input: "[100, 200, 300, 400]",
    expectedOutput: "1000"
  },
  {
    id: "6",
    input: "[1]",
    expectedOutput: "1"
  }
];

export default function DSADemo() {
  const [code, setCode] = useState(`/**
 * @param {number[]} nums
 * @return {number}
 */
function solution(nums) {
    // Calculate the sum of all numbers in the array
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
    }
    return sum;
}`);

  return (
    <>
      <NavBar />
      <DemoContainer>
        <DemoHeader>
          <DemoTitle>DSA Editor Demo - Array Sum Problem</DemoTitle>
          <DemoDescription>
            Test the JavaScript test case execution. Write a function that returns the sum of all numbers in an array.
          </DemoDescription>
        </DemoHeader>
        <EditorWrapper>
          <DSAEditor 
            code={code} 
            onChange={setCode}
            problemId="demo-array-sum"
            testCases={SAMPLE_TEST_CASES}
          />
        </EditorWrapper>
      </DemoContainer>
    </>
  );
} 