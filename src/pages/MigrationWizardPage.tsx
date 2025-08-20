import React from "react";
import { AppPage } from "../components/AppPage";
import { MigrationWizard } from "../migration-wizard/MigrationWizard";
import { Provider as DiscoverySourcesProvider } from "../migration-wizard/contexts/discovery-sources/Provider";

const MigrationWizardPage: React.FC = () => {
  return (
    <AppPage
      breadcrumbs={[
        { key: 1, to: "/openshift/migration-assessment", children: "Migration assessment" },
        { key: 2, to: "#", children: "Guide", isActive: true },
      ]}
      title="Welcome, let's start your migration journey from VMware to OpenShift."
    >
      <DiscoverySourcesProvider>
        <MigrationWizard />
      </DiscoverySourcesProvider>
    </AppPage>
  );
};

MigrationWizardPage.displayName = "MigrationWizardPage";

export default MigrationWizardPage;
