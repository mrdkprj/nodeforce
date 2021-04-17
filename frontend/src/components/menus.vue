<template>
    <ul id="menus">
        <li><a id="soql" href="javascript:void(0)" class="menu-item" v-bind:class="{displayed: current == 'soql'}" @click="onMenuClick">SOQL</a></li>
        <!--<li><a id="describe" href="javascript:void(0)" class="menu-item">Describe</a></li>-->
        <li><a id="apex" href="javascript:void(0)" class="menu-item" v-bind:class="{displayed: current == 'apex'}" @click="onMenuClick">Apex</a></li>
    </ul>
</template>

<script>
export default {

    data: function () {
        return {
            current: "soql"
        }
    },

    methods: {

        onMenuClick: function(e) {
            const clickedAnchor = e.target.id;
            this.current = clickedAnchor;
            this.$emit('change', {target: this.current});
        }

    }
}
</script>

<style scoped>
    #menus {
        height: 45px;
        margin-left: auto;
        list-style: none;
        padding-right: 10px;
    }

    #menus li {
        width: 120px;
        height: 44px;
        float: left;
        border-left: #aaa 1px solid;
        box-sizing: border-box;
    }

    #menus li:last-child {
        border-right: #aaa 1px solid;
    }

    #menus li a {
        height: 44px;
        line-height: 44px;
        display: block;
        text-align: center;
        transition: all 0.2s linear;
        text-decoration: none;
        color: #fff;
    }

    #menus li:hover > a {
        background-color: #1579c0;
    }

    .displayed{
        background-color: #1579c0;
    }
</style>

