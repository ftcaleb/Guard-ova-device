// src/components/modals/CallModal.tsx
// DESIGN-SPEC §10.2 "Call" & reference screenshots 33-modal-call-member.png, 58-modal-call-siyabonga.png
// Layout reference: design/layout/33-modal-call-member.json
// Contains:
// - Blue icon tile with phone icon (43×43, radius 8px, bg #EDF2FF, margin-bottom 19)
// - Title "Call {Name}" (h2 21px / 750)
// - Text "This prototype demonstrates the call action. No real phone call will be placed." (12px #9AA4B3)
// - Primary button wide "Demonstrate call" + phone icon 18
// - On tap: toast "Call action demonstrated. No real call was made."

import React from 'react';
import { ModalSheet, ModalTitle, ModalText } from '../ui/ModalSheet';
import { HeadingIcon } from '../ui/HeadingIcon';
import { Button } from '../ui/Button';
import { useStore } from '../../state/store';

interface CallModalProps {
  visible: boolean;
  targetName?: string;
  onClose: () => void;
}

export function CallModal({
  visible,
  targetName = 'Siyabonga',
  onClose,
}: CallModalProps) {
  const notify = useStore((s) => s.notify);

  const handleDemonstrateCall = () => {
    onClose();
    notify('Call action demonstrated. No real call was made.');
  };

  return (
    <ModalSheet visible={visible} onClose={onClose} accessibilityLabel="Guard’Ova confirmation">
      <HeadingIcon name="phone" size={43} style={{ marginBottom: 19 }} />
      <ModalTitle>Call {targetName}</ModalTitle>
      <ModalText>This prototype demonstrates the call action. No real phone call will be placed.</ModalText>
      <Button label="Demonstrate call" icon="phone" iconSize={18} wide onPress={handleDemonstrateCall} />
    </ModalSheet>
  );
}
