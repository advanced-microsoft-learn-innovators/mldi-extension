import React from 'react';
import { HeadingCheckBox } from './HeadingCheckBox';
import { storage } from '~background';

export const HeadingCheckBoxGroup = () => {
  const [isSummaryHeadeingLevels, setIsSummaryHeadeingLevels] = React.useState({
    h2: false,
    h3: false,
    h4: false
  });
  React.useEffect(() => {
    (async () => {
      const isSummaryHeadeingLevels:
        | { h2: boolean; h3: boolean; h4: boolean }
        | undefined = await storage.get('isSummaryHeadeingLevels');
      if (isSummaryHeadeingLevels) {
        console.log('isSummaryHeadeingLevels', isSummaryHeadeingLevels);
        setIsSummaryHeadeingLevels(isSummaryHeadeingLevels);
      }
    })();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {['h2', 'h3', 'h4'].map((headingLevel, idx) => (
        <div key={idx}>
          <HeadingCheckBox
            headingLevel={headingLevel as 'h2' | 'h3' | 'h4'}
            isShowSummary={
              isSummaryHeadeingLevels[headingLevel as 'h2' | 'h3' | 'h4']
            }
            setIsShowSummary={async (isShowSummary) => {
              const newIsSummaryHeadeingLevels = isSummaryHeadeingLevels;
              newIsSummaryHeadeingLevels[headingLevel as 'h2' | 'h3' | 'h4'] =
                isShowSummary;
              await storage.set(
                'isSummaryHeadeingLevels',
                newIsSummaryHeadeingLevels
              );
            }}
          />
        </div>
      ))}
    </div>
  );
};
