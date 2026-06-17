import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

export default function CadastroScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const formatarTelefone = (texto: string) => {
    let valor = texto.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }

    if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
    }

    if (valor.length > 8) {
      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }

    setCelular(valor);
  };

  const cadastrar = () => {
    if (
      !nome ||
      !sobrenome ||
      !celular ||
      !email ||
      !senha
    ) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos.'
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        'Erro',
        'As senhas não coincidem.'
      );
      return;
    }

    Alert.alert(
      'Sucesso',
      'Conta criada com sucesso!'
    );

    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.voltar}>
            ← Voltar ao Login
          </Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Criar Conta
        </Text>

        <Text style={styles.subtitulo}>
          Preencha seus dados para continuar
        </Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="João"
          placeholderTextColor="#666"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Sobrenome</Text>
        <TextInput
          style={styles.input}
          placeholder="Silva"
          placeholderTextColor="#666"
          value={sobrenome}
          onChangeText={setSobrenome}
        />

        <Text style={styles.label}>Celular</Text>
        <TextInput
          style={styles.input}
          placeholder="(11) 90000-0000"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          value={celular}
          onChangeText={formatarTelefone}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#666"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>
          Confirmar Senha
        </Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={cadastrar}
        >
          <Text style={styles.botaoTexto}>
            Criar Conta
          </Text>
        </TouchableOpacity>

        {/*
            a Confirmar
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          >
          <Text style={styles.loginLink}>
            Já possui conta? Entrar
         </Text>
        </TouchableOpacity> */}


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  content: {
    padding: 24,
    paddingTop: 50,
  },

  voltar: {
    color: '#9CA3AF',
    marginBottom: 20,
    fontSize: 14,
  },

  titulo: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '700',
  },

  subtitulo: {
    color: '#888',
    marginTop: 5,
    marginBottom: 30,
  },

  label: {
    color: '#FFF',
    marginBottom: 8,
    marginTop: 12,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 55,
    color: '#FFF',
  },

  botao: {
    backgroundColor: '#F4F4F4',
    height: 55,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  botaoTexto: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },

  loginLink: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});