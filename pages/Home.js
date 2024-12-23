import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MenuItem from './MenuItem'
import { useNavigation } from '@react-navigation/native'

export default function Home() {
  const [menus, setMenus] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  const fetchMenu = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')

      if (!token) {
        navigation.replace('Login')
        Alert.alert('Error', 'Sesi telah berakhir. Silakan login kembali.')
        return
      }

      const response = await fetch('http://indo.prinafsika.world:8000/api/food', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch menu')
      }

      const result = await response.json()
      const fetchedMenus = result.data.data.map((item) => ({
        id: item.id,
        image: `http://indo.prinafsika.world:8000/storage/products/${item.gambar}`,
        name: item.nama,
        price: `Rp ${item.harga}`,
        variant: item.variant,
        category: item.kategori.nama,
        size: item.ukuran.map((size) => size.nama).join(', '),
        available: item.tersedia === 1,
      }))

      setMenus(fetchedMenus)
      const uniqueCategories = [...new Set(fetchedMenus.map((menu) => menu.category))].map((name, index) => ({ id: index + 1, name }))
      setCategories(uniqueCategories)
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077b6" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flex: 1, height: 2, backgroundColor: 'white' }} />
              <View>
                <Text style={{ width: 200, textAlign: 'center', color: 'white', fontSize: 24, fontWeight: 'bold' }}>{category.name}</Text>
              </View>
              <View style={{ flex: 1, height: 2, backgroundColor: 'white' }} />
            </View>
            {menus
              .filter((menu) => menu.category === category.name)
              .map((menu) => (
                <MenuItem key={menu.id} image={menu.image} name={menu.name} price={menu.price} variant={menu.variant} category={menu.category} size={menu.size} available={menu.available} />
              ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0077b6',
  },
  scrollContainer: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0077b6',
  },
})
