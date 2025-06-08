<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <notifications position="top right" class="notifications">
    <template #body="props">
      <v-alert
        :title="props.item.title"
        :text="props.item.text"
        :type="props.item.type"
      />
    </template>
  </notifications>
</template>

<style lang="scss">
  .notifications {
    width: unset !important;
    margin-top: 20px;
    margin-right: 20px;
    .v-alert {
      margin-bottom: 10px;
    }
  }
</style>
