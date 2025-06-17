import React from 'react';
import { NavigationContainer }        from '@react-navigation/native'      ;
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home             from './Screens/home'            ;
import Login            from './Screens/login'           ;
import Cadastro_Usuario from './Screens/cadastro_usuario';
import Pagina_Principal from './Screens/pagina_principal';
import Adocao           from './Screens/adocao'          ;
import Gerenciamento    from './Screens/gerenciamento'   ;

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
        <Stack.Screen name="Home"             component={Home}             />
        <Stack.Screen name="Login"            component={Login}            />
        <Stack.Screen name="Cadastro_Usuario" component={Cadastro_Usuario} />
        <Stack.Screen name="Pagina_Principal" component={Pagina_Principal} />
        <Stack.Screen name="Adocao"           component={Adocao}           />
        <Stack.Screen name="Gerenciamento"    component={Gerenciamento}    />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
