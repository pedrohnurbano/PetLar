import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { ScrollView } from 'react-native-web';

const Pagina_Principal = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setCurrentUser(user);
                await buscarDadosUsuario(user.uid);
            } else {
                navigation.navigate('Home');
            }
        });

        return () => unsubscribe();
    }, []);

    const buscarDadosUsuario = async (uid) => {
        try {
            const q = query(
                collection(db, 'usuarios'),
                where('uid', '==', uid)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                setUserData(userData);
                console.log('Dados do usuário:', userData);
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.cabecalho}>
                        <Image source={require('../assets/logo_circulo.png')} style={styles.logo} />
                        <Text style={styles.titulo_cabecalho}>PetLar</Text>
                        <TouchableOpacity onPress={handleLogout} style={styles.botao_logout}>
                            <Text style={styles.texto_logout}>Sair</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Image
                            source={require('../assets/anuncio.jpg')}
                            style={{ width: '100%', height: 230 }}
                        />
                    </View>

                    <View style={styles.conteudo}>
                        <Text style={styles.titulo_principal}>Bem-vindo ao PetLar!</Text>
                        {currentUser && (
                            <View style={styles.info_usuario}>
                                <Text style={styles.email_usuario}>
                                    Logado como: {currentUser.email}
                                </Text>
                                {userData && userData.dataCriacao && (
                                    <Text style={styles.data_cadastro}>
                                        Membro desde: {new Date(userData.dataCriacao).toLocaleDateString('pt-BR')}
                                    </Text>
                                )}
                            </View>
                        )}

                        <Text style={styles.subtitulo}>Encontre seu companheiro perfeito</Text>
                        <View style={styles.container_botoes}>
                            <TouchableOpacity style={[styles.botao, { backgroundColor: '#284E73' }]}>
                                <Text style={styles.texto_botao}
                                    onPress={() => navigation.navigate('Gerenciamento')}
                                > Gerenciar Pets </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            
            {/* Bottom Tab Navigation */}
            <View style={styles.bottomTab}>
                <TouchableOpacity 
                    style={[styles.tabItem, styles.activeTab]}
                    onPress={() => navigation.navigate('Pagina_Principal')}
                >
                    <View style={styles.homeIcon}>
                        <View style={styles.homeIconShape}></View>
                        <View style={styles.homeIconRoof}></View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.tabItem}
                    onPress={() => navigation.navigate('Adocao')}
                >
                    <View style={styles.pawIcon}>
                        <View style={styles.pawPad}></View>
                        <View style={styles.pawToe1}></View>
                        <View style={styles.pawToe2}></View>
                        <View style={styles.pawToe3}></View>
                        <View style={styles.pawToe4}></View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cabecalho: {
        width: 402,
        height: 60,
        backgroundColor: '#284E73',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    logo: {
        width: 40,
        height: 40,
    },
    titulo_cabecalho: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    botao_logout: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    texto_logout: {
        color: '#284E73',
        fontSize: 14,
        fontWeight: 'semibold',
    },
    conteudo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 80, // Espaço para o bottom tab
    },
    titulo_principal: {
        fontSize: 28,
        color: '#307D53',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    info_usuario: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginVertical: 15,
        alignItems: 'center',
    },
    email_usuario: {
        fontSize: 14,
        color: '#284E73',
        fontWeight: 'semibold',
        marginBottom: 5,
    },
    data_cadastro: {
        fontSize: 12,
        color: '#666',
    },
    subtitulo: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    container_botoes: {
        width: '100%',
        alignItems: 'center',
    },
    botao: {
        width: 280,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    texto_botao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'semibold',
    },
    // Bottom Tab Styles
    bottomTab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#284E73',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    tabItem: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#85B542',
    },
    // Home Icon Styles
    homeIcon: {
        width: 24,
        height: 24,
        position: 'relative',
    },
    homeIconShape: {
        width: 20,
        height: 16,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 2,
    },
    homeIconRoof: {
        width: 0,
        height: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    // Paw Icon Styles
    pawIcon: {
        width: 24,
        height: 24,
        position: 'relative',
    },
    pawPad: {
        width: 12,
        height: 10,
        backgroundColor: '#fff',
        borderRadius: 6,
        position: 'absolute',
        bottom: 0,
        left: 6,
    },
    pawToe1: {
        width: 4,
        height: 6,
        backgroundColor: '#fff',
        borderRadius: 2,
        position: 'absolute',
        top: 2,
        left: 4,
    },
    pawToe2: {
        width: 4,
        height: 8,
        backgroundColor: '#fff',
        borderRadius: 2,
        position: 'absolute',
        top: 0,
        left: 8,
    },
    pawToe3: {
        width: 4,
        height: 8,
        backgroundColor: '#fff',
        borderRadius: 2,
        position: 'absolute',
        top: 0,
        left: 12,
    },
    pawToe4: {
        width: 4,
        height: 6,
        backgroundColor: '#fff',
        borderRadius: 2,
        position: 'absolute',
        top: 2,
        right: 4,
    },
});

export default Pagina_Principal;