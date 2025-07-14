import React from 'react';

import {
  Infra,
  VMResourceBreakdown,
  VMs,
} from '@migration-planner-ui/api-client/models';
import {
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';

import { Datastores } from './Datastores';
import { InfrastructureOverview } from './InfastructureOverview';
import { NetworkTopology } from './NetworkTopology';
import { OSDistribution } from './OSDistribution';
import { StorageOverview } from './StorageOverview';
import { VMMigrationStatus } from './VMMigrationStatus';

import './Dashboard.css';

interface Props {
  infra: Infra;
  cpuCores: VMResourceBreakdown;
  ramGB: VMResourceBreakdown;
  vms: VMs;
  isExportMode?: boolean;
}

export const Dashboard: React.FC<Props> = ({
  infra,
  cpuCores,
  ramGB,
  vms,
  isExportMode,
}) => {
  // Transform osInfo to the expected format, fallback to os if osInfo is undefined
  const osData = vms.osInfo
    ? Object.entries(vms.osInfo).reduce((acc, [osName, osInfo]) => {
        acc[osName] = osInfo.count;
        return acc;
      }, {} as { [osName: string]: number })
    : vms.os;

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Grid hasGutter>
        <GridItem span={12} id="infrastructure-overview">
          <InfrastructureOverview
            infra={infra}
            cpuCores={cpuCores}
            ramGB={ramGB}
          />
        </GridItem>
        <GridItem span={12}>
          <Gallery hasGutter minWidths={{ default: '40%' }}>
            <GalleryItem>
              <VMMigrationStatus
                data={{
                  migratable: vms.totalMigratableWithWarnings,
                  nonMigratable: vms.total - vms.totalMigratableWithWarnings,
                }}
                isExportMode={isExportMode}
              />
            </GalleryItem>
            <GalleryItem>
              <OSDistribution osData={osData} isExportMode={isExportMode} />
            </GalleryItem>
          </Gallery>
        </GridItem>
        <GridItem span={12}>
          <Gallery hasGutter minWidths={{ default: '40%' }}>
            <GalleryItem>
              <StorageOverview
                data={vms.diskGB.histogram.data}
                minValue={vms.diskGB.histogram.minValue}
                step={vms.diskGB.histogram.step}
                isExportMode={isExportMode}
              />
            </GalleryItem>
            <GalleryItem>
              <NetworkTopology
                networks={infra.networks}
                isExportMode={isExportMode}
              />
            </GalleryItem>
          </Gallery>
        </GridItem>
        <GridItem span={12}>
          <Gallery hasGutter minWidths={{ default: '80%' }}>
            <GalleryItem>
              <Datastores
                datastores={infra.datastores}
                isExportMode={isExportMode}
              />
            </GalleryItem>
          </Gallery>
        </GridItem>
      </Grid>
    </PageSection>
  );
};
