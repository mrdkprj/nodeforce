<template>
    <div class="message-area" :class="state"><div class="message">{{message}}</div></div>
</template>

<script>
export default {

    data: function(){
        return {
            message: "",
            displayed: false
        }
    },

    computed: {
        state: function(){
            if(this.displayed){
                return "message-displayed";
            }else{
                return "message-hidden";
            }
        }
    },

    methods: {

        displayError: function(json){
            this.message = json;
            this.displayed = true;
        },

        hideMessageArea: function(){
            this.message = "";
            this.displayed = false;
        },
    }

}
</script>

<style scoped>
    .message-area{
        margin: 5px;
    }

    .message{
        width: 100%;
        display: none;
        color: red;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    .message-displayed{
        display: block;
    }

    .message-hidden{
        display: none;
    }

</style>