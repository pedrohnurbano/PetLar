import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import * as ImagePicker from 'expo-image-picker';

const Gerenciamento = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [contato, setContato] = useState('');
    const [imagemUri, setImagemUri] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Função para abrir a galeria e selecionar imagem
    const selecionarImagem = async () => {
        try {
            // Solicitar permissão para acessar a galeria
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permissão necessária', 'É necessário permitir acesso à galeria para selecionar uma foto.');
                return;
            }

            // Abrir a galeria
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImagemUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem');
        }
    };

    // Função para converter imagem para base64 (alternativa sem Storage)
    const converterImagemParaBase64 = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Erro ao converter imagem:', error);
            throw error;
        }
    };

    // Função para cadastrar o pet
    const handleCadastro = async () => {
        console.log('=== INICIANDO CADASTRO DE PET ===');

        if (!nome || !descricao || !contato) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (!imagemUri) {
            Alert.alert('Erro', 'Por favor, selecione uma foto do pet');
            return;
        }

        try {
            setUploading(true);

            let imagemBase64 = null;

            if (imagemUri) {
                console.log('Convertendo imagem para base64...');
                imagemBase64 = await converterImagemParaBase64(imagemUri);
                console.log('✅ Imagem convertida para base64');
            }

            console.log('Salvando dados no Firestore...');

            // Salvar dados do pet no Firestore
            const docRef = await addDoc(collection(db, 'pets'), {
                nome: nome,
                descricao: descricao,
                contato: contato,
                imagemBase64: imagemBase64, // Salvar como base64
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                dataCadastro: new Date().toISOString(),
                status: 'disponivel' // disponivel, adotado, etc.
            });

            console.log('✅ Pet cadastrado no Firestore com ID:', docRef.id);

            Alert.alert(
                'Sucesso!',
                'Pet cadastrado com sucesso para adoção!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Limpar formulário
                            setNome('');
                            setDescricao('');
                            setContato('');
                            setImagemUri(null);
                            // Navegar de volta
                            navigation.goBack();
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('❌ Erro no cadastro:', error);

            let errorMessage = 'Erro ao cadastrar pet';
            if (error.message.includes('base64')) {
                errorMessage = 'Erro ao processar a imagem';
            } else if (error.message.includes('firestore')) {
                errorMessage = 'Erro ao salvar dados';
            }

            Alert.alert('Erro', errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView>
                <View style={styles.container}>

                    {/* Cabeçalho */}
                    <View style={styles.cabecalho}>
                        <Image
                            source={require('../assets/logo_circulo.png')}
                            style={styles.logoHeader}
                        />
                    </View>

                    {/* Logo principal */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.titulo}>Cadastre seu animal para adoção</Text>
                    </View>

                    {/* Formulário */}
                    <View style={styles.formulario}>

                        {/* Campo Nome */}
                        <Text style={styles.textoLabel}>Nome:</Text>
                        <TextInput
                            style={styles.campo}
                            placeholder="Digite o nome do animal"
                            value={nome}
                            onChangeText={setNome}
                        />

                        {/* Campo Descrição */}
                        <Text style={styles.textoLabel}>Descrição:</Text>
                        <TextInput
                            style={[styles.campo, styles.campoDescricao]}
                            placeholder="Fale um pouco sobre o animal, personalidade, cuidados especiais..."
                            value={descricao}
                            onChangeText={setDescricao}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        {/* Campo Contato */}
                        <Text style={styles.textoLabel}>Contato:</Text>
                        <TextInput
                            style={styles.campo}
                            placeholder="DDD + Número: Ex: 11912345678"
                            value={contato}
                            onChangeText={setContato}
                            keyboardType="phone-pad"
                        />

                        {/* Seleção de Imagem */}
                        <Text style={styles.textoLabel}>Foto do Pet:</Text>
                        <TouchableOpacity
                            style={styles.botaoImagem}
                            onPress={selecionarImagem}
                        >
                            {imagemUri ? (
                                <Image
                                    source={{ uri: imagemUri }}
                                    style={styles.imagemPreview}
                                />
                            ) : (
                                <View style={styles.placeholderImagem}>
                                    <Text style={styles.textoPlaceholder}>
                                        📷 Toque para selecionar uma foto
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                    </View>

                    {/* Botões */}
                    <TouchableOpacity
                        style={[styles.botao, styles.botaoCadastrar]}
                        onPress={handleCadastro}
                        disabled={uploading}
                    >
                        <Text style={styles.textoBotao}>
                            {uploading ? 'Cadastrando...' : 'Cadastrar'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.botao, styles.botaoVoltar]}
                        onPress={() => navigation.goBack()}
                        disabled={uploading}
                    >
                        <Text style={styles.textoBotao}>Voltar</Text>
                    </TouchableOpacity>

                </View>
                {/* Rodapé */}
                <View style={styles.rodape} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    // Cabeçalho
    cabecalho: {
        width: '100%',
        height: 60,
        backgroundColor: '#284E73',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoHeader: {
        width: 46,
        height: 46,
    },

    // Logo e título
    logoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    titulo: {
        fontSize: 18,
        color: '#307D53',
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 20,
    },

    // Formulário
    formulario: {
        width: '100%',
        paddingHorizontal: 45,
        marginBottom: 20,
    },
    textoLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginTop: 15,
        fontWeight: '500',
    },
    campo: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 14,
        backgroundColor: '#FAFAFA',
    },
    campoDescricao: {
        height: 100,
        paddingTop: 12,
    },

    // Seleção de imagem
    botaoImagem: {
        width: '100%',
        height: 150,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 8,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        marginTop: 5,
    },
    imagemPreview: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    placeholderImagem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoPlaceholder: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },

    // Botões
    botao: {
        width: 312,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginVertical: 8,
    },
    botaoCadastrar: {
        backgroundColor: '#307C53',
    },
    botaoVoltar: {
        backgroundColor: '#273A57',
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Rodapé
    rodape: {
        width: '100%',
        height: 60,
        backgroundColor: '#85B542',
    },
});

export default Gerenciamento;
