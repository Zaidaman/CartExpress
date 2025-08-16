<script setup>
</script>

<template>
  <div>
    <!-- Header di navigazione -->
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/categoria">Categoria</router-link> |
      <router-link to="/carrello">Carrello</router-link> |
      <router-link to="/ricerca">Ricerca</router-link>
    </nav>
    <hr />

    <!-- Qui verranno caricate le pagine -->
    <router-view />
  </div>
</template>

<style scoped>
nav {
  background: #f2f2f2;
  padding: 10px;
}
router-link {
  margin-right: 10px;
}
</style>
