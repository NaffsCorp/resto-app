import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

const EditProduct = ({ route }) => {
  const {
    id,
    nama: initialNama,
    harga: initialHarga,
    variant: initialVariant,
    idKategori: initialIdKategori,
    namaKategori: initialNamaKategori,
    ukuran: initialUkuran,
    idUkuran: initialIdUkuran,
    tersedia: initialTersedia,
    gambar: prevImg,
  } = route.params

  const navigation = useNavigation()

  const [ukuran, setUkuran] = useState([])
  const [kategori, setKategori] = useState([])

  const [nama, setNama] = useState(initialNama || '')
  const [variant, setVariant] = useState(initialVariant || '')
  const [harga, setHarga] = useState(String(initialHarga) || '')
  const [inputKategori, setInputKategori] = useState(String(initialIdKategori) || '')
  const [inputUkuran, setInputUkuran] = useState(String(initialIdUkuran) || '')
  const [tersedia, setTersedia] = useState(String(initialTersedia || '1'))
  const [image, setImage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch kategori
        const responseCategory = await fetch('http://indo.prinafsika.world:8000/api/category/')
        const jsonCategory = await responseCategory.json()
        setKategori(jsonCategory.data.data)

        // Fetch ukuran
        const responseSize = await fetch('http://indo.prinafsika.world:8000/api/size/')
        const jsonSize = await responseSize.json()
        setUkuran(jsonSize.data.data)

        // Log untuk debugging
        console.log('Initial kategori:', initialIdKategori)
        console.log('Initial ukuran:', initialIdUkuran)
        console.log('Fetched kategori:', jsonCategory.data.data)
        console.log('Fetched ukuran:', jsonSize.data.data)
      } catch (error) {
        console.error('Error during fetchData:', error)
      }
    }
    fetchData()
  }, [])

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleUpdate = async () => {
    if (!nama || !variant || !harga || !inputKategori) {
      // Tambahkan validasi untuk kategori
      Alert.alert('Validation Error', 'All fields are required.')
      return
    }

    // Log untuk debugging
    console.log('kategori_id yang akan dikirim:', inputKategori)

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('nama', nama)
    formData.append('variant', variant)
    formData.append('harga', harga)
    formData.append('tersedia', tersedia)
    formData.append('kategori_id', String(inputKategori))
    formData.append('size_ids[]', String(inputUkuran))

    // Hanya tambahkan gambar jika ada yang dipilih
    if (image) {
      const uri = image
      const fileType = uri.substring(uri.lastIndexOf('.') + 1)
      const fileName = uri.substring(uri.lastIndexOf('/') + 1)

      formData.append('gambar', {
        uri: uri,
        name: fileName,
        type: `image/${fileType}`,
      })
    }

    // Log semua data yang akan dikirim
    console.log('FormData yang dikirim:', Object.fromEntries(formData._parts))

    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(`http://indo.prinafsika.world:8000/api/food/${id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })

      const responseData = await response.json()

      if (response.ok) {
        Alert.alert('Success', 'Product updated successfully!')
        navigation.navigate('Product')
      } else {
        Alert.alert('Error', responseData.message || 'Failed to update product.')
        console.log('Error Response:', responseData)
      }
    } catch (error) {
      console.error('Update Error:', error)
      Alert.alert('Error', 'Something went wrong during the update.')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <Text style={styles.title}>Edit Product</Text>
        <Image source={{ uri: `http://indo.prinafsika.world:8000/storage/products/` + prevImg }} style={styles.prevImg} />

        {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}

        <TouchableOpacity style={styles.buttonImage} onPress={handleChooseImage}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flex: 1, height: 2, backgroundColor: 'white' }} />
          <View>
            <Text style={{ width: 100, textAlign: 'center', color: 'white' }}>Product</Text>
          </View>
          <View style={{ flex: 1, height: 2, backgroundColor: 'white' }} />
        </View>
        <View>
          <Text style={styles.text}>Product Name</Text>
          <TextInput style={styles.input} placeholder="Product Name" placeholderTextColor="black" value={nama} onChangeText={setNama} />
        </View>
        <View>
          <Text style={styles.text}>Variant</Text>
          <TextInput style={styles.input} placeholder="Variant" placeholderTextColor="black" value={variant} onChangeText={setVariant} />
        </View>
        <View>
          <Text style={styles.text}>Price</Text>
          <TextInput style={styles.input} placeholder="Price" placeholderTextColor="black" value={harga} onChangeText={setHarga} keyboardType="numeric" />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.text}>Available</Text>
          {/* <TextInput style={styles.input} placeholder={tersedia ? 'Yes' : 'No'} placeholderTextColor="black" value={tersedia ? 'Yes' : 'No'} onChangeText={setTersedia} /> */}
          <Picker selectedValue={tersedia} onValueChange={(itemValue) => setTersedia(itemValue)} itemStyle={{ backgroundColor: '#fff', color: 'black', height: 50, borderRadius: 10 }}>
            <Picker.Item label="Yes" value="1" />
            <Picker.Item label="No" value="0" />
          </Picker>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.text}>Category</Text>
          <Picker selectedValue={inputKategori} onValueChange={(itemValue) => setInputKategori(itemValue)} itemStyle={{ backgroundColor: '#fff', color: 'black', height: 50, borderRadius: 10 }}>
            <Picker.Item key={initialIdKategori} label={initialNamaKategori} value={initialIdKategori} />
            {kategori
              .filter((k) => k.id != initialIdKategori)
              .map((k) => (
                <Picker.Item key={k.id} label={k.nama} value={k.id} />
              ))}
          </Picker>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.text}>Size</Text>
          <Picker selectedValue={inputUkuran} onValueChange={(itemValue) => setInputUkuran(itemValue)} itemStyle={{ backgroundColor: '#fff', color: 'black', height: 50, borderRadius: 10 }}>
            <Picker.Item key={initialIdUkuran} label={initialUkuran} value={initialIdUkuran} />
            {ukuran
              .filter((u) => u.id != initialIdUkuran)
              .map((u) => (
                <Picker.Item key={u.id} label={u.nama} value={u.id} />
              ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
  text: {
    fontSize: 18,
    color: '#fff',
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#00b4d8',
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
  picker: {
    height: 50,
    borderColor: '#00b4d8',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  prevImg: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  buttonImage: {
    backgroundColor: '#00b4d8',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'cover',
  },
})

export default EditProduct
