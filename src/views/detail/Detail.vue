<template>
	<div id="detail">
		<detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
		<scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
			<detail-swiper :top-images = "topImages"/>
			<detail-base-info :goods = "goods"/>
			<detail-shop-info :shop = "shop"/>
			<detail-goods-info :detail-info = "detailInfo" @imageLoad="imageLoad"/>
			<detail-param-info ref="params" :param-info = "paramInfo"/>
			<detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
			<goods-list ref="recommend" :goods="recommendList"/>
		</scroll>
		<back-top @click.native="backClick" v-show="isShowBackTop"/>
		<detail-bottom-bar @addCart="addToCart"/>
	</div>
</template>

<script>
	import {getDetail, getRecommend,Goods,Shop,GoodsParam} from "network/detail"
	import { itemListenerMixin,backTopMixin } from 'common/mixin.js'
	import { debounce } from 'common/utils.js'

	import Scroll from 'components/common/scroll/Scroll';
	import GoodsList from 'components/content/goods/GoodsList'

	import DetailNavBar from './childComps/DetailNavBar'
	import DetailSwiper from './childComps/DetailSwiper'
	import DetailBaseInfo from './childComps/DetailBaseInfo'
	import DetailShopInfo from './childComps/DetailShopInfo'
	import DetailGoodsInfo from'./childComps/DetailGoodsInfo'
	import DetailParamInfo from './childComps/DetailParamInfo'
	import DetailCommentInfo from './childComps/DetailCommentInfo'
	import DetailBottomBar from './childComps/DetailBottomBar'

	import { mapActions } from 'vuex'

	export default {
	  name: 'Detail',
	  data(){
	  	return {
	  		iid:null,
	  		topImages:[],
	  		goods:{},
	  		shop:{},
	  		detailInfo:{},
	  		paramInfo:{},
	  		commentInfo: {},
	  		recommendList: [],
	  		themeTopYs:[],
	  		getThemeTopY:null,
	  		currentIndex:0
	  	}
	  },
	  components:{
	  	DetailNavBar,
	  	DetailSwiper,
	  	DetailBaseInfo,
	  	DetailShopInfo,
	  	DetailGoodsInfo,
	  	DetailParamInfo,
	  	DetailCommentInfo,
	  	GoodsList,
	  	Scroll,
	  	DetailBottomBar
	  	
	  },
	  mixins:[itemListenerMixin,backTopMixin],
	  destroyed(){
	  	this.$bus.$off('itemImgLoad',this.itemImgListener)
	  },
	  created(){
	  	//1.保存传入的iid
	  	this.iid = this.$route.params.iid;

	  	//2.根据iid请求详情数据
	  	getDetail(this.iid).then(res => {
	  		//1.获取顶部的图片轮播数据
	  		const data = res.result
	  		this.topImages = data.itemInfo.topImages

	  		//2.获取商品信息
	  		this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

	  		//3.创建店铺信息的对象
	  		this.shop = new Shop(data.shopInfo)

	  		//4.获取商品基本详细信息
	  		this.detailInfo = data.detailInfo;

	  		//5.获取参数信息
	  		this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

	  		//6.保存评论信息
	  		if (data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0];
          }
	  	});

	  	//3.请求推荐数据
	  	getRecommend().then(res => {
          this.recommendList = res.data.list
      });


      //4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {

      	this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      },100)
	  },
	  methods:{
	  	...mapActions(['addCart']),
	  	imageLoad(){
	  		this.$refs.scroll.refresh()
	  		this.getThemeTopY()
	  	},
	  	titleClick(index){
	  		this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
	  	},
	  	contentScroll(position){
	  		const positionY = -position.y

	  		//判断BackTop是否显示
	  		this.listenShowBackTop(position)

	  		let length = this.themeTopYs.length
	  		// for(let i = 0 ;i < length;i++) {
	  		// 	if(this.currentIndex !== i && ((i < length-1) && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length-1 && positionY >= this.themeTopYs[i]))) {
	  		// 		this.currentIndex = i;
	  		// 		this.$refs.nav.currentIndex = this.currentIndex;
	  		// 	}
	  		// }

	  		for(let i=0;i<length-1;i++) {
	  			if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
	  				this.currentIndex = i;
	  				this.$refs.nav.currentIndex = this.currentIndex;
	  			}
	  		}
	  	},
	  	addToCart(){
	  		const product = {}
	  		product.image = this.topImages[0]
	  		product.title = this.goods.title
	  		product.desc = this.goods.desc
	  		product.price = this.goods.realPrice
	  		product.iid = this.iid


	  		this.addCart(product).then(res => {
	  			this.$toast.show(res)
	  		})
	  		// this.$store.dispatch("addCart",product).then(res => {
	  		// 	console.log(res)
	  		// })
	  	}
	  }
	}
</script>

<style scoped>
#detail {
	position: relative;
	z-index: 9;
	background-color: #fff;
	height:100vh;
}
.content {
	height: calc(100% - 44px - 49px);
}
.detail-nav {
	position: relative;
	z-index: 9;
	background-color: #fff;
}
</style>