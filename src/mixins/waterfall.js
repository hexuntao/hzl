export default {
  data(){
    return{
      leftList: [],
      rightList: []
    }
  },
  methods: {
    getList(lists) {
      this.leftList = lists.left;
      this.rightList = lists.right;
    }
  }
};