<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Meu Mundo em Símbolos

Uma aplicação web de comunicação alternativa através de símbolos, desenvolvida para auxiliar pessoas com dificuldades de comunicação. O aplicativo permite construir frases usando símbolos visuais e convertê-las em fala usando síntese de voz.

## 🚀 Funcionalidades

### ✨ Editor de Frases com Símbolos
- **Construção de frases**: Selecione símbolos de diferentes categorias para formar frases
- **Histórico**: Sistema de undo/redo para desfazer e refazer ações
- **Síntese de voz**: Converte frases em fala com destaque visual durante a pronúncia
- **Salvar frases**: Salve frases favoritas para uso rápido
- **Histórico recente**: Acesse frases usadas recentemente

### ⌨️ Teclado de Símbolos
- **10 categorias**: Emoções, Ações, Pessoas, Lugares, Objetos, Tempo, Comidas, Animais, Natureza, Roupas
- **Símbolos personalizados**: Adicione seus próprios símbolos com upload de imagens
- **Busca**: Pesquise símbolos por nome
- **Símbolos recentes**: Acesso rápido aos símbolos mais usados

### 📝 Escrita Livre
- **Digitação livre**: Digite texto diretamente e converta em fala
- **Destaque visual**: Visualize palavras sendo pronunciadas em tempo real
- **Controles**: Play/pause e limpar texto

### 👨‍⚕️ Área do Acompanhante
- **Proteção por PIN**: Acesso seguro com código PIN
- **Dashboard de Analytics**: Visualize estatísticas de uso
  - Total de frases salvas
  - Média de símbolos por frase
  - Vocabulário único utilizado
  - Categorias e símbolos mais usados
- **Metas de Comunicação**: Defina e acompanhe metas de comunicação
- **Registro de Sessões**: Registre anotações e duração das sessões

### ⚙️ Configurações
- **Temas**: Modo claro e escuro
- **Tamanho da fonte**: Pequeno, médio ou grande
- **Configurações de voz**: 
  - Seleção de voz
  - Velocidade de fala
  - Tom (pitch)
  - Volume
- **Backup e Restore**: Exporte e importe seus dados
- **Reset**: Opção para resetar o aplicativo

## 🛠️ Tecnologias

- **React 19.2.0** - Biblioteca JavaScript para interfaces
- **TypeScript 5.8.2** - Superset tipado do JavaScript
- **Vite 6.2.0** - Build tool e dev server
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **Web Speech API** - Síntese de voz do navegador

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/leorecoa/Meu-Mundo-em-Simbolos-original.git
   cd Meu-Mundo-em-Simbolos-original
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

Para visualizar o build:
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
├── components/          # Componentes React
│   ├── common/         # Componentes reutilizáveis
│   ├── keyboard/       # Componentes do teclado de símbolos
│   ├── modals/         # Modais (Settings, EditSymbol, etc.)
│   └── therapist/      # Componentes do módulo terapêutico
├── screens/            # Telas principais
├── services/          # Serviços (VoiceService)
├── hooks/             # Hooks customizados
├── types.ts           # Definições TypeScript
├── constants.ts       # Constantes e dados de símbolos
└── index.css          # Estilos globais (Tailwind)
```

## 💾 Armazenamento de Dados

O aplicativo utiliza `localStorage` do navegador para armazenar:
- Símbolos personalizados
- Frases salvas
- Histórico de frases recentes
- Metas e sessões do acompanhante
- Configurações de aparência e voz
- PIN do acompanhante

**Nota**: Os dados são armazenados localmente no navegador. Use a funcionalidade de backup para exportar seus dados.

## 🔒 Privacidade

Todos os dados são armazenados localmente no navegador. Nenhuma informação é enviada para servidores externos. O aplicativo funciona completamente offline após o carregamento inicial.

## 🌐 Compatibilidade

O aplicativo funciona em navegadores modernos que suportam:
- ES2022
- Web Speech API (para síntese de voz)
- localStorage

Testado e funcionando em:
- Chrome/Edge (recomendado)
- Firefox
- Safari

## 📝 Licença

Este projeto é privado.

## 🤝 Contribuindo

Este é um projeto privado. Para sugestões ou problemas, entre em contato com os mantenedores.

## 📧 Suporte

Para questões ou suporte, abra uma issue no repositório.

---

Desenvolvido com ❤️ para facilitar a comunicação através de símbolos.
