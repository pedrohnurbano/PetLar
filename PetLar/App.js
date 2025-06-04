import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Screens/home';
import Login from './Screens/login';
<<<<<<< Updated upstream
import CadastroUsuario from './Screens/cadastro_usuario';
import PaginaPrincipal from './Screens/pagina_principal';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Remove o header padrão para manter o design
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} />
        <Stack.Screen name="PaginaPrincipal" component={PaginaPrincipal} />
      </Stack.Navigator>
    </NavigationContainer>
=======
import Cadastro_Usuario from './Screens/cadastro_usuario';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Home/> */}
      {/* <Login/> */}
      <Cadastro_Usuario/>
      <StatusBar style="auto" />
    </View>
>>>>>>> Stashed changes
  );
}
