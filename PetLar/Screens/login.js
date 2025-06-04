import React from 'react';
import { View, Text, Button, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Login = () => {
    return (
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
                <TextInput style={styles.campo} placeholder="Digite seu e-mail"/>
                <Text style={styles.texto_campo}>Senha:</Text>
                <TextInput style={styles.campo} placeholder="Digite sua senha"/>
            </View>

            {/* Botões de ação */}
            <TouchableOpacity style={[styles.botao, { backgroundColor: '#307C53' }]}>
                <Text style={styles.texto_botao}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botao, { backgroundColor: '#273A57' }]}>
                <Text style={styles.texto_botao}>Voltar</Text>
            </TouchableOpacity>

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
        padding: 16,
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