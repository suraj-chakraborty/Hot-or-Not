import React from 'react';
import StackNavigator from './StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <NavigationContainer>
      {/* HOC - higher order component */}
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
    
  );
}

