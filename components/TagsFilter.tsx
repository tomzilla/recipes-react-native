import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { X, ChevronRight } from 'lucide-react';
import { theme } from '@/constants/Colors';
import { supabase } from '@/services/SupabaseClient';
import { useTags } from '@/hooks/useTags';
import { Tables } from '@/services/database.types';

interface TagsFilterProps {
  onSelectionChange: (selectedTags: number[]) => void;
  maxVisibleTags?: number;
}

const TagsFilter = ({ onSelectionChange, maxVisibleTags = 5 }: TagsFilterProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const colors = theme[colorScheme];
  
  const {
    selectedTags,
    availableTags,
    isLoading,
    error,
    fetchTags,
    toggleTag,
  } = useTags();

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    onSelectionChange?.(selectedTags);
  }, [selectedTags, onSelectionChange]);

  // Sort tags with selected ones first
  const sortedTags = useMemo(() => {
    return [...availableTags].sort((a, b) => {
      const aSelected = selectedTags.includes(a.id);
      const bSelected = selectedTags.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [availableTags, selectedTags]);

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!searchQuery) return sortedTags;
    return sortedTags.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedTags, searchQuery]);


  // Render individual tag
  const renderTag = (tag: Tables<'tags'>, inModal: boolean = false) => {
    const isSelected = selectedTags.includes(tag.id);
    
    return (
      <TouchableOpacity
        key={tag.id}
        onPress={() => toggleTag(tag.id)}
        style={[
          styles.tag,
          { backgroundColor: isSelected ? colors.brand : colors.backgroundAlt },
        ]}
      >
        <Text
          style={[
            styles.tagText,
            { color: isSelected ? colors.textPrimary : colors.textPrimary },
          ]}
        >
          {tag.name}
          {/* {!inModal && tag.count && ` (${tag.count})`} */}
        </Text>
      </TouchableOpacity>
    );
  };

  // Highlight matching text in search results
  const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight) return <Text>{text}</Text>;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <Text>
        {parts.map((part, index) => (
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Text key={index} style={{ backgroundColor: colors.butter }}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        ))}
      </Text>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.textSecondary }}>Loading tags...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.brand }}>Error loading tags: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main tags list */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {sortedTags.slice(0, maxVisibleTags).map(tag => renderTag(tag))}
        {availableTags.length > maxVisibleTags && (
          <TouchableOpacity
            style={[styles.moreButton, { backgroundColor: colors.backgroundAlt }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.moreButtonText, { color: colors.textPrimary }]}>
              More
            </Text>
            <ChevronRight size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Tags modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Filter by Tags
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: colors.backgroundAlt,
                color: colors.textPrimary,
                borderColor: colors.border,
              }]}
              placeholder="Search tags..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredTags}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalTag,
                    { 
                      backgroundColor: selectedTags.includes(item.id) 
                        ? colors.brand 
                        : colors.surface,
                    },
                  ]}
                  onPress={() => toggleTag(item.id)}
                >
                  <HighlightedText
                    text={item.name}
                    highlight={searchQuery}
                  />
                  {/* {item.count && (
                    <Text style={[
                      styles.tagCount,
                      { color: selectedTags.includes(item.id) 
                        ? colors.textPrimary 
                        : colors.textSecondary 
                      },
                    ]}>
                      {item.count}
                    </Text>
                  )} */}
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollView: {
    flexGrow: 0,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  modalTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  tagCount: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default TagsFilter;