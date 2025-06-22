import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const Cadastro_Usuario = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    // Teste de conexão com Firebase
    React.useEffect(() => {
        console.log('🔥 Firebase Auth:', auth ? 'Conectado' : 'Erro de conexão');
        console.log('🔥 Firebase DB:', db ? 'Conectado' : 'Erro de conexão');
    }, []);

    const handleCadastro = async () => {
        console.log('=== INICIANDO CADASTRO ===');
        console.log('Email:', email);
        console.log('Senha length:', senha.length);

        if (!email || !senha) {
            console.log('Campos vazios detectados');
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        if (senha.length < 6) {
            console.log('Senha muito curta');
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            console.log('Tentando criar usuário no Firebase Auth...');

            // Criar usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;
            console.log('✅ Usuário criado no Auth:', user.uid);

            console.log('Tentando salvar no Firestore...');

            // Salvar dados do usuário no Firestore
            const docRef = await addDoc(collection(db, 'usuarios'), {
                uid: user.uid,
                email: email,
                dataCriacao: new Date().toISOString(),
            });

            console.log('✅ Usuário salvo no Firestore com ID:', docRef.id);

            Alert.alert(
                'Sucesso',
                'Conta criada com sucesso!',
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
            );

        } catch (error) {
            console.log('❌ ERRO NO CADASTRO:', error);
            console.log('Código do erro:', error.code);
            console.log('Mensagem do erro:', error.message);

            let errorMessage = 'Erro ao criar conta';

            // Tratamento de erros específicos do Firebase
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este email já está em uso';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Senha muito fraca';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Erro de conexão. Verifique sua internet';
                    break;
                default:
                    errorMessage = `Erro: ${error.message}`;
            }

            Alert.alert('Erro', errorMessage);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView>
                <View style={styles.container}>

                    {/* Cabeçalho sem logo */}
                    <View style={styles.cabecalho} />

                    {/* Logo */}
                    <Image style={styles.logo} source={require('../assets/logo.png')} />

                    {/* Título em texto */}
                    <Text style={styles.titulo}>Cadastro de Usuário</Text>

                    {/* Campos de entrada */}
                    <View style={styles.campuzinho}>
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
                                placeholder="Digite sua senha (mín. 6 caracteres)"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry
                            />
                        </View>

                        {/* Botões de ação */}
                        <TouchableOpacity
                            style={[styles.botao, { backgroundColor: '#307C53' }]}
                            onPress={handleCadastro}
                        >
                            <Text style={styles.texto_botao}>Cadastrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botao, { backgroundColor: '#273A57' }]}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.texto_botao}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Rodapé */}
                <View style={styles.rodape} />
            </ScrollView>
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
        fontWeight: 'bold',
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
        fontWeight: 'semibold',
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

    campuzinho: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginVertical: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 3,
    },
});

export default Cadastro_Usuario;
