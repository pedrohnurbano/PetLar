## PetLar

Aplicativo mobile (Expo/React Native) para facilitar a adoção responsável de animais. Permite cadastro e autenticação de usuários (Firebase), publicação de pets para adoção com foto, listagem dos pets disponíveis e contato rápido via WhatsApp.

### Sumário
- O que é o projeto
- Funcionalidades
- Tecnologias utilizadas
- Requisitos
- Como executar
- Configuração do Firebase
- Estrutura do projeto
- Scripts disponíveis
- Modelo de dados (Firestore)
- Observações e limitações
- Licença

## O que é o projeto
O PetLar conecta quem deseja adotar com pessoas que estão disponibilizando animais para adoção. Após criar uma conta e fazer login, o usuário pode cadastrar pets (com foto, descrição e contato). A tela principal lista os pets disponíveis, e o contato abre diretamente no WhatsApp com mensagem pré-preenchida.

## Funcionalidades
- Autenticação de usuários (Firebase Authentication)
- Cadastro de usuário e login
- Cadastro de pets para adoção (nome, descrição, contato e foto)
- Upload de imagem via galeria (expo-image-picker) e armazenamento como base64
- Listagem de pets disponíveis (consulta no Firestore)
- Contato rápido com o anunciante via WhatsApp
- Edição e exclusão de pets cadastrados pelo usuário
- Navegação entre telas com React Navigation

## Tecnologias utilizadas
- Expo `^53.0.11`
- React Native `^0.79.3`
- React `19.0.0`
- React Navigation (Native Stack) `^7.x`
- Firebase (Auth e Firestore) `^11.x`
- expo-image-picker `^16.x`
- react-native-screens, react-native-safe-area-context
- Suporte a Web com react-native-web

## Requisitos
- Node.js 18+ e npm (ou yarn)
- Conta no Expo (opcional, mas recomendada para usar o Expo Go)
- Dispositivo físico com app Expo Go ou emulador Android/iOS configurado

## Como executar
1) Clonar o repositório

```bash
git clone <url-do-seu-repo>
cd PetLar
```

2) Instalar dependências

```bash
npm install
```

3) Rodar o projeto

```bash
# Inicia o servidor Metro e mostra opções (Expo Dev Tools)
npm start

# Atalhos convenientes
npm run android   # abre no emulador/dispositivo Android
npm run ios       # abre no simulador iOS (apenas macOS)
npm run web       # executa no navegador
```

4) Abrir no dispositivo
- Android: leia o QR Code com o app Expo Go
- iOS: use a câmera (com Expo Go instalado) ou o simulador via `npm run ios`

## Configuração do Firebase
O projeto já inclui `PetLar/firebase/config.js`. Para usar seu próprio projeto no Firebase:
1) Crie um projeto no Firebase Console, habilite Authentication (Email/Password) e Firestore
2) Crie um app Web e copie as credenciais (apiKey, authDomain, projectId, etc.)
3) Substitua os valores no arquivo abaixo pelos seus:

```text
PetLar/firebase/config.js
```

Recomendação: para produção, evite commitar chaves sensíveis. Considere variáveis de ambiente e um mecanismo de injeção (por exemplo, usando soluções compatíveis com Expo) antes de publicar.

## Estrutura do projeto
```text
.
├─ PetLar/
│  ├─ App.js
│  ├─ index.js
│  ├─ app.json
│  ├─ package.json
│  ├─ assets/
│  ├─ firebase/
│  │  └─ config.js
│  └─ Screens/
│     ├─ home.js
│     ├─ login.js
│     ├─ cadastro_usuario.js
│     ├─ pagina_principal.js
│     ├─ adocao.js
│     └─ gerenciamento.js
└─ README.md
```

## Scripts disponíveis
Definidos em `PetLar/package.json`:

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

## Modelo de dados (Firestore)
- Coleção `usuarios`
  - `uid`: string (UID do Auth)
  - `email`: string
  - `dataCriacao`: ISO string

- Coleção `pets`
  - `nome`: string
  - `descricao`: string
  - `contato`: string (11 dígitos: DDD + número)
  - `imagemBase64`: string (Data URL da imagem)
  - `userId`: string (UID do usuário dono do anúncio)
  - `userEmail`: string
  - `status`: string (ex.: "disponivel")
  - `dataCadastro`: ISO string
  - `dataAtualizacao` (opcional): ISO string

## Observações e limitações
- O contato deve ter 11 dígitos (formato brasileiro): DDD + número. A tela de listagem formata e cria link de WhatsApp automaticamente.
- O comando `npm run ios` só funciona em macOS com Xcode instalado.
