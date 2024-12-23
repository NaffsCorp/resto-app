import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login')
    }, 3000)
    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>RestoKu</Text>
      <Text style={styles.subtitle}>Hidangan Istimewa Untuk Momen Istimewa Kamu</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B4D8',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#0077b6',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
})

export default SplashScreen
