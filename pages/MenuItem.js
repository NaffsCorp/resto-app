import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

export default function MenuItem({ image, name, price, variant, category, size, available }) {
  return (
    <View style={styles.card}>
      {/* Gambar di kiri */}
      <Image style={styles.image} source={{ uri: image }} />
      
      {/* Detail di tengah */}
      <View style={styles.center}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      
      {/* Informasi tambahan di kanan */}
      <View style={styles.right}>
        <Text style={styles.size}>{size}</Text>
        <Text style={[styles.availability, available ? styles.available : styles.unavailable]}>
          {available ? 'Available' : 'Out of stock'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginVertical: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row', // Tata letak horizontal
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 16, // Jarak dari detail di tengah
  },
  center: {
    flex: 2, // Memberikan proporsi lebih untuk bagian tengah
    justifyContent: 'center',
  },
  right: {
    flex: 1, // Memberikan proporsi lebih kecil untuk bagian kanan
    justifyContent: 'center',
    alignItems: 'flex-end', // Menyusun teks ke kanan
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  size: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  availability: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  available: {
    color: 'green',
  },
  unavailable: {
    color: 'red',
  },
});