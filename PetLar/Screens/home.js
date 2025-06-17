import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

const Home = ({ navigation }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView style={styles.scrollView}>
                    {/* Cabeçalho com logo */}
                    <View style={styles.cabecalho}>
                        <Image 
                            source={require('../assets/logo_circulo.png')} 
                            style={styles.logo}
                            accessibilityLabel="Logo do PetLar"
                        />
                    </View>

                    {/* Imagem principal */}
                    <Image 
                        source={require('../assets/imagem_home.jpg')} 
                        style={styles.imagem}
                        accessibilityLabel="Família feliz com cachorro"
                    />

                    {/* Seção de benefícios */}
                    <View style={styles.containerBeneficios}>
                        <Text style={styles.tituloBeneficios}>Por que adotar?</Text>
                        
                        <View style={styles.beneficio}>
                            <View style={styles.iconeBeneficio}>
                                <Text style={styles.emoji}>❤️</Text>
                            </View>
                            <Text style={styles.textoBeneficio}>Você salva uma vida e ganha um amigo fiel para toda a vida!</Text>
                        </View>
                        
                        <View style={styles.beneficio}>
                            <View style={styles.iconeBeneficio}>
                                <Text style={styles.emoji}>😊</Text>
                            </View>
                            <Text style={styles.textoBeneficio}>Adoção responsável e gratuita</Text>
                        </View>
                    </View>

                    {/* Botões de ação */}
                    <View style={styles.containerBotoes}>
                        <TouchableOpacity 
                            style={[styles.botao, styles.botaoEntrar]}
                            onPress={() => navigation.navigate('Login')}
                            accessibilityLabel="Entrar na sua conta"
                            accessibilityRole="button"
                        >
                            <Text style={styles.texto_botao}>Acesse o Sistema</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.botao, styles.botaoCadastro]}
                            onPress={() => navigation.navigate('Cadastro_Usuario')}
                            accessibilityLabel="Criar nova conta"
                            accessibilityRole="button"
                        >
                            <Text style={styles.texto_botao}>Cadastre-se já!</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Rodapé */}
                    <View style={styles.rodape}>
                        <Text style={styles.texto_rodape}>
                            © 2025 PetLar. Todos os direitos reservados.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    
    scrollView: {
        flex: 1,
    },
    
    cabecalho: {
        width: '100%',
        height: 60,
        backgroundColor: '#284E73',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 46,
        height: 46,
    },
    
    // Imagem principal
    imagem: {
        width: '100%',
        height: 227,
        resizeMode: 'cover',
    },
    
    // Container do texto
    containerTexto: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
        position: 'relative',
    },
    
    // Seção de benefícios
    containerBeneficios: {
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
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    tituloBeneficios: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#284E73',
        textAlign: 'center',
        marginBottom: 15,
    },
    
    beneficio: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    
    iconeBeneficio: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f8f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    
    emoji: {
        fontSize: 16,
    },
    
    textoBeneficio: {
        flex: 1,
        fontSize: 14,
        color: '#555',
        lineHeight: 18,
    },
    
    // Container dos botões
    containerBotoes: {
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    
    // Botões
    botao: {
        width: Math.min(312, screenWidth - 40),
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    
    botaoEntrar: {
        backgroundColor: '#307C53',
    },
    
    botaoCadastro: {
        backgroundColor: '#273A57',
    },
    
    texto_botao: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    
    // Rodapé
    rodape: {
        width: '100%',
        height: 60,
        backgroundColor: '#85B542',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    texto_rodape: {
        color: '#fff',
        fontSize: 12,
    },
});

export default Home;