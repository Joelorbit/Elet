import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text, Card, LucideIcon, useAppColors } from '@/src/theme/app-ui';
import { EOTC_BIBLE_BOOKS, type BibleBook } from '@/src/features/bible/utils/bible-books';
import type { AppLanguage } from '@/src/types/app';

interface ScriptureRefPickerProps {
  visible: boolean;
  language: AppLanguage;
  onSelect: (ref: string) => void;
  onClose: () => void;
}

export function ScriptureRefPicker({ visible, language, onSelect, onClose }: ScriptureRefPickerProps) {
  const colors = useAppColors();
  const [step, setStep] = useState<'book' | 'chapter'>('book');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    if (book.chapters === 1) {
      onSelect(`${language === 'am' ? book.nameAm : book.nameEn} 1`);
      handleClose();
    } else {
      setStep('chapter');
    }
  };

  const handleChapterSelect = (chapter: number) => {
    if (!selectedBook) return;
    onSelect(`${language === 'am' ? selectedBook.nameAm : selectedBook.nameEn} ${chapter}`);
    handleClose();
  };

  const handleClose = () => {
    setStep('book');
    setSelectedBook(null);
    onClose();
  };

  const testamentLabel = (t: BibleBook['testament']) => {
    if (t === 'OT') return language === 'am' ? 'ብሉይ ኪዳን' : 'Old Testament';
    if (t === 'NT') return language === 'am' ? 'አዲስ ኪዳን' : 'New Testament';
    return language === 'am' ? 'ዲውቴሮካኖኒካል' : 'Deuterocanonical';
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            {step === 'chapter' && (
              <Pressable onPress={() => setStep('book')} style={styles.backBtn}>
                <LucideIcon name="arrow-left" size={20} color={colors.primary} />
              </Pressable>
            )}
            <Text tone="title" style={[styles.title, { color: colors.text }]}>
              {step === 'book'
                ? (language === 'am' ? 'መጽሐፍ ይምረጡ' : 'Select Book')
                : (language === 'am' ? `ምዕራፍ — ${selectedBook?.[language === 'am' ? 'nameAm' : 'nameEn']}` : `Chapter — ${selectedBook?.nameEn}`)}
            </Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <LucideIcon name="x" size={20} color={colors.muted} />
            </Pressable>
          </View>

          {step === 'book' ? (
            <FlatList
              data={EOTC_BIBLE_BOOKS}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item, index }) => {
                const prevItem = index > 0 ? EOTC_BIBLE_BOOKS[index - 1] : null;
                const showHeader = !prevItem || prevItem.testament !== item.testament;
                return (
                  <View>
                    {showHeader && (
                      <Text tone="label" style={[styles.sectionHeader, { color: colors.primary }]}>
                        {testamentLabel(item.testament)}
                      </Text>
                    )}
                    <Pressable
                      onPress={() => handleBookSelect(item)}
                      style={({ pressed }) => [styles.bookItem, { backgroundColor: pressed ? colors.secondary : 'transparent' }]}
                    >
                      <Text style={[styles.bookName, { color: colors.text }]}>
                        {language === 'am' ? item.nameAm : item.nameEn}
                      </Text>
                      <Text style={[styles.bookChapters, { color: colors.muted }]}>
                        {item.chapters} {language === 'am' ? 'ምዕ.' : 'ch.'}
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          ) : (
            <FlatList
              data={Array.from({ length: selectedBook?.chapters ?? 1 }, (_, i) => i + 1)}
              keyExtractor={(item) => String(item)}
              numColumns={5}
              contentContainerStyle={styles.chapterGrid}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleChapterSelect(item)}
                  style={({ pressed }) => [
                    styles.chapterCell,
                    { backgroundColor: pressed ? colors.primaryContainer : colors.secondary, borderColor: colors.border }
                  ]}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'center' }}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1.5, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  backBtn: { padding: 8 },
  closeBtn: { padding: 8 },
  title: { fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  sectionHeader: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6, marginTop: 16, marginBottom: 4 },
  bookItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8 },
  bookName: { fontSize: 15, fontWeight: '600' },
  bookChapters: { fontSize: 12 },
  chapterGrid: { padding: 16, gap: 8 },
  chapterCell: { flex: 1, aspectRatio: 1, margin: 4, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', minWidth: 44 },
});
