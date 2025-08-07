import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FlexItem,
  Icon,
  Stack,
  StackItem,
  Text,
  TextContent,
  Tooltip,
} from '@patternfly/react-core';
import { ClusterIcon, MigrationIcon, QuestionCircleIcon } from '@patternfly/react-icons';
import { global_active_color_300 as globalActiveColor300 } from '@patternfly/react-tokens/dist/js/global_active_color_300';
import { AppPage } from '../components/AppPage';
import { CustomEnterpriseIcon } from '../components/CustomEnterpriseIcon';

const cards: React.ReactElement[] = [
  <Card isFullHeight isPlain key="card-1">
    <CardHeader>
      <TextContent style={{ textAlign: 'center' }}>
        <Icon size="xl" style={{ color: globalActiveColor300.var }}>
          <CustomEnterpriseIcon />
        </Icon>
        <Text component="h2">Discover your VMware environment</Text>
      </TextContent>
    </CardHeader>
    <CardBody>
      <TextContent style={{ textAlign: 'center' }}>
        <Text>
          Run the discovery process and create a full evaluation report
          including recommendations for your migration journey.
          <a href="/apps/assisted-migration-app/example_report.pdf" download>
            <Button size="sm" variant="link">
              See an example report.
            </Button>
          </a>
          <Tooltip
            content="As part of the discovery process, 
            we're collecting aggregated data about your VMware environment. 
            This includes information such as the number of clusters, hosts, and VMs; 
            VM counts per operating system type; total CPU cores and memory; 
            network types and VLANs; and a list of datastores."
            position="top-start"
          >
            <Icon style={{ color: globalActiveColor300.var }}>
              <QuestionCircleIcon />
            </Icon>
          </Tooltip>
        </Text>
      </TextContent>
    </CardBody>
  </Card>,

  <Card isFullHeight isPlain key="card-2">
    <CardHeader>
      <TextContent style={{ textAlign: 'center' }}>
        <Icon size="xl" style={{ color: globalActiveColor300.var }}>
          <ClusterIcon />
        </Icon>
        <Text component="h2">Select a target cluster</Text>
      </TextContent>
    </CardHeader>
    <CardBody>
      <TextContent style={{ textAlign: 'center' }}>
        <Text>
          Select your target OpenShift Cluster to fit your migration goals.
        </Text>
      </TextContent>
    </CardBody>
  </Card>,

  <Card isFullHeight isPlain key="card-3">
    <CardHeader>
      <TextContent style={{ textAlign: 'center' }}>
        <Icon size="xl" style={{ color: globalActiveColor300.var }}>
          <MigrationIcon />
        </Icon>
        <Text component="h2">Create a migration plan</Text>
      </TextContent>
    </CardHeader>
    <CardBody>
      <TextContent style={{ textAlign: 'center' }}>
        <Text>
          Select your VMs, create a network and storage mapping and schedule
          your migration timeline
        </Text>
      </TextContent>
    </CardBody>
  </Card>,
];

const MigrationAssessmentPage: React.FC = () => (
  <AppPage
    breadcrumbs={[
      {
        key: 1,
        to: '#',
        children: 'Migration assessment',
        isActive: true,
      },
    ]}
    title="Welcome, let's start your migration journey from VMware to OpenShift."
  >
    <Bullseye>
      <Stack hasGutter style={{ justifyContent: 'space-evenly' }}>
        <StackItem>
          <Flex>
            {cards.map((card) => (
              <FlexItem flex={{ default: 'flex_1' }} key={card.key}>
                {card}
              </FlexItem>
            ))}
          </Flex>
        </StackItem>
        <StackItem style={{ alignSelf: 'center' }}>
          <Link to="migrate/wizard">
            <Button>Start your migration journey</Button>
          </Link>
        </StackItem>
      </Stack>
    </Bullseye>
  </AppPage>
);

MigrationAssessmentPage.displayName = 'MigrationAssessmentPage';

export default MigrationAssessmentPage;
