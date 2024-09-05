import React from 'react';
import styled from 'styled-components';

export const HeadingCheckBox = ({
  headingLevel,
  isShowSummary,
  setIsShowSummary
}: {
  headingLevel: 'h2' | 'h3' | 'h4';
  isShowSummary: boolean;
  setIsShowSummary: (isShowSummary: boolean) => void;
}) => {
  const checkboxRef = React.useRef(null);
  React.useEffect(() => {
    if (isShowSummary) {
      checkboxRef.current.checked = true;
    }
  }, [isShowSummary]);

  const Label = styled.label`
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
    height: 30px;
    border: 0.5px solid gray;
    color: gray;
    border-radius: 5px;
    cursor: pointer;
    transition: 300ms all;

    &:hover {
      border-color: black;
      color: black;
    }
  `;

  const Input = styled.input`
    display: none;

    &:checked + ${Label} {
      background: #4f52b2;
      color: white;
      text-weight: bold;
      border-color: black;
    }
  `;
  return (
    <div>
      <Input
        ref={checkboxRef}
        type="checkbox"
        id={`heading-checkbox-${headingLevel}`}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setIsShowSummary(isChecked);
        }}
      />
      <Label htmlFor={`heading-checkbox-${headingLevel}`}>{headingLevel}</Label>
    </div>
  );
};
