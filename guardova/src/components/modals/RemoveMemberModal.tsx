// src/components/modals/RemoveMemberModal.tsx
// DESIGN-SPEC §10.2 "Remove member" & reference screenshot 82-modal-remove-member.png
// Layout reference: design/layout/82-modal-remove-member.json
// - Title "Remove {Name}?" · paragraph (no heading icon)
// - Danger wide "Remove from My Network" (margin-top 20) · Secondary wide "Keep in my network" (margin-top 12)
// - Confirm: member removed (frees a slot), toast "{Name} was removed from your trusted network."

import React from 'react';
import { ModalSheet, ModalTitle, ModalText } from '../ui/ModalSheet';
import { Button } from '../ui/Button';
import { useStore } from '../../state/store';

interface RemoveMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onRemoved?: () => void;
}

export function RemoveMemberModal({ visible, onClose, onRemoved }: RemoveMemberModalProps) {
  const member = useStore((s) => s.selectedMember);
  const removeMember = useStore((s) => s.removeMember);
  const notify = useStore((s) => s.notify);

  const handleRemove = () => {
    removeMember(member.name);
    onClose();
    onRemoved?.();
    notify(`${member.name} was removed from your trusted network.`);
  };

  return (
    <ModalSheet visible={visible} onClose={onClose} accessibilityLabel="Guard’Ova confirmation">
      <ModalTitle>Remove {member.name}?</ModalTitle>
      <ModalText>They’ll no longer see your safety status, shared location, or emergency alerts.</ModalText>
      <Button label="Remove from My Network" variant="danger" wide onPress={handleRemove} style={{ marginTop: 20 }} />
      <Button label="Keep in my network" variant="secondary" wide onPress={onClose} style={{ marginTop: 12 }} />
    </ModalSheet>
  );
}
