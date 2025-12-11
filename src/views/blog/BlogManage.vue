<template>
    <div class="website-container">
        <iframe
            :src="websiteUrl"
            frameborder="0"
            width="100%"
            height="98%"
            @load="onLoad"
        ></iframe>
    </div>
</template>

<script>
export default {
    data() {
        return {
            websiteUrl: 'https://blog.syfcode.xyz/',
            loading: true
        }
    },
    methods: {
        onLoad() {
            this.loading = false
        }
    }
}
</script>

<style scoped>
.website-container {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
