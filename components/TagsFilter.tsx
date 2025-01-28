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
import { useColors } from '@/hooks/useColors';

interface TagsFilterProps {
  onSelectionChange: (selectedTags: number[]) => void;
  maxVisibleTags?: number;
}

const TagsFilter = ({ onSelectionChange, maxVisibleTags = 5 }: TagsFilterProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useColors();
  
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
          { backgroundColor: isSelected ? colors.yellow : colors.disabled },
        ]}
      >
        <Text
          style={[
            styles.tagText,
            { color: isSelected ? colors.textDarkerGray : colors.textLightGray },
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
            <Text key={index} >
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
        <Text style={{ color: colors.textLightGray }}>Loading tags...</Text>
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
      <View style={styles.filterHeader}>
      <Text style={[styles.filterHeaderText, { color: colors.textLightGray, flex: 1, fontSize: 17 }]}>Filter ({selectedTags.length}):</Text>
      {availableTags.length > maxVisibleTags && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.filterHeaderText, { color: colors.brand, fontSize: 12 }]}>
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View 
        style={styles.tagsContainer}
      >
        {sortedTags.slice(0, maxVisibleTags).map(tag => renderTag(tag))}
      
      </View>

      {/* Tags modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.white }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textDarkerGray }]}>
                Filter by Tags
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.textDarkerGray} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: colors.white,
                color: colors.textDarkerGray,
                borderColor: colors.black,
              }]}
              placeholder="Search tags..."
              placeholderTextColor={colors.textLightGray}
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
                        : colors.white,
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
  filterHeader: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
  },
  filterHeaderText: {
    fontWeight: '600',
    lineHeight: 22,
  },
  container: {
    marginVertical: 10,
  },
  tagsContainer: {
    flexWrap: 'wrap',
    flex: 1,
    flexDirection: 'row',
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