.<template>
  <a-card hoverable>
    <img
      slot="cover"
      :alt="item.name"
      :src="item.src"
      :key="item.id" />
    <a-card-meta :title="item.name">
    </a-card-meta>
  </a-card>
</template>

<script>
export default {

}
</script>

<style>

</style>
