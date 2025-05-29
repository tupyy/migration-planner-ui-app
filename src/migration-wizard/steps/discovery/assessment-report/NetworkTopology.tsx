import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { InfraNetworksInner } from '@migration-planner-ui/api-client/models';
import { ReportTable } from '../ReportTable';
import NetworkIcon from '@patternfly/react-icons/dist/esm/icons/network-icon';

interface NetworkTopologyProps {
  networks: InfraNetworksInner[]
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({networks}) => {

  return (
        <Card>
          <CardTitle><NetworkIcon/> Network Topology</CardTitle>
          <CardBody>
          <ReportTable<InfraNetworksInner>
            data={networks}
            columns={['Name', 'Type', 'VlanId']}
            fields={['name', 'type', 'vlanId']}
          />
          </CardBody>
        </Card>
  );
};
