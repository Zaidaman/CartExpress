<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const email = ref('');
const password = ref('');
const errore = ref('');
const loading = ref(false);
const router = useRouter();

// Registrazione
const showRegister = ref(false);
const regNome = ref('');
const regEmail = ref('');
const regPassword = ref('');
const regErrore = ref('');
const regSuccess = ref('');
const regLoading = ref(false);

function openRegister() {
  regNome.value = '';
  regEmail.value = '';
  regPassword.value = '';
  regErrore.value = '';
  regSuccess.value = '';
  showRegister.value = true;
}
function closeRegister() {
  showRegister.value = false;
}

async function registraUtente() {
  regErrore.value = '';
  regSuccess.value = '';
  if (!regNome.value || !regEmail.value || !regPassword.value) {
    regErrore.value = 'Tutti i campi sono obbligatori.';
    return;
  }
  regLoading.value = true;
  try {
    const res = await fetch('http://localhost:3000/api/utenti/registrazione', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: regNome.value, email: regEmail.value, password: regPassword.value })
    });
    const data = await res.json();
    if (data.success) {
      regSuccess.value = 'Registrazione avvenuta! Ora puoi accedere.';
      setTimeout(() => {
        showRegister.value = false;
      }, 1200);
    } else {
      regErrore.value = data.error || 'Errore durante la registrazione.';
    }
  } catch (err) {
    regErrore.value = 'Errore di connessione al server.';
  } finally {
    regLoading.value = false;
  }
}

const login = async () => {
  errore.value = '';
  if (!email.value || !password.value) {
    errore.value = 'Inserisci email e password.';
    return;
  }
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await res.json();
    if (data.success) {
      // Salva info utente in localStorage/sessionStorage se necessario
      localStorage.setItem('utente', JSON.stringify(data.utente));
      router.push('/home');
    } else {
      errore.value = data.error || 'Credenziali non valide.';
    }
  } catch (err) {
    errore.value = 'Errore di connessione al server.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" autocomplete="username" />
      <input v-model="password" type="password" placeholder="Password" autocomplete="current-password" />
      <button type="submit" :disabled="loading">Accedi</button>
    </form>
    <button class="register-btn" type="button" @click="openRegister">Registrati</button>
    <div v-if="errore" class="errore">{{ errore }}</div>

    <!-- Overlay registrazione -->
    <div v-if="showRegister" class="overlay">
      <div class="register-modal">
        <h3>Registrazione</h3>
        <form @submit.prevent="registraUtente">
          <input v-model="regNome" type="text" placeholder="Nome utente" />
          <input v-model="regEmail" type="email" placeholder="Email" />
          <input v-model="regPassword" type="password" placeholder="Password" />
          <button type="submit" :disabled="regLoading">Registrati</button>
          <button type="button" @click="closeRegister" :disabled="regLoading">Annulla</button>
        </form>
        <div v-if="regErrore" class="errore">{{ regErrore }}</div>
        <div v-if="regSuccess" class="success">{{ regSuccess }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/login.scss' as *;
</style>
