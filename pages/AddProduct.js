import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AddProduct = ({ navigation }) => {
  const [ukuran, setUkuran] = useState([])
  const [kategori, setKategori] = useState([])

  const [nama, setNama] = useState('')
  const [variant, setVariant] = useState('')
  const [harga, setHarga] = useState('')
  const [tersedia, setTersedia] = useState('1')
  const [inputKategori, setInputKategori] = useState('')
  const [inputUkuran, setInputUkuran] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCategory = await fetch('http://indo.prinafsika.world:8000/api/category/')
        const jsonCategory = await responseCategory.json()
        setKategori(jsonCategory.data.data)

        const responseSize = await fetch('http://indo.prinafsika.world:8000/api/size/')
        const jsonSize = await responseSize.json()
        setUkuran(jsonSize.data.data)
      } catch (error) {
        console.error('Error during fetchData:', error)
      }
    }
    fetchData()
  }, [])

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (!nama || !variant || !harga || !inputKategori || !inputUkuran || !image) {
      Alert.alert('All fields are required!')
      return
    }

    const formData = new FormData()
    formData.append('nama', nama)
    formData.append('variant', variant)
    formData.append('harga', harga)
    formData.append('tersedia', tersedia)
    formData.append('kategori_id', inputKategori)
    formData.append('size_ids[0]', inputUkuran)

    const uri = image
    const fileType = uri.split('.').pop()
    const fileName = uri.split('/').pop()
    formData.append('gambar', {
      uri,
      name: fileName,
      type: `image/${fileType}`,
    })

    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch('http://indo.prinafsika.world:8000/api/food/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const responseText = await response.text()

      if (response.ok) {
        Alert.alert('Product added successfully!')
        navigation.navigate('Product')
      } else {
        let jsonResponse
        try {
          jsonResponse = JSON.parse(responseText)
          console.error('Error from server:', JSON.stringify(jsonResponse, null, 2))
          Alert.alert('Failed to add product', jsonResponse.message || 'Something went wrong.')
        } catch (parseError) {
          console.error('Error parsing response JSON:', parseError.message)
          Alert.alert('Error', 'Unexpected response from server.')
        }
      }
    } catch (error) {
      console.error('Error during product submission:', error.message || error.toString().slice(0, 200))
      Alert.alert('Error', 'Failed to submit product.')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>
      <TextInput style={styles.input} placeholder="Product Name" placeholderTextColor="#000" value={nama} onChangeText={setNama} />
      <TextInput style={styles.input} placeholder="Variant" placeholderTextColor="#000" value={variant} onChangeText={setVariant} />
      <TextInput style={styles.input} placeholder="Price" placeholderTextColor="#000" value={harga} onChangeText={setHarga} keyboardType="numeric" />
      {/* Picker untuk Kategori */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker selectedValue={inputKategori} onValueChange={(itemValue) => setInputKategori(itemValue)} itemStyle={{ backgroundColor: '#fff', color: 'black', height: 50, borderRadius: 10 }}>
          <Picker.Item label="Select a Category" value="" />
          {kategori.map((k) => (
            <Picker.Item key={k.id} label={k.nama} value={k.id} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Size</Text>
        <Picker selectedValue={inputUkuran} onValueChange={(itemValue) => setInputUkuran(itemValue)} itemStyle={{ backgroundColor: '#fff', color: 'black', height: 50, borderRadius: 10 }}>
          <Picker.Item label="Select a Size" value="" />
          {ukuran.map((u) => (
            <Picker.Item key={u.id} label={u.nama} value={u.id} />
          ))}
        </Picker>
      </View>

      {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}

      <TouchableOpacity style={styles.buttonImage} onPress={handleChooseImage}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0077b6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00b4d8',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonImage: {
    backgroundColor: '#00b4d8',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'cover',
  },
})

export default AddProduct
