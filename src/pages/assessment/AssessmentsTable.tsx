import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Assessment } from '@migration-planner-ui/api-client/models';
import { getSourceTypeLabelProps } from './utils/badgeStyles';
import { sortSnapshotsByTimestamp } from './utils/snapshotSorting';
import { SnapshotsTable } from './SnapshotsTable';
import { Badge, Button, Spinner } from '@patternfly/react-core';
import { EditIcon, TrashIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

type Props = {
  assessments: Assessment[];
  isLoading?: boolean;
  search?: string;
  selectedSourceTypes?: string[];
  sortBy?: { index: number; direction: 'asc' | 'desc' } | undefined;
  onSort?: (event: unknown, index: number, direction: 'asc' | 'desc') => void;
  onDelete?: (assessmentId: string) => void;
  onUpdate?: (assessmentId: string) => void;
};

const enum Columns {
  Name = 'Name',
  Owner = 'Owner',
  Snapshots = 'Snapshots',
  Actions = 'Actions',
}

export const AssessmentsTable: React.FC<Props> = ({
  assessments,
  isLoading,
  search = '',
  selectedSourceTypes = [],
  sortBy,
  onSort,
  onDelete,
  onUpdate,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRowExpanded = (assessmentId: string): void => {
    setExpandedRows((prev) => ({
      ...prev,
      [assessmentId]: !prev[assessmentId],
    }));
  };

  const handleDelete = (assessmentId: string): void => {
    onDelete?.(assessmentId);
  };

  const handleUpdate = (assessmentId: string): void => {
    onUpdate?.(assessmentId);
  };

  const rows = useMemo(() => {
    const items = (assessments || []).map((assessment) => {
      const anyObj = assessment as unknown as Record<string, unknown>;

      const name = (anyObj?.name as string) || `Assessment ${anyObj?.id ?? ''}`;
      const id = String((anyObj?.id as string) ?? '');
      const sourceType = (anyObj?.sourceType as string) || 'Unknown';
      const snapshots = anyObj?.snapshots as unknown[] | undefined;

      return {
        key: id || name,
        id,
        name,
        sourceType,
        owner: 'Current User', // Stub for owner
        snapshots: snapshots || [],
      };
    });

    let filtered = search
      ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
      : items;

    // Apply source type filter
    if (selectedSourceTypes.length === 0) {
      // If no source types are selected, show no assessments
      filtered = [];
    } else {
      filtered = filtered.filter((i) =>
        selectedSourceTypes.includes(i.sourceType.toLowerCase()),
      );
    }

    if (!sortBy) return filtered;

    const copy = [...filtered];
    if (sortBy.index === 1) {
      // Name column (index 1 because expand column is index 0)
      copy.sort((a, b) =>
        sortBy.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
    } else if (sortBy.index === 2) {
      // Owner column (index 2)
      copy.sort((a, b) =>
        sortBy.direction === 'asc'
          ? a.owner.localeCompare(b.owner)
          : b.owner.localeCompare(a.owner),
      );
    } else if (sortBy.index === 3) {
      // Snapshots column (index 3)
      copy.sort((a, b) =>
        sortBy.direction === 'asc'
          ? a.snapshots.length - b.snapshots.length
          : b.snapshots.length - a.snapshots.length,
      );
    }
    return copy;
  }, [assessments, search, selectedSourceTypes, sortBy]);

  const nameSortParams = onSort
    ? {
        sortBy,
        onSort,
        columnIndex: 1,
      }
    : undefined;

  const ownerSortParams = onSort
    ? {
        sortBy,
        onSort,
        columnIndex: 2,
      }
    : undefined;

  const snapshotsSortParams = onSort
    ? {
        sortBy,
        onSort,
        columnIndex: 3,
      }
    : undefined;

  if (isLoading && (!assessments || assessments.length === 0)) {
    return (
      <Table aria-label="Loading assessments" variant="compact" borders={false}>
        <Tbody>
          <Tr>
            <Td colSpan={5}>
              <Spinner size="xl" />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    );
  }

  return (
    <div style={{ overflowX: 'auto', minHeight: '400px' }}>
      <Table
        aria-label="Assessments table"
        variant="compact"
        borders={false}
        style={{ tableLayout: 'fixed', width: '100%' }}
      >
        {rows && rows.length > 0 && (
          <Thead>
            <Tr>
              <Th
                style={{ width: '80px', minWidth: '40px', maxWidth: '60px' }}
              />
              <Th
                sort={nameSortParams}
                width={30}
                style={{ whiteSpace: 'normal' }}
              >
                {Columns.Name}
              </Th>
              <Th
                sort={ownerSortParams}
                width={20}
                style={{ whiteSpace: 'normal' }}
              >
                {Columns.Owner}
              </Th>
              <Th
                sort={snapshotsSortParams}
                width={15}
                style={{ whiteSpace: 'normal' }}
              >
                {Columns.Snapshots}
              </Th>
              <Th style={{ whiteSpace: 'normal' }}>{Columns.Actions}</Th>
            </Tr>
          </Thead>
        )}
        <Tbody>
          {rows && rows.length > 0 ? (
            rows.map((row) => (
              <React.Fragment key={row.key}>
                <Tr>
                  <Td
                    expand={{
                      rowIndex: row.id,
                      isExpanded: expandedRows[row.id] || false,
                      onToggle: () => toggleRowExpanded(row.id),
                    }}
                  />
                  <Td dataLabel={Columns.Name}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Badge
                        style={getSourceTypeLabelProps(row.sourceType).style}
                      >
                        {getSourceTypeLabelProps(row.sourceType).letter}
                      </Badge>
                      <Link to={`migrate/assessments/${row.id}`}>
                        {row.name}
                      </Link>
                    </div>
                  </Td>
                  <Td dataLabel={Columns.Owner}>{row.owner}</Td>
                  <Td dataLabel={Columns.Snapshots}>{row.snapshots.length}</Td>
                  <Td dataLabel={Columns.Actions} style={{ width: '120px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        variant="plain"
                        onClick={() => handleUpdate(row.id)}
                        aria-label="Edit assessment"
                        icon={<EditIcon />}
                      />
                      <Button
                        variant="plain"
                        onClick={() => handleDelete(row.id)}
                        aria-label="Delete assessment"
                        icon={<TrashIcon />}
                        isDanger
                      />
                    </div>
                  </Td>
                </Tr>
                {expandedRows[row.id] && (
                  <Tr isExpanded>
                    <Td />
                    <Td colSpan={5}>
                      <div style={{ padding: '16px' }}>
                        <h4 style={{ marginBottom: '12px' }}>
                          Snapshots ({row.snapshots.length})
                        </h4>
                        <SnapshotsTable snapshots={sortSnapshotsByTimestamp(row.snapshots)} />
                      </div>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <Tr>
              <Td colSpan={5}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  No assessments found.
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </div>
  );
};

AssessmentsTable.displayName = 'AssessmentsTable';

export default AssessmentsTable;
