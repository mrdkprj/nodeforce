<template>
    <div class="progress" v-show="inprogress">
        <div class="progress-line"></div>
    </div>
</template>

<script>
export default {
    computed: {
        inprogress () {
            return this.$store.getters.inProgress
        }
    },
}
</script>

<style scoped>
    .progress{
        display: block;
        height: 2px;
        width: 100%;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 3500;
    }

    .progress-line, .progress-line:before {
        height: 2px;
        width: 100%;
        margin: 0;
    }

    .progress-line {
        display: -webkit-flex;
        display: flex;
    }

    .progress-line:before {
        background-color: #f0ad4e;
        content: '';
        -webkit-animation: running-progress 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation: running-progress 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @-webkit-keyframes running-progress {
        0% { margin-left: 0px; margin-right: 100%; }
        50% { margin-left: 25%; margin-right: 0%; }
        100% { margin-left: 100%; margin-right: 0; }
        }

        @keyframes running-progress {
        0% { margin-left: 0px; margin-right: 100%; }
        50% { margin-left: 25%; margin-right: 0%; }
        100% { margin-left: 100%; margin-right: 0; }
    }
</style>