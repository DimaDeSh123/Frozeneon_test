<template>
    <div class="container mt-5">
        <h1 class="mt-5">Find modern JavaScript packages</h1>
        <b-input-group class="mt-3 col-md-8 col-xs-12 mx-auto table">
            <b-form-input v-model="packageName" @change="setQuery" placeholder="Enter package name"></b-form-input>
            <b-input-group-append v-if="packageName">
                <b-button class="mr-3" variant="info" @click="clearQuery">Clear</b-button>
            </b-input-group-append>
        </b-input-group>
        <template v-if="packages">
            <div class="table-wrap">
                <b-table responsive=true hover :items="packages" :busy="loading"  tbody-tr-class="zxc" class="mt-3" @row-clicked="rowSelected" :fields="fields" outlined>
                    <template #table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Loading...</strong>
                        </div>
                    </template>
                </b-table>
            </div>

            <b-pagination-nav v-if="totalPage>1" :link-gen="linkGen" :number-of-pages="totalPage" class="mx-auto pagination" use-router></b-pagination-nav>
        </template>
        <div v-if="notResult">
            <p class="h3 mt-5 mx-auto">No results founds</p>
        </div>
    </div>
</template>

<script>
    import ModalComponent from "@/components/ModalComponent";
    const search = require('../utils/npm-search');
    export default {
        name: "MainView",
        data() {
            return {
                fields: [
                    { key: "name", label: "Name"},
                    { key: "description", label: "Description"},
                    { key: "deprecated", label: "Deprecated"}
                ],
                packageName: '',
                packages: null,
                hitsPerPage: 10,
                currentPage: 0,
                totalPage: 0,
                notResult: false,
                loading: false,
                showModal: false
            }
        },
        methods:{
            linkGen(pageNum){
                return pageNum === 1 ? '?query='+ this.packageName : '?query='+ this.packageName +`&page=${pageNum -1}`
            },
            clearQuery(){
                this.packageName = '';
                this.setQuery();
            },
            setQuery(){

                if(this.packageName){
                    this.$router.push({name: 'Home', query: {'query': this.packageName}}).catch(err => {
                        console.log('err', err)
                    });
                    this.searchPackage()
                } else {
                    this.$router.push({name: 'Home'})
                    this.packages = null;
                }
            },
            searchPackage(){
                this.notResult = false;
                this.loading = true;
                if(this.$route.query.query)
                search(this.$route.query.query, this.$route.query.page ? this.$route.query.page : 0, this.hitsPerPage)
                    .then(result => {
                        if(result.hits.length > 0){
                            this.packages = result.hits;
                            this.totalPage = result.nbPages;
                            this.loading = false;
                        } else if (result.nbHits) {
                            this.currentPage = this.totalPage;
                            this.searchPackage()
                        } else {
                            this.packages = null;
                            this.notResult = true;
                            this.loading = false;
                        }
                    })
                    .catch((e) => { console.error(e)});
            },
            rowSelected(record) {
                this.$modal.show(ModalComponent, {name: record.name},{
                    height: 'auto',
                    minHeight: 400,
                    adaptive: true,
                    resizable: true,
                    root: this.$root
                });
                this.showModal = true;
            },
        },
        watch: {
            $route() {
                this.searchPackage()
            }
        },
        created() {
            if (this.$route.query.query) {
                this.packageName = this.$route.query.query;
                this.setQuery();
            }
        }
    }
</script>

<style lang="scss">
    .table{
        tr{
            cursor: pointer;
        }
        @media (max-width: 576px) {
            font-size: 0.7rem;
            th, td{
                padding: 0.4rem;
            }
        }
    }
    .pagination{
        width: fit-content;
    }
</style>