import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Profile from './pages/ProfileScreen'
import ProductScreen from './pages/ProductScreen'
import AddProduct from './pages/AddProduct'
import Login from './pages/Login'
import Register from './pages/Register'
import SplashScreen from './pages/SplashScreen'
import CategoryScreen from './pages/CategoryScreen'
import SizeScreen from './pages/SizeScreen'
import EditProduct from './pages/EditProduct'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
          }),
          cardStyle: {
            backgroundColor: 'transparent',
          },
          headerStyle: {
            backgroundColor: '#0077b6',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleContainerStyle: {
            alignItems: 'center',
          },
          headerRightContainerStyle: {
            alignItems: 'center',
          },
          headerLeftContainerStyle: {
            alignItems: 'center',
          },
          headerRight: () => null,
          headerLeft: () => null,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="Home"
          component={(props) => (
            <>
              <Header {...props} />
              <Home {...props} />
              <Footer {...props} />
            </>
          )}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={(props) => (
            <>
              <Header {...props} />
              <Profile {...props} />
              <Footer {...props} />
            </>
          )}
        />
        <Stack.Screen
          name="Product"
          component={(props) => (
            <>
              <Header {...props} />
              <ProductScreen {...props} />
              <Footer {...props} />
            </>
          )}
        />
        <Stack.Screen
          name="AddProduct"
          component={(props) => (
            <>
              <Header {...props} />
              <AddProduct {...props} />
              <Footer {...props} />
            </>
          )}
        />

        <Stack.Screen
          name="EditProduct"
          component={(props) => (
            <>
              <Header {...props} />
              <EditProduct {...props} />
              <Footer {...props} />
            </>
          )}
        />

        <Stack.Screen
          name="Login"
          component={(props) => (
            <>
              <Login {...props} />
            </>
          )}
        />

        <Stack.Screen
          name="CategoryScreen"
          component={(props) => (
            <>
              <Header {...props} />
              <CategoryScreen {...props} />
              <Footer {...props} />
            </>
          )}
        />

        <Stack.Screen
          name="SizeScreen"
          component={(props) => (
            <>
              <Header {...props} />
              <SizeScreen {...props} />
              <Footer {...props} />
            </>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
