import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

export const SelectorModal = ({ 
  label, 
  placeholder, 
  options = [], 
  selectedValue, 
  selectedLabel, 
  onSelect,
  loading = false,
  error
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(option => 
    option.name?.toLowerCase().includes(search.toLowerCase()) || 
    option.sublabel?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    onSelect(option);
    setSearch('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={[
          styles.selectorButton, 
          modalVisible && styles.selectorActive,
          error && styles.selectorError
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectedText, !selectedLabel && styles.placeholderText]}>
          {selectedLabel || placeholder || 'Selecione...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textLight} />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar {label}</Text>
            <TouchableOpacity 
              onPress={() => {
                setSearch('');
                setModalVisible(false);
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Digitar para buscar..."
              placeholderTextColor="#a4b0be"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {loading ? (
            <View style={styles.center}>
              <Text style={styles.infoText}>Carregando opções...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    item.id === selectedValue && styles.optionItemSelected
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.optionText,
                      item.id === selectedValue && styles.optionTextSelected
                    ]}>
                      {item.name}
                    </Text>
                    {item.sublabel && (
                      <Text style={styles.optionSublabel}>{item.sublabel}</Text>
                    )}
                  </View>
                  {item.id === selectedValue && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="sad-outline" size={48} color={colors.textLight} />
                  <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 6,
    fontWeight: '700',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
  },
  selectorActive: {
    borderColor: colors.primary,
  },
  selectorError: {
    borderColor: colors.danger,
  },
  selectedText: {
    fontSize: 15,
    color: colors.textDark,
  },
  placeholderText: {
    color: '#a4b0be',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  closeButton: {
    padding: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 14,
    borderRadius: 10,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: colors.textDark,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#f5f4ff',
  },
  optionText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.primary,
  },
  optionSublabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  infoText: {
    fontSize: 16,
    color: colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 12,
  },
});
export default SelectorModal;
