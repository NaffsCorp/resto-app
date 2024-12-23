import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setpassword_confirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !password_confirmation) {
      alert('Harap isi semua kolom!');
      return;
    }
    if (password !== password_confirmation) {
      alert('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://indo.prinafsika.world:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registrasi berhasil! Silakan login.');
        navigation.navigate('Login');
      } else {
        
        alert(data.message || 'Registrasi gagal. Coba lagi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
      console.error('Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/BG_login.jpeg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Resto Ku - Register</Text>
        <Text style={styles.subtitle}>
          Buat Akun Baru untuk Mengatur Makanan dan Minuman Yang Akan Dijual
        </Text>

        {/* Kolom Nama */}
        <TextInput
          style={styles.input}
          placeholder="Masukkan Nama"
          placeholderTextColor="#000"
          value={name}
          onChangeText={setName}
        />

        {/* Kolom Email */}
        <TextInput
          style={styles.input}
          placeholder="Masukkan Email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
        />

        {/* Kolom Password */}
        <TextInput
          style={styles.input}
          placeholder="Masukkan Password"
          placeholderTextColor="#000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Kolom Konfirmasi Password */}
        <TextInput
          style={styles.input}
          placeholder="Konfirmasi Password"
          placeholderTextColor="#000"
          value={password_confirmation}
          onChangeText={setpassword_confirmation}
          secureTextEntry
        />

        {/* Tombol Daftar */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Memuat...' : 'Daftar'}
          </Text>
        </TouchableOpacity>

        {/* Tautan ke Login */}
        <Text style={styles.loginText}>
          Sudah punya akun?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Login
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
  registerButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 25,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
  },
  loginLink: {
    color: '#00AEEF',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;