import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

interface Snapshot {
  createdAt?: string;
  infra?: {
    totalHosts?: number;
    networks?: unknown[];
    datastores?: unknown[];
  };
  inventory?: {
    infra?: {
      totalHosts?: number;
      networks?: unknown[];
      datastores?: unknown[];
    };
    vms?: {
      total?: number;
    };
  };
  vms?: {
    total?: number;
  };
}

interface SnapshotsTableProps {
  snapshots: Snapshot[];
}

export const SnapshotsTable: React.FC<SnapshotsTableProps> = ({
  snapshots,
}) => {
  return (
    <div style={{ maxWidth: '1000px', overflowX: 'auto' }}>
      <Table variant="compact" borders={true} style={{ fontSize: '14px' }}>
        <Thead>
          <Tr>
            <Th width={30}>Timestamp</Th>
            <Th width={17}>Hosts</Th>
            <Th width={17}>VMs</Th>
            <Th width={18}>Networks</Th>
            <Th width={18}>Datastores</Th>
          </Tr>
        </Thead>
        <Tbody>
          {snapshots.map((snapshot: Snapshot, index: number) => {
            const hosts =
              snapshot.infra?.totalHosts ??
              snapshot.inventory?.infra?.totalHosts ??
              '-';
            const vms =
              snapshot.vms?.total ?? snapshot.inventory?.vms?.total ?? '-';
            const networks = Array.isArray(snapshot.infra?.networks)
              ? snapshot.infra.networks.length
              : Array.isArray(snapshot.inventory?.infra?.networks)
              ? snapshot.inventory.infra.networks.length
              : '-';
            const datastores = Array.isArray(snapshot.infra?.datastores)
              ? snapshot.infra.datastores.length
              : Array.isArray(snapshot.inventory?.infra?.datastores)
              ? snapshot.inventory.infra.datastores.length
              : '-';
            const timestamp = snapshot.createdAt
              ? new Date(snapshot.createdAt).toLocaleString()
              : '-';

            return (
              <Tr key={index}>
                <Td>{timestamp}</Td>
                <Td>{hosts}</Td>
                <Td>{vms}</Td>
                <Td>{networks}</Td>
                <Td>{datastores}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};

SnapshotsTable.displayName = 'SnapshotsTable';

export default SnapshotsTable;
