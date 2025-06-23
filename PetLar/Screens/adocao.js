import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const Adocao = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Conteúdo da página de adoção aqui */}
            <View style={styles.content}>
                {/* Seu conteúdo futuro vai aqui */}
            </View>

            {/* Botão Adicionar Pets */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.addPetButton}
                    onPress={() => navigation.navigate('Gerenciamento')}
                >
                    <Text style={styles.addPetButtonText}>Adicionar Pets</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Tab Navigation */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingBottom: 140, // Espaço para o botão e bottom tab
    },
    // Container do botão
    buttonContainer: {
        position: 'absolute',
        bottom: 80, // 70px do bottom tab + 10px de margem
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    // Botão Adicionar Pets
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

export default Adocao;