import React, { useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core';
import { Source } from '@migration-planner-ui/api-client/models';

interface CreateAssessmentFromSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  source: Source | null;
  isLoading?: boolean;
}

export const CreateAssessmentFromSourceModal: React.FC<CreateAssessmentFromSourceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  source,
  isLoading = false,
}) => {
  const [assessmentName, setAssessmentName] = useState('');

  const handleSubmit = async () => {
    if (!assessmentName.trim()) return;
    
    try {
      await onSubmit(assessmentName.trim());
      setAssessmentName('');
    } catch (error) {
      console.error('Failed to create assessment:', error);
    }
  };

  const handleClose = () => {
    setAssessmentName('');
    onClose();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title="Create Assessment"
      isOpen={isOpen}
      onClose={handleClose}
      actions={[
        <Button
          key="create"
          variant="primary"
          onClick={handleSubmit}
          isDisabled={!assessmentName.trim() || isLoading}
          isLoading={isLoading}
        >
          Create
        </Button>,
        <Button key="cancel" variant="link" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
    >
      <Form>
        <FormGroup
          label="Assessment Name"
          isRequired
          fieldId="assessment-name"
        >
          <TextInput
            id="assessment-name"
            name="assessment-name"
            type="text"
            value={assessmentName}
            onChange={(_event, value) => setAssessmentName(value)}
            placeholder="Enter assessment name"
            isRequired
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

CreateAssessmentFromSourceModal.displayName = 'CreateAssessmentFromSourceModal';

export default CreateAssessmentFromSourceModal;