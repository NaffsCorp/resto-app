import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {
  const [user, setUser] = useState(null)
  const navigation = useNavigation()

  // Fungsi untuk mengambil data user
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get('http://indo.prinafsika.world:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      navigation.replace('Login')
      Alert.alert('Error', 'Failed to fetch user data')
    }
  }

  // Fungsi logout
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      await axios.post(
        'http://indo.prinafsika.world:8000/api/logout',
        {}, // empty body karena POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      // Hapus token dari storage
      await AsyncStorage.removeItem('userToken')

      // Redirect ke halaman login
      navigation.replace('Login')
      Alert.alert('Success', 'Logged out successfully')
    } catch (error) {
      console.error('Error logging out:', error)
      Alert.alert('Error', 'Failed to logout')
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/logo.png')} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{user?.name || 'Username'}</Text>
          <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="#ffffff" style={styles.icon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View>
        <Text style={{ color: '#ffffff', textAlign: 'center', marginVertical: 20, fontWeight: 'bold' }}>Created by</Text>
        <View style={styles.createdByContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>A</Text>
            <Text style={styles.item}>Ahmad Dhany Prayogi | 21081010269</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>P</Text>
            <Text style={styles.item}>Prinafsika | 21081010278</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>R</Text>
            <Text style={styles.item}>Rena Rama Rosalinda | 21081010190</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>W</Text>
            <Text style={styles.item}>Wahyudi | 21081010100</Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={{ color: '#ffffff', textAlign: 'center', marginTop: 20 }}>&copy; 2023 RestoKu. All rights reserved.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0077b6',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'white',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077b6',
    textAlign: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#90e0ef',
  },
  textContainer: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03045e',
  },
  email: {
    fontSize: 16,
    color: '#0077b6',
    marginTop: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef233c',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
})

export default ProfileScreen
