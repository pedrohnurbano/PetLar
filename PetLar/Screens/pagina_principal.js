import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Linking, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const Pagina_Principal = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [pets, setPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setCurrentUser(user);
                await buscarDadosUsuario(user.uid);
                await carregarPets(); // Carrega os pets quando o usuário está autenticado
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

    const carregarPets = async () => {
        try {
            setLoadingPets(true);
            console.log('Carregando pets disponíveis...');

            // Buscar todos os pets disponíveis
            const q = query(
                collection(db, 'pets'),
                where('status', '==', 'disponivel')
            );

            const querySnapshot = await getDocs(q);
            const petsData = [];

            querySnapshot.forEach((doc) => {
                petsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log(`${petsData.length} pets encontrados`);
            setPets(petsData);

        } catch (error) {
            console.error('Erro ao carregar pets:', error);
            Alert.alert('Erro', 'Não foi possível carregar os pets disponíveis');
        } finally {
            setLoadingPets(false);
        }
    };

    // Função para abrir WhatsApp
    const abrirWhatsApp = (contato, nomePet) => {
        try {
            // Remove caracteres não numéricos do contato
            const numeroLimpo = contato.replace(/\D/g, '');

            // Verifica se o número tem o formato correto
            if (numeroLimpo.length < 10) {
                Alert.alert('Erro', 'Número de contato inválido');
                return;
            }

            // Adiciona o código do país se não tiver (55 para Brasil)
            let numeroCompleto = numeroLimpo;
            if (!numeroCompleto.startsWith('55')) {
                numeroCompleto = '55' + numeroCompleto;
            }

            // Mensagem pré-definida
            const mensagem = `Olá! Vi seu anúncio do ${nomePet} no PetLar e tenho interesse em adotar. Podemos conversar?`;

            // Codifica a mensagem para URL
            const mensagemCodificada = encodeURIComponent(mensagem);

            // Cria o link do WhatsApp
            const linkWhatsApp = `https://wa.me/${numeroCompleto}?text=${mensagemCodificada}`;

            console.log('Abrindo WhatsApp:', linkWhatsApp);

            // Abre o WhatsApp
            Linking.openURL(linkWhatsApp).catch((error) => {
                console.error('Erro ao abrir WhatsApp:', error);
                Alert.alert(
                    'Erro',
                    'Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado.'
                );
            });

        } catch (error) {
            console.error('Erro na função abrirWhatsApp:', error);
            Alert.alert('Erro', 'Não foi possível abrir o contato');
        }
    };

    // Função para formatar o número de telefone
    const formatarTelefone = (numero) => {
        const numeroLimpo = numero.replace(/\D/g, '');

        if (numeroLimpo.length === 11) {
            return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7)}`;
        } else if (numeroLimpo.length === 10) {
            return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 6)}-${numeroLimpo.slice(6)}`;
        }

        return numero;
    };

    const renderPet = (pet) => (
        <View key={pet.id} style={styles.petCard}>
            {/* Imagem do Pet */}
            <View style={styles.imagemContainer}>
                {pet.imagemBase64 ? (
                    <Image
                        source={{ uri: pet.imagemBase64 }}
                        style={styles.imagemPet}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagemPlaceholder}>
                        <Text style={styles.textoPlaceholder}>📷</Text>
                    </View>
                )}
            </View>

            {/* Informações do Pet */}
            <View style={styles.infoPet}>
                <Text style={styles.nomePet}>{pet.nome}</Text>
                <Text style={styles.descricaoPet} numberOfLines={3}>
                    {pet.descricao}
                </Text>

                {/* Botão de Contato */}
                <TouchableOpacity
                    style={styles.botaoContato}
                    onPress={() => abrirWhatsApp(pet.contato, pet.nome)}
                >
                    <Text style={styles.textoContato}>
                        📱 {formatarTelefone(pet.contato)}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

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

                        <Text style={styles.subtitulo}>Encontre seu companheiro perfeito</Text>

                        {/* Lista de Pets Disponíveis */}
                        <View style={styles.petsSection}>
                            {loadingPets ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#284E73" />
                                    <Text style={styles.loadingText}>Carregando pets...</Text>
                                </View>
                            ) : pets.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>🐾</Text>
                                    <Text style={styles.emptyTitle}>Nenhum pet disponível</Text>
                                    <Text style={styles.emptySubtitle}>
                                        Seja o primeiro a cadastrar um pet para adoção!
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.petsContainer}>
                                    {pets.map(renderPet)}
                                </View>
                            )}
                        </View>

                        {/* Seção de Doação */}
                        <View style={styles.container_doacao}>
                            <View style={styles.card_doacao}>
                                <View style={styles.doacao_header}>
                                    <View style={styles.qrCodeContainer}>
                                        <View style={styles.qrCode}>
                                            <Text style={styles.qrCodeText}>QR</Text>
                                        </View>
                                    </View>
                                    <View style={styles.doacao_texto}>
                                        <Text style={styles.doacao_titulo}>DOAÇÂO VOLUNTÁRIA</Text>
                                        <Text style={styles.doacao_subtitulo}>
                                            Ajude nossos amiguinhos a encontrar um lar cheio de amor
                                        </Text>
                                        <Text style={styles.chave_doacao}>Chave pix para doação: 123.456.789-00</Text>
                                    </View>
                                </View>
                            </View>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 80,
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
        marginBottom: 20,
    },

    // Seção de Pets
    petsSection: {
        width: '100%',
        marginBottom: 20,
    },
    petsContainer: {
        width: '100%',
    },

    // Loading
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },

    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        fontSize: 50,
        marginBottom: 15,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#284E73',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Pet Card
    petCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },

    // Imagem
    imagemContainer: {
        height: 200,
        backgroundColor: '#f5f5f5',
    },
    imagemPet: {
        width: '100%',
        height: '100%',
    },
    imagemPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    textoPlaceholder: {
        fontSize: 40,
        color: '#ccc',
    },

    // Info do Pet
    infoPet: {
        padding: 15,
    },
    nomePet: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#284E73',
        marginBottom: 8,
    },
    descricaoPet: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 15,
    },

    // Botão de Contato
    botaoContato: {
        backgroundColor: '#25D366',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textoContato: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Seção de Doação
    container_doacao: {
        width: '100%',
        marginTop: 20,
    },
    card_doacao: {
        width: '100%',
        backgroundColor: '#4A90E2',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    doacao_header: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    qrCodeContainer: {
        marginRight: 12,
    },
    qrCode: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrCodeText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    doacao_texto: {
        flex: 1,
        justifyContent: 'center',
    },
    doacao_titulo: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    doacao_subtitulo: {
        color: '#fff',
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 4,
    },
    chave_doacao: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
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