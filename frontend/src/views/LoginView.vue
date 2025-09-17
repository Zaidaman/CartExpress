<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errore = ref('');
const loading = ref(false);
const router = useRouter();

async function login() {
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
      router.push('/');
    } else {
      errore.value = data.error || 'Credenziali non valide.';
    }
  } catch (err) {
    errore.value = 'Errore di connessione al server.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" autocomplete="username" />
      <input v-model="password" type="password" placeholder="Password" autocomplete="current-password" />
      <button type="submit" :disabled="loading">Accedi</button>
    </form>
    <div v-if="errore" class="errore">{{ errore }}</div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/login.scss' as *;
</style>
