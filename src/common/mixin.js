import { debounce } from 'common/utils.js'
import BackTop from 'components/content/backTop/BackTop';

export const itemListenerMixin = {
	data(){
		return {
			itemImgListener:null
		}
	},
mounted(){
		//1.图片加载完成的事件监听
		const refresh = debounce(this.$refs.scroll.refresh,50)
		this.itemImgListener = () => {
			refresh()
		}
		this.$bus.$on('itemImgLoad',this.itemImgListener
		)
	},
}

export const backTopMixin = {
	components:{
		BackTop
	},
	data(){
		return {
	  	isShowBackTop:false,
		}
	},
	methods:{
		backClick(){
				this.$refs.scroll.scrollTo(0,0,300)
			},
		listenShowBackTop(position){
			this.isShowBackTop = (-position.y) > 1000 
		},
	}
}