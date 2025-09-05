import { Source } from '@migration-planner-ui/api-client/models';

export interface EnvironmentSelectionState {
  selectedEnvironment: Source | null;
  isSelecting: boolean;
  savedAssessmentName: string | null;
}

export interface EnvironmentSelectionActions {
  startSelection: (assessmentName?: string) => void;
  finishSelection: () => void;
  clearSelection: () => void;
  setSelectedEnvironment: (environment: Source | null) => void;
}

export const initialEnvironmentSelectionState: EnvironmentSelectionState = {
  selectedEnvironment: null,
  isSelecting: false,
  savedAssessmentName: null,
};

export const createEnvironmentSelectionActions = (
  setState: React.Dispatch<React.SetStateAction<EnvironmentSelectionState>>,
): EnvironmentSelectionActions => ({
  startSelection: (assessmentName?: string) => {
    setState(prev => ({
      ...prev,
      isSelecting: true,
      savedAssessmentName: assessmentName || null,
    }));
  },

  finishSelection: () => {
    setState(prev => ({
      ...prev,
      isSelecting: false,
    }));
  },

  clearSelection: () => {
    setState(initialEnvironmentSelectionState);
  },

  setSelectedEnvironment: (environment: Source | null) => {
    setState(prev => ({
      ...prev,
      selectedEnvironment: environment,
    }));
  },
});
