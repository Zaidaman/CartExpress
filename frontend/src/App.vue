<script setup>
</script>

<template>
  <div>
    <nav>
      <router-link to="/">Login</router-link> |
      <router-link to="/home">Home</router-link> |
      <router-link to="/categoria">Categoria</router-link> |
      <router-link to="/carrello">Carrello</router-link> |
      <router-link to="/ricerca">Ricerca</router-link>
    </nav>
    <hr />

    <router-view />
  </div>
</template>