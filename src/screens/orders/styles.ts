import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flexGrow: 1,
        padding: 25,
        paddingBottom: 140,
    },
    botaoProximoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 50,
        alignItems: 'center',
    },
    containerLoja: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
        marginTop: 0,
        gap: 20,
        marginBottom: 20,
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
        paddingLeft: 0,
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
    mais: {
        fontSize: 18,
        color: 'red',
    },
})