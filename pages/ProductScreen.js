import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Product = ({ navigation }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://indo.prinafsika.world:8000/api/food/')
        const json = await response.json()
        setData(json.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(`http://indo.prinafsika.world:8000/api/food/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        Alert.alert('Success', 'Product deleted successfully!')
        setData((prevData) => prevData.filter((item) => item.id !== productId))
      } else {
        const errorResponse = await response.json()
        Alert.alert('Error', errorResponse.message || 'Failed to delete product.')
      }
    } catch (error) {
      console.error('Error during product deletion:', error)
      Alert.alert('Error', 'Something went wrong while deleting the product.')
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.safeArea}>
        {data.map((post) => (
          <TouchableOpacity style={styles.container} activeOpacity={0.7} key={post.id}>
            <Image source={{ uri: `http://indo.prinafsika.world:8000/storage/products/` + post.gambar }} style={styles.image} />
            <View style={{ padding: 10 }}>
              <View style={styles.header}>
                <Text style={styles.title}>{post.nama}</Text>
              </View>
              <Text style={styles.variant}>{post.variant}</Text>
              <Text style={styles.category}>Category: {post.kategori.nama}</Text>
              <Text style={styles.size}>Size: {post.ukuran.map((u) => u.nama).join(', ')}</Text>
              <Text style={[styles.category, post.tersedia ? styles.statusTersedia : styles.statusTidakTersedia]}>{post.tersedia ? 'Tersedia' : 'Tidak Tersedia'}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>Rp</Text>
                <Text style={styles.priceValue}>{post.harga}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditProduct', {
                    id: post.id,
                    nama: post.nama,
                    harga: post.harga,
                    variant: post.variant,
                    gambar: post.gambar,
                    idKategori: post.kategori.id,
                    namaKategori: post.kategori.nama,
                    tersedia: post.tersedia,
                    ukuran: post.ukuran.map((u) => u.nama).join(', '),
                    idUkuran: post.ukuran[0].id,
                  })
                }
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(post.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('AddProduct')}>
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#00b4d8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  variant: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  size: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },

  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00b4d8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#0077b6',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0077b6',
    paddingTop: 10,
  },
  statusTersedia: {
    color: '#4CAF50',
  },
  statusTidakTersedia: {
    color: '#F44336',
  },
})

export default Product
