<template>
  <PaginationCustomComp :customUrl="customUrl" :resData="mediaData" @setData="setMediaData" :notingToShow="false">
    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 p-3">
      <div v-show="uploading" class="bg-gray-900 rounded-lg flex items-center justify-center items-center gap-2 text-light">
        <i class="fas fa-spinner fa-spin text-2xl"></i>
        <span class="text-sm">Uploading...</span>
      </div>
      <file-uploader v-show="!uploading" :urlSuffix="type === 'video' && 'video'" @beforeUpload="uploading = true"
        @uploaded="uploadMedia" :accept="this.type === 'video' ? 'video/*' : 'image/*'">
        <div
          class="aspect-[9/16] bg-gray-900 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
          <i class="fas fa-plus text-white text-3xl"></i>
        </div>
      </file-uploader>
      <div v-for="(media, index) in mediaData?.data" :key="index"
        class="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden cursor-pointer group hover:ring-2 hover:ring-blue-500 transition-all"
        @click="openMedia(media)">

        <!-- Image Thumbnail -->
        <img v-if="media.type === 'image'" :src="showImg(media.path)" :alt="`Media ${index + 1}`"
          class="w-full h-full object-cover" />

        <!-- Video Thumbnail (you can generate/store thumbnails or use a placeholder) -->
        <div v-else-if="media.type === 'video'" class="relative w-full h-full">
          <img :src="showImg(media.path?.replace('master.m3u8', 'thumbnail.png'))" class="w-full h-full object-cover"
            alt="Video thumbnail" />
          <!-- Video Play Icon Overlay -->
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <i v-if="uploadingVideos.includes(media.path)" class="fas fa-spinner text-white text-4xl animate-spin"></i>
            <i v-else class="fas fa-play-circle text-white text-4xl"></i>
          </div>
        </div>

        <!-- Hover Overlay -->
        <div
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
          <i :class="media.type === 'video' ? 'fas fa-play' : 'fas fa-search-plus'"
            class="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity">
          </i>
        </div>

        <!-- Media Info Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <div class="flex items-center justify-between text-xs text-gray-300">
            <span>
              <i :class="media.type === 'video' ? 'fas fa-video' : 'fas fa-image'"></i>
              {{ media.type }}
            </span>
            <span class="text-[10px]">{{ formatDate(media.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #empty>
      <div class="text-center py-16 text-gray-400">
        <i class="fas fa-photo-video text-5xl mb-4"></i>
        <p>No media available</p>
      </div>
    </template>
  </PaginationCustomComp>

  <!-- Media Modal/Lightbox -->
  <div v-if="selectedMedia" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
    @click="closeMedia">
    <div class="relative max-w-4xl w-full" @click.stop>
      <!-- Close Button -->
      <button @click="closeMedia" class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
        <i class="fas fa-times text-3xl"></i>
      </button>

      <!-- Image Display -->
      <img v-if="selectedMedia.type === 'image'" :src="showImg(selectedMedia.path)"
        class="w-full h-auto max-h-[80vh] object-contain rounded-lg" alt="Full size media" />

      <!-- Video Display -->
      <HlsVideoPlayer v-else-if="selectedMedia.type === 'video'" :src="showImg(selectedMedia.path, true)"
        class="w-full h-auto max-h-[80vh] rounded-lg" />

      <!-- Media Info -->
      <div class="mt-4 text-white">
        <div class="flex items-center justify-between text-sm">
          <span>
            <i :class="selectedMedia.type === 'video' ? 'fas fa-video' : 'fas fa-image'"></i>
            {{ selectedMedia.type.toUpperCase() }}
          </span>
          <span>{{ formatDate(selectedMedia.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUploader from "@/components/FileUploader.vue";
import HlsVideoPlayer from "@/components/HlsVideoPlayer.vue";
import PaginationCustomComp from "@/components/PaginationCustomComp.vue";
import socket from '@/plugins/socket';

export default {
  name: "LeagueMedia",
  components: { PaginationCustomComp, HlsVideoPlayer, FileUploader },
  data() {
    return {
      mediaData: null,
      customUrl: "",
      selectedMedia: null,
      uploading: false,
      uploadingVideos: [],
    };
  },
  props: {
    leagueId: {
      type: String,
    },
    type: {
      type: String,
      default: "image", // or 'video'
    },
  },
  methods: {
    uploadMedia(file) {
      console.log("Uploaded file data:", file);
      if (!file) return;

      if(file.video) this.uploadingVideos.push(file.video)

      // After successful upload, you can either refetch the media list or directly add the new media to mediaData
      this.httpReq({
        customUrl: 'league-media',
        data: {
          leagueId: this.leagueId,
          path: file.path || file.video,
          type: this.type,
        },
        callback: (data) => {
          this.mediaData.data.unshift(data);
          this.uploading = false;
        },
      });
    },
    setMediaData(data) {
      this.mediaData = data;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },
    openMedia(media) {
      this.selectedMedia = media;
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    },
    closeMedia() {
      this.selectedMedia = null;
      // Restore body scroll
      document.body.style.overflow = '';
    },
  },
  mounted() {
    this.customUrl += `league-media?leagueId=${this.leagueId}&type=${this.type}&limit=6`;

    this.fetchData({
      customUrl: this.customUrl,
      callback: (data, res) => {
        this.mediaData = res.data;
      }
    });

    socket.on("video-uploaded", ({masterPlaylist}) => {
      this.uploadingVideos.pop(masterPlaylist);
    });
  },
  beforeUnmount() {
    // Clean up: ensure body scroll is restored if component is destroyed while modal is open
    document.body.style.overflow = '';
  },
};
</script>

<style scoped>
/* Optional: Add smooth scrollbar hiding for modal */
.modal-open {
  overflow: hidden;
}
</style>