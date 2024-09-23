import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

import EditorTabs, { EditorTabsProps } from "./editor-tabs";

interface FullscreenEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editorProps: EditorTabsProps;
}

function FullscreenEditorModal({
  isOpen,
  onClose,
  editorProps,
}: FullscreenEditorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent background="none" shadow="none" w="90%">
        <ModalBody p={0}>
          <EditorTabs {...editorProps} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default FullscreenEditorModal;
