<template>
    <div class="base-modal flex-column" @close="$emit('close')" v-if="pack">
            <div class="modal-header" >
                <h5 class="modal-title">Package name: {{pack.name}}</h5>
            </div>
            <div class="modal-body">
                <div v-if="pack.description" class="description">
                    <p> {{pack.description}} </p>
                </div>
                <div v-if="pack.keywords.length > 0" class="keywords">
                    <template v-for="(keyword, index) in pack.keywords" >
                            <span :key="index" class="package-label">{{keyword}}</span>
                    </template>
                </div>
                <div v-if="Object.keys(pack.versions).length > 0" class="versions">
                    <p>Version:</p>
                    <template v-for="(version, name, index) in pack.versions" >
                        <p :key="index" >
                               {{name}}: {{version.split('T')[0]}}
                            </p>
                    </template>
                </div>
            </div>
            <div class="modal-footer">
                <div class="owner row">
                    <img v-if="pack.owner.avatar" :src="pack.owner.avatar" class="rounded owner-image float-left" alt="owner-image">
                </div>
                <a class="owner-name" v-if="pack.owner.name" :href="pack.owner.link" target="_blank">
                    {{pack.owner.name}}
                </a>
                <button type="button" class="btn btn-secondary" @click="$emit('close')">Close</button>

            </div>
    </div>
    <PulseLoader v-else ></PulseLoader>
</template>

<script>
    import PulseLoader from "vue-spinner/src/PulseLoader.vue";
    const search = require('../utils/npm-search');
    export default {
        name: "ModalComponent",
        components: {
            PulseLoader
        },
        data(){
            return{
                pack: null,
                loading: true
            }
        },
        props: {
            name: null
        },
        created(){
            if(this.name){
                search.getByName(this.name).then((result) => {
                    this.pack = result;
                    this.loading = false;
                }).catch((error) => {
                    console.log(error)
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    p{
        margin: 0;
    }
    .base-modal {
        z-index: 5;
    }
    .modal-footer{
       justify-content: space-around;
    }
    .versions{
        max-height: 7rem;
        overflow-y: auto;
    }
    .description{
        max-height: 7rem;
        margin-bottom: 1rem;
    }
     .package-label {
        display: inline-block;
        border: 1px solid #e5e5e5;
        border-radius: 3px;
        padding: 2px 8px;
        white-space: nowrap;
        margin: 0 15px 10px 0;
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
    }
    .owner-image{
        height: 100px;
        width: 100px;
    }
    .owner-name{
        font-size: 1.5rem;
        font-weight: bold;
    }
</style>
