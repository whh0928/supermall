<template>
	<div class="bottom-bar">
		<div class="check-content">
			<check-button class="check-button" :isChecked="isSelectAll" @click.native="checkClick"/>
			<span>全选</span>
		</div>

		<div class="price">
			合计：{{totalPrice}}
		</div>

		<div class="calculate" @click="calcClick">
			去结算({{checkLength}})
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import CheckButton from 'components/content/checkButton/CheckButton'
	export default {
	  name: 'CartBottomBar',
	  components:{
	  	CheckButton
	  },
	  computed:{
	  	...mapGetters(['cartList']),
	  	totalPrice(){
	  		return "¥"+this.cartList.filter(item => {
	  			return item.checked
	  		}).reduce((preValue,item) => {
	  			return preValue + item.price * item.count
	  		},0)
	  	},
	  	checkLength(){
	  		return this.cartList.filter(item => item.checked).length
	  	},
	  	isSelectAll(){
	  		if(this.cartList.length === 0) return false
	  		//1.使用filter
	  		//return !(this.cartList.filter(item => !item.checked).length)
	  		//2.使用find
	  		//return !this.cartList.find(item => !item.checked)
	  		//3.使用遍历
	  		for(let item of this.cartList) {
	  			if(!item.checked){
	  				return false
	  			}
	  		}
	  		return true
	  	}
	  },
	  methods:{
	  	checkClick(){
	  		if(this.isSelectAll){//全部选中
	  			this.cartList.forEach(item => item.checked = false)
	  		}else{//部分或全不选中
	  			this.cartList.forEach(item => item.checked = true)
	  		}
	  	},
	  	calcClick(){
	  		if(!this.isSelectAll){//全部都没选中
	  			this.$toast.show('请选择购买商品',2000)
	  		}
	  	}
	  },
	}
</script>

<style scoped>
.bottom-bar{
	position: relative;
	display: flex;

	height: 40px;
	line-height: 40px;

	background-color: #eee;
}
.check-content{
	display: flex;
	align-items: center;
	margin-left: 10px;
	width: 100px;
}
.check-button{
	width: 20px;
	height: 20px;
	line-height: 20px;
	margin-right: 5px;
}
.price {
	margin-left: 20px;
	flex: 1;
}
.calculate {
	width: 100px;
	color: #fff;
	text-align: center;
	background-color: red;
}
</style>