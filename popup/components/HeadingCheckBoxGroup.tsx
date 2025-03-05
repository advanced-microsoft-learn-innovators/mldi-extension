import React from 'react';
import { HeadingCheckBox } from './HeadingCheckBox';
import { useStorage } from '@plasmohq/storage/hook';

export const HeadingCheckBoxGroup = () => {
  const [isSummaryHeadingLevels, setIsSummaryHeadingLevels] = useStorage<{
    h2: boolean;
    h3: boolean;
    h4: boolean;
  }>('isSummaryHeadingLevels', { h2: false, h3: false, h4: false });

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {['h2', 'h3', 'h4'].map((headingLevel, idx) => (
        <div key={idx}>
          <HeadingCheckBox
            headingLevel={headingLevel as 'h2' | 'h3' | 'h4'}
            isShowSummary={
              isSummaryHeadingLevels[headingLevel as 'h2' | 'h3' | 'h4']
            }
            setIsShowSummary={async (isShowSummary) => {
              const newIsSummaryHeadingLevels = isSummaryHeadingLevels;
              newIsSummaryHeadingLevels[headingLevel as 'h2' | 'h3' | 'h4'] =
                isShowSummary;
              setIsSummaryHeadingLevels(newIsSummaryHeadingLevels);
            }}
          />
        </div>
      ))}
    </div>
  );
};
