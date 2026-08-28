<template>
  <!-- <div v-if="dataList?.pagination" class="flex justify-end">
    <a-pagination
    :current="parseInt(dataList.pagination.currentPage)"
    :total="parseInt(dataList.pagination.totalCount)"
    :pageSize="parseInt(dataList.pagination.itemsPerPage)"
    show-quick-jumper
    show-size-changer
    @change="onChange"
    @showSizeChange="onShowSizeChange"
  />
  </div> -->
  <div v-if="true" class="flex justify-center mt-5">
    <a-pagination :current="5" :total="100" :pageSize="10" show-quick-jumper show-size-changer @change="{ }"
      @showSizeChange="{ }" />
  </div>
</template>

<script>
export default {
  name: 'PaginationComp',
  data() {
    return {
      // current1: 1,
    };
  },
  methods: {
    onChange(page) {
      this.filters.page = page;
      this.fetchData();
    },
    onShowSizeChange(current, size) {
      this.filters.page = current;
      this.filters.limit = size;
      this.fetchData();
    },
  }
};
</script>

<style>
.ant-pagination-item a {
  /* color: white !important; */
  background: white !important;
}

.ant-pagination-item-active a {
  color: white !important;
  background: linear-gradient(to bottom, #0175F2, #0A427D) !important;

}

.ant-pagination-options-quick-jumper,
.ant-pagination-item-link,
.ant-pagination-item-ellipsis {
  color: white !important;
}
</style>