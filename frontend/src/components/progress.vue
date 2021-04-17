<template>
    <div id="progress" :class="{'show-progress':inprogress, 'hide-progress': !inprogress}">
        <div id="progress-line" :class="{'progress-line': inprogress}"></div>
    </div>
</template>

<script>
export default {
    computed: {
        inprogress () {
            return this.$store.state.auth.inprogress
        }
    },
}
</script>

<style scoped>

</style>