import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const Adocao = ({ navigation }) => {
    // ============================================
    // ESTADOS PRINCIPAIS DO COMPONENTE
    // ============================================
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Estados para controle do modal de edição
    const [modalVisible, setModalVisible] = useState(false);
    const [petEditando, setPetEditando] = useState(null);
    const [nomeEdit, setNomeEdit] = useState('');
    const [descricaoEdit, setDescricaoEdit] = useState('');
    const [contatoEdit, setContatoEdit] = useState('');
    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    // ============================================
    // EFEITO PARA AUTENTICAÇÃO E CARREGAMENTO INICIAL
    // ============================================
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setCurrentUser(user);
                await carregarPetsUsuario(user.uid);
            } else {
                navigation.navigate('Home');
            }
        });
        return () => unsubscribe();
    }, []);

    // ============================================
    // FUNÇÃO PARA CARREGAR PETS DO USUÁRIO LOGADO
    // ============================================
    const carregarPetsUsuario = async (uid) => {
        try {
            setLoading(true);
            const q = query(
                collection(db, 'pets'),
                where('userId', '==', uid),
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
            setPets(petsData);
        } catch (error) {
            console.error('Erro ao carregar pets do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // FUNÇÃO PARA LOGOUT DO USUÁRIO
    // ============================================
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // ============================================
    // FUNÇÕES DE CONTROLE DO MODAL DE EDIÇÃO
    // ============================================
    
    // Abrir modal de edição com dados do pet selecionado
    const abrirModalEdicao = (pet) => {
        setPetEditando(pet);
        setNomeEdit(pet.nome);
        setDescricaoEdit(pet.descricao);
        setContatoEdit(pet.contato);
        setModalVisible(true);
    };

    // Fechar modal e limpar estados
    const fecharModalEdicao = () => {
        setModalVisible(false);
        setPetEditando(null);
        setNomeEdit('');
        setDescricaoEdit('');
        setContatoEdit('');
    };

    // ============================================
    // FUNÇÃO PARA SALVAR ALTERAÇÕES DO PET
    // ============================================
    const salvarAlteracoes = async () => {
        if (!nomeEdit.trim() || !descricaoEdit.trim() || !contatoEdit.trim()) {
            return;
        }

        try {
            setSalvandoEdicao(true);

            // Atualizar dados no Firestore
            const petRef = doc(db, 'pets', petEditando.id);
            await updateDoc(petRef, {
                nome: nomeEdit.trim(),
                descricao: descricaoEdit.trim(),
                contato: contatoEdit.trim(),
                dataAtualizacao: new Date().toISOString()
            });

            // Atualizar estado local da lista de pets
            setPets(pets.map(pet =>
                pet.id === petEditando.id
                    ? { ...pet, nome: nomeEdit.trim(), descricao: descricaoEdit.trim(), contato: contatoEdit.trim() }
                    : pet
            ));

            fecharModalEdicao();

        } catch (error) {
            console.error('Erro ao atualizar pet:', error);
        } finally {
            setSalvandoEdicao(false);
        }
    };

    // ============================================
    // FUNÇÃO PARA EXCLUIR PET
    // ============================================
    const excluirPet = async (pet) => {
        try {
            // Remover do Firestore
            await deleteDoc(doc(db, 'pets', pet.id));

            // Atualizar lista local
            setPets(pets.filter(p => p.id !== pet.id));

        } catch (error) {
            console.error('Erro ao excluir pet:', error);
        }
    };

    // ============================================
    // FUNÇÃO UTILITÁRIA PARA FORMATAÇÃO DE TELEFONE
    // ============================================
    const formatarTelefone = (numero) => {
        const numeroLimpo = numero.replace(/\D/g, '');
        if (numeroLimpo.length === 11) {
            return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7)}`;
        } else if (numeroLimpo.length === 10) {
            return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 6)}-${numeroLimpo.slice(6)}`;
        }
        return numero;
    };

    // ============================================
    // COMPONENTE DE RENDERIZAÇÃO DE CADA PET
    // ============================================
    const renderPet = (pet) => (
        <View key={pet.id} style={styles.petCard}>
            {/* Área da imagem do pet */}
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
            
            {/* Informações do pet */}
            <View style={styles.infoPet}>
                <Text style={styles.nomePet}>{pet.nome}</Text>
                <Text style={styles.descricaoPet} numberOfLines={3}>
                    {pet.descricao}
                </Text>
                
                {/* Container com contato e botões de ação */}
                <View style={styles.contatoContainer}>
                    <View style={styles.contatoBox}>
                        <Text style={styles.textoContato}>
                            📱 {formatarTelefone(pet.contato)}
                        </Text>
                    </View>
                    
                    {/* Botões de editar e excluir */}
                    <View style={styles.botoesAcao}>
                        <TouchableOpacity
                            style={[styles.botaoAcao, styles.botaoEditar]}
                            onPress={() => abrirModalEdicao(pet)}
                        >
                            <Text style={styles.textoBotaoAcao}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botaoAcao, styles.botaoExcluir]}
                            onPress={() => excluirPet(pet)}
                        >
                            <Text style={styles.textoBotaoAcao}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    // ============================================
    // RENDERIZAÇÃO DO COMPONENTE PRINCIPAL
    // ============================================
    return (
        <View style={styles.container}>
            {/* CABEÇALHO DA APLICAÇÃO */}
            <View style={styles.cabecalho}>
                <Image source={require('../assets/logo_circulo.png')} style={styles.logo} />
                <Text style={styles.titulo_cabecalho}>PetLar</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.botao_logout}>
                    <Text style={styles.texto_logout}>Sair</Text>
                </TouchableOpacity>
            </View>

            {/* CONTEÚDO PRINCIPAL - LISTA DE PETS */}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.content}>
                    <Text style={styles.titulo}>Meus Pets para Adoção</Text>
                    <Text style={styles.subtitulo}>
                        Veja abaixo os pets que você cadastrou para adoção.
                    </Text>
                    
                    {/* Seção dos pets */}
                    <View style={styles.petsSection}>
                        {loading ? (
                            // Estado de carregamento
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#284E73" />
                                <Text style={styles.loadingText}>Carregando pets...</Text>
                            </View>
                        ) : pets.length === 0 ? (
                            // Estado vazio - nenhum pet cadastrado
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>🐾</Text>
                                <Text style={styles.emptyTitle}>Você ainda não cadastrou nenhum pet</Text>
                                <Text style={styles.emptySubtitle}>
                                    Toque em "Adicionar Pets" para cadastrar seu primeiro pet!
                                </Text>
                            </View>
                        ) : (
                            // Lista de pets cadastrados
                            <View style={styles.petsContainer}>
                                {pets.map(renderPet)}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* BOTÃO FIXO PARA ADICIONAR NOVOS PETS */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.addPetButton}
                    onPress={() => navigation.navigate('Gerenciamento')}
                >
                    <Text style={styles.addPetButtonText}>Adicionar Pets</Text>
                </TouchableOpacity>
            </View>

            {/* MODAL DE EDIÇÃO DE PET */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={fecharModalEdicao}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        {/* Cabeçalho do modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Pet</Text>
                            <TouchableOpacity
                                style={styles.botaoFechar}
                                onPress={fecharModalEdicao}
                            >
                                <Text style={styles.textoFechar}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Formulário de edição */}
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.labelModal}>Nome:</Text>
                            <TextInput
                                style={styles.inputModal}
                                placeholder="Digite o nome do animal"
                                value={nomeEdit}
                                onChangeText={setNomeEdit}
                            />

                            <Text style={styles.labelModal}>Descrição:</Text>
                            <TextInput
                                style={[styles.inputModal, styles.inputDescricao]}
                                placeholder="Fale um pouco sobre o animal..."
                                value={descricaoEdit}
                                onChangeText={setDescricaoEdit}
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                            <Text style={styles.labelModal}>Contato:</Text>
                            <TextInput
                                style={styles.inputModal}
                                placeholder="DDD + Número: Ex: 11912345678"
                                value={contatoEdit}
                                onChangeText={setContatoEdit}
                                keyboardType="phone-pad"
                            />
                        </ScrollView>

                        {/* Botões de ação do modal */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.botaoModal, styles.botaoCancelar]}
                                onPress={fecharModalEdicao}
                                disabled={salvandoEdicao}
                            >
                                <Text style={styles.textoBotaoModal}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.botaoModal, styles.botaoSalvar]}
                                onPress={salvarAlteracoes}
                                disabled={salvandoEdicao}
                            >
                                <Text style={styles.textoBotaoModal}>
                                    {salvandoEdicao ? 'Salvando...' : 'Salvar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* NAVEGAÇÃO INFERIOR (BOTTOM TAB) */}
            <View style={styles.bottomTab}>
                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => navigation.navigate('Pagina_Principal')}
                >
                    <View style={styles.homeIcon}>
                        <View style={styles.homeIconShape}></View>
                        <View style={styles.homeIconRoof}></View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabItem, styles.activeTab]}
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

// ============================================
// ESTILOS DO COMPONENTE
// ============================================
const styles = StyleSheet.create({
    // Estilos principais do container
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    
    // Estilos do cabeçalho
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
    
    // Estilos do conteúdo principal
    content: {
        flex: 1,
        padding: 20,
        paddingBottom: 140,
    },
    titulo: {
        fontSize: 24,
        color: '#307D53',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        marginTop: 10,
    },
    subtitulo: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 18,
    },
    
    // Estilos da seção de pets
    petsSection: {
        width: '100%',
        marginBottom: 20,
    },
    petsContainer: {
        width: '100%',
    },
    
    // Estilos para estado de carregamento
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    
    // Estilos para estado vazio
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
    
    // Estilos dos cards de pets
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
    
    // Estilos do container de contato e ações
    contatoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contatoBox: {
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        flex: 1,
        marginRight: 10,
    },
    textoContato: {
        color: '#284E73',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    // Estilos dos botões de ação
    botoesAcao: {
        flexDirection: 'row',
        gap: 8,
    },
    botaoAcao: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    botaoEditar: {
        backgroundColor: '#4CAF50',
    },
    botaoExcluir: {
        backgroundColor: '#f44336',
    },
    textoBotaoAcao: {
        fontSize: 16,
        color: '#fff',
    },
    
    // Estilos do botão adicionar pets
    buttonContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    addPetButton: {
        width: 280,
        height: 50,
        backgroundColor: '#284E73',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addPetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Estilos do modal de edição
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#284E73',
    },
    botaoFechar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoFechar: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    modalBody: {
        padding: 20,
        maxHeight: 400,
    },
    labelModal: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        marginTop: 10,
        fontWeight: '500',
    },
    inputModal: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
        marginBottom: 15,
    },
    inputDescricao: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 10,
    },
    botaoModal: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    botaoCancelar: {
        backgroundColor: '#ddd',
    },
    botaoSalvar: {
        backgroundColor: '#284E73',
    },
    textoBotaoModal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },

    // Estilos da navegação inferior
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
    
    // Estilos dos ícones da navegação
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

export default Adocao;