<template>
  <div class="view-container">
    <h1>Benvenuto a CartExpress</h1>
    <h2>La tua spesa inizia da qui!</h2>
    <button @click="vaiAllaCategoria">Vai alle Categorie</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function vaiAllaCategoria() {
  router.push('/categoria');
}
</script>
