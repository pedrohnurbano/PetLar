import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Screens/home';
import Login from './Screens/login';
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
  );
}
