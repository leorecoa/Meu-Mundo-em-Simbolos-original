import { Category } from './types';

// New data structure for the application
export const categories: Category[] = [
  {
    id: 'emotions',
    name: 'Emoções',
    iconName: 'smile',
    symbols: [
      { id: 'happy', name: 'Feliz', icon: '😊', category: 'emotions', speechText: 'feliz' },
      { id: 'sad', name: 'Triste', icon: '😢', category: 'emotions', speechText: 'triste' },
      { id: 'angry', name: 'Nervoso', icon: '😠', category: 'emotions', speechText: 'nervoso' },
      { id: 'love', name: 'Amar', icon: '❤️', category: 'emotions', speechText: 'amar' },
      { id: 'like', name: 'Gostar', icon: '👍', category: 'emotions', speechText: 'gostar' },
      { id: 'dislike', name: 'Não Gostar', icon: '👎', category: 'emotions', speechText: 'não gostar' },
      { id: 'scared', name: 'Assustado', icon: '😨', category: 'emotions', speechText: 'assustado' },
      { id: 'surprised', name: 'Surpreso', icon: '😲', category: 'emotions', speechText: 'surpreso' },
      { id: 'tired', name: 'Cansado', icon: '😩', category: 'emotions', speechText: 'cansado' },
      { id: 'sick', name: 'Doente', icon: '🤢', category: 'emotions', speechText: 'doente' },
      { id: 'excited', name: 'Animado', icon: '🎉', category: 'emotions', speechText: 'animado' },
      { id: 'thinking', name: 'Pensando', icon: '🤔', category: 'emotions', speechText: 'pensando' },
      { id: 'shy', name: 'Tímido', icon: '😳', category: 'emotions', speechText: 'tímido' },
      { id: 'proud', name: 'Orgulhoso', icon: '🥲', category: 'emotions', speechText: 'orgulhoso' },
      { id: 'confused', name: 'Confuso', icon: '😕', category: 'emotions', speechText: 'confuso' },
      { id: 'silly', name: 'Bobo', icon: '🤪', category: 'emotions', speechText: 'bobo' },
    ]
  },
  {
    id: 'actions',
    name: 'Ações',
    iconName: 'zap',
    symbols: [
      { id: 'eat', name: 'Comer', icon: '🍽️', category: 'actions', speechText: 'comer' },
      { id: 'drink', name: 'Beber', icon: '🥤', category: 'actions', speechText: 'beber' },
      { id: 'sleep', name: 'Dormir', icon: '😴', category: 'actions', speechText: 'dormir' },
      { id: 'play', name: 'Brincar', icon: '🎮', category: 'actions', speechText: 'brincar' },
      { id: 'read', name: 'Ler', icon: '📚', category: 'actions', speechText: 'ler' },
      { id: 'write', name: 'Escrever', icon: '✍️', category: 'actions', speechText: 'escrever' },
      { id: 'run', name: 'Correr', icon: '🏃', category: 'actions', speechText: 'correr' },
      { id: 'walk', name: 'Andar', icon: '🚶', category: 'actions', speechText: 'andar' },
      { id: 'wash', name: 'Lavar', icon: '🧼', category: 'actions', speechText: 'lavar' },
      { id: 'go', name: 'Ir', icon: '➡️', category: 'actions', speechText: 'ir' },
      { id: 'come', name: 'Vir', icon: '⬅️', category: 'actions', speechText: 'vir' },
      { id: 'listen', name: 'Ouvir', icon: '👂', category: 'actions', speechText: 'ouvir' },
      { id: 'help', name: 'Ajudar', icon: '🤝', category: 'actions', speechText: 'ajudar' },
      { id: 'wait', name: 'Esperar', icon: '⏳', category: 'actions', speechText: 'esperar' },
      { id: 'look', name: 'Olhar', icon: '👀', category: 'actions', speechText: 'olhar' },
      { id: 'dance', name: 'Dançar', icon: '💃', category: 'actions', speechText: 'dançar' },
      { id: 'sing', name: 'Cantar', icon: '🎤', category: 'actions', speechText: 'cantar' },
      { id: 'open', name: 'Abrir', icon: '🚪', category: 'actions', speechText: 'abrir' },
      { id: 'close', name: 'Fechar', icon: '📕', category: 'actions', speechText: 'fechar' },
    ]
  },
  {
    id: 'people',
    name: 'Pessoas',
    iconName: 'users',
    symbols: [
        { id: 'family', name: 'Família', icon: '👨‍👩‍👧‍👦', category: 'people', speechText: 'família' },
        { id: 'friend', name: 'Amigo', icon: '👫', category: 'people', speechText: 'amigo' },
        { id: 'teacher', name: 'Professor', icon: '👨‍🏫', category: 'people', speechText: 'professor' },
        { id: 'doctor', name: 'Médico', icon: '👨‍⚕️', category: 'people', speechText: 'médico' },
        { id: 'me', name: 'Eu', icon: '👤', category: 'people', speechText: 'eu' },
        { id: 'you', name: 'Você', icon: '👉', category: 'people', speechText: 'você' },
        { id: 'mom', name: 'Mãe', icon: '👩', category: 'people', speechText: 'mãe' },
        { id: 'dad', name: 'Pai', icon: '👨', category: 'people', speechText: 'pai' },
        { id: 'brother', name: 'Irmão', icon: '👦', category: 'people', speechText: 'irmão' },
        { id: 'sister', name: 'Irmã', icon: '👧', category: 'people', speechText: 'irmã' },
        { id: 'baby', name: 'Bebê', icon: '👶', category: 'people', speechText: 'bebê' },
        { id: 'grandma', name: 'Avó', icon: '👵', category: 'people', speechText: 'avó' },
        { id: 'grandpa', name: 'Avô', icon: '👴', category: 'people', speechText: 'avô' },
        { id: 'police', name: 'Policial', icon: '👮', category: 'people', speechText: 'policial' },
        { id: 'firefighter', name: 'Bombeiro', icon: '👨‍🚒', category: 'people', speechText: 'bombeiro' },
    ]
  },
  {
    id: 'places',
    name: 'Lugares',
    iconName: 'mapPin',
    symbols: [
        { id: 'home', name: 'Casa', icon: '🏠', category: 'places', speechText: 'casa' },
        { id: 'school', name: 'Escola', icon: '🏫', category: 'places', speechText: 'escola' },
        { id: 'park', name: 'Parque', icon: '🏞️', category: 'places', speechText: 'parque' },
        { id: 'store', name: 'Loja', icon: '🏪', category: 'places', speechText: 'loja' },
        { id: 'hospital', name: 'Hospital', icon: '🏥', category: 'places', speechText: 'hospital' },
        { id: 'beach', name: 'Praia', icon: '🏖️', category: 'places', speechText: 'praia' },
        { id: 'bathroom', name: 'Banheiro', icon: '🚽', category: 'places', speechText: 'banheiro' },
        { id: 'kitchen', name: 'Cozinha', icon: '🍳', category: 'places', speechText: 'cozinha' },
        { id: 'bedroom', name: 'Quarto', icon: '🛏️', category: 'places', speechText: 'quarto' },
        { id: 'living_room', name: 'Sala', icon: '🛋️', category: 'places', speechText: 'sala' },
        { id: 'playground', name: 'Parquinho', icon: '🤸', category: 'places', speechText: 'parquinho' },
        { id: 'restaurant', name: 'Restaurante', icon: '🍔', category: 'places', speechText: 'restaurante' },
        { id: 'cinema', name: 'Cinema', icon: '🎬', category: 'places', speechText: 'cinema' },
        { id: 'airport', name: 'Aeroporto', icon: '✈️', category: 'places', speechText: 'aeroporto' },
        { id: 'farm', name: 'Fazenda', icon: '🚜', category: 'places', speechText: 'fazenda' },
    ]
  },
  {
    id: 'objects',
    name: 'Objetos',
    iconName: 'box',
    symbols: [
        { id: 'phone', name: 'Telefone', icon: '📱', category: 'objects', speechText: 'telefone' },
        { id: 'book', name: 'Livro', icon: '📖', category: 'objects', speechText: 'livro' },
        { id: 'ball', name: 'Bola', icon: '⚽', category: 'objects', speechText: 'bola' },
        { id: 'food', name: 'Comida', icon: '🍎', category: 'objects', speechText: 'comida' },
        { id: 'water', name: 'Água', icon: '💧', category: 'objects', speechText: 'água' },
        { id: 'toy', name: 'Brinquedo', icon: '🧸', category: 'objects', speechText: 'brinquedo' },
        { id: 'car', name: 'Carro', icon: '🚗', category: 'objects', speechText: 'carro' },
        { id: 'money', name: 'Dinheiro', icon: '💰', category: 'objects', speechText: 'dinheiro' },
        { id: 'clothes', name: 'Roupas', icon: '👕', category: 'objects', speechText: 'roupas' },
        { id: 'shoes', name: 'Sapatos', icon: '👟', category: 'objects', speechText: 'sapatos' },
        { id: 'computer', name: 'Computador', icon: '💻', category: 'objects', speechText: 'computador' },
        { id: 'tv', name: 'TV', icon: '📺', category: 'objects', speechText: 'tv' },
        { id: 'chair', name: 'Cadeira', icon: '🪑', category: 'objects', speechText: 'cadeira' },
        { id: 'bed', name: 'Cama', icon: '🛏️', category: 'objects', speechText: 'cama' },
        { id: 'pencil', name: 'Lápis', icon: '✏️', category: 'objects', speechText: 'lápis' },
        { id: 'paper', name: 'Papel', icon: '📄', category: 'objects', speechText: 'papel' },
        { id: 'backpack', name: 'Mochila', icon: '🎒', category: 'objects', speechText: 'mochila' },
    ]
  },
  {
    id: 'time',
    name: 'Tempo',
    iconName: 'clock',
    symbols: [
        { id: 'now', name: 'Agora', icon: '⏰', category: 'time', speechText: 'agora' },
        { id: 'today', name: 'Hoje', icon: '📅', category: 'time', speechText: 'hoje' },
        { id: 'tomorrow', name: 'Amanhã', icon: '🌅', category: 'time', speechText: 'amanhã' },
        { id: 'yesterday', name: 'Ontem', icon: '🌇', category: 'time', speechText: 'ontem' },
        { id: 'morning', name: 'Manhã', icon: '🌞', category: 'time', speechText: 'manhã' },
        { id: 'afternoon', name: 'Tarde', icon: '🌤️', category: 'time', speechText: 'tarde' },
        { id: 'night', name: 'Noite', icon: '🌙', category: 'time', speechText: 'noite' },
        { id: 'soon', name: 'Logo', icon: '⚡', category: 'time', speechText: 'logo' },
        { id: 'always', name: 'Sempre', icon: '🔄', category: 'time', speechText: 'sempre' },
        { id: 'never', name: 'Nunca', icon: '🚫', category: 'time', speechText: 'nunca' },
        { id: 'sometimes', name: 'Às vezes', icon: '🌗', category: 'time', speechText: 'às vezes' },
        { id: 'hour', name: 'Hora', icon: '🕒', category: 'time', speechText: 'hora' },
        { id: 'day', name: 'Dia', icon: '☀️', category: 'time', speechText: 'dia' },
        { id: 'week', name: 'Semana', icon: '📆', category: 'time', speechText: 'semana' },
        { id: 'month', name: 'Mês', icon: '🈷️', category: 'time', speechText: 'mês' },
        { id: 'year', name: 'Ano', icon: '🎇', category: 'time', speechText: 'ano' },
    ]
  },
  {
    id: 'food',
    name: 'Comidas',
    iconName: 'utensils', // Ícone de talheres da biblioteca Lucide
    symbols: [
        { id: 'apple', name: 'Maçã', icon: '🍎', category: 'food', speechText: 'maçã' },
        { id: 'banana', name: 'Banana', icon: '🍌', category: 'food', speechText: 'banana' },
        { id: 'bread', name: 'Pão', icon: '🍞', category: 'food', speechText: 'pão' },
        { id: 'pizza', name: 'Pizza', icon: '🍕', category: 'food', speechText: 'pizza' },
        { id: 'milk', name: 'Leite', icon: '🥛', category: 'food', speechText: 'leite' },
        { id: 'juice', name: 'Suco', icon: '🧃', category: 'food', speechText: 'suco' }
    ]
  },
  {
    id: 'animals',
    name: 'Animais',
    iconName: 'paw-print', // Ícone de patinha da biblioteca Lucide
    symbols: [
        { id: 'dog', name: 'Cachorro', icon: '🐶', category: 'animals', speechText: 'cachorro' },
        { id: 'cat', name: 'Gato', icon: '🐱', category: 'animals', speechText: 'gato' },
        { id: 'bird', name: 'Pássaro', icon: '🐦', category: 'animals', speechText: 'pássaro' },
        { id: 'fish', name: 'Peixe', icon: '🐠', category: 'animals', speechText: 'peixe' },
        { id: 'lion', name: 'Leão', icon: '🦁', category: 'animals', speechText: 'leão' },
        { id: 'cow', name: 'Vaca', icon: '🐮', category: 'animals', speechText: 'vaca' }
    ]
  },
  {
    id: 'nature',
    name: 'Natureza',
    iconName: 'leaf', // Ícone de folha da biblioteca Lucide
    symbols: [
        { id: 'sun', name: 'Sol', icon: '☀️', category: 'nature', speechText: 'sol' },
        { id: 'moon', name: 'Lua', icon: '🌙', category: 'nature', speechText: 'lua' },
        { id: 'star', name: 'Estrela', icon: '⭐', category: 'nature', speechText: 'estrela' },
        { id: 'rain', name: 'Chuva', icon: '🌧️', category: 'nature', speechText: 'chuva' },
        { id: 'flower', name: 'Flor', icon: '🌸', category: 'nature', speechText: 'flor' },
        { id: 'tree', name: 'Árvore', icon: '🌳', category: 'nature', speechText: 'árvore' }
    ]
  }
];
