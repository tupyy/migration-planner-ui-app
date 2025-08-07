import React, { useCallback, useState } from "react";
import {
  Tooltip,
  Button,
  Icon,
} from "@patternfly/react-core";
import { DownloadIcon } from "@patternfly/react-icons";
import { useDiscoverySources } from "../../../../contexts/discovery-sources/Context";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DownloadOvaAction {
  export type Props = {
    sourceId: string;
    sourceName?: string;
    isDisabled?: boolean;
  };
}

export const DownloadOvaAction: React.FC<DownloadOvaAction.Props> = (
  props
) => {
  const { 
    sourceId, 
    sourceName, 
    isDisabled = false, 
  } = props;
  
  const discoverySourcesContext = useDiscoverySources();
  const [isDownloading, setIsDownloading] = useState(false);
  const url = discoverySourcesContext.getDownloadUrlForSource(sourceId);

  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);

      const anchor = document.createElement('a');
      anchor.download = `${sourceName || sourceId}.ova`;
      anchor.href = url;
      anchor.click();
      anchor.remove();

    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [
    sourceId, 
    sourceName,
    url,
  ]);

  return (
    <Tooltip content="Download OVA File">
      <Button
        data-source-id={sourceId}
        variant="plain"
        isDisabled={isDisabled || isDownloading || !url}
        onClick={handleDownload}
      >
        <Icon size="md" isInline>
          <DownloadIcon />
        </Icon>
      </Button>
    </Tooltip>
  );
};

DownloadOvaAction.displayName = "DownloadOvaAction"; 