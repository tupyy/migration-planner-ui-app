import { Bullseye, Spinner } from '@patternfly/react-core';
import React, { Suspense } from 'react';

function RootApp() {
  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      <label>
        Search albums
      </label>
    </Suspense>
  );
}

export default RootApp;
