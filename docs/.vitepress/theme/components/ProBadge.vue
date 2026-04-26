<template>
  <span class="pro-badge">PRO</span>
</template>

<style scoped>
.pro-badge {
  display: inline-block;
  vertical-align: middle;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  padding: 3px 6px;
  border-radius: 12px;
  margin-left: 6px;
  margin-top: -2px;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 2px rgba(217, 119, 6, 0.3);
}

h1 .pro-badge,
h2 .pro-badge,
h3 .pro-badge {
  transform: translateY(-2px);
}
</style>
