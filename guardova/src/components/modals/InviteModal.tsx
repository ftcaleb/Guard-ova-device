// src/components/modals/InviteModal.tsx
// DESIGN-SPEC §10.2 "Invite" & reference screenshots 34-modal-invite-empty.png, 35-modal-invite-filled.png
// Layout reference: design/layout/34-modal-invite-empty.json
// - Blue people tile 43 (margin-bottom 19) · title · paragraph
// - Labels 11 / 16.5 550 #778498 (margin-bottom 8; 18 above the second)
// - Inputs 44 high, padding 12, radius 7, border #DFE5EF, bg #FBFCFE, 12 / 18 #5B6A83, placeholder #B3BDCA
// - Primary wide "Send invitation →" (margin-top 24) · note (margin-top 15)
// Validation (DESIGN-SPEC §16 #1 fixed, decision N4): nothing is added and the first invalid field gets focus;
// no message is shown (the design has no error state). No focus ring (D13).

import React, { useRef } from 'react';
import { Text, TextInput, StyleSheet, Platform } from 'react-native';
import { ModalSheet, ModalTitle, ModalText } from '../ui/ModalSheet';
import { HeadingIcon } from '../ui/HeadingIcon';
import { Button } from '../ui/Button';
import { useStore } from '../../state/store';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

interface InviteModalProps {
  visible: boolean;
  onClose: () => void;
}

export function InviteModal({ visible, onClose }: InviteModalProps) {
  const inviteName = useStore((s) => s.inviteName);
  const setInviteName = useStore((s) => s.setInviteName);
  const invitePhone = useStore((s) => s.invitePhone);
  const setInvitePhone = useStore((s) => s.setInvitePhone);
  const inviteMember = useStore((s) => s.inviteMember);

  const nameRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const phoneRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const handleSend = () => {
    const invalid = inviteMember();
    if (invalid === 'name') nameRef.current?.focus();
    if (invalid === 'phone') phoneRef.current?.focus();
  };

  return (
    <ModalSheet visible={visible} onClose={onClose} accessibilityLabel="Invite a trusted person">
      <HeadingIcon name="people" size={43} style={styles.icon} />
      <ModalTitle>A trusted person. One invitation.</ModalTitle>
      <ModalText>
        Add someone who will be there when you need them. They’ll receive an invitation to your private network.
      </ModalText>

      <Text style={styles.label} nativeID="invite-name-label">Their name</Text>
      <TextInput
        ref={nameRef}
        style={styles.input}
        value={inviteName}
        onChangeText={setInviteName}
        placeholder="e.g. Nomsa"
        placeholderTextColor={colors.placeholder}
        maxLength={30}
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
        accessibilityLabelledBy="invite-name-label"
        aria-label="Their name"
      />

      <Text style={[styles.label, styles.labelSpaced]} nativeID="invite-phone-label">Mobile number</Text>
      <TextInput
        ref={phoneRef}
        style={styles.input}
        value={invitePhone}
        onChangeText={setInvitePhone}
        placeholder="+27 82 123 4567"
        placeholderTextColor={colors.placeholder}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="send"
        onSubmitEditing={handleSend}
        accessibilityLabelledBy="invite-phone-label"
        aria-label="Mobile number"
      />

      <Button label="Send invitation" arrow wide onPress={handleSend} style={styles.send} />
      <Text style={styles.note}>Private by design. Maximum 5 trusted people.</Text>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 19,
  },
  label: {
    fontFamily: fonts.dmSans550,
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
    color: colors.formLabel,
    marginBottom: 8,
    ...noPad,
  },
  labelSpaced: {
    marginTop: 18,
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 7,
    backgroundColor: colors.inputBg,
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    letterSpacing: 0,
    color: colors.inputText,
    ...noPad,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  send: {
    marginTop: 24,
  },
  note: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 17,
    letterSpacing: 0,
    color: colors.simulationNote,
    textAlign: 'center',
    marginTop: 15,
    ...noPad,
  },
});
