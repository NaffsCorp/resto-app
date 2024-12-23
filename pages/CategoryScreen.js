import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function CategoryScreen() {
  const [category, setCategory] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    id: '',
    name: '',
  })

  useEffect(() => {
    axios
      .get('http://indo.prinafsika.world:8000/api/category')
      .then((response) => {
        setCategory(response.data.data.data)
      })
      .catch((error) => {
        console.error('Error fetching category data:', error)
      })
  }, [])

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const addCategory = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')

      if (!form.name) {
        alert('Please fill in all required fields')
        return
      }

      const response = await axios.post(
        'http://indo.prinafsika.world:8000/api/category',
        { nama: form.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      setCategory((prevCategory) => [...prevCategory, response.data.data])
      resetForm()
      alert('Category added successfully')
    } catch (error) {
      console.error('Error adding category:', error)
      alert(error.response?.data?.message || 'Error adding category')
    }
  }

  const editCategory = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')

      if (!form.name) {
        alert('Please fill in the category name')
        return
      }

      const response = await axios.put(
        `http://indo.prinafsika.world:8000/api/category/${editingId}`,
        { nama: form.name }, // data yang akan diupdate
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      setCategory((prevCategory) => prevCategory.map((cat) => (cat.id === editingId ? response.data.data : cat)))

      resetForm()
      alert('Category updated successfully')
    } catch (error) {
      console.error('Error updating category:', error)
      alert(error.response?.data?.message || 'Error updating category')
    }
  }

  const deleteCategory = async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken')

      await axios.delete(`http://indo.prinafsika.world:8000/api/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      setCategory((prevCategory) => prevCategory.filter((category) => category.id !== id))
      alert('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      alert(error.response?.data?.message || 'Error deleting category')
    }
  }

  const startEditing = (category) => {
    setIsEditing(true)
    setEditingId(category.id)
    setForm({
      id: category.id,
      name: category.nama,
    })
    setModalVisible(true)
  }

  const resetForm = () => {
    setForm({
      id: '',
      name: '',
    })
    setIsEditing(false)
    setEditingId(null)
    setModalVisible(false)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => {
          resetForm()
          setModalVisible(true)
        }}
      >
        <Ionicons name="add-circle" size={50} color="#fff" />
      </TouchableOpacity>

      <FlatList
        data={category}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cardContainer}
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            <View style={styles.foodNameContainer}>
              <Text style={styles.foodName}>{item.nama}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => startEditing(item)}>
                <Ionicons name="pencil" size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCategory(item.id)}>
                <Ionicons name="trash" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Category' : 'Add New Category'}</Text>
            <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={(value) => handleInputChange('name', value)} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={isEditing ? editCategory : addCategory}>
                <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0077b6',
  },
  addIcon: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  foodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  foodNameContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#0077b6',
    borderRadius: 4,
    padding: 6,
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 4,
    padding: 6,
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#00b4d8',
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#0077b6',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
})
