import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('admin@gmail.co.id');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password harus diisi.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://indo.prinafsika.world:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan token ke AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);

        Alert.alert('Sukses', 'Login berhasil!');
        navigation.replace('Home');
      } else {
        Alert.alert('Error', data.message || 'Login gagal.');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan pada server.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/BG_login.jpeg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>RestoKu</Text>
        <Text style={styles.subtitle}>
          Hidangan Istimewa dan Mewah Harga Kaki Lima
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Masukkan Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Loading...' : 'Login'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.registerText}>
          Belum punya akun?{' '}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            Daftar
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#00AEEF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 25,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    color: '#fff',
    marginBottom: 10,
  },
  registerText: {
    color: '#fff',
  },
  registerLink: {
    color: '#00AEEF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;