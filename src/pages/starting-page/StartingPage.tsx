import React from 'react';

import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FlexItem,
  Icon,
  Text,
  TextContent,
  Tooltip,
} from '@patternfly/react-core';
import {
  ClusterIcon,
  MigrationIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import { global_active_color_300 as globalActiveColor300 } from '@patternfly/react-tokens/dist/js/global_active_color_300';

import { CustomEnterpriseIcon } from '../../components/CustomEnterpriseIcon';

const cards: React.ReactElement[] = [
  <Card isFullHeight isPlain key="card-1">
    <CardHeader>
      <TextContent style={{ textAlign: 'center' }}>
        <Icon size="xl" style={{ color: globalActiveColor300.var }}>
          <CustomEnterpriseIcon />
        </Icon>
        <Text component="h2">
          Assess your VMware environment{' '}
          <Tooltip content="Run the discovery process or upload an inventory file to create a full migration assessment report.">
            <Icon style={{ color: globalActiveColor300.var }}>
              <QuestionCircleIcon />
            </Icon>
          </Tooltip>
        </Text>
      </TextContent>
    </CardHeader>
    <CardBody>
      <TextContent style={{ textAlign: 'center' }}>
        <Text>
          Run the discovery process or upload an inventory file to create a full
          migration assessment report.
        </Text>
        <Button
          size="sm"
          variant="link"
          component="a"
          href="/apps/assisted-migration-app/example_report.pdf"
          download
        >
          See an example report
        </Button>
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
          Select your target OpenShift Cluster to fit your migration data
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
        <Button size="sm" variant="plain" isDisabled>
          Coming soon
        </Button>
      </TextContent>
    </CardBody>
  </Card>,
];

const StartingPage: React.FC = () => {
  return (
    <Bullseye>
      <Flex>
        {cards.map((card) => (
          <FlexItem flex={{ default: 'flex_1' }} key={card.key}>
            {card}
          </FlexItem>
        ))}
      </Flex>
    </Bullseye>
  );
};

StartingPage.displayName = 'StartingPage';

export default StartingPage;
