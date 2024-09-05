import styled from 'styled-components';

export const HeadingCheckBox = ({
  headingLevel
}: {
  headingLevel: 'h2' | 'h3' | 'h4';
}) => {
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
      <Input type="checkbox" id={`heading-checkbox-${headingLevel}`} />
      <Label htmlFor={`heading-checkbox-${headingLevel}`}>{headingLevel}</Label>
    </div>
  );
};
