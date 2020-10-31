<template>
  <div class="page">
    <Table :table='data.data'></Table>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  layout: 'empty',
  async asyncData({$axios, params}) {
    const data = await $axios.$get(`${process.env.apiBaseUrl}/api/spreadsheets/${params.id}`)
    return {data}
  },
}
</script>
