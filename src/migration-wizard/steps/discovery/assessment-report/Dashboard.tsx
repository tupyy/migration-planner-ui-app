import React from 'react';
import {
  PageSection,
  PageSectionVariants,
  Grid,
  GridItem,
  Gallery,
  GalleryItem,
} from '@patternfly/react-core';
import { InfrastructureOverview } from './InfastructureOverview';
import {
  Infra,
  VMResourceBreakdown,
  VMs,
} from '@migration-planner-ui/api-client/models';
import { VMMigrationStatus } from './VMMigrationStatus';
import { NetworkTopology } from './NetworkTopology';
import { StorageOverview } from './StorageOverview';
import { OSDistribution } from './OSDistribution';
import { Datastores } from './Datastores';

interface Props {
  infra: Infra;
  cpuCores: VMResourceBreakdown;
  ramGB: VMResourceBreakdown;
  vms: VMs;
  isExportMode?: boolean;
}



const getCardStyle = (isExportMode?: boolean): React.CSSProperties =>
  isExportMode
    ? { }
    : {
        height: '400px',
        overflow: 'auto',
      };

export const Dashboard: React.FC<Props> = ({ infra, cpuCores, ramGB, vms, isExportMode }) => {
  
  return(
  <PageSection variant={PageSectionVariants.light}>
    <Grid hasGutter>
      <GridItem span={12} id='infrastructure-overview'>
        <InfrastructureOverview
          infra={infra}
          cpuCores={cpuCores}
          ramGB={ramGB}
        />
      </GridItem>
      <GridItem span={12}>
        <Grid hasGutter>
          <GridItem span={6}>
            <div style={getCardStyle(isExportMode)}>
              <VMMigrationStatus
                data={{
                  migratable: vms.totalMigratableWithWarnings,
                  nonMigratable: vms.total - vms.totalMigratableWithWarnings,
                }}
              />
            </div>
          </GridItem>
          <GridItem span={6}>
            <div style={getCardStyle(isExportMode)}>
              <OSDistribution osData={vms.os} />
            </div>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem span={12}>
        <Grid hasGutter>
          <GridItem span={6}>
            <div style={getCardStyle(isExportMode)}>
              <StorageOverview
                data={vms.diskGB.histogram.data}
                minValue={vms.diskGB.histogram.minValue}
                step={vms.diskGB.histogram.step}
              />
            </div>
          </GridItem>
          <GridItem span={6}>
            <div style={getCardStyle(isExportMode)}>
              <Datastores datastores={infra.datastores} isExportMode={isExportMode}/>
            </div>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
     <Grid hasGutter>
      <GridItem span={6}>
        <NetworkTopology networks={infra.networks}/>
      </GridItem>
    </Grid> 
  </PageSection>)
};
