### arquitectura de mi proyecto 

- src/
- ├── context/              # React Contexts (Auth, User, etc.)
- │   └── AuthContext.js
- ├── models/               # Definición de entidades y estructuras de datos
- │   └── UserModel.js
- ├── viewmodels/           # Lógica de negocio y conexión con modelos
- │   ├── AuthViewModel.js
- │   └── useRegisterForm.js
- ├── views/                # Todo lo que es UI
- │   ├── components/       # Componentes reutilizables (Input, Button, etc.)
- │   │   └── InputText.js
- │   └── screens/          # Pantallas principales
- │       ├── LoginScreen.js
- │       └── RegisterScreen.js
- ├── App.js                # Configuración de navegación + contextos
- └── index.js              # Entry point del proyecto

## instalaciones 
- npx expo install @react-navigation/native
- npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
- npx expo install @react-navigation/native-stack
- npx expo install @react-native-async-storage/async-storage
- expo install @react-native-community/datetimepicker expo-image-picker
- npx expo install react-native-toast-message

- npx expo install @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler


-npm install react-native-vector-icons
- npm install react-native-modal
