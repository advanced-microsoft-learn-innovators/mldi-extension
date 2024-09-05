import { HeadingCheckBox } from './HeadingCheckBox';

export const HeadingCheckBoxGroup = () => {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <HeadingCheckBox headingLevel="h2" />
      <HeadingCheckBox headingLevel="h3" />
      <HeadingCheckBox headingLevel="h4" />
    </div>
  );
};
