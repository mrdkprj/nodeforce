<template>
    <div class="message-area" :class="state"><div class="message">{{message}}</div></div>
</template>

<script>
export default {

    data: function(){
        return {
            message: "",
        }
    },

    computed: {
        state: function(){
            if(this.message == ""){
                return "";
            }else{
                return "fault";
            }
        }
    },

    methods: {

        displayError: function(json){
            this.message = json;
        },

        hideMessageArea: function(){
            this.message = "";
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

    .fault .message{
        display: block;
    }

</style>