import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';


export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const validarEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailChange = (text: string) => {
    const sanitized = text.replace(/\s/g, '');
    setErro('');
    setEmail(sanitized);
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (!validarEmail(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }

    try {
      // Sua API aqui
      console.log({ email, senha });

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar login.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.systemLabel}>SISTEMA DE SERVIÇO</Text>
        <View style={styles.line} />
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Acessar</Text>
        <Text style={styles.subtitle}>
          Efetue login na sua conta para continuar
        </Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>

          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleEmailChange}
            style={styles.input}
          />
          {!!erro && (
            <Text style={styles.errorText}>{erro}</Text>
          )}
        </View>

        {/* Senha */}
        <View style={styles.inputContainer}>
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Senha</Text>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>
                Esqueceu?
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#666"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
          />
        </View>

        {/* Botão Login */}
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>
            Entrar
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.divider} />
        </View>

        {/* Google */}
        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.8}
        >
          <View style={styles.googleContent}>
            <Svg width={20} height={20} viewBox="0 0 48 48" style={styles.googleIcon}>
              <Path fill="#4285F4" d="M23.5 11.7c2.7 0 5.1.9 7 2.5l5.2-5.2C32.1 5.3 27.9 3.5 23.5 3.5 14.8 3.5 7.7 8.9 4.8 16.7l6 4.7C12.2 15.7 17.3 11.7 23.5 11.7z" />
              <Path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.6H23.5v8.7h12.7c-.5 2.7-2 4.9-4.2 6.4l6.6 5.1c3.8-3.5 6-8.7 6-15.6z" />
              <Path fill="#FBBC05" d="M11.8 29.4c-.6-1.6-.9-3.3-.9-5.1s.3-3.5.9-5.1l-6-4.7C2.4 17.7 1.5 20.8 1.5 24s.9 6.3 2.4 8.8l6-4.4z" />
              <Path fill="#EA4335" d="M23.5 44.5c5.4 0 9.9-1.8 13.2-4.8l-6.6-5.1c-1.8 1.2-4.2 1.9-6.6 1.9-6.2 0-11.3-4-13.1-9.4l-6 4.7c2.9 7.8 10 13.2 18.7 13.2z" />
            </Svg>
            <Text style={styles.googleText}>
              Continuar com Google
            </Text>
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Não tem conta?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('CadastroScreen' as never)}
          >
            <Text style={styles.footerLink}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  systemLabel: {
    color: '#888',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '600',
  },

  line: {
    width: 60,
    height: 1,
    backgroundColor: '#333',
    marginTop: 10,
  },

  card: {
    backgroundColor: '#121212',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222',
  },

  title: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '700',
  },

  subtitle: {
    color: '#888',
    marginTop: 6,
    marginBottom: 24,
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    color: '#AAA',
    marginBottom: 8,
    fontSize: 13,
  },

  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2B2B2B',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    color: '#FFF',
    fontSize: 15,
  },

  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  forgotPassword: {
    color: '#999',
    fontSize: 13,
  },

  loginButton: {
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },

  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleIcon: {
    marginRight: 10,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#222',
  },

  dividerText: {
    color: '#666',
    marginHorizontal: 12,
  },

  googleButton: {
    height: 56,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  googleText: {
    color: '#DDD',
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  footerText: {
    color: '#666',
  },

  errorText: {
    color: '#ef4444',
    marginTop: 8,
    fontSize: 13,
  },

  footerLink: {
    color: '#FFF',
    marginLeft: 5,
    fontWeight: '600',
  },
});