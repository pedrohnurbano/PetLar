import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { ScrollView } from 'react-native-web';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        try {
            // Fazer login com Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;
            console.log('Login realizado com sucesso:', user.uid);

            // Opcional: Buscar dados adicionais do usuário no Firestore
            const q = query(
                collection(db, 'usuarios'), 
                where('uid', '==', user.uid)
            );
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                console.log('Dados do usuário do Firestore:', userData);
                // Aqui você pode salvar os dados em um contexto global se necessário
            }

            navigation.navigate('Pagina_Principal');
            
        } catch (error) {
            let errorMessage = 'Falha no login';
            
            // Tratamento de erros específicos
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Usuário não encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Senha incorreta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            Alert.alert('Erro', errorMessage);
            console.error('Erro no login:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView>
                <View style={styles.container}>

                    {/* Cabeçalho sem logo */}
                    <View style={styles.cabecalho}/>

                    {/* Logo */}
                    <Image style={styles.logo} source={require('../assets/logo.png')}/>
                    
                    {/* Título em texto */}
                    <Text style={styles.titulo}>Entre em sua conta</Text>

                    {/* Campos de entrada */}
                    <View style={styles.formulario}>
                        <Text style={styles.texto_campo}>E-mail:</Text>
                        <TextInput 
                            style={styles.campo} 
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Text style={styles.texto_campo}>Senha:</Text>
                        <TextInput 
                            style={styles.campo} 
                            placeholder="Digite sua senha"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                        />
                    </View>

                    {/* Botões de ação */}
                    <TouchableOpacity 
                        style={[styles.botao, { backgroundColor: '#307C53' }]}
                        onPress={handleLogin}
                    >
                        <Text style={styles.texto_botao}>Entrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.botao, { backgroundColor: '#273A57' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.texto_botao}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Rodapé */}
            <View style={styles.rodape}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    // Cabeçalho sem logo:
    cabecalho: {
        width: 402,
        height: 60,
        backgroundColor: '#284E73',
    },
    // Logo:
    logo: {
        width: 158,
        height: 158,
        marginBottom: 16,
        marginTop: 16,
    },
    // Título:
    titulo: {
        fontSize: 20,
        color: '#307D53',
        fontWeight: 'semibold',
        marginBottom: 16,
    },
    // Formulário:
    formulario: {
        alignContent: 'justify',
    },
    campo: {
        width: 312,
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
    },
    texto_campo: {
        fontSize: 14,
        color: '#283A59',
        marginVertical: 8,
    },
    // Botões:
    botao: {
        width: 312,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginVertical: 8,
    },
    texto_botao: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'semibold',
    },
    // Rodapé:
    rodape: {
        width: 402,
        height: 60,
        backgroundColor: '#85B542',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Login;
