import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core';
import { useDiscoverySources } from '../../migration-wizard/contexts/discovery-sources/Context';

interface CreateAssessmentFromSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEnvironment: (assessmentName: string) => void;
  onCreateAssessment?: (assessmentName: string) => void;
}

export const CreateAssessmentFromSourceModal: React.FC<
  CreateAssessmentFromSourceModalProps
> = ({ isOpen, onClose, onSelectEnvironment, onCreateAssessment }) => {
  const discoverySourcesContext = useDiscoverySources();
  const [assessmentName, setAssessmentName] = useState('');
  const [nameError, setNameError] = useState('');

  // Restore saved assessment name when returning from environment selection
  useEffect(() => {
    if (discoverySourcesContext.environmentSelection.savedAssessmentName) {
      setAssessmentName(
        discoverySourcesContext.environmentSelection.savedAssessmentName,
      );
    }
  }, [discoverySourcesContext.environmentSelection.savedAssessmentName]);

  const validateForm = (): boolean => {
    if (!assessmentName.trim()) {
      setNameError('Assessment name is required');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const handleCreateAssessment = (): void => {
    if (validateForm() && onCreateAssessment) {
      onCreateAssessment(assessmentName.trim());
      handleClose();
    }
  };

  const handleClose = (): void => {
    setAssessmentName('');
    setNameError('');
    // Clear environment selection state when closing/canceling
    discoverySourcesContext.environmentActions.clearSelection();
    onClose();
  };

  // Check if both name and environment are selected
  const isFormValid =
    assessmentName.trim() &&
    discoverySourcesContext.environmentSelection.selectedEnvironment;

  const actions = [
    <Button
      key="create"
      variant="primary"
      onClick={handleCreateAssessment}
      isDisabled={!isFormValid}
    >
      Create Assessment
    </Button>,
    <Button key="cancel" variant="link" onClick={handleClose}>
      Cancel
    </Button>,
  ];

  return (
    <Modal
      variant={ModalVariant.medium}
      title="Create Assessment from Environment"
      isOpen={isOpen}
      onClose={handleClose}
      actions={actions}
    >
      <Form>
        <FormGroup label="Assessment Name" isRequired fieldId="assessment-name">
          <TextInput
            isRequired
            type="text"
            id="assessment-name"
            name="assessment-name"
            value={assessmentName}
            onChange={(_event, value) => {
              setAssessmentName(value);
              if (nameError && value.trim()) {
                setNameError('');
              }
            }}
            validated={nameError ? 'error' : 'default'}
            placeholder="Enter assessment name"
          />
          {nameError && (
            <div
              style={{
                color: 'var(--pf-global--danger-color--100)',
                fontSize: '14px',
                marginTop: '4px',
              }}
            >
              {nameError}
            </div>
          )}
        </FormGroup>

        <FormGroup label="Environment" fieldId="environment-info">
          {discoverySourcesContext.environmentSelection.selectedEnvironment ? (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--pf-global--BackgroundColor--200)',
                border: '1px solid var(--pf-global--BorderColor--100)',
                borderRadius: '4px',
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              Selected:{' '}
              {
                discoverySourcesContext.environmentSelection.selectedEnvironment
                  .name
              }
            </div>
          ) : (
            <div
              style={{
                fontSize: '14px',
                color: 'var(--pf-global--Color--200)',
                marginBottom: '12px',
              }}
            >
              Choose an environment from available environments in the migration
              wizard.
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Button
              variant="secondary"
              onClick={() => onSelectEnvironment(assessmentName.trim())}
            >
              {discoverySourcesContext.environmentSelection.selectedEnvironment
                ? 'Change Environment'
                : 'Select Environment'}
            </Button>
          </div>
        </FormGroup>
      </Form>
    </Modal>
  );
};

CreateAssessmentFromSourceModal.displayName = 'CreateAssessmentFromSourceModal';

export default CreateAssessmentFromSourceModal;
