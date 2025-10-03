import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
} from '@patternfly/react-core';

import { AppPage } from '../components/AppPage';

import { Environment } from './environment/Environment';
import StartingPageModal from './starting-page/StartingPageModal';
import { MigrationAssessmentPageContent } from './MigrationAssessmentPage';

type Props = {
  initialTabKey?: number;
};

const MigrationPage: React.FC<Props> = ({ initialTabKey }) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(
    typeof initialTabKey === 'number' ? initialTabKey : 0,
  );
  const [isStartingPageModalOpen, setIsStartingPageModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTabKey(typeof initialTabKey === 'number' ? initialTabKey : 0);
  }, [initialTabKey]);

  const breadcrumbs = [
    {
      key: 1,
      children: 'Migration assessment',
    },
    {
      key: 2,
      children: activeTabKey === 1 ? 'environments' : 'assessments',
      isActive: true,
    },
  ];

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ): void => {
    setActiveTabKey(tabIndex);
    const indexNumber = typeof tabIndex === 'number' ? tabIndex : Number(tabIndex);
    if (indexNumber === 1) {
      navigate('/openshift/migration-assessment/environments/');
    } else {
      navigate('/openshift/migration-assessment/assessments/');
    }
  };

  return (
    <>
      <AppPage
        breadcrumbs={breadcrumbs}
        title="Welcome, let's start your migration journey from VMware to OpenShift."
        caption={
          <Button
            variant="link"
            isInline
            onClick={() => setIsStartingPageModalOpen(true)}
          >
            How does this work?
          </Button>
        }
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Migration tabs"
          role="region"
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Assessments</TabTitleText>}
            aria-label="Assessments tab"
          >
            <TabContent
              eventKey={0}
              id="assessments-tab-content"
              style={{ padding: 0, marginTop: '24px' }}
            >
              <MigrationAssessmentPageContent />
            </TabContent>
          </Tab>

          <Tab
            eventKey={1}
            title={<TabTitleText>Environments</TabTitleText>}
            aria-label="Environments tab"
          >
            <TabContent
              eventKey={1}
              id="environments-tab-content"
              style={{ padding: 0, marginTop: '24px' }}
            >
              <Environment />
            </TabContent>
          </Tab>
        </Tabs>
      </AppPage>

      <StartingPageModal
        isOpen={isStartingPageModalOpen}
        onClose={() => setIsStartingPageModalOpen(false)}
        onOpenRVToolsModal={() => setActiveTabKey(0)}
      />
    </>
  );
};

MigrationPage.displayName = 'MigrationPage';

export default MigrationPage;
