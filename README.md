### arquitectura de mi proyecto 

src/
├── context/              # React Contexts (Auth, User, etc.)
│   └── AuthContext.js
├── models/               # Definición de entidades y estructuras de datos
│   └── UserModel.js
├── viewmodels/           # Lógica de negocio y conexión con modelos
│   ├── AuthViewModel.js
│   └── useRegisterForm.js
├── views/                # Todo lo que es UI
│   ├── components/       # Componentes reutilizables (Input, Button, etc.)
│   │   └── InputText.js
│   └── screens/          # Pantallas principales
│       ├── LoginScreen.js
│       └── RegisterScreen.js
├── App.js                # Configuración de navegación + contextos
└── index.js              # Entry point del proyecto

## instalaciones 
- npx expo install @react-navigation/native
- npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
- npx expo install @react-navigation/native-stack
- npx expo install @react-native-async-storage/async-storage


