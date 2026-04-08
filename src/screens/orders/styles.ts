import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        padding: 10,
        paddingBottom: 30,
    },
    containerLoja: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25,
        gap: 20,
        marginBottom: 15,
    },
    containerLojaLink: {
        color: '#D33535',
        fontWeight: 'bold',
        fontSize: 13,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 15,
    },

    info: {
        flex: 1,
    },

    nome: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    desc: {
        fontSize: 14,
        color: 'gray',
    },

    valor: {
        fontSize: 15,
        color: 'green',
    },

    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 2,
        borderRadius: 4,
        width: 52,
        backgroundColor: '#E5E5E5',
    },

    apagar: {
        color: 'red',
    },
    containerCupom: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 15,
    },
    cupom: {
        fontSize: 14,
        fontWeight: '500',
    },

    containerResumo: {
        padding: 20,
        paddingLeft: 0,
        marginBottom: 20,
    },

    linha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },

    h1: {
        fontSize: 21,
        fontWeight: 'bold',
    },

    p: {
        fontSize: 18,
        color: '#574949',
    },
})