import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, } from 'react-native';

const login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = () => {
        // Lógica de login aqui
        console.log('Login:', { email, senha });
    };

    const handleGoBack = () => {
        // Lógica para voltar
        console.log('Voltar');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#4A6B8A" barStyle="light-content" />

            {/* Header azul */}
            <View style={styles.header}>
                {/* Espaço reservado para o logo da pata */}
                <View style={styles.logoContainer}>
                    {/* Substitua este View pela sua Image do logo */}
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>🐾</Text>
                    </View>
                    {/* Exemplo de como usar a imagem quando tiver o arquivo:
          <Image 
            source={require('./assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          */}
                </View>
            </View>

            {/* Conteúdo principal */}
            <View style={styles.content}>
                <Text style={styles.title}>PETLAR</Text>
                <Text style={styles.subtitle}>Entre em sua conta</Text>

                {/* Campo E-mail */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu e-mail"
                        placeholderTextColor="#A0A0A0"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Campo Senha */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha"
                        placeholderTextColor="#A0A0A0"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Botões */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>

            {/* Footer verde */}
            <View style={styles.footer} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#4A6B8A',
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    logoContainer: {
        marginTop: 20,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoText: {
        fontSize: 40,
        color: '#FFFFFF',
    },
    // Estilo para quando você adicionar a imagem real
    logo: {
        width: 80,
        height: 80,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 30,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A6B8A',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
        color: '#333333',
    },
    loginButton: {
        backgroundColor: '#5B8C5A',
        borderRadius: 25,
        paddingVertical: 15,
        marginTop: 30,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#4A6B8A',
        borderRadius: 25,
        paddingVertical: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footer: {
        backgroundColor: '#7CB342',
        height: 60,
    },
});

export default login;
