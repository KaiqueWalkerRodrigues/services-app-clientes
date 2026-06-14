import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function ApiScreen() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);

  const ITENS_POR_PAGINA = 10;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://192.168.0.103:81');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();

      setDados(json.dados || []);
    } catch (error) {
      console.log(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const dadosFiltrados = useMemo(() => {
    return dados.filter(item => {
      const termo = busca.toLowerCase();

      return (
        item.nome?.toLowerCase().includes(termo) ||
        item.codigo_empresa?.toLowerCase().includes(termo)
      );
    });
  }, [dados, busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(dadosFiltrados.length / ITENS_POR_PAGINA)
  );

  const dadosPagina = useMemo(() => {
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;

    return dadosFiltrados.slice(inicio, fim);
  }, [dadosFiltrados, pagina]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.idCell]}>
        {item.id_empresa}
      </Text>

      <Text style={[styles.cell, styles.codigoCell]}>
        {item.codigo_empresa}
      </Text>

      <Text style={[styles.cell, styles.nomeCell]}>
        {item.nome}
      </Text>

      <Text style={[styles.cell, styles.dataCell]}>
        {item.created_at?.split(' ')[0]}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>
          Erro: {erro}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Empresas
      </Text>

      <Text style={styles.subtitulo}>
        Total: {dadosFiltrados.length} registros
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Pesquisar por nome ou código..."
        value={busca}
        onChangeText={texto => {
          setBusca(texto);
          setPagina(1);
        }}
      />

      <ScrollView horizontal>
        <View>
          <View style={styles.header}>
            <Text style={[styles.headerCell, styles.idCell]}>
              ID
            </Text>

            <Text style={[styles.headerCell, styles.codigoCell]}>
              Código
            </Text>

            <Text style={[styles.headerCell, styles.nomeCell]}>
              Empresa
            </Text>

            <Text style={[styles.headerCell, styles.dataCell]}>
              Criação
            </Text>
          </View>

          <FlatList
            data={dadosPagina}
            keyExtractor={item =>
              item.id_empresa.toString()
            }
            renderItem={renderItem}
          />
        </View>
      </ScrollView>

      <View style={styles.paginacao}>
        <TouchableOpacity
          style={[
            styles.botao,
            pagina === 1 && styles.botaoDesabilitado,
          ]}
          disabled={pagina === 1}
          onPress={() => setPagina(pagina - 1)}
        >
          <Text style={styles.textoBotao}>
            Anterior
          </Text>
        </TouchableOpacity>

        <Text style={styles.infoPagina}>
          Página {pagina} de {totalPaginas}
        </Text>

        <TouchableOpacity
          style={[
            styles.botao,
            pagina >= totalPaginas &&
              styles.botaoDesabilitado,
          ]}
          disabled={pagina >= totalPaginas}
          onPress={() => setPagina(pagina + 1)}
        >
          <Text style={styles.textoBotao}>
            Próxima
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingTop: 50,
    paddingHorizontal: 10,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  subtitulo: {
    color: '#666',
    marginBottom: 15,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },

  header: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
  },

  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    padding: 12,
  },

  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  cell: {
    padding: 12,
    color: '#333',
  },

  idCell: {
    width: 70,
  },

  codigoCell: {
    width: 100,
  },

  nomeCell: {
    width: 220,
  },

  dataCell: {
    width: 130,
  },

  paginacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 20,
  },

  botao: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },

  botaoDesabilitado: {
    opacity: 0.4,
  },

  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },

  infoPagina: {
    fontWeight: 'bold',
  },
});