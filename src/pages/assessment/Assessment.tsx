import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Assessment as AssessmentModel } from '@migration-planner-ui/api-client/models';
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
  InputGroup,
  InputGroupItem,
  MenuToggle,
  MenuToggleElement,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { CaretDownIcon, FilterIcon } from '@patternfly/react-icons';

import { useDiscoverySources } from '../../migration-wizard/contexts/discovery-sources/Context';

import AssessmentsTable from './AssessmentsTable';
import CreateAssessmentModal, { AssessmentMode } from './CreateAssessmentModal';
import UpdateAssessment from './UpdateAssessment';
import { ConfirmationModal } from '../../components/ConfirmationModal';

type Props = {
  assessments: AssessmentModel[];
  isLoading?: boolean;
  hasUpToDateSources?: boolean;
};

const Assessment: React.FC<Props> = ({ assessments, isLoading }) => {
  const navigate = useNavigate();
  const discoverySourcesContext = useDiscoverySources();
  const [search, setSearch] = useState('');
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<string[]>([
    'inventory',
    'rvtools',
    'agent',
  ]);
  const [isSourceTypeFilterOpen, setIsSourceTypeFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    { index: number; direction: 'asc' | 'desc' } | undefined
  >({
    index: 0,
    direction: 'asc',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AssessmentMode>('inventory');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentModel | null>(null);

  const onSort = (
    _event: unknown,
    index: number,
    direction: 'asc' | 'desc',
  ): void => {
    setSortBy({ index, direction });
  };

  const onDropdownToggle = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const onDropdownSelect = (): void => {
    setIsDropdownOpen(false);
  };

  const onSourceTypeFilterToggle = (): void => {
    setIsSourceTypeFilterOpen(!isSourceTypeFilterOpen);
  };

  const onSourceTypeFilterSelect = (): void => {
    // Don't close the dropdown when selecting checkboxes
  };

  const handleSourceTypeChange = (
    checked: boolean,
    sourceType: string,
  ): void => {
    if (checked) {
      setSelectedSourceTypes((prev) => [...prev, sourceType]);
    } else {
      setSelectedSourceTypes((prev) =>
        prev.filter((type) => type !== sourceType),
      );
    }
  };

  const handleOpenModal = (mode: AssessmentMode): void => {
    setModalMode(mode);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleUpdateAssessment = (assessmentId: string): void => {
    const assessment = assessments.find((a) => (a as any).id === assessmentId);
    if (assessment) {
      setSelectedAssessment(assessment);
      setIsUpdateModalOpen(true);
    }
  };

  const handleDeleteAssessment = (assessmentId: string): void => {
    const assessment = assessments.find((a) => (a as any).id === assessmentId);
    if (assessment) {
      setSelectedAssessment(assessment);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseUpdateModal = (): void => {
    setIsUpdateModalOpen(false);
    setSelectedAssessment(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setSelectedAssessment(null);
  };

  const handleConfirmUpdate = async (
    name: string,
    file?: File,
  ): Promise<void> => {
    if (!selectedAssessment) return;

    try {
      await discoverySourcesContext.updateAssessment(
        (selectedAssessment as any).id,
        name,
      );
      // Refresh assessments after successful update
      await discoverySourcesContext.listAssessments();
      handleCloseUpdateModal();
    } catch (error) {
      console.error('Failed to update assessment:', error);
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!selectedAssessment) return;

    try {
      await discoverySourcesContext.deleteAssessment(
        (selectedAssessment as any).id,
      );
      // Refresh assessments after successful deletion
      await discoverySourcesContext.listAssessments();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Failed to delete assessment:', error);
    }
  };

  const handleSubmitAssessment = async (
    name: string,
    file: File | null,
    mode: AssessmentMode,
  ) => {
    try {
      switch (mode) {
        case 'inventory': {
          if (!file) throw new Error('File is required for inventory mode');
          // Read the JSON file content as text
          const fileContent = await file.text();

          // Validate that it's valid JSON and parse it
          let parsedInventory;
          try {
            parsedInventory = JSON.parse(fileContent);
          } catch (jsonError) {
            console.error('Invalid JSON file:', jsonError);
            throw new Error('Invalid JSON file format');
          }

          // Create the assessment using the discovery sources context
          await discoverySourcesContext.createAssessment(
            name,
            'inventory',
            parsedInventory,
            undefined, // sourceId not used for inventory mode
          );
          break;
        }

        case 'rvtools': {
          if (!file) throw new Error('File is required for rvtools mode');
          // Create the assessment with RVTools file
          await discoverySourcesContext.createAssessment(
            name,
            'rvtools',
            undefined, // jsonValue not used for rvtools mode
            undefined, // sourceId not used for rvtools mode
            file, // rvToolFile
          );
          break;
        }

        default: {
          throw new Error(`Unknown assessment creation mode: ${mode}`);
        }
      }

      // Refresh assessments list after successful creation
      await discoverySourcesContext.listAssessments();
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  return (
    <>
      <Toolbar inset={{ default: 'insetNone' }}>
        <ToolbarContent>
          <ToolbarItem>
            <InputGroup>
              <InputGroupItem>
                <Button variant="control" aria-label="Search filter">
                  <FilterIcon />
                </Button>
              </InputGroupItem>
              <InputGroupItem isFill>
                <TextInput
                  name="assessment-search"
                  id="assessment-search"
                  type="search"
                  placeholder="Search by name"
                  value={search}
                  onChange={(_event, value) => setSearch(value)}
                />
              </InputGroupItem>
            </InputGroup>
          </ToolbarItem>
          <ToolbarItem>
            <Dropdown
              isOpen={isSourceTypeFilterOpen}
              onSelect={onSourceTypeFilterSelect}
              onOpenChange={(isOpen: boolean) =>
                setIsSourceTypeFilterOpen(isOpen)
              }
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={onSourceTypeFilterToggle}
                  isExpanded={isSourceTypeFilterOpen}
                  icon={<FilterIcon />}
                >
                  Source Type
                  <Badge isRead style={{ marginLeft: '8px' }}>
                    {selectedSourceTypes.length}
                  </Badge>
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem
                  key="inventory"
                  component="div"
                  style={{ padding: '4px 16px' }}
                >
                  <Checkbox
                    id="filter-inventory"
                    label="Inventory"
                    isChecked={selectedSourceTypes.includes('inventory')}
                    onChange={(event, checked) =>
                      handleSourceTypeChange(checked, 'inventory')
                    }
                  />
                </DropdownItem>
                <DropdownItem
                  key="rvtools"
                  component="div"
                  style={{ padding: '4px 16px' }}
                >
                  <Checkbox
                    id="filter-rvtools"
                    label="RVTools"
                    isChecked={selectedSourceTypes.includes('rvtools')}
                    onChange={(event, checked) =>
                      handleSourceTypeChange(checked, 'rvtools')
                    }
                  />
                </DropdownItem>
                <DropdownItem
                  key="agent"
                  component="div"
                  style={{ padding: '4px 16px' }}
                >
                  <Checkbox
                    id="filter-agent"
                    label="Agent"
                    isChecked={selectedSourceTypes.includes('agent')}
                    onChange={(event, checked) =>
                      handleSourceTypeChange(checked, 'agent')
                    }
                  />
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem align={{ default: 'alignRight' }}>
            <Dropdown
              isOpen={isDropdownOpen}
              onSelect={onDropdownSelect}
              onOpenChange={(isOpen: boolean) => setIsDropdownOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  variant="primary"
                  onClick={onDropdownToggle}
                  isExpanded={isDropdownOpen}
                >
                  Create assessment
                </MenuToggle>
              )}
              shouldFocusToggleOnSelect
            >
              <DropdownList>
                <DropdownItem
                  key="inventory"
                  component="button"
                  onClick={() => handleOpenModal('inventory')}
                >
                  From inventory
                </DropdownItem>
                <DropdownItem
                  key="rvtools"
                  component="button"
                  onClick={() => handleOpenModal('rvtools')}
                >
                  From rvTools
                </DropdownItem>
                <DropdownItem
                  key="agent"
                  component="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    discoverySourcesContext.setAssessmentFromAgent(true);
                    navigate('/migrate/wizard');
                  }}
                >
                  From agent
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <AssessmentsTable
        assessments={assessments}
        isLoading={isLoading}
        search={search}
        selectedSourceTypes={selectedSourceTypes}
        sortBy={sortBy}
        onSort={onSort}
        onDelete={handleDeleteAssessment}
        onUpdate={handleUpdateAssessment}
      />

      <CreateAssessmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAssessment}
        mode={modalMode}
        isLoading={discoverySourcesContext.isCreatingAssessment}
        selectedEnvironment={null}
      />

      <UpdateAssessment
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onSubmit={handleConfirmUpdate}
        name={(selectedAssessment as any)?.name || ''}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Assessment"
        titleIconVariant="warning"
        primaryButtonVariant="danger"
      >
        Are you sure you want to delete the assessment "
        {(selectedAssessment as any)?.name}"? This action cannot be undone.
      </ConfirmationModal>
    </>
  );
};

Assessment.displayName = 'Assessment';

export default Assessment;
