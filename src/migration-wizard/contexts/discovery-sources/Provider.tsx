import React, { type PropsWithChildren, useCallback, useState, useEffect } from 'react';
import { useAsyncFn, useInterval } from 'react-use';

import {
  type AgentApiInterface,
  type ImageApiInterface,
  type SourceApiInterface,
} from '@migration-planner-ui/api-client/apis';
import {
  Agent,
  InventoryFromJSON,
  Source,
  UpdateInventoryFromJSON,
} from '@migration-planner-ui/api-client/models';
import { useInjection } from '@migration-planner-ui/ioc';

import { Symbols } from '../../../main/Symbols';

import { Context } from './Context';

export const Provider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [sourceSelected, setSourceSelected] = useState<Source | null>(null);

  const [agentSelected, setAgentSelected] = useState<Agent | null>(null);

  const [sourcesLoaded, setSourcesLoaded] = useState(false);

  const [downloadSourceUrl, setDownloadSourceUrl] = useState('');
  const [sourceDownloadUrls, setSourceDownloadUrls] = useState<Record<string, string>>({});

  const [sourceCreatedId, setSourceCreatedId] = useState<string | null>(null);

  const sourceApi = useInjection<SourceApiInterface>(Symbols.SourceApi);
  const agentsApi = useInjection<AgentApiInterface>(Symbols.AgentApi);
  const imageApi = useInjection<ImageApiInterface>(Symbols.ImageApi);

  const [listAgentsState, listAgents] = useAsyncFn(async () => {
    if (!sourcesLoaded) return;
    const agents = await agentsApi.listAgents();
    return agents;
  }, [sourcesLoaded]);

  const [listSourcesState, listSources] = useAsyncFn(async () => {
    const sources = await sourceApi.listSources({ includeDefault: true });
    setSourcesLoaded(true);
    return sources;
  });

  const [deleteSourceState, deleteSource] = useAsyncFn(async (id: string) => {
    const deletedSource = await sourceApi.deleteSource({ id });
    return deletedSource;
  });

  const [createSourceState, createSource] = useAsyncFn(
    async (
      name: string,
      sshPublicKey: string,
      httpProxy: string,
      httpsProxy: string,
      noProxy: string,
    ) => {
      try {
        // Build the sourceCreate object conditionally
        const sourceCreate: {
          name: string;
          sshPublicKey?: string;
          proxy?: {
            httpUrl?: string;
            httpsUrl?: string;
            noProxy?: string;
          };
        } = { name };

        // Only include sshPublicKey if it has a value
        if (sshPublicKey && sshPublicKey.trim()) {
          sourceCreate.sshPublicKey = sshPublicKey;
        }

        // Only include proxy if at least one proxy field has a value
        const proxyFields: {
          httpUrl?: string;
          httpsUrl?: string;
          noProxy?: string;
        } = {};
        if (httpProxy && httpProxy.trim()) {
          proxyFields.httpUrl = httpProxy;
        }
        if (httpsProxy && httpsProxy.trim()) {
          proxyFields.httpsUrl = httpsProxy;
        }
        if (noProxy && noProxy.trim()) {
          proxyFields.noProxy = noProxy;
        }

        // Only add proxy object if it has at least one field
        if (Object.keys(proxyFields).length > 0) {
          sourceCreate.proxy = proxyFields;
        }

        return await sourceApi.createSource({ sourceCreate });
      } catch (error: unknown) {
        console.error('Error creating source:', error);

        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error
        ) {
          const response = (error as { response: Response }).response;

          try {
            const errorText = await response.text(); // Read as text first
            try {
              const errorData = JSON.parse(errorText); // Attempt to parse JSON
              return errorData?.message || 'API error occurred.';
            } catch {
              return errorText || 'Failed to parse API error response.';
            }
          } catch {
            return 'Error response could not be read.';
          }
        }

        return 'Unexpected error occurred while creating the source.';
      }
    },
  );

  const [downloadSourceState, createDownloadSource] = useAsyncFn(
    async (
      sourceName: string,
      sourceSshKey: string,
      httpProxy: string,
      httpsProxy: string,
      noProxy: string,
    ): Promise<void> => {
      const newSource = await createSource(
        sourceName,
        sourceSshKey,
        httpProxy,
        httpsProxy,
        noProxy,
      );

      if (!newSource?.id) {
        throw new Error(
          `Failed to create source. Response: ${JSON.stringify(
            newSource,
            null,
            2,
          )}`,
        );
      }

      await imageApi.headImage({ id: newSource.id });
      const imageUrl = await imageApi.getSourceDownloadURL({
        id: newSource.id,
      });
      downloadSourceState.loading = true;

      storeDownloadUrlForSource(newSource.id, imageUrl.url);
      setDownloadSourceUrl(imageUrl.url);
      setSourceCreatedId(newSource.id);
    },
  );

  const getDownloadUrlForSource = useCallback((sourceId: string): string | undefined => {
    return sourceDownloadUrls[sourceId];
  }, [sourceDownloadUrls]);

  const storeDownloadUrlForSource = useCallback((sourceId: string, downloadUrl: string) => {
    setSourceDownloadUrls(prev => ({
      ...prev,
      [sourceId]: downloadUrl
    }));
  }, []);

  const [isPolling, setIsPolling] = useState(false);
  const [pollingDelay, setPollingDelay] = useState<number | null>(null);
  const startPolling = useCallback(
    (delay: number) => {
      if (!isPolling) {
        setPollingDelay(delay);
        setIsPolling(true);
      }
    },
    [isPolling],
  );
  const stopPolling = useCallback(() => {
    if (isPolling) {
      setPollingDelay(null);
      setIsPolling(false);
    }
  }, [isPolling]);

  useInterval(() => {
    if (!listSourcesState.loading) {
      listSources();
    }
  }, pollingDelay);

  const selectSource = useCallback((source: Source | null) => {
    setSourceSelected(source);
  }, []);

  const selectSourceById = useCallback(
    (sourceId: string) => {
      if (!listSourcesState.loading) {
        const source = listSourcesState.value?.find(
          (source) => source.id === sourceId,
        );
        setSourceSelected(source || null);
      } else {
        listSources().then((_sources) => {
          const source = _sources.find((source) => source.id === sourceId);
          setSourceSelected(source || null);
        });
      }
    },
    [listSources, listSourcesState],
  );

  const selectAgent = useCallback(async (agent: Agent) => {
    setAgentSelected(agent);
  }, []);

  const [deleteAgentState, deleteAgent] = useAsyncFn(async (agent: Agent) => {
    const deletedAgent = await agentsApi.deleteAgent({ id: agent.id });
    return deletedAgent;
  });

  const getSourceById = useCallback(
    (sourceId: string) => {
      const source = listSourcesState.value?.find(
        (source) => source.id === sourceId,
      );
      return source;
    },
    [listSourcesState.value],
  );

  const [updateInventoryState, updateInventory] = useAsyncFn(
    async (sourceId: string, jsonValue: string) => {
      const updatedSource = sourceApi.updateInventory({
        id: sourceId,
        updateInventory: UpdateInventoryFromJSON(jsonValue),
      });
      return updatedSource;
    },
  );

  const [uploadRvtoolsFileState, uploadRvtoolsFile] = useAsyncFn(
    async (sourceId: string, file: Blob): Promise<void> => {
      await sourceApi.uploadRvtoolsFile({
        id: sourceId,
        file: file,
      });
    },
  );

  const setDownloadUrl = useCallback((url: string) => {
    setDownloadSourceUrl(url);
  }, []);

  const deleteSourceCreated = useCallback(() => {
    setSourceCreatedId(null);
  }, []);

  const [updateSourceState, updateSource] = useAsyncFn(
    async (
      sourceId: string,
      sshPublicKey: string,
      httpProxy: string,
      httpsProxy: string,
      noProxy: string,
    ): Promise<void> => {
      // Build the sourceUpdate object conditionally
      const sourceUpdate: {
        sshPublicKey?: string;
        proxy?: {
          httpUrl?: string;
          httpsUrl?: string;
          noProxy?: string;
        };
      } = {};

      // Only include sshPublicKey if it has a value
      if (sshPublicKey && sshPublicKey.trim()) {
        sourceUpdate.sshPublicKey = sshPublicKey;
      }

      // Only include proxy if at least one proxy field has a value
      const proxyFields: {
        httpUrl?: string;
        httpsUrl?: string;
        noProxy?: string;
      } = {};
      if (httpProxy && httpProxy.trim()) {
        proxyFields.httpUrl = httpProxy;
      }
      if (httpsProxy && httpsProxy.trim()) {
        proxyFields.httpsUrl = httpsProxy;
      }
      if (noProxy && noProxy.trim()) {
        proxyFields.noProxy = noProxy;
      }

      // Only add proxy object if it has at least one field
      if (Object.keys(proxyFields).length > 0) {
        sourceUpdate.proxy = proxyFields;
      }
      const updatedSource = await sourceApi.updateSource({
        id: sourceId,
        sourceUpdate,
      });

      await imageApi.headImage({ id: updatedSource.id });
      const imageUrl = await imageApi.getSourceDownloadURL({
        id: updatedSource.id,
      });
      downloadSourceState.loading = true;

      setDownloadSourceUrl(imageUrl.url);
    },
  );

  const ctx: DiscoverySources.Context = {
    sources: listSourcesState.value ?? [],
    isLoadingSources: listSourcesState.loading,
    errorLoadingSources: listSourcesState.error,
    isDeletingSource: deleteSourceState.loading,
    errorDeletingSource: deleteSourceState.error,
    isCreatingSource: createSourceState.loading,
    errorCreatingSource: createSourceState.error,
    isDownloadingSource: downloadSourceState.loading,
    errorDownloadingSource: downloadSourceState.error,
    isPolling,
    listSources,
    deleteSource,
    createDownloadSource,
    startPolling,
    stopPolling,
    sourceSelected: sourceSelected,
    selectSource,
    agents: listAgentsState.value ?? [],
    isLoadingAgents: listAgentsState.loading,
    errorLoadingAgents: listAgentsState.error,
    listAgents,
    deleteAgent,
    isDeletingAgent: deleteAgentState.loading,
    errorDeletingAgent: deleteAgentState.error,
    selectAgent,
    agentSelected: agentSelected,
    selectSourceById,
    getSourceById,
    updateSource,
    isUpdatingSource: updateSourceState.loading,
    errorUpdatingSource: updateSourceState.error,
    downloadSourceUrl,
    setDownloadUrl,
    sourceCreatedId,
    deleteSourceCreated,
    updateInventory,
    isUpdatingInventory: updateInventoryState.loading,
    errorUpdatingInventory: updateInventoryState.error,
    uploadRvtoolsFile,
    isUploadingRvtoolsFile: uploadRvtoolsFileState.loading,
    errorUploadingRvtoolsFile: uploadRvtoolsFileState.error,
    sourceDownloadUrls,
    getDownloadUrlForSource,
    storeDownloadUrlForSource,
  };

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
};

Provider.displayName = 'DiscoverySourcesProvider';
