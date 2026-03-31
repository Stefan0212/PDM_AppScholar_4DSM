// src/navigation/TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { useAuth } from "../hooks/useAuth"; // 1. IMPORTAÇÃO ADICIONADA AQUI

// Importando as telas
import { DashboardScreen } from "../screens/DashboardScreen";
import { AlunosScreen } from "../screens/AlunosScreen";
import { ProfessoresScreen } from "../screens/ProfessoresScreen";
import { DisciplinasScreen } from "../screens/DisciplinasScreen";
import { BoletimScreen } from "../screens/BoletimScreen";
import { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  const { user } = useAuth(); // 2. OBTENDO O USUÁRIO AQUI

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configuração dinâmica dos ícones baseada na rota
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help-circle";

          if (route.name === "Dashboard")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Alunos")
            iconName = focused ? "people" : "people-outline";
          else if (route.name === "Professores")
            iconName = focused ? "school" : "school-outline";
          else if (route.name === "Disciplinas")
            iconName = focused ? "book" : "book-outline";
          else if (route.name === "Boletim")
            iconName = focused ? "document-text" : "document-text-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Estilização da Tab Bar usando nosso tema
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundNavy,
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: theme.colors.primaryLight,
        tabBarInactiveTintColor: theme.colors.placeholder,
        // Estilização do Header de cada tela na Tab Bar
        headerStyle: {
          backgroundColor: theme.colors.backgroundDark,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.backgroundNavy,
        },
        headerTintColor: theme.colors.text,
        headerTitleAlign: "center",
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Início" }}
      />
      <Tab.Screen
        name="Boletim"
        component={BoletimScreen}
        options={{ title: "Boletim" }}
      />

      {/* Aluno NÃO vê a aba de Alunos. Admin e Professor veem e editam. */}
      {user?.role !== "aluno" && (
        <Tab.Screen
          name="Alunos"
          component={AlunosScreen}
          options={{ title: "Alunos" }}
        />
      )}

      {/* Todos veem Professores e Disciplinas (o bloqueio de edição será feito dentro da tela) */}
      <Tab.Screen
        name="Professores"
        component={ProfessoresScreen}
        options={{ title: "Professores" }}
      />
      <Tab.Screen
        name="Disciplinas"
        component={DisciplinasScreen}
        options={{ title: "Disciplinas" }}
      />
    </Tab.Navigator>
  );
};