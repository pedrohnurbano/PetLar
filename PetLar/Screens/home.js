import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const Home = () => {
    return (
        <View style={styles.container}>

            {/* Cabeçalho com logo */}
            <View style={styles.cabecalho}>
              <Image source={require('../assets/logo_circulo.png')} style={styles.logo} />
            </View>

            {/* Imagem principal */}
            <Image source={require('../assets/imagem_home.jpg')} style={styles.imagem} />

            {/* Texto motivacional */}
            <Text style={styles.texto_motivacional}>Cada pet merece um lar, cada lar merece um pet.</Text>

            {/* Botões de ação */}
            <TouchableOpacity style={[styles.botao, { backgroundColor: '#307C53' }]}>
                <Text style={styles.texto_botao}>Entre em sua conta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botao, { backgroundColor: '#273A57' }]}>
                <Text style={styles.texto_botao}>Cadastre-se</Text>
            </TouchableOpacity>

            {/* Rodapé */}
            <View style={styles.rodape}>
              <Text style={styles.texto_rodape}>© 2025 PetLar. Todos os direitos reservados.</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    
    cabecalho : {
        width: 402,
        height: 60,
        backgroundColor: '#284E73',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 46,
        height: 46,
    },
    // Imagem principal:
    imagem: {
        width: 402,
        height: 227,
    },
    // Texto motivacional:
    texto_motivacional: {
        fontSize: 20,
        color: '#307D53',
        marginVertical: 16,
        textAlign: 'center',
        fontWeight: 'bold',
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
    texto_rodape: {
        color: '#fff',
        fontSize: 12,
    },
});

export default Home;