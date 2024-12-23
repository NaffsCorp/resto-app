import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation, useRoute } from '@react-navigation/native'

const Footer = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const isActive = (routeName) => {
    return route.name === routeName
  }

  return (
    <SafeAreaView style={styles.footerContainer}>
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color={isActive('Home') ? '#0077b6' : 'white'} />
          <Text style={[styles.navText, isActive('Home') && styles.activeText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Product')}>
          <Icon name="utensils" size={24} color={isActive('Product') ? '#0077b6' : 'white'} />
          <Text style={[styles.navText, isActive('Product') && styles.activeText]}>Food</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('CategoryScreen')}>
          <Icon name="th-list" size={24} color={isActive('CategoryScreen') ? '#0077b6' : 'white'} />
          <Text style={[styles.navText, isActive('CategoryScreen') && styles.activeText]}>Category</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('SizeScreen')}>
          <Icon name="ruler-horizontal" size={24} color={isActive('SizeScreen') ? '#0077b6' : 'white'} />
          <Text style={[styles.navText, isActive('SizeScreen') && styles.activeText]}>Size</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#000',
    paddingVertical: 15,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  activeText: {
    color: '#0077b6',
  },
})

export default Footer
