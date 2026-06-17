import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, User, CheckCircle2 } from "lucide-react-native";

type Props = {
  navigation: any;
};

interface DadosFormulario {
  nome: string;
  sobrenome: string;
  celular: string;
  email: string;
  senha: string;
}

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const getCircleStyle = (step: number) => {
    if (currentStep > step) {
      return [styles.stepCircle, styles.stepCircleCompleted];
    }

    if (currentStep === step) {
      return [styles.stepCircle, styles.stepCircleCurrent];
    }

    return [styles.stepCircle, styles.stepCircleInactive];
  };

  const getLineStyle = (step: number) => {
    if (currentStep > step) {
      return [styles.stepLine, styles.stepLineCompleted];
    }

    return styles.stepLine;
  };

  return (
    <View style={styles.stepContainer}>
      <View style={getCircleStyle(1)}>
        <Text style={styles.stepText}>1</Text>
      </View>

      <View style={getLineStyle(1)} />

      <View style={getCircleStyle(2)}>
        <Text style={styles.stepText}>2</Text>
      </View>

      <View style={getLineStyle(2)} />

      <View style={getCircleStyle(3)}>
        <Text style={styles.stepText}>3</Text>
      </View>
    </View>
  );
};

export default function CadastroScreen({ navigation }: Props) {
  const [passoAtual, setPassoAtual] = useState<number>(1);

  const [dadosFormulario, setDadosFormulario] = useState<DadosFormulario>({
    nome: "",
    sobrenome: "",
    celular: "",
    email: "",
    senha: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const atualizarDados = (novosDados: Partial<DadosFormulario>) => {
    setDadosFormulario((prev) => ({
      ...prev,
      ...novosDados,
    }));
  };

  const avancarPasso = () => setPassoAtual((prev) => prev + 1);

  const voltarPasso = () => setPassoAtual((prev) => prev - 1);

  const cadastrarUsuario = async () => {
    setLoading(true);
    const usuario = {
      nome: dadosFormulario.nome,
      sobrenome: dadosFormulario.sobrenome,
      celular: dadosFormulario.celular,
      email: dadosFormulario.email,
      senha: dadosFormulario.senha,
    };

    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      const resultado = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Usuário cadastrado!");
        return resultado || usuario;
      } else {
        Alert.alert("Erro", resultado.mensagem || "Falha no cadastro");
        return resultado || null;
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
      return null;
    } finally {
      setLoading(false);
      navigation.navigate("LoginScreen");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {passoAtual === 1 && (
            <RegisterStep1
              dados={dadosFormulario}
              atualizarDados={atualizarDados}
              onNext={avancarPasso}
              onBack={() => navigation.goBack()}
            />
          )}

          {passoAtual === 2 && (
            <RegisterStep2
              dados={dadosFormulario}
              atualizarDados={atualizarDados}
              onNext={avancarPasso}
              onBack={voltarPasso}
            />
          )}

          {passoAtual === 3 && (
            <RegisterStep3
              dados={dadosFormulario}
              onBack={voltarPasso}
              onNext={async () => {
                try {
                  const usuario = await cadastrarUsuario();

                  if (usuario) {
                    Alert.alert("JSON Gerado", JSON.stringify(usuario, null, 2));
                    console.log(usuario);
                  }
                } catch (error) {
                  // navigation to Login occurs in cadastrarUsuario finally
                }
              }}
              isLoading={loading}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RegisterStep1({ dados, atualizarDados, onNext, onBack }: any) {
  const lidarComTelefone = (valor: string) => {
    valor = valor.replace(/\D/g, "");

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    }

    if (valor.length > 7) {
      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    atualizarDados({
      celular: valor,
    });
  };

  const continuar = () => {
    if (!dados.nome || !dados.sobrenome || !dados.celular) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    onNext();
  };

  return (
    <View>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={16} color="#9ca3af" />
        <Text style={styles.backText}>Voltar ao login</Text>
      </TouchableOpacity>

      <View style={styles.iconCircle}>
        <User size={22} color="#9ca3af" />
      </View>

      <Text style={styles.title}>Criar conta</Text>

      <Text style={styles.subtitle}>
        Dados <Text style={styles.blue}>pessoais</Text>
      </Text>

      <StepIndicator currentStep={1} />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Nome</Text>

          <TextInput
            style={styles.input}
            placeholder="João"
            placeholderTextColor="#6b7280"
            keyboardType="default"
            autoCapitalize="words"
            value={dados.nome}
            onChangeText={(text) =>
              atualizarDados({
                nome: text,
              })
            }
          />
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>Sobrenome</Text>

          <TextInput
            style={styles.input}
            placeholder="Silva"
            placeholderTextColor="#6b7280"
            keyboardType="default"
            autoCapitalize="words"
            value={dados.sobrenome}
            onChangeText={(text) =>
              atualizarDados({
                sobrenome: text,
              })
            }
          />
        </View>
      </View>

      <Text style={styles.label}>Celular</Text>

      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="(11) 90000-0000"
        placeholderTextColor="#6b7280"
        value={dados.celular}
        onChangeText={lidarComTelefone}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={continuar}>
        <Text style={styles.primaryButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

function RegisterStep2({ dados, atualizarDados, onNext, onBack }: any) {
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (text: string) => {
    const sanitized = text.replace(/\s/g, "");
    setErro("");
    atualizarDados({
      email: sanitized,
    });
  };

  const continuar = () => {
    setErro("");

    if (!validarEmail(dados.email)) {
      setErro("Digite um e-mail válido.");
      return;
    }

    if (dados.senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    onNext();
  };

  return (
    <View>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={16} color="#9ca3af" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.iconCircle}>
        <User size={22} color="#9ca3af" />
      </View>

      <Text style={styles.title}>Criar conta</Text>

      <Text style={styles.subtitle}>
        Dados de <Text style={styles.blue}>acesso</Text>
      </Text>

      <StepIndicator currentStep={2} />

      <Text style={styles.label}>E-mail</Text>

      <TextInput
        style={styles.input}
        placeholder="email@email.com"
        placeholderTextColor="#6b7280"
        keyboardType="email-address"
        autoCapitalize="none"
        value={dados.email}
        onChangeText={handleEmailChange}
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#6b7280"
            value={dados.senha}
            onChangeText={(text) =>
              atualizarDados({
                senha: text,
              })
            }
          />
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>Confirmar</Text>

          <TextInput
            style={[styles.input, erro && styles.inputError]}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#6b7280"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>
      </View>

      {!!erro && <Text style={styles.error}>{erro}</Text>}

      <TouchableOpacity style={styles.primaryButton} onPress={continuar}>
        <Text style={styles.primaryButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

function RegisterStep3({ dados, onBack, onNext, isLoading }: any) {
  return (
    <View>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={16} color="#9ca3af" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.iconCircle}>
        <CheckCircle2 size={24} color="#22c55e" />
      </View>

      <Text style={styles.title}>Tudo certo?</Text>

      <Text style={styles.subtitle}>
        Confirme seus <Text style={styles.blue}>dados</Text>
      </Text>

      <StepIndicator currentStep={3} />

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Nome Completo</Text>

          <Text style={styles.summaryValue}>
            {dados.nome} {dados.sobrenome}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Celular</Text>

          <Text style={styles.summaryValue}>{dados.celular}</Text>
        </View>

        <View>
          <Text style={styles.summaryLabel}>E-mail</Text>

          <Text style={styles.summaryValue}>{dados.email}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={onNext}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.primaryButtonText}>Confirmar e Criar Conta</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },

  card: {
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 24,
    padding: 28,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backText: {
    color: "#9ca3af",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#333",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
    fontSize: 15,
  },

  blue: {
    color: "#3b82f6",
  },

  stepContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  stepCircleInactive: {
    backgroundColor: "#1c1c1c",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  stepCircleCurrent: {
    backgroundColor: "#f4f4f4",
  },

  stepCircleCompleted: {
    backgroundColor: "#22c55e",
  },

  stepText: {
    fontWeight: "700",
    color: "#000",
  },

  stepLine: {
    width: 28,
    height: 1,
    backgroundColor: "#2a2a2a",
  },

  stepLineCompleted: {
    backgroundColor: "#22c55e",
    height: 2,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  half: {
    flex: 1,
  },

  label: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#1c1c1c",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },

  inputError: {
    borderColor: "#ef4444",
  },

  error: {
    color: "#ef4444",
    marginTop: 10,
  },

  primaryButton: {
    backgroundColor: "#f4f4f4",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 24,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },

  summaryCard: {
    backgroundColor: "#1c1c1c",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
  },

  summaryItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingBottom: 12,
    marginBottom: 12,
  },

  summaryLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  summaryValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
