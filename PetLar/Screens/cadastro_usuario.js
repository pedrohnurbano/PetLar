import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * Componente de Cadastro de Usuário
 * Permite criar uma nova conta de usuário com email e senha
 * Integrado com Firebase Authentication e Firestore
 */
const Cadastro_Usuario = ({ navigation }) => {
    // Estados para controle dos campos de entrada
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    // Verificação de conexão com Firebase ao carregar o componente
    React.useEffect(() => {
        console.log('Firebase Auth:', auth ? 'Conectado' : 'Erro de conexão');
        console.log('Firebase DB:', db ? 'Conectado' : 'Erro de conexão');
    }, []);

    /**
     * Função principal de cadastro de usuário
     * Realiza validações, cria conta no Firebase Auth e salva dados no Firestore
     */
    const handleCadastro = async () => {
        console.log('Iniciando cadastro...');
        console.log('Email:', email);
        console.log('Senha length:', senha.length);

        // Validação de campos obrigatórios
        if (!email || !senha) {
            console.log('Campos vazios detectados');
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        // Validação de tamanho mínimo da senha
        if (senha.length < 6) {
            console.log('Senha muito curta');
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            console.log('Tentando criar usuário no Firebase Auth...');

            // Criação do usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;
            console.log('Usuário criado no Auth:', user.uid);

            console.log('Tentando salvar no Firestore...');

            // Salvamento dos dados do usuário no Firestore
            const docRef = await addDoc(collection(db, 'usuarios'), {
                uid: user.uid,
                email: email,
                dataCriacao: new Date().toISOString(),
            });

            console.log('Usuário salvo no Firestore com ID:', docRef.id);

            // Redirecionamento para tela de Login após sucesso
            navigation.navigate('Login');

        } catch (error) {
            console.log('Erro no cadastro:', error);
            console.log('Código do erro:', error.code);
            console.log('Mensagem do erro:', error.message);

            let errorMessage = 'Erro ao criar conta';

            // Tratamento específico para diferentes tipos de erro do Firebase
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

                    {/* Header da aplicação */}
                    <View style={styles.cabecalho} />

                    {/* Logo da aplicação */}
                    <Image style={styles.logo} source={require('../assets/logo.png')} />

                    {/* Título da tela */}
                    <Text style={styles.titulo}> Cadastro de Usuário </Text>

                    {/* Container principal do formulário */}
                    <View style={styles.campuzinho}>
                        {/* Formulário de entrada de dados */}
                        <View style={styles.formulario}>
                            <Text style={styles.texto_campo}> E-mail: </Text>
                            <TextInput
                                style={styles.campo}
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Text style={styles.texto_campo}> Senha: </Text>
                            <TextInput
                                style={styles.campo}
                                placeholder="Digite sua senha (mín. 6 caracteres)"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry
                            />
                        </View>

                        {/* Botão de confirmação do cadastro */}
                        <TouchableOpacity
                            style={[styles.botao, { backgroundColor: '#307C53' }]}
                            onPress={handleCadastro}
                        >
                            <Text style={styles.texto_botao}> Cadastrar </Text>
                        </TouchableOpacity>

                        {/* Botão de retorno à tela anterior */}
                        <TouchableOpacity
                            style={[styles.botao, { backgroundColor: '#273A57' }]}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.texto_botao}> Voltar </Text>
                        </TouchableOpacity>

                        {/* Link para navegação à tela de Login */}
                        <View style={styles.row}>
                            <Text style={styles.texto_cadastro}> Já possui uma conta? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.texto_botao_cadastro}> Entre aqui </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                {/* Footer da aplicação */}
                <View style={styles.rodape} />
            </ScrollView>
        </View>
    );
}

/**
 * Estilos do componente
 * Organizados por seções: Container, Header, Logo, Título, Formulário, Botões e Footer
 */
const styles = StyleSheet.create({
    // Container principal
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    
    // Estilo do header
    cabecalho: {
        width: 402,
        height: 60,
        backgroundColor: '#284E73',
    },
    
    // Estilo da logo
    logo: {
        width: 158,
        height: 158,
        marginBottom: 16,
        marginTop: 16,
    },
    
    // Estilo do título
    titulo: {
        fontSize: 20,
        color: '#307D53',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    
    // Estilos do formulário
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
    
    // Estilos dos botões
    botao: {
        width: 312,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginVertical: 10,
    },
    texto_botao: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'semibold',
    },
    texto_botao_cadastro: {
        color: '#4682B4'
    },
    
    // Estilo do footer
    rodape: {
        width: 402,
        height: 60,
        backgroundColor: '#85B542',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Container do formulário com sombra
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
    
    // Layout em linha para link de login
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default Cadastro_Usuario;