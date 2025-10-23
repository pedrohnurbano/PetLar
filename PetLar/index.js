import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App);
// Ele também garante que, independentemente de carregar o aplicativo no Expo Go ou em uma build nativa,
// o ambiente é configurado adequadamente
registerRootComponent(App);
