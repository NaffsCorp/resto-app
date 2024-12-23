import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation, useRoute } from '@react-navigation/native'

const Header = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const isActive = (routeName) => {
    return route.name === routeName
  }

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
        <Icon name="user-alt" size={24} color={isActive('ProfileScreen') ? '#0077b6' : 'white'} />
      </TouchableOpacity>
      <Text style={styles.headerText}>RestoKu</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000',
    padding: 15,
    marginTop: 50,
    flexDirection: 'row',
  },
  headerText: {
    marginLeft: 120,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
})

export default Header
