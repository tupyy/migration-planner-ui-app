import React from 'react';

import { MigrationIssue } from '@migration-planner-ui/api-client/models';
import { Card, CardBody, CardTitle, Icon } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 as globalDangerColor100 } from '@patternfly/react-tokens/dist/js/global_danger_color_100';

import { ReportTable } from '../ReportTable';

interface ErrorTableProps {
  errors: MigrationIssue[];
  isExportMode?: boolean;
}

export const ErrorTable: React.FC<ErrorTableProps> = ({
  errors,
  isExportMode = false,
}) => {
  const tableHeight = isExportMode ? '100%' : '250px';
  return (
    <Card className={isExportMode ? 'dashboard-card-print' : 'dashboard-card'}>
      <CardTitle>
        <Icon style={{ color: globalDangerColor100.value }}>
          <ExclamationCircleIcon />
        </Icon>{' '}
        Errors
      </CardTitle>
      <CardBody style={{ padding: 0 }}>
        {errors.length === 0 ? (
          <div
            style={{
              padding: '16px',
              textAlign: 'center',
              color: '#6a6e73',
              fontStyle: 'italic',
            }}
          >
            No errors found
          </div>
        ) : (
          <div
            style={{
              maxHeight: tableHeight,
              overflowY: 'auto',
              overflowX: 'auto',
              padding: 2,
            }}
          >
            <ReportTable<MigrationIssue>
              data={errors}
              columns={['Description', 'Total']}
              fields={['assessment', 'count']}
              withoutBorder
              caption="Virtual machine validations"
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
